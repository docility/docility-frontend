<template>
  <div class="mb-4">
    <label class="block text-lg font-medium text-gray-700">
      {{ label }}
    </label>
    <select
      v-model="localValue"
      class="mt-1 block w-full p-2 border border-gray-300 rounded"
    >
      <optgroup
        v-for="group in groupedItems"
        :label="group.controlHeading"
        :key="group.controlHeading"
      >
        <option v-for="item in group.items" :key="item.id" :value="item.id">
          {{ item.controlHeading }}
        </option>
      </optgroup>
    </select>
  </div>
</template>

<script>
export default {
  name: "ControlMappingDropdown",
  props: {
    label: {
      type: String,
      default: "Control Mapping",
    },
    groupedItems: {
      type: Array,
      required: true,
    },
    modelValue: {
      type: [String, Number, null],
      default: null,
    },
  },
  computed: {
    localValue: {
      get() {
        return this.modelValue;
      },
      set(value) {
        this.$emit("update:modelValue", value);
      },
    },
  },
};
</script>

<style scoped>
/* Add any custom styles if needed */
</style>
