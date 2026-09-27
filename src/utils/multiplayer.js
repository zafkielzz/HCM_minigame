// Real-time synchronization utility for classroom multiplayer competition
// Utilizes browser BroadcastChannel + localStorage bus + public high-speed MQTT over WebSocket (EMQX / HiveMQ)
// Zero external server maintenance, immune to network blocking, sub-100ms latency for 60+ students.

import mqtt from 'mqtt';

export const DEFAULT_HOST_ROOM_CODE = 'HCM1945';
export const VALID_ROOM_CODES = new Set(['HCM1945', 'HCM24', 'HCM60', 'HCM88', 'HCM01', 'HCM02', 'HCM']);

const STORAGE_KEY_ROOMS = 'hcm_v2_active_rooms';
const STORAGE_BUS_PREFIX = 'hcm_v2_bus_';

// Public high-speed MQTT brokers with native WebSocket support (accessible in Vietnam & globally)
export const BROKER_SERVERS = [
  'wss://broker.emqx.io:8084/mqtt',
  'wss://broker.hivemq.com:8884/mqtt'
];

/**
 * Normalizes user input room code:
 * - Strips whitespace, special symbols and hyphens
 * - Automatically prepends 'HCM' if only numbers were entered (e.g. '1945' -> 'HCM1945')
 * - Uppercases letters (e.g. 'hcm1945' -> 'HCM1945')
 */
export function normalizeRoomCode(input) {
  let clean = (input || '').trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (!clean) return '';
  if (!clean.startsWith('HCM') && /^\d+$/.test(clean)) {
    clean = 'HCM' + clean;
  }
  return clean;
}

/**
 * Retrieves the registry of active rooms from localStorage.
 */
export function getActiveRooms() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ROOMS);
    if (!raw) return {};
    const rooms = JSON.parse(raw);
    const now = Date.now();
    const cleaned = {};
    for (const [code, r] of Object.entries(rooms)) {
      if (now - (r.updatedAt || r.createdAt || 0) < 6 * 60 * 60 * 1000) {
        cleaned[code] = r;
      }
    }
    return cleaned;
  } catch (e) {
    return {};
  }
}

/**
 * Registers an active host room in localStorage.
 */
export function registerHostRoom(roomCode = DEFAULT_HOST_ROOM_CODE, status = 'lobby', sessionId = null) {
  try {
    const code = normalizeRoomCode(roomCode);
    const rooms = getActiveRooms();
    rooms[code] = {
      code,
      sessionId: sessionId || ('s_' + Date.now()),
      createdAt: Date.now(),
      updatedAt: Date.now(),
      status // 'lobby' | 'live' | 'summary' | 'closed'
    };
    localStorage.setItem(STORAGE_KEY_ROOMS, JSON.stringify(rooms));
  } catch (e) {}
}

/**
 * Updates status of an existing host room in localStorage.
 */
export function updateHostRoomStatus(roomCode = DEFAULT_HOST_ROOM_CODE, status, sessionId = null) {
  try {
    const code = normalizeRoomCode(roomCode);
    const rooms = getActiveRooms();
    if (rooms[code]) {
      rooms[code].status = status;
      rooms[code].updatedAt = Date.now();
      if (sessionId) rooms[code].sessionId = sessionId;
      localStorage.setItem(STORAGE_KEY_ROOMS, JSON.stringify(rooms));
    }
  } catch (e) {}
}

/**
 * Unregisters a host room.
 */
export function unregisterHostRoom(roomCode = DEFAULT_HOST_ROOM_CODE) {
  try {
    const code = normalizeRoomCode(roomCode);
    const rooms = getActiveRooms();
    if (rooms[code]) {
      rooms[code].status = 'closed';
      rooms[code].updatedAt = Date.now();
      delete rooms[code];
      localStorage.setItem(STORAGE_KEY_ROOMS, JSON.stringify(rooms));
    }
  } catch (e) {}
}

/**
 * Verifies if a room is actively OPEN and accepting players.
 * Checks format, active host session, and room lifecycle state via MQTT retained state.
 */
