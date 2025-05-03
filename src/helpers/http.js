import axios from "axios";

console.log(process.env.VUE_APP_ENVI);

const http = axios.create({
  baseURL: "/v1", // Use the proxy URL instead of the backend API URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: Set up request interceptors for token attachment or logging
http.interceptors.request.use(
  (config) => {
    // For example, add token from local storage if needed
    const token = sessionStorage.getItem("jwt");
    const profile = JSON.parse(sessionStorage.getItem("profile"));
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log(profile);
    if (profile && profile.id) {
      config.headers.userId = profile.id; // Add the user ID to the headers
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Optional: Set up response interceptors for error handling
http.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle errors here, such as refreshing tokens or logging out users
    return Promise.reject(error);
  },
);

export default http;