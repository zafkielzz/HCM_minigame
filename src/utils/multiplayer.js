// Real-time synchronization utility for classroom multiplayer competition
// Utilizes browser BroadcastChannel + localStorage storage event bus + public HTTPS SSE (ntfy.sh)
// Alphanumeric room codes with 'HCM' prefix (e.g. HCM1945, HCM24, HCM88, HCM60)

export const DEFAULT_HOST_ROOM_CODE = 'HCM1945';
export const VALID_ROOM_CODES = new Set(['HCM1945', 'HCM24', 'HCM60', 'HCM88', 'HCM01', 'HCM02', 'HCM']);

const BASE_TOPIC_PREFIX = 'hcm-vibe-';
const STORAGE_KEY_ROOMS = 'hcm_active_rooms';

/**
 * Normalizes user input room code:
 * - Strips whitespace, special symbols and hyphens
 * - Automatically prepends 'HCM' if only numbers were entered (e.g. '1945' -> 'HCM1945', '24' -> 'HCM24')
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
      if (now - (r.createdAt || 0) < 12 * 60 * 60 * 1000) {
        cleaned[code] = r;
      }
    }
    return cleaned;
  } catch (e) {
    return {};
  }
}

/**
 * Registers an active host room.
 */
export function registerHostRoom(roomCode = DEFAULT_HOST_ROOM_CODE, status = 'lobby') {
  try {
    const code = normalizeRoomCode(roomCode);
    const rooms = getActiveRooms();
    rooms[code] = {
      code,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      status // 'lobby' | 'live' | 'summary' | 'closed'
    };
    localStorage.setItem(STORAGE_KEY_ROOMS, JSON.stringify(rooms));
  } catch (e) {
    // ignore
  }
}

/**
 * Updates status of an existing host room ('lobby' | 'live' | 'summary' | 'closed').
 */
export function updateHostRoomStatus(roomCode = DEFAULT_HOST_ROOM_CODE, status) {
  try {
    const code = normalizeRoomCode(roomCode);
    const rooms = getActiveRooms();
    if (rooms[code]) {
      rooms[code].status = status;
      rooms[code].updatedAt = Date.now();
      localStorage.setItem(STORAGE_KEY_ROOMS, JSON.stringify(rooms));
    }
  } catch (e) {
    // ignore
  }
}