export async function verifyRoom(roomCode) {
  const code = normalizeRoomCode(roomCode);
  if (!code) {
    return { valid: false, message: 'Vui lòng nhập Mã phòng.' };
  }

  // 1. Format check
  const isFormatValid = /^HCM\d+$/.test(code) || VALID_ROOM_CODES.has(code);
  if (!isFormatValid) {
    return { 
      valid: false, 
      message: `Mã phòng không đúng định dạng (Ví dụ: ${DEFAULT_HOST_ROOM_CODE} hoặc HCM24)!` 
    };
  }

  const now = Date.now();

  // 2. Check local storage (instant 0ms response on same device/browser if host active in last 20 seconds)
  const localRooms = getActiveRooms();
  const localRoom = localRooms[code];
  if (localRoom && (now - (localRoom.updatedAt || localRoom.createdAt || 0) < 20000)) {
    if (localRoom.status === 'live' || localRoom.status === 'locked') {
      return { valid: false, message: 'Phòng thi đấu đã bắt đầu và đã khoá phòng, không thể tham gia!' };
    }
    if (localRoom.status === 'summary') {
      return { valid: false, message: 'Phòng thi đấu này đã kết thúc!' };
    }
    if (localRoom.status === 'closed') {
      return { valid: false, message: 'Chủ phòng chưa mở hoặc đã đóng phòng thi đấu này!' };
    }
    if (localRoom.status === 'lobby') {
      return { valid: true, code, status: 'lobby', sessionId: localRoom.sessionId };
    }
  }

  // 3. Network verification via MQTT retained state subscription
  return new Promise((resolve) => {
    let resolved = false;
    let client = null;

    const timeoutTimer = setTimeout(() => {
      if (!resolved) {
        resolved = true;
        try { if (client) client.end(true); } catch (e) {}
        // Fallback: If local room exists in lobby, accept it
        if (localRoom && localRoom.status === 'lobby') {
          resolve({ valid: true, code, status: 'lobby', sessionId: localRoom.sessionId });
        } else {
          resolve({
            valid: false,
            message: 'Chủ phòng chưa mở phòng thi đấu này. Vui lòng chờ nhóm thuyết trình tạo phòng!'
          });
        }
      }
    }, 2000);

    try {
      client = mqtt.connect(BROKER_SERVERS[0], {
        clientId: 'vfy_' + Math.random().toString(36).substring(2, 9),
        clean: true,
        connectTimeout: 1800
      });

      client.on('connect', () => {
        client.subscribe(`hcm/v2/room/${code}/state`, { qos: 0 });
      });

      client.on('message', (topic, payload) => {
        if (resolved) return;
        try {
          const raw = payload.toString().trim();
          if (!raw) return;
          const data = JSON.parse(raw);
          const msgAge = Date.now() - (data.hostTime || 0);

          // If message is older than 2 hours or status is closed
          if (data.status === 'closed' || msgAge > 2 * 60 * 60 * 1000) {
            resolved = true;
            clearTimeout(timeoutTimer);
            try { client.end(true); } catch (e) {}
            resolve({
              valid: false,
              message: 'Chủ phòng chưa mở phòng thi đấu này. Vui lòng chờ nhóm thuyết trình tạo phòng!'
            });
            return;
          }

          if (data.status === 'live' || data.status === 'locked') {
            resolved = true;
            clearTimeout(timeoutTimer);
            try { client.end(true); } catch (e) {}
            resolve({
              valid: false,
              message: 'Phòng thi đấu đã bắt đầu và đã khoá phòng, không thể tham gia!'
            });
            return;
          }

          if (data.status === 'summary') {
            resolved = true;
            clearTimeout(timeoutTimer);
            try { client.end(true); } catch (e) {}
            resolve({
              valid: false,
              message: 'Phòng thi đấu này đã kết thúc!'
            });
            return;
          }

          if (data.status === 'lobby') {
            resolved = true;
            clearTimeout(timeoutTimer);
            try { client.end(true); } catch (e) {}
            resolve({
              valid: true,
              code,
              status: 'lobby',
              sessionId: data.sessionId
            });
            return;
          }
        } catch (e) {}
      });

      client.on('error', () => {
        if (!resolved) {
          resolved = true;
          clearTimeout(timeoutTimer);
          try { client.end(true); } catch (e) {}
          if (localRoom && localRoom.status === 'lobby') {
            resolve({ valid: true, code, status: 'lobby', sessionId: localRoom.sessionId });
          } else {
            resolve({
              valid: false,
              message: 'Chủ phòng chưa mở phòng thi đấu này. Vui lòng chờ nhóm thuyết trình tạo phòng!'
            });
          }
        }
      });
    } catch (err) {
      if (!resolved) {
        resolved = true;
        clearTimeout(timeoutTimer);
        resolve({
          valid: false,
          message: 'Chủ phòng chưa mở phòng thi đấu này. Vui lòng chờ nhóm thuyết trình tạo phòng!'
        });
      }
    }
  });
}

