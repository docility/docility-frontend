// src/main.js
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router"; // Import the router
// Import Tailwind CSS
import "./assets/tailwind.css";
import Vue3Toastify from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import { createPinia } from 'pinia';

console.log(process.env.VUE_APP_ENVI);

const app = createApp(App);
const toastOptions = {
  autoClose: 3000, // Toast duration in milliseconds
  position: "top-right", // Toast position
};
app.use(Vue3Toastify, toastOptions);
app.use(createPinia());
app.use(router); // Use the router

app.mount("#app");
