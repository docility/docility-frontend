<!-- InputTextComponent.vue -->
<template>
  <div class="input-group">
    <label :for="id" class="block text-sm font-medium text-gray-700"
      >{{ label }}:</label
    >
    <input
      :id="id"
      :type="type"
      :value="value"
      :placeholder="placeholder"
      :class="['input-text', className]"
      @input="updateValue($event.target.value)"
      required
    />
  </div>
</template>

<script>
export default {
  name: "InputTextComponent",
  props: {
    value: {
      type: String,
      default: "",
    },
    placeholder: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      default: "text",
    },
    className: {
      type: String,
      default: "",
    },
    id: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      default: "",
    },
  },
  methods: {
    updateValue(value) {
      this.$emit("input", value);
    },
  },
};
</script>

<style scoped>
.input-text {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 0.375rem;
  box-shadow: 0 0 0 1px rgba(49, 130, 206, 0.2);
}
</style>