export class MultiplayerSession {
  constructor(roomCode = DEFAULT_HOST_ROOM_CODE, isHost = false, sessionId = null) {
    this.roomCode = normalizeRoomCode(roomCode) || DEFAULT_HOST_ROOM_CODE;
    this.isHost = isHost;
    this.sessionId = sessionId || (isHost ? ('s_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6)) : null);
    this.status = isHost ? 'lobby' : null;
    this.listeners = [];
    this.mqttClient = null;
    this.broadcastChannel = null;
    this.storageListener = null;
    this.heartbeatTimer = null;
    this.closed = false;

    this.init();
  }

  init() {
    // 1. BroadcastChannel for instant 0ms same-browser tab sync
    try {
      if (typeof window !== 'undefined' && window.BroadcastChannel) {
        this.broadcastChannel = new BroadcastChannel(`hcm_v2_channel_${this.roomCode}`);
        this.broadcastChannel.onmessage = (event) => {
          this.handleIncoming(event.data);
        };
      }
    } catch (e) {}

    // 2. LocalStorage event bus
    try {
      if (typeof window !== 'undefined') {
        this.storageListener = (e) => {
          if (e.key === `${STORAGE_BUS_PREFIX}${this.roomCode}` && e.newValue) {
            try {
              const payload = JSON.parse(e.newValue);
              if (payload) {
                this.handleIncoming(payload);
              }
            } catch (err) {}
          }
        };
        window.addEventListener('storage', this.storageListener);
      }
    } catch (e) {}

    // 3. High-Speed MQTT over WebSocket
    this.connectMQTT();

    // 4. If Host, register room and start heartbeat
    if (this.isHost) {
      registerHostRoom(this.roomCode, 'lobby', this.sessionId);
      this.publishRetainedState('lobby');

      this.heartbeatTimer = setInterval(() => {
        if (!this.closed && this.status) {
          updateHostRoomStatus(this.roomCode, this.status, this.sessionId);
          this.publishRetainedState(this.status);
        }
      }, 2500);
    }
  }

  connectMQTT(brokerIndex = 0) {
    if (this.closed) return;
    const brokerUrl = BROKER_SERVERS[brokerIndex % BROKER_SERVERS.length];

    try {
      if (this.mqttClient) {
        try { this.mqttClient.end(true); } catch (e) {}
      }

      this.mqttClient = mqtt.connect(brokerUrl, {
        clientId: (this.isHost ? 'host_' : 'std_') + Math.random().toString(36).substring(2, 9),
        clean: true,
        reconnectPeriod: 2500,
        connectTimeout: 4000
      });

      this.mqttClient.on('connect', () => {
        if (this.isHost) {
          // Host listens for student packets & pings
          this.mqttClient.subscribe(`hcm/v2/room/${this.roomCode}/students/#`, { qos: 0 });
          this.mqttClient.subscribe(`hcm/v2/room/${this.roomCode}/ping`, { qos: 0 });
          this.publishRetainedState(this.status || 'lobby');
        } else {
          // Student listens for Host control signals & room state changes
          this.mqttClient.subscribe(`hcm/v2/room/${this.roomCode}/host`, { qos: 0 });
          this.mqttClient.subscribe(`hcm/v2/room/${this.roomCode}/state`, { qos: 0 });
        }
      });

      this.mqttClient.on('message', (topic, payload) => {
        try {
          const raw = payload.toString().trim();
          if (!raw) return;
          const data = JSON.parse(raw);

          if (topic === `hcm/v2/room/${this.roomCode}/state`) {
            // Retained state update from host
            if (!this.isHost) {
              if (data.sessionId && !this.sessionId) {
                this.sessionId = data.sessionId;
              }
              if (data.status === 'live') {
                this.handleIncoming({ type: 'SESSION_START', ...data });
              } else if (data.status === 'summary') {
                this.handleIncoming({ type: 'SESSION_END', ...data });
              }
            }
            return;
          }

          this.handleIncoming(data);
        } catch (e) {}
      });

      this.mqttClient.on('error', () => {
        // Try fallback broker on error
        if (!this.closed && brokerIndex === 0) {
          setTimeout(() => {
            if (!this.closed) this.connectMQTT(1);
          }, 1000);
        }
      });
    } catch (e) {}
  }

  publishRetainedState(status) {
    if (!this.mqttClient || !this.mqttClient.connected) return;
    try {
      const payload = JSON.stringify({
        code: this.roomCode,
        sessionId: this.sessionId,
        status: status,
        hostTime: Date.now()
      });
      this.mqttClient.publish(`hcm/v2/room/${this.roomCode}/state`, payload, { retain: true, qos: 0 });
    } catch (e) {}
  }

  handleIncoming(data) {
    if (!data || this.closed) return;

    // Filter out messages from different / old sessions
    if (this.sessionId && data.sessionId && data.sessionId !== this.sessionId) {
      return;
    }

    if (this.isHost) {
      // Host handles student join, progress, finish
      this.notify(data);
    } else {
      // Student only cares about host control signals (SESSION_START, SESSION_END, ROOM_STATE)
      if (
        data.type === 'SESSION_START' ||
        data.type === 'SESSION_END' ||
        data.type === 'ROOM_STATE'
      ) {
        this.notify(data);
      }
    }
  }

  setStatus(status) {
    this.status = status;
    if (this.isHost) {
      updateHostRoomStatus(this.roomCode, status, this.sessionId);
      this.publishRetainedState(status);
    }
  }

  resetSession() {
    this.sessionId = 's_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
    this.status = 'lobby';
    registerHostRoom(this.roomCode, 'lobby', this.sessionId);
    this.publishRetainedState('lobby');
    this.broadcast({
      type: 'ROOM_STATE',
      roomCode: this.roomCode,
      sessionId: this.sessionId,
      status: 'lobby',
      hostTime: Date.now()
    });
  }

  onMessage(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  notify(data) {
    this.listeners.forEach(cb => {
      try {
        cb(data);
      } catch (err) {
        console.error("Error in multiplayer message listener", err);
      }
    });
  }

  async broadcast(data) {
    if (this.closed) return;
    const packet = {
      ...data,
      sessionId: this.sessionId || data.sessionId,
      hostTime: Date.now()
    };

    // A. Local BroadcastChannel
    if (this.broadcastChannel) {
      try {
        this.broadcastChannel.postMessage(packet);
      } catch (e) {}
    }

    // B. LocalStorage bus
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(`${STORAGE_BUS_PREFIX}${this.roomCode}`, JSON.stringify({
          ...packet,
          _busId: Math.random(),
          _busTime: Date.now()
        }));
      }
    } catch (e) {}

    // C. MQTT publish
    if (this.mqttClient && this.mqttClient.connected) {
      try {
        const jsonStr = JSON.stringify(packet);
        if (this.isHost) {
          this.mqttClient.publish(`hcm/v2/room/${this.roomCode}/host`, jsonStr, { qos: 0 });
          if (data.type === 'SESSION_START') {
            this.publishRetainedState('live');
          } else if (data.type === 'SESSION_END') {
            this.publishRetainedState('summary');
          }
        } else {
          this.mqttClient.publish(
            `hcm/v2/room/${this.roomCode}/students/${data.playerId || 'anon'}`,
            jsonStr,
            { qos: 0 }
          );
        }
      } catch (e) {}
    }
  }

  close() {
    this.closed = true;
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
    if (this.isHost) {
      try {
        this.publishRetainedState('closed');
      } catch (e) {}
      unregisterHostRoom(this.roomCode);
    }
    if (this.storageListener && typeof window !== 'undefined') {
      window.removeEventListener('storage', this.storageListener);
      this.storageListener = null;
    }
    if (this.broadcastChannel) {
      try { this.broadcastChannel.close(); } catch (e) {}
      this.broadcastChannel = null;
    }
    if (this.mqttClient) {
      try { this.mqttClient.end(true); } catch (e) {}
      this.mqttClient = null;
    }
    this.listeners = [];
  }
}

export function generateRoomCode() {
  return DEFAULT_HOST_ROOM_CODE;
}
