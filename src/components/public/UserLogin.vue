<template>
  <div class="min-h-screen bg-gradient-to-r from-purple-200 to-[#42f5e0] flex items-center justify-center px-4">
    <!-- 3D Login Card -->
    <div
      class="w-full max-w-md bg-white rounded-lg shadow-2xl transform transition-transform hover:scale-105 hover:shadow-3xl"
    >
      <!-- Logo Section -->
      <div class="flex justify-center py-6 bg-gradient-to-r from-gray-100 to-gray-200 rounded-t-lg">
        <img
          src="@/assets/logo.png"
          alt="Logo"
          class="h-16 w-auto object-contain"
        />
      </div>

      <!-- Login Form Section -->
      <div class="p-8">
        <h2 class="text-3xl font-bold text-center text-gray-800 mb-4">
          Welcome Back!
        </h2>
        <p class="text-center text-gray-600 mb-6">
          Please log in to access your account.
        </p>

        <form @submit.prevent="UserLogin">
          <!-- Username Field -->
          <div class="mb-6">
            <label for="username" class="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              v-model="username"
              id="username"
              placeholder="Enter your username"
              class="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-150"
            />
          </div>

          <!-- Password Field -->
          <div class="mb-6">
            <label for="password" class="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              v-model="password"
              id="password"
              type="password"
              placeholder="Enter your password"
              class="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-150"
            />
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            class="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-3 rounded-lg shadow-lg transition duration-200 transform hover:translate-y-[-2px]"
            :disabled="isSubmitting"
          >
            <span v-if="isSubmitting">Logging in...</span>
            <span v-else>Login</span>
          </button>

          <!-- Error Message -->
          <p v-if="errorMessage" class="mt-4 text-red-600 text-center">
            {{ errorMessage }}
          </p>
        </form>

        <!-- Additional Links -->
        <div class="mt-6 text-center">
          <router-link
            to="/register"
            class="text-indigo-500 hover:underline font-medium"
          >
            Create an Account
          </router-link>
        </div>
        <div class="mt-4 text-center">
          <button
            @click.prevent="showModal = true"
            class="text-gray-500 hover:underline font-medium"
          >
            Privacy Policy
          </button>
        </div>
      </div>
    </div>

    <!-- Privacy Policy Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div
        class="bg-white p-8 rounded-lg shadow-lg w-11/12 max-w-lg h-[700px] overflow-auto flex flex-col"
      >
        <PrivacyPolicy />
        <button
          @click="showModal = false"
          class="mt-4 px-4 py-2 rounded-lg self-end bg-indigo-500 text-white hover:bg-indigo-600 transition duration-200"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import http from "@/helpers/http";
import socket from "@/helpers/socket";
import PrivacyPolicy from "./PrivacyPolicy.vue";
import { createPinia } from "pinia";
const pinia = createPinia();
import { useSidebarStore } from "@/stores/SideBar";
const sidebarStore = useSidebarStore(pinia);
export default {
  components: {
    PrivacyPolicy,
  },
  data() {
    return {
      username: "",
      password: "",
      errorMessage: "",
      isSubmitting: false,
      showModal: false, // To control modal visibility
    };
  },
  methods: {
    async UserLogin() {
      this.isSubmitting = true;
      try {
        const response = await http.post("/api/auth/local", {
          identifier: this.username,
          password: this.password,
        });
        const { jwt, user } = response.data;
        
        console.log(user.data);
        console.log("jwt", jwt);
        console.log("user", user);
        sessionStorage.setItem("jwt", jwt);
        sessionStorage.setItem("profile", JSON.stringify(user));

        if (jwt) { 
          
        const userRes = await http.get(`/api/users/${user.id}?populate=*`)
          console.log("user data", userRes)
        
       
          const accessModule  = JSON.parse(userRes.data.subscription_management.accessModule).map(item => JSON.parse(item.value));
          console.log(typeof accessModule)
          console.log(accessModule)
          sessionStorage.setItem("accessModule", JSON.stringify(accessModule));
        
          sessionStorage.setItem("profile", JSON.stringify(userRes));
      
          socket.connect();
          
          sidebarStore.refreshMenu();
            this.$router.push("/dashboard").then(() => {
            window.location.reload();
          });
        }

      } catch (error) {
        console.error("Login error:", error);
        this.errorMessage = "Login failed. Please try again.";
      } finally {
        this.isSubmitting = false;
      }
    },
  },
};
</script>

<style>
/* Custom shadow for 3D effect */
.shadow-3xl {
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2), 0 15px 35px rgba(0, 0, 0, 0.15);
}
</style>