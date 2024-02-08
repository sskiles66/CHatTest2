import { io } from 'socket.io-client';

// socket.js

let socket;

export const connectSocket = () => {
  return new Promise((resolve, reject) => {
    socket = io('http://localhost:3000');
    socket.on('connect', () => {
      // Socket is connected
      resolve(socket);
    });
    socket.on('error', (error) => {
      // Handle error
      reject(error);
    });
  });
};

export const socket2 = io('http://localhost:3000');

