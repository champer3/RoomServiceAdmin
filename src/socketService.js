import io from 'socket.io-client';

// const SERVER_URL = 'http://10.0.0.173:3000';
const SERVER_URL = 'https://afternoon-waters-32871-fdb986d57f83.herokuapp.com';

let socket;

const initializeSocket = async (token) => {
  try {
    if (!socket) {
      socket = io(SERVER_URL, {
        query: { token, role: "admin" },
        transports: ['websocket'], 
      });

      socket.on('connect', () => {
        console.log('Connected to server');
      });

      socket.on('disconnect', () => {
        console.log('Disconnected from server');
      });

    }
  } catch (error) {
    console.error('Error initializing socket:', error);
  }
};

const getSocket = () => {
  if (!socket) {
    console.warn('Socket is not initialized. Please call initializeSocket first.');
  }
  return socket;
};

const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export { initializeSocket, getSocket, disconnectSocket };