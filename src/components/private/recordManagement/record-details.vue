<template>
  <div v-if="record" class="modal">
    <div class="modal-content">
      <h3>Record Details</h3>
      <p><strong>ID:</strong> {{ record.recordId }}</p>
      <p><strong>Name:</strong> {{ record.recordName }}</p>
      <p><strong>Category:</strong> {{ record.recordCategory }}</p>
      <p><strong>Contact:</strong> {{ record.contactPerson }}</p>
      <p><strong>Phone:</strong> {{ record.phone }}</p>
      <p><strong>Email:</strong> {{ record.email }}</p>
      <button @click="$emit('close')" class="btn btn-secondary">Close</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    record: {
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
