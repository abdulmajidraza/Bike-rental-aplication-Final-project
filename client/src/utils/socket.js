import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect() {
    if (!this.socket) {
      this.socket = io(SOCKET_URL, {
        transports: ['websocket'],
        autoConnect: true,
      });

      this.socket.on('connect', () => {
        console.log('Socket connected:', this.socket.id);
      });

      this.socket.on('disconnect', () => {
        console.log('Socket disconnected');
      });
    }
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinTracking(bookingId) {
    if (this.socket) {
      this.socket.emit('joinTracking', bookingId);
    }
  }

  updateLocation(data) {
    if (this.socket) {
      this.socket.emit('updateLocation', data);
    }
  }

  onLocationUpdate(callback) {
    if (this.socket) {
      this.socket.on('locationUpdate', callback);
    }
  }

  offLocationUpdate() {
    if (this.socket) {
      this.socket.off('locationUpdate');
    }
  }
}

export default new SocketService();
