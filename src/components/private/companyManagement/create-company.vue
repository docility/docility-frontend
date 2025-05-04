<template>
  <div class="modal-overlay flex justify-center items-center fixed inset-0 bg-black bg-opacity-50 z-[99999]">
    <div
      v-if="loading"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100000]"
    >
      <div class="flex flex-col items-center">
        <span class="loader w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></span>
        <p class="text-white mt-4 text-lg font-semibold">Loading...</p>
      </div>
    </div>
    <div  v-else class="modal-content bg-white p-8 rounded-lg max-w-5xl w-full overflow-y-auto h-66 shadow-lg">
      <h3 class="text-2xl font-bold mb-6 text-gray-800">
        {{ existingCompany ? "Update Company" : "New Company" }}
      </h3>
      <form @submit.prevent="submitForm" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Dynamic Form Fields -->
        <div v-for="field in formFields" :key="field.id" class="form-group flex flex-col">
          <label :for="field.id" class="block text-sm font-medium text-gray-700 mb-1">
            {{ field.label }}
            <span v-if="field.required" class="text-red-500">*</span>
          </label>
 
          <!-- Textarea -->
          <textarea v-if="field.type === 'textarea'" :id="field.id" v-model="newCompany[field.model]"
            :placeholder="field.placeholder" :required="field.required"
            class="form-input mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300 focus:outline-none"></textarea>

          <!-- Text Input -->
          <input v-else-if="field.type === 'text'" :id="field.id" v-model="newCompany[field.model]" :type="field.type"
            :placeholder="field.placeholder" :required="field.required" :readonly="field['read-only']"
            class="form-input mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300 focus:outline-none" />

          <!-- Date Input -->
          <input v-else-if="field.type === 'date'" :id="field.id" v-model="newCompany[field.model]" type="date"
            :placeholder="field.placeholder" :required="field.required"
            class="form-input mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300 focus:outline-none" />

          <!-- Select Dropdown -->
          <select v-else-if="field.type === 'select'" :id="field.id" v-model="newCompany[field.model]"
            :required="field.required"
            class="form-input mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300 focus:outline-none">
            <option v-for="option in field.options" :key="option.value" :value="option.value">
              {{ option.text }}
            </option>
          </select>

          <!-- Checkbox Group -->
          <div v-else-if="field.type === 'checkbox'" class="mt-2 space-y-2">
            <label v-for="option in field.options" :key="option.value" class="flex items-center space-x-2">
              <input type="checkbox" :value="option.value" v-model="newCompany[field.model]"
                class="form-checkbox h-4 w-4 text-blue-500" />
              <span>{{ option.text }}</span>
            </label>
          </div>



          <!-- Multiselect -->
          <Multiselect v-else-if="field.type === 'multi'" v-model="newCompany[field.model]" :options="field.options"
            :multiple="field['multiple-select']" :close-on-select="!field['multiple-select']" :clear-on-select="false"
            :preserve-search="true" placeholder="Select Options" label="label" track-by="value" class="w-full mt-1" />

            <div v-else-if="field.type === 'file'" class="flex flex-col w-full">
              <input
                :id="field.id"
                type="file"
                class="hidden"
                :accept="field.fileTypes || '*'"
                @change="handleFileUpload($event, field.model)"
              />
              <label
                :for="field.id"
                :class="[
                  'flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer',
                  uploadedFiles[field.model] ? 'bg-green-100 border-green-500' : 'bg-gray-50 border-gray-300 hover:bg-gray-100'
                ]"
              >
                <div class="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg
                    v-if="!loadingFiles[field.model]"
                    class="w-8 h-8 mb-4 text-gray-500"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 16"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                    />
                  </svg>
                  <div v-else class="flex items-center space-x-2">
                    <span class="loader w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></span>
                    <span class="text-sm text-gray-500">Uploading...</span>
                  </div>
                  <p class="mb-2 text-sm text-gray-500">
                    <span class="font-semibold">
                      {{ uploadedFiles[field.model]?.name ? "File Uploaded" : "Click to upload or drag and drop" }}
                    </span>
                  </p>
                  <p class="text-xs text-gray-500">
                    {{ uploadedFiles[field.model]?.name ? uploadedFiles[field.model]?.name  : field.fileTypes ? `Accepted: ${field.fileTypes}` : "All file types accepted" }}
                  </p>
                </div>
              </label>
            </div>
        </div>

        <!-- Form Actions -->
        <div class="modal-actions col-span-full flex justify-end mt-6 space-x-4">
          <button type="submit"
            class="btn bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md shadow-md transition duration-200">
            Save
          </button>
          <button type="button" @click="$emit('close')"
            class="btn bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-md shadow-md transition duration-200">
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
      newCompany: {},
      showCreateCompanyCategory: false,
      companyCategoryList: null,
      formFields: [
        {
          id: "name",
          label: "Company Name",
          model: "name",
          type: "text",
          required: true,
          placeholder: "Enter Company name",
        },
        {
          id: "address",
          label: "Address",
          model: "address",
          type: "text",
          required: true,
          placeholder: "Enter Address",
        },
        {
          id: "email",
          label: "Email",
          model: "email",
          type: "text",
          required: true,
          placeholder: "Enter Address",
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
    console.log("Initializing company data:", company);
    return company
      ? { ...company } // Use the existing company data
      : {
          name: "",
          address: "",
          email: "",
        }; // Default empty values
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
    
    this.newCompany = this.initializeCompanyData(this.existingCompany);
    console.log("New Company Data:", this.newCompany);
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
