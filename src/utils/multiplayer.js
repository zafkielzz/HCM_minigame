// Real-time synchronization utility for classroom multiplayer competition
// Utilizes browser BroadcastChannel + localStorage storage event bus + public HTTPS SSE (ntfy.sh)
// Hardcoded dedicated classroom room code: 1945 (Chỉ toàn số, không ký tự đặc biệt)

export const DEFAULT_HOST_ROOM_CODE = '1945';
export const VALID_ROOM_CODES = new Set(['1945', 'HCM', 'HCM24', 'HCM1945']);

const BASE_TOPIC_PREFIX = 'hcm-vibe-';
const STORAGE_KEY_ROOMS = 'hcm_active_rooms';

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
export function updateHostRoomStatus(roomCode = DEFAULT_HOST_ROOM_CODE, status) {
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
 * Unregisters a host room.
 */
export function unregisterHostRoom(roomCode = DEFAULT_HOST_ROOM_CODE) {
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
 * Verifies if a room code is valid.
 * - Dedicated room code: 1945 (Chỉ số, mang ý nghĩa lịch sử Tuyên ngôn Độc lập)
 * - Returns { valid: true, code } if correct, or { valid: false, message } if incorrect.
 */
export function verifyRoom(roomCode) {
  const code = (roomCode || '').trim().toUpperCase();
  if (!code) {
    return { valid: false, message: 'Vui lòng nhập Mã phòng.' };
  }

  const isHardcodedValid = VALID_ROOM_CODES.has(code);
  const localRooms = getActiveRooms();
  const isRegisteredValid = Boolean(localRooms[code]);

  if (!isHardcodedValid && !isRegisteredValid) {
    return { 
      valid: false, 
      message: `Mã phòng không chính xác! Vui lòng nhập đúng mã phòng trên máy chiếu (${DEFAULT_HOST_ROOM_CODE}).` 
    };
  }

  // Check if active host is already in 'live' or 'summary'
  const room = localRooms[code];
  if (room) {
    if (room.status === 'live') {
      return { valid: false, message: 'Phòng thi đấu này đã bắt đầu! Không thể tham gia giữa chừng.' };
    }
    if (room.status === 'summary') {
      return { valid: false, message: 'Phòng thi đấu này đã kết thúc!' };
    }
  }

  return { valid: true, code };
}

export class MultiplayerSession {
  constructor(roomCode = DEFAULT_HOST_ROOM_CODE, isHost = false) {
    this.roomCode = roomCode.trim().toUpperCase();
    this.isHost = isHost;
    this.status = isHost ? 'lobby' : null;
    this.topic = `${BASE_TOPIC_PREFIX}${this.roomCode.toLowerCase()}`;
    this.eventSource = null;
    this.broadcastChannel = null;
    this.storageListener = null;
    this.listeners = [];

    this.init();
  }

  init() {
    // 1. Setup BroadcastChannel for local tabs on same browser/device
    try {
      if (typeof window !== 'undefined' && window.BroadcastChannel) {
        this.broadcastChannel = new BroadcastChannel(`hcm-channel-${this.roomCode}`);
        this.broadcastChannel.onmessage = (event) => {
          this.notify(event.data);
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
                this.notify(payload);
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
    try {
      const sseUrl = `https://ntfy.sh/${this.topic}/sse`;
      this.eventSource = new EventSource(sseUrl);

      this.eventSource.onmessage = (event) => {
        try {
          const envelope = JSON.parse(event.data);
          if (envelope.message) {
            const payload = JSON.parse(envelope.message);
            this.notify(payload);
          }
        } catch (err) {}
      };

      this.eventSource.onerror = () => {
        // SSE connection retry suppressed
      };
    } catch (e) {}
  }

  setStatus(status) {
    this.status = status;
    if (this.isHost) {
      updateHostRoomStatus(this.roomCode, status);
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
    if (this.isHost) {
      unregisterHostRoom(this.roomCode);
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

// Generate room code: Always returns dedicated clean room code '1945'
export function generateRoomCode() {
  return DEFAULT_HOST_ROOM_CODE;
}
