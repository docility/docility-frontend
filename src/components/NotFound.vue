<template>
  <div class="text-center p-8">
    <h2 class="text-2xl font-bold mb-4">404 Not Found</h2>
    <p>The page you are looking for does not exist.</p>
    <button 
      @click="goBack" 
      class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
    >
      Go Back
    </button>
  </div>
</template>

<script>
export default {
  name: 'NotFound',
  methods: {
    goBack() {
      this.$router.back(-1);
    }
  }
}
</script>

<style scoped>
/* Optional custom styles */
</style>
