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
 * Unregisters a host room.
 */
export function unregisterHostRoom(roomCode = DEFAULT_HOST_ROOM_CODE) {
  try {
    const code = normalizeRoomCode(roomCode);
    const rooms = getActiveRooms();
    delete rooms[code];
    localStorage.setItem(STORAGE_KEY_ROOMS, JSON.stringify(rooms));
  } catch (e) {
    // ignore
  }
}

/**
 * Verifies if a room code is valid.
 * - Accepts HCM prefix + numbers (e.g. HCM1945, HCM24, or student typing 1945)
 * - Returns { valid: true, code } or { valid: false, message }
 */
export function verifyRoom(roomCode) {
  const code = normalizeRoomCode(roomCode);
  if (!code) {
    return { valid: false, message: 'Vui lòng nhập Mã phòng.' };
  }

  // Must match format HCM + digits (e.g. HCM1945, HCM24) or known valid codes
  const isFormatValid = /^HCM\d+$/.test(code) || VALID_ROOM_CODES.has(code);
  const localRooms = getActiveRooms();
  const isRegisteredValid = Boolean(localRooms[code]);

  if (!isFormatValid && !isRegisteredValid) {
    return { 
      valid: false, 
      message: `Mã phòng không đúng định dạng (Ví dụ: ${DEFAULT_HOST_ROOM_CODE} hoặc HCM24)!` 
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
    this.roomCode = normalizeRoomCode(roomCode) || DEFAULT_HOST_ROOM_CODE;
    this.isHost = isHost;
    this.status = isHost ? 'lobby' : null;
    this.topic = `${BASE_TOPIC_PREFIX}${this.roomCode.toLowerCase()}`;
    this.eventSource = null;
    this.broadcastChannel = null;
    this.storageListener = null;
    this.visibilityHandler = null;
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
  }

  connectSSE() {
    try {
      if (this.eventSource) {
        try { this.eventSource.close(); } catch (e) {}
      }
      const sseUrl = `https://ntfy.sh/${this.topic}/sse`;
      this.eventSource = new EventSource(sseUrl);

      this.eventSource.onmessage = (event) => {
        try {
          const envelope = JSON.parse(event.data);
          if (envelope.message) {
            const payload = JSON.parse(envelope.message);
            this.handleIncoming(payload);
          }
        } catch (err) {}
      };

      this.eventSource.onerror = () => {
        // SSE connection retry suppressed
      };
    } catch (e) {}
  }

  // Optimize traffic for 60 students:
  // Student phones ONLY care about Host control signals (SESSION_START, SESSION_END)
  // Ignoring the other 59 students' progress updates eliminates 98% of mobile CPU & network load!
  handleIncoming(data) {
    if (!data) return;

    if (!this.isHost) {
      if (data.type !== 'SESSION_START' && data.type !== 'SESSION_END') {
        return; // Ignore other students' progress on student phone
      }
    }

    this.notify(data);
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
