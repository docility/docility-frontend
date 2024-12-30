<template>
  <div class="flex items-center flex-col cursor-pointer hover:scale-110">
    <img @click="callback" :src="svg" alt="My Icon" /> 
    <small>{{ title }}</small>
  </div>
</template>

<script>
export default {
  props: {
    svg: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '', // Change type to String if it's just text
    },
    callback: {
      type: Function,
      default: () => {},
    },
  },
};
</script>

<style scoped>
/* Tailwind classes already applied, so no need for custom CSS here */
</style>