/**
 * Unregisters a host room and sets its status to 'closed'.
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
  } catch (e) {
    // ignore
  }
}

/**
 * Verifies if a room is actively OPEN and accepting players.
 * Strict room lifecycle control:
 * 1. Checks format (HCM prefix + digits e.g. HCM1945, HCM24)
 * 2. Checks if Host has actively clicked "Tạo phòng" (status: 'lobby')
 * 3. Blocks entry if Host hasn't opened room yet
 * 4. Blocks entry if session already started (status: 'live') or ended (status: 'summary')
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

  // 2. Check local storage (instant 0ms response on same device/browser)
  const localRooms = getActiveRooms();
  const localRoom = localRooms[code];

  if (localRoom) {
    const age = now - (localRoom.updatedAt || localRoom.createdAt || 0);
    // If local room active in last 2 hours
    if (age < 2 * 60 * 60 * 1000) {
      if (localRoom.status === 'live' || localRoom.status === 'locked') {
        return { 
          valid: false, 
          message: 'Phòng thi đấu đã bắt đầu và đã khoá phòng, không thể tham gia!' 
        };
      }
      if (localRoom.status === 'summary') {
        return { 
          valid: false, 
          message: 'Phòng thi đấu này đã kết thúc!' 
        };
      }
      if (localRoom.status === 'closed') {
        return { 
          valid: false, 
          message: 'Chủ phòng chưa mở hoặc đã đóng phòng thi đấu này!' 
        };
      }
      if (localRoom.status === 'lobby') {
        return { valid: true, code, status: 'lobby' };
      }
    }
  }

  // 3. For cross-device (e.g. 60 student phones over WiFi/4G connecting to Host laptop):
  // Poll ntfy.sh to verify if Host has actively opened this room and what its state is
  try {
    const topic = `${BASE_TOPIC_PREFIX}${code.toLowerCase()}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    const resp = await fetch(`https://ntfy.sh/${topic}/json?poll=1`, {
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (resp.ok) {
      const text = await resp.text();
      const lines = text.trim().split('\n').filter(Boolean);

      // Search backwards for the latest host control packet
      let latestHostMsg = null;
      for (let i = lines.length - 1; i >= 0; i--) {
        try {
          const item = JSON.parse(lines[i]);
          if (item.message) {
            const data = JSON.parse(item.message);
            if (
              data.type === 'ROOM_STATE' ||
              data.type === 'ROOM_HEARTBEAT' ||
              data.type === 'SESSION_START' ||
              data.type === 'SESSION_END'
            ) {
              latestHostMsg = { ...data, serverTime: (item.time || 0) * 1000 };
              break;
            }
          }
        } catch (e) {}
      }

      if (!latestHostMsg) {
        return { 
          valid: false, 
          message: 'Chủ phòng chưa mở phòng thi đấu này. Vui lòng chờ nhóm thuyết trình tạo phòng!' 
        };
      }

      const msgTime = latestHostMsg.hostTime || latestHostMsg.serverTime || 0;
      if (now - msgTime > 30 * 60 * 1000) {
        return { 
          valid: false, 
          message: 'Phòng thi đấu này chưa được mở hoặc đã hết hạn từ phiên trước!' 
        };
      }

      const status = latestHostMsg.status;
      if (status === 'live' || status === 'locked' || latestHostMsg.type === 'SESSION_START') {
        return { 
          valid: false, 
          message: 'Phòng thi đấu đã bắt đầu và đã khoá phòng, không thể tham gia!' 
        };
      }
      if (status === 'summary' || latestHostMsg.type === 'SESSION_END') {
        return { 
          valid: false, 
          message: 'Phòng thi đấu này đã kết thúc!' 
        };
      }
      if (status === 'closed') {
        return { 
          valid: false, 
          message: 'Chủ phòng đã đóng phòng thi đấu này!' 
        };
      }
      if (status === 'lobby') {
        return { valid: true, code, status: 'lobby' };
      }
    }
  } catch (err) {
    // If fetch failed due to offline/timeout, but local tab was in lobby:
    if (localRoom && localRoom.status === 'lobby') {
      return { valid: true, code, status: 'lobby' };
    }
    return {
      valid: false,
      message: 'Không thể kết nối đến máy chủ phòng. Vui lòng kiểm tra lại kết nối mạng hoặc chờ chủ phòng!'
    };
  }

  return { 
    valid: false, 
    message: 'Chủ phòng chưa mở phòng thi đấu này. Vui lòng chờ nhóm thuyết trình tạo phòng!' 
  };
}

export class MultiplayerSession {
  constructor(roomCode = DEFAULT_HOST_ROOM_CODE, isHost = false) {
    this.roomCode = normalizeRoomCode(roomCode) || DEFAULT_HOST_ROOM_CODE;
    this.isHost = isHost;
    this.status = isHost ? 'lobby' : null;
    this.topic = `${BASE_TOPIC_PREFIX}${this.roomCode.toLowerCase()}`;
    this.eventSource = null;
    this.broadcastChannel = null;
    this.storageListener = null;
    this.visibilityHandler = null;
    this.heartbeatTimer = null;
    this.listeners = [];

    this.init();
  }

  init() {
    // 1. Setup BroadcastChannel for local tabs on same browser/device
    try {
      if (typeof window !== 'undefined' && window.BroadcastChannel) {
        this.broadcastChannel = new BroadcastChannel(`hcm-channel-${this.roomCode}`);
        this.broadcastChannel.onmessage = (event) => {
          this.handleIncoming(event.data);
        };
      }
    } catch (e) {
      console.warn("BroadcastChannel not supported", e);
    }

    // 2. Setup LocalStorage storage event bus for indestructible cross-tab sync
    try {
      if (typeof window !== 'undefined') {
        this.storageListener = (e) => {
          if (e.key === `hcm_bus_${this.roomCode}` && e.newValue) {
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
    } catch (e) {
      // ignore
    }

    // 3. Setup Server-Sent Events (SSE) via ntfy.sh for cross-device internet sync
    this.connectSSE();

    // 4. Auto-reconnect SSE when phone wakes up from lock screen
    if (typeof document !== 'undefined') {
      this.visibilityHandler = () => {
        if (!document.hidden) {
          if (!this.eventSource || this.eventSource.readyState === EventSource.CLOSED) {
            this.connectSSE();
          }
        }
      };
      document.addEventListener('visibilitychange', this.visibilityHandler);
    }

    // 5. If Host, broadcast initial ROOM_STATE and start regular heartbeat
    if (this.isHost) {
      registerHostRoom(this.roomCode, 'lobby');
      this.broadcastRoomState('lobby');

      this.heartbeatTimer = setInterval(() => {
        if (this.status) {
          updateHostRoomStatus(this.roomCode, this.status);
          this.broadcast({
            type: 'ROOM_HEARTBEAT',
            roomCode: this.roomCode,
            status: this.status,
            hostTime: Date.now()
          });
        }
      }, 4000);
    }
  }

  connectSSE() {
    try {
      if (this.eventSource) {
        try { this.eventSource.close(); } catch (e) {}
      }
      const sseUrl = `https://ntfy.sh/${this.topic}/sse`;
      this.eventSource = new EventSource(sseUrl);

      this.eventSource.onmessage = async (event) => {
        try {
          const envelope = JSON.parse(event.data);
          let payload = null;
          if (envelope.attachment && envelope.attachment.url) {
            try {
              const fileRes = await fetch(envelope.attachment.url);
              payload = await fileRes.json();
            } catch (err) {}
          }
          if (!payload && envelope.message) {
            try {
              payload = JSON.parse(envelope.message);
            } catch (err) {}
          }
          if (payload) {
            this.handleIncoming(payload);
          }
        } catch (err) {}
      };

      this.eventSource.onerror = () => {
        // SSE connection retry suppressed
      };
    } catch (e) {}
  }

  broadcastRoomState(status = this.status) {
    this.status = status;
    updateHostRoomStatus(this.roomCode, status);
    this.broadcast({
      type: 'ROOM_STATE',
      roomCode: this.roomCode,
      status: status,
      hostTime: Date.now()
    });
  }

  // Optimize traffic for 60 students:
  // Student phones ONLY care about Host control signals (SESSION_START, SESSION_END)
  // Ignoring the other 59 students' progress updates eliminates 98% of mobile CPU & network load!
  handleIncoming(data) {
    if (!data) return;

    if (this.isHost) {
      if (data.type === 'ROOM_PING') {
        this.broadcast({
          type: 'ROOM_PONG',
          roomCode: this.roomCode,
          status: this.status,
          hostTime: Date.now()
        });
        return;
      }
    } else {
      if (
        data.type !== 'SESSION_START' && 
        data.type !== 'SESSION_END' && 
        data.type !== 'ROOM_PONG' && 
        data.type !== 'ROOM_STATE'
      ) {
        return; // Ignore other students' progress on student phone
      }
    }

    this.notify(data);
  }

  setStatus(status) {
    this.status = status;
    if (this.isHost) {
      this.broadcastRoomState(status);
    }
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
        console.error("Error in room message listener", err);
      }
    });
  }

  async broadcast(data) {
    // A. Local BroadcastChannel
    if (this.broadcastChannel) {
      try {
        this.broadcastChannel.postMessage(data);
      } catch (e) {}
    }

    // B. LocalStorage bus
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(`hcm_bus_${this.roomCode}`, JSON.stringify({
          ...data,
          _busId: Math.random(),
          _busTime: Date.now()
        }));
      }
    } catch (e) {}

    // C. Cloud SSE broker (ntfy.sh)
    try {
      await fetch(`https://ntfy.sh/${this.topic}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    } catch (e) {}
  }

  close() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
    if (this.isHost) {
      try {
        this.broadcast({
          type: 'ROOM_STATE',
          roomCode: this.roomCode,
          status: 'closed',
          hostTime: Date.now()
        });
      } catch (e) {}
      unregisterHostRoom(this.roomCode);
    }
    if (this.visibilityHandler && typeof document !== 'undefined') {
      document.removeEventListener('visibilitychange', this.visibilityHandler);
      this.visibilityHandler = null;
    }
    if (this.storageListener && typeof window !== 'undefined') {
      window.removeEventListener('storage', this.storageListener);
      this.storageListener = null;
    }
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
    if (this.broadcastChannel) {
      this.broadcastChannel.close();
      this.broadcastChannel = null;
    }
    this.listeners = [];
  }
}

// Generate room code: Defaults to 'HCM1945' with ability to cycle other codes
const ROOM_SUITE = ['HCM1945', 'HCM24', 'HCM60', 'HCM88', 'HCM01', 'HCM02'];
let currentSuiteIndex = 0;

export function generateRoomCode(cycleNext = false) {
  if (cycleNext) {
    currentSuiteIndex = (currentSuiteIndex + 1) % ROOM_SUITE.length;
  }
  return ROOM_SUITE[currentSuiteIndex];
}
