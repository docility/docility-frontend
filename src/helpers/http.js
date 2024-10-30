import axios from 'axios';

const http = axios.create({
  baseURL: process.env.VUE_APP_API_URL || 'https://api.example.com', // Use your API URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optional: Set up request interceptors for token attachment or logging
http.interceptors.request.use(
  (config) => { 
    // For example, add token from local storage if needed
    const token = sessionStorage.getItem('jwt');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Optional: Set up response interceptors for error handling
http.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle errors here, such as refreshing tokens or logging out users
    return Promise.reject(error);
  }
);

export default http;
