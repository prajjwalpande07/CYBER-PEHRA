const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8000/ws/alerts';

type MessageHandler = (data: any) => void;

class WebSocketClient {
  private socket: WebSocket | null = null;
  private handlers: Set<MessageHandler> = new Set();
  private reconnectInterval: number = 3000;
  private isExplicitlyClosed: boolean = false;

  connect() {
    this.isExplicitlyClosed = false;
    try {
      this.socket = new WebSocket(WS_URL);

      this.socket.onopen = () => {
        console.log('[CYBER PEHRA WebSocket] Connected to real-time intervention grid at', WS_URL);
      };

      this.socket.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data);
          this.handlers.forEach((handler) => handler(parsed));
        } catch (err) {
          console.error('[CYBER PEHRA WebSocket] Failed to parse incoming event:', err);
        }
      };

      this.socket.onclose = () => {
        if (!this.isExplicitlyClosed) {
          console.warn('[CYBER PEHRA WebSocket] Connection closed. Retrying in', this.reconnectInterval, 'ms...');
          setTimeout(() => this.connect(), this.reconnectInterval);
        }
      };

      this.socket.onerror = (error) => {
        console.error('[CYBER PEHRA WebSocket] Error:', error);
      };
    } catch (err) {
      console.error('[CYBER PEHRA WebSocket] Initialization error:', err);
      setTimeout(() => this.connect(), this.reconnectInterval);
    }
  }

  subscribe(handler: MessageHandler): () => void {
    this.handlers.add(handler);
    return () => {
      this.handlers.delete(handler);
    };
  }

  disconnect() {
    this.isExplicitlyClosed = true;
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }
}

export const wsClient = new WebSocketClient();
