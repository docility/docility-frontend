<template>
  <div v-if="visible" class="modal-overlay">
    <div class="modal">
      <h3>{{ title }}</h3>
      <p>{{ message }}</p>
      <div class="modal-actions">
        <button @click="handleSubmit">{{ submitText }}</button>
        <button @click="handleCancel">{{ cancelText }}</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SubmitModal',
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    title: {
      type: String,
      default: 'Confirmation',
    },
    message: {
      type: String,
      required: true,
    },
    submitText: {
      type: String,
      default: 'Submit',
    },
    cancelText: {
      type: String,
      default: 'Cancel',
    },
  },
  methods: {
    handleSubmit() {
      this.$emit('submit');
    },
    handleCancel() {
      this.$emit('cancel');
    },
  },
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  background: white;
  padding: 20px;
  border-radius: 5px;
  text-align: center;
}

.modal-actions {
  margin-top: 20px;
}
</style>
