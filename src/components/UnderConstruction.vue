<template>
  <div class="under-construction">
    <div class="message">
      🚧 This page is currently under construction! 🚧
    </div>
    <p>Please check back later for updates.</p>
  </div>
</template>

<script>
export default {
  name: 'UnderConstruction',
};
</script>

<style scoped>
.under-construction {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
  font-family: Arial, sans-serif;
}

.message {
  font-size: 2rem;
  font-weight: bold;
  color: #d9534f;
  margin-bottom: 10px;
}

p {
  font-size: 1.2rem;
  color: #5a5a5a;
}
</style>
