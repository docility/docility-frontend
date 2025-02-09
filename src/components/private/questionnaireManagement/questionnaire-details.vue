<template>
  <div v-if="customer" class="modal">
    <div class="modal-content">
      <h3>Customer Details</h3>
      <p><strong>Title:</strong> {{ customer.title }}</p>
      <p><strong>Description:</strong> {{ customer.description }}</p> 
      <button @click="$emit('close')" class="btn btn-secondary">Close</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    questionnaire: {
      type: Object,
      default: null,
    },
  },
};
</script>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  width: 50%;
}
</style>
