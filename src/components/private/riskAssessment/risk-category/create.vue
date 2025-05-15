<template>
  <div
    class="modal-overlay flex justify-center items-center fixed inset-0 bg-black bg-opacity-50 z-[99999]"
  >
    <div
      class="modal-content bg-white p-8 rounded-lg max-w-7xl w-full overflow-y-auto"
    >
      <h3 class="text-xl font-semibold mb-6">
        {{ existingRiskCategory ? "Update Category" : "Add New Category" }}
      </h3>
      <form
        @submit.prevent="submitForm"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <div v-for="field in formFields" :key="field.id" class="form-group">
          <label :for="field.id" class="block text-sm font-medium">
            {{ field.label }}
            <span v-if="field.required" class="text-red-500">*</span>
          </label>

          <!-- Input Fields -->
          <textarea
            v-if="field.type === 'textarea'"
            :id="field.id"
            v-model="newCategory[field.model]"
            :placeholder="field.placeholder"
            :required="field.required"
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

          <!-- Select Dropdown -->
          <select
            v-else-if="field.type === 'select'"
            :id="field.id"
            v-model="newCategory[field.model]"
            :required="field.required"
            class="form-input mt-1 block w-full border rounded-md shadow-sm"
          >
            <option
              v-for="option in field.options"
              :key="option.value"
              :value="option.value"
            >
              {{ option.text }}
            </option>
          </select>

          <!-- Checkbox Group -->
          <div v-else-if="field.type === 'checkbox'" class="mt-2 space-y-2">
            <label
              v-for="option in field.options"
              :key="option.value"
              class="flex items-center space-x-2"
            >
              <input
                type="checkbox"
                :value="option.value"
                v-model="newCategory[field.model]"
                class="form-checkbox h-4 w-4 text-blue-500"
              />
              <span>{{ option.text }}</span>
            </label>
          </div>
        </div>

        <div class="modal-actions col-span-full flex justify-end mt-6">
          <button
            type="submit"
            class="btn bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Save
          </button>
          <button
            type="button"
            @click="$emit('close')"
            class="btn bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md ml-2"
          >
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
    existingRiskCategory: {
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
      topics: [],
      newCategory: this.initializeCategoryData(this.existingRiskCategory),
      formFields: [
        {
          id: "category_domain",
          label: "Category Name",
          model: "category_domain",
          type: "text",
          required: true,
          placeholder: "Enter Category Name",
        },
        {
          id: "categoryType",
          label: "Category Type",
          model: "categoryType",
          type: "text",
          required: true,
          placeholder: "Enter Category Name",
        },
        {
          id: "description",
          label: "Description",
          model: "description",
          type: "text",
          required: true,
          placeholder: "Enter Description",
        },
        // {
        //   id: "options",
        //   label: "Options",
        //   model: "options",
        //   type: "text",
        //   required: true,
        //   placeholder: "Enter Options",
        // }, 
      ],
    };
  },
  watch: {
    existingCategory: {
      immediate: true,
      handler(newVal) {
        console.log("newVal", newVal)
        // this.newCategory = this.initializeCategoryData(newVal);
      },
    },
  },
  methods: {
    initializeCategoryData(category = null) {
      console.log("category", category) 
      return category
        ? {
          category_domain: category.category_domain,
          categoryType: category.categoryType,
          description: category.description, 
          }
        : {
            category_domain: "",
            categoryType: "",
            description: "",  
          };
    },
    submitForm() {
      console.log("Submitted Data:", this.newCategory);
      // if (Object.values(this.newCategory).some((value) => value === "")) {
      //   alert("Please fill in all required fields.");
      //   return;
      // }

      // Convert options to JSON before submission
      // this.newCategory.options = JSON.stringify({
      //   options: this.newCategory.options,
      // });

      this.newCategory.id = this.existingRiskCategory?.id;
      console.log("submited", this.existingRiskCategory)
      this.callback({ ...this.newCategory });
      this.$emit("close");
    },

  },
  mounted() {
    // this.fetchTopics();
  },
};
</script>

<style>
/* Modal Backdrop */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  backdrop-filter: blur(8px);
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

/* Modal Styling */
.modal {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  width: 350px;
  max-width: 90%;
  text-align: center;
}

.modal h3 {
  margin-bottom: 15px;
  font-size: 18px;
  color: #333;
}

.modal-buttons {
  margin-top: 15px;
}

.btn-save {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
}

.btn-save:hover {
  background-color: #45a049;
}

.btn-cancel {
  background-color: #f44336;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  margin-left: 10px;
}

.btn-cancel:hover {
  background-color: #d32f2f;
}
</style>
