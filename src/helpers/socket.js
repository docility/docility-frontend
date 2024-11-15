// src/utils/socket.js
import { io } from "socket.io-client";

// Establish a connection to the Socket.IO server

const profile = sessionStorage.getItem("profile")
let profileId = ''

if (profile) { 
  profileId = JSON.parse(profile)?.id 
  console.log(profileId)
}



  console.log(process.env.VUE_APP_ENVI == 'production' ? process.env.VUE_APP_API_URL_PROD : process.env.VUE_APP_API_URL)
  const socket = io(process.env.VUE_APP_ENVI == 'production' ? process.env.VUE_APP_API_URL_PROD : process.env.VUE_APP_API_URL, {
    reconnection: true,          // Default: true (enabled)
    reconnectionAttempts: 5,     // Number of attempts before giving up
    reconnectionDelay: 1000,     // Delay between each attempt (in ms)
    reconnectionDelayMax: 5000,  // Maximum delay between attempts (in ms)
    timeout: 20000,               // Connection timeout (in ms)// Manually connect when needed
    auth: {
      userId: profileId, // Pass the JWT during connection
    },
  });


  // Add event listeners for debugging or handling connections
  socket.on("connect", () => {
    console.log(`Connected to server with ID: ${socket?.id}`);
  });

  socket.on("connect_error", (err) => {
    console.error("Connection error:", err.message);
  });

  socket.on("disconnect", () => {
    console.log("Disconnected from server");
  }); 
 
export default socket;
