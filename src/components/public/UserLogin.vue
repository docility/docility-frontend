<template>
  <div class="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-200 to-[#42f5e0]">
    <div class="w-full max-w-md p-8 bg-white shadow-lg">
      <img src="@/assets/logo.png" alt="Profile Picture" class="w-full h-full border-4 border-white object-cover"/>
    </div>
    <div class="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
      <h2 class="text-4xl  text-default text-center mb-6  drop-shadow-md">Welcome Back!</h2>
      <p class="text-center text-gray-600 mb-8">Please sign in to your account</p>
      <form @submit.prevent="UserLogin">
        <div class="mb-6">
          <label for="username" class="text-default">Username</label>
          <input 
            v-model="username" 
            id="username" 
            placeholder="Enter your username"
            class="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-150"
          />
        </div>

        <div class="mb-6">
          <label for="password" class=" text-default">Password</label>
          <input 
            v-model="password" 
            id="password" 
            type="password" 
            placeholder="Enter your password"
            class="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-150"
          />
        </div>

        <button 
          type="submit" 
          class="w-full secondary-button-style text-default"
          :disabled="isSubmitting"
        >
          <span v-if="isSubmitting">Logging in...</span>
          <span v-else>Login</span>
        </button>

        <div class="mt-6 text-center">
          <router-link to="/register" class="link-text-primary">Create an Account</router-link>
        </div> 

        <div class="mt-6 text-center">
          <button 
            @click.prevent="showModal = true" 
            class="link-text-secondary"
          >
            Privacy Policy
          </button>
        </div> 

        <p v-if="errorMessage" class="mt-4 text-red-600 text-center">{{ errorMessage }}</p>
      </form>
    </div>

    <!-- Privacy Policy Modal -->
    <div 
      v-if="showModal"  
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 scroll-smooth"
    >
      <div class="bg-white p-8 rounded-lg shadow-lg w-11/12 max-w-lg h-[700px] overflow-auto flex flex-col"> 
        <PrivacyPolicy /> 
        <button 
          @click="showModal = false" 
          class="mt-4 px-4 py-2 rounded-lg self-end transition  button-style"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import http from '@/helpers/http';  
import socket from '@/helpers/socket';
import PrivacyPolicy from './PrivacyPolicy.vue';

export default { 
  components: {
    PrivacyPolicy
  },
  data() {
    return {
      username: '',
      password: '',
      errorMessage: '',
      isSubmitting: false,
      showModal: false, // To control modal visibility
      apiUrl: process.env.VUE_APP_API_URL,
    };
  },
  methods: {
    async UserLogin() {
      this.isSubmitting = true;
      try {
        const response = await http.post(`/api/auth/local`, {
          identifier: this.username,
          password: this.password,
        });

        const { jwt, user } = response.data; 

        sessionStorage.setItem('jwt', jwt); 
        sessionStorage.setItem('profile', JSON.stringify(user)); 
        socket.connect();
        this.$router.push('/dashboard'); 
      } catch (error) {
        this.errorMessage = 'Login failed. Please try again.';
      } finally {
        this.isSubmitting = false;
      }
    },
  },
};
</script>
