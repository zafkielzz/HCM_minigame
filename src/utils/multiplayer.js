// Real-time synchronization utility for classroom multiplayer competition
// Utilizes public HTTPS SSE (Server-Sent Events) via ntfy.sh and browser BroadcastChannel fallback

const BASE_TOPIC_PREFIX = 'hcm-vibe-';

export class MultiplayerSession {
  constructor(roomCode, isHost = false) {
    this.roomCode = roomCode.trim().toUpperCase();
    this.isHost = isHost;
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
          this.notify(event.data);
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
            this.notify(payload);
          }
        } catch (err) {
          // Non-JSON or handshake event, ignore
        }
      };

      this.eventSource.onerror = (err) => {
        console.warn("SSE connection retry...", err);
      };
    } catch (e) {
      console.warn("SSE initialization error", e);
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
      console.warn("Cloud broadcast error, using local fallback", e);
    }
  }

  close() {
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
