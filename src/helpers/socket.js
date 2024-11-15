// src/utils/socket.js
import { io } from "socket.io-client";

// Establish a connection to the Socket.IO server

const profileId = JSON.parse(sessionStorage.getItem("profile")).id

const socket = io("http://localhost:1337", {
  autoConnect: false, // Manually connect when needed
  auth: {
    userId: profileId, // Pass the JWT during connection
  },
});

socket.connect();

// Add event listeners for debugging or handling connections
socket.on("connect", () => {
  console.log(`Connected to server with ID: ${socket.id}`);
});

socket.on("connect_error", (err) => {
  console.error("Connection error:", err.message);
});

socket.on("disconnect", () => {
  console.log("Disconnected from server");
});

// Function to listen for backend messages
export const listenToBackendMessage = (callback) => {
  socket.on("message", (data) => { 
    callback({type: data.type, message: data.message}); // Pass data to a custom handler
  });
};

export default socket;
