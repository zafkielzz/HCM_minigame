// Real-time synchronization utility for classroom multiplayer competition
// Utilizes public HTTPS SSE (Server-Sent Events) via ntfy.sh and browser BroadcastChannel fallback
// Includes room registry & validation logic to prevent joining non-existent or expired rooms

const BASE_TOPIC_PREFIX = 'hcm-vibe-';
const STORAGE_KEY_ROOMS = 'hcm_active_rooms';

/**
 * Retrieves the registry of active rooms from localStorage.
 * Automatically purges rooms older than 12 hours.
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
export function registerHostRoom(roomCode, status = 'lobby') {
  try {
    const code = roomCode.trim().toUpperCase();
    const rooms = getActiveRooms();
    rooms[code] = {
      code,
      createdAt: Date.now(),
      status // 'lobby' | 'live' | 'summary'
    };
    localStorage.setItem(STORAGE_KEY_ROOMS, JSON.stringify(rooms));
  } catch (e) {
    // ignore
  }
}

/**
 * Updates status of an existing host room ('lobby' | 'live' | 'summary').
 */
export function updateHostRoomStatus(roomCode, status) {
  try {
    const code = roomCode.trim().toUpperCase();
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
 * Unregisters a host room when host leaves or closes session.
 */
export function unregisterHostRoom(roomCode) {
  try {
    const code = roomCode.trim().toUpperCase();
    const rooms = getActiveRooms();
    delete rooms[code];
    localStorage.setItem(STORAGE_KEY_ROOMS, JSON.stringify(rooms));
  } catch (e) {
    // ignore
  }
}

/**
 * Verifies if a room exists and is currently accepting participants.
 * Combines localStorage fast lookup and BroadcastChannel ping-pong fallback.
 */
export async function verifyRoom(roomCode) {
  const code = (roomCode || '').trim().toUpperCase();
  if (!code) {
    return { valid: false, message: 'Vui lòng nhập mã phòng.' };
  }

  // 1. Fast check via localStorage active registry
  const localRooms = getActiveRooms();
  if (localRooms[code]) {
    const room = localRooms[code];
    if (room.status === 'live') {
      return { valid: false, message: 'Phòng thi đấu này đã bắt đầu! Không thể tham gia giữa chừng.' };
    }
    if (room.status === 'summary') {
      return { valid: false, message: 'Phòng thi đấu này đã kết thúc!' };
    }
    return { valid: true, room };
  }

  // 2. BroadcastChannel Ping-Pong fallback (for isolated incognito or cross-context host)
  if (typeof window !== 'undefined' && window.BroadcastChannel) {
    const checkPromise = new Promise((resolve) => {
      let channel = null;
      let timer = null;
      let finished = false;

      const finish = (result) => {
        if (!finished) {
          finished = true;
          if (timer) clearTimeout(timer);
          if (channel) {
            try { channel.close(); } catch (e) {}
          }
          resolve(result);
        }
      };

      try {
        channel = new BroadcastChannel(`hcm-channel-${code}`);
        channel.onmessage = (event) => {
          const data = event.data;
          if (data && (data.type === 'PONG_ROOM' || data.type === 'ROOM_HEARTBEAT' || data.type === 'SESSION_START')) {
            if (data.status === 'live') {
              finish({ valid: false, message: 'Phòng thi đấu này đã bắt đầu! Không thể tham gia giữa chừng.' });
            } else if (data.status === 'summary') {
              finish({ valid: false, message: 'Phòng thi đấu này đã kết thúc!' });
            } else {
              finish({ valid: true });
            }
          }
        };

        // Ping host
        channel.postMessage({ type: 'PING_ROOM', roomCode: code });

        // Wait up to 350ms for local channel response
        timer = setTimeout(() => {
          finish({ valid: false, message: 'Mã phòng không tồn tại hoặc chủ phòng chưa tạo phòng!' });
        }, 350);
      } catch (err) {
        finish({ valid: false, message: 'Mã phòng không tồn tại hoặc chủ phòng chưa tạo phòng!' });
      }
    });

    return await checkPromise;
  }

  return { valid: false, message: 'Mã phòng không tồn tại hoặc chủ phòng chưa tạo phòng!' };
}

export class MultiplayerSession {
  constructor(roomCode, isHost = false) {
    this.roomCode = roomCode.trim().toUpperCase();
    this.isHost = isHost;
    this.status = isHost ? 'lobby' : null;
    this.topic = `${BASE_TOPIC_PREFIX}${this.roomCode.toLowerCase()}`;
    this.eventSource = null;
    this.broadcastChannel = null;
    this.listeners = [];

    this.init();
  }

  init() {
    // 1. Setup BroadcastChannel for local tabs on same browser/device
    try {
      if (typeof window !== 'undefined' && window.BroadcastChannel) {
        this.broadcastChannel = new BroadcastChannel(`hcm-channel-${this.roomCode}`);
        this.broadcastChannel.onmessage = (event) => {
          const data = event.data;
          // If host receives ping from joining client, respond with current status
          if (this.isHost && data?.type === 'PING_ROOM') {
            try {
              this.broadcastChannel.postMessage({
                type: 'PONG_ROOM',
                roomCode: this.roomCode,
                status: this.status || 'lobby'
              });
            } catch (e) {}
            return;
          }
          this.notify(data);
        };
      }
    } catch (e) {
      console.warn("BroadcastChannel not supported", e);
    }

    // 2. Setup Server-Sent Events (SSE) via ntfy.sh for cross-device Internet sync
    try {
      const sseUrl = `https://ntfy.sh/${this.topic}/sse`;
      this.eventSource = new EventSource(sseUrl);

      this.eventSource.onmessage = (event) => {
        try {
          const envelope = JSON.parse(event.data);
          if (envelope.message) {
            const payload = JSON.parse(envelope.message);
            // If host receives ping via SSE
            if (this.isHost && payload?.type === 'PING_ROOM') {
              this.broadcast({
                type: 'PONG_ROOM',
                roomCode: this.roomCode,
                status: this.status || 'lobby'
              });
              return;
            }
            this.notify(payload);
          }
        } catch (err) {
          // Non-JSON or handshake event, ignore
        }
      };

      this.eventSource.onerror = (err) => {
        // SSE connection retry...
      };
    } catch (e) {
      console.warn("SSE initialization error", e);
    }
  }

  setStatus(status) {
    this.status = status;
    if (this.isHost) {
      updateHostRoomStatus(this.roomCode, status);
    }
  }

  // Subscribe to room messages
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

  // Broadcast event to all devices in the room
  async broadcast(data) {
    // Send to local BroadcastChannel first (0ms latency for local tabs)
    if (this.broadcastChannel) {
      try {
        this.broadcastChannel.postMessage(data);
      } catch (e) {
        // ignore
      }
    }

    // Send to ntfy.sh cloud broker for all phones / remote devices
    try {
      await fetch(`https://ntfy.sh/${this.topic}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    } catch (e) {
      // Cloud fallback warning suppressed
    }
  }

  close() {
    if (this.isHost) {
      unregisterHostRoom(this.roomCode);
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

// Generate easy 4-character room code (e.g. HCM-88, BOC-62)
export function generateRoomCode() {
  const prefixes = ['HCM', 'BOC', 'DVC', 'DAN', 'MINH'];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const num = Math.floor(10 + Math.random() * 89);
  return `${prefix}-${num}`;
}
