<!-- src/App.vue -->
<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import { toast } from "vue3-toastify";
import socket from "./helpers/socket";

export default {
  name: "App",
  mounted() {
    socket.on("message", (data) => {
      toast[data.type](data.message); // Pass data to a custom handler
    });
  },
};
</script>
