<template>
  <div
    class="modal-overlay flex justify-center items-center fixed inset-0 bg-black bg-opacity-50 z-[99999]"
  >
    <div
      class="modal-content bg-white p-8 rounded-lg max-w-7xl w-full overflow-y-auto"
    >
      <h3 class="text-xl font-semibold mb-6">
        {{ existingCompany ? "Update Company" : "Add New Company" }}
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
          <component
            :is="
              field.type === 'textarea'
                ? 'textarea'
                : field.type === 'select'
                  ? 'select'
                  : 'input'
            "
            :id="field.id"
            v-model="newCompany[field.model]"
            :type="
              field.type === 'textarea' || field.type === 'select'
                ? undefined
                : field.type
            "
            :class="[
              'form-input',
              'mt-1',
              'block',
              'w-full',
              'border',
              'rounded-md',
              'shadow-sm',
            ]"
            :required="field.required"
            :aria-required="field.required"
            :placeholder="field.placeholder"
            @change="logChange(field.model, $event)"
            @click="logChange(field.model, $event)"
          >
            <option
              v-for="option in field.options || []"
              :key="option.value"
              :value="option.value"
            >
              {{ option.text }}
            </option>
          </component>
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
// import http from "@/helpers/http";
// import { toast } from "vue3-toastify";
export default {
  props: {
    existingCompany: {
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
      newCompany: this.initializeCompanyData(this.existingCompany),
      showCreateCompanyCategory: false,
      companyCategoryList: null,
      formFields: [
        {
          id: "question",
          label: "Question",
          model: "question",
          type: "text",
          required: true,
          placeholder: "Enter Description",
        },
        {
          id: "options",
          label: "Options",
          model: "options",
          type: "text",
          required: true,
          options: [
            { text: "Customer", value: "Customer" },
            { text: "Supplier", value: "Supplier" },
          ],
          placeholder: "Enter Questionnaire Type",
        },
      ],
    };
  },
  watch: {
    existingCompany: {
      immediate: true,
      handler(newVal) {
        this.newCompany = this.initializeCompanyData(newVal);
      },
    },
  },
  methods: {
    logChange(model, event) {
      console.log(`Changed ${model}:`, event.target.value);
      this.newCompany[model] = event.target.value;
    },
    initializeCompanyData(company = null) {
      console.log(company);
      return company
        ? { ...company }
        : {
            question: "",
            options: "",
            questionnaires_id: this.$route.query.questionaireId,
          };
    },
    submitForm() {
      console.log("Submitted Data:", this.newCompany);
      if (Object.values(this.newCompany).some((value) => value === "")) {
        alert("Please fill in all required fields.");
        return;
      }

      this.callback({ ...this.newCompany });
      this.$emit("close");
    },
  },
  mounted() {
    console.log("Existing Company:", this.companyCategoryList);
  },
};
</script>
<style>
/* Modal Backdrop with Blur */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  backdrop-filter: blur(8px);
  background-color: rgba(0, 0, 0, 0.5); /* Slightly darken the background */
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
