<template>
  <div v-if="customer" class="modal">
    <div class="modal-content">
      <h3>Customer Details</h3>
      <p><strong>ID:</strong> {{ customer.customerId }}</p>
      <p><strong>Name:</strong> {{ customer.customerName }}</p>
      <p><strong>Category:</strong> {{ customer.customerCategory }}</p>
      <p><strong>Contact:</strong> {{ customer.contactPerson }}</p>
      <p><strong>Phone:</strong> {{ customer.phone }}</p>
      <p><strong>Email:</strong> {{ customer.email }}</p>
      <button @click="$emit('close')" class="btn btn-secondary">Close</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    customer: {
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
