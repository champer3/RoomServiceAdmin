import io from 'socket.io-client';
import { API_URL } from './config';

let socket = null;

export const initializeSocket = (token) => {
  console.log('[AdminSocket] initializeSocket called, existing socket:', socket ? 'yes' : 'no');
  if (socket) {
    console.log('[AdminSocket] Socket already exists, connected:', socket.connected);
    return;
  }

  console.log('[AdminSocket] Creating new socket to:', API_URL);
  socket = io(API_URL, {
    query: { token, role: 'admin' },
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
  });

  socket.on('connect', () => {
    console.log('[AdminSocket] CONNECTED, id:', socket.id);
  });

  socket.on('disconnect', (reason) => {
    console.log('[AdminSocket] DISCONNECTED, reason:', reason);
  });

  socket.on('connect_error', (err) => {
    console.error('[AdminSocket] CONNECTION ERROR:', err.message);
  });

  socket.onAny((event, ...args) => {
    console.log('[AdminSocket] RECEIVED event:', event, JSON.stringify(args));
  });
};

export const getSocket = () => {
  if (!socket) {
    console.warn('[AdminSocket] getSocket called but socket is NULL');
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
