<template>
  <div class="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-200 to-[#42f5e0]">
    <div class="w-full max-w-md p-8 bg-white  shadow-lg ">
    <img src="@/assets/logo.jpg" alt="Profile Picture" class="w-full h-full border-4 border-white object-cover"/>
  </div>
    <div class="w-full max-w-md p-8 bg-white rounded-lg shadow-lg ">
      <h2 class="text-4xl font-bold text-center mb-6 text-indigo-700 drop-shadow-md">Welcome Back!</h2>
      <p class="text-center text-gray-600 mb-8">Please sign in to your account</p>
      <form v-if="!grades" @submit.prevent="UserLogin">
        <div class="mb-6">
          <label for="username" class="block text-sm font-semibold text-gray-800">Username</label>
          <input 
            v-model="username" 
            id="username" 
            placeholder="Enter your username"
            class="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-150"
          />
        </div>

        <div class="mb-6">
          <label for="password" class="block text-sm font-semibold text-gray-800">Password</label>
          <input 
            v-model="password" 
            id="password" 
            type="password" 
            placeholder="Enter your password"
            class="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-150"
          />
        </div>

        <Button 
          type="submit" 
          class="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 font-semibold shadow-lg"
          :disabled="isSubmitting"
        >
          <span v-if="isSubmitting">Logging in...</span>
          <span v-else>Login</span>
        </Button>

        <div class="mt-6 text-center">
          <router-link to="/register" class="text-sm text-indigo-600 hover:underline">Create an Account</router-link>
        </div>

        <div class="mt-4 text-center border-t p-2">
          <router-link to="/view-grades" class="text-sm text-gray-600 hover:underline mt-2">View Grades</router-link>
        </div>
        
        <p v-if="errorMessage" class="mt-4 text-red-600 text-center">{{ errorMessage }}</p>
      </form>
    </div>
  </div>
</template>

<script>
import http from '@/helpers/http';  
import socket from '@/helpers/socket';
export default { 
  data() {
    return {
      username: '',
      password: '',
      errorMessage: '',
      isSubmitting: false,
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
        socket.connect()
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

<style scoped>
body {
  font-family: 'Poppins', sans-serif;
}

h2 {
  letter-spacing: 1.5px;
}

input {
  transition: border-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
}
 
button {
  letter-spacing: 0.5px;
}

a {
  font-weight: 500;
}
</style>
