<template>
  <div class="modal-overlay flex justify-center items-center fixed inset-0 bg-black bg-opacity-50 z-[99999]">
    <div class="modal-content bg-white p-8 rounded-lg max-w-7xl w-full overflow-y-auto">
      <h3 class="text-xl font-semibold mb-6">
        {{ existingAssetCategory ? "Update Risk Treatment" : "New Risk Treatment" }}
      </h3>
      <form @submit.prevent="submitForm" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="field in formFields" :key="field.id" class="form-group">
          <label :for="field.id" class="block text-sm font-medium">
            {{ field.label }}
            <span v-if="field.required" class="text-red-500">*</span>
          </label>

          <textarea
            v-if="field.type === 'textarea'"
            :id="field.id"
            v-model="newCategory[field.model]"
            :placeholder="field.placeholder"
            :required="field.required" 
            :rows="field.rows"
            class="form-input mt-1 block w-full border rounded-md shadow-sm"
          ></textarea>

          <input
            v-else-if="field.type === 'text'"
            :id="field.id"
            v-model="newCategory[field.model]"
            :type="field.type"
            :placeholder="field.placeholder"
            :required="field.required"
            class="form-input mt-1 block w-full border rounded-md shadow-sm"
          />
        </div>

        <div class="modal-actions col-span-full flex justify-end mt-6">
          <button type="submit" class="btn bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">
            Save
          </button>
          <button type="button" @click="$emit('close')" class="btn bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md ml-2">
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: "CreateCategory",
  props: {
    existingAssetCategory: {
      type: Object,
      default: null,
    },
    callback: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
      newCategory: this.initializeCategoryData(this.existingAssetCategory),
      formFields: [
        {
          id: "treatmentOption",
          label: "Treatment Option Name",
          model: "treatmentOption",
          type: "text",
          required: true,
          placeholder: "Enter Treatment Option",
        },
        {
          id: "whenToUse",
          label: "When To Use",
          model: "whenToUse",
          type: "textarea",
          rows: 4,
          required: true,
          placeholder: "Enter When To Use",
        },
        {
          id: "description",
          label: "Description",
          model: "description",
          type: "textarea",
          rows: 4,
          required: true,
          placeholder: "Enter Description",
        },
      ],
    };
  },
  watch: {
    existingAssetCategory: {
      immediate: true,
      handler(newVal) {
        this.newCategory = this.initializeCategoryData(newVal);
      },
    },
  },
  methods: {
    initializeCategoryData(category = null) {
      return category ? { ...category } : { treatmentOption: "", whenToUse: "", description: "" };
    },
    submitForm() {
      if (Object.values(this.newCategory).some(value => value === "")) {
        alert("Please fill in all required fields.");
        return;
      }
      this.callback({ ...this.newCategory });
      this.$emit("close");
    },
  },
};
</script>

<style>
.modal-overlay {
  backdrop-filter: blur(8px);
}
</style>
