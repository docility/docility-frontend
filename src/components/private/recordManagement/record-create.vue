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
    <div  v-else class="modal-content bg-white p-8 rounded-lg max-w-5xl w-full overflow-y-auto h-full shadow-lg">
      <h3 class="text-2xl font-bold mb-6 text-gray-800">
        {{ existingCompany ? "Update Record" : "New Record" }}
      </h3>
      <form @submit.prevent="submitForm" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Dynamic Form Fields -->
        <div v-for="field in formFields" :key="field.id" class="form-group flex flex-col">
          <label :for="field.id" class="block text-sm font-medium text-gray-700 mb-1">
            {{ field.label }}
            <span v-if="field.required" class="text-red-500">*</span>
          </label>
 {{newRecord[field.model]}}
          <!-- Textarea -->
          <textarea v-if="field.type === 'textarea'" :id="field.id" v-model="newRecord[field.model]"
            :placeholder="field.placeholder" :required="field.required"
            class="form-input mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300 focus:outline-none"></textarea>

          <!-- Text Input -->
          <input v-else-if="field.type === 'text'" :id="field.id" v-model="newRecord[field.model]" :type="field.type"
            :placeholder="field.placeholder" :required="field.required" :readonly="field['read-only']"
            class="form-input mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300 focus:outline-none" />

          <!-- Date Input -->
          <input v-else-if="field.type === 'date'" :id="field.id" v-model="newRecord[field.model]" type="date"
            :placeholder="field.placeholder" :required="field.required"
            class="form-input mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300 focus:outline-none" />

          <!-- Select Dropdown -->
          <select v-else-if="field.type === 'select'" :id="field.id" v-model="newRecord[field.model]"
            :required="field.required"
            class="form-input mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300 focus:outline-none">
            <option v-for="option in field.options" :key="option.value" :value="option.value">
              {{ option.text }}
            </option>
          </select>

          <!-- Checkbox Group -->
          <div v-else-if="field.type === 'checkbox'" class="mt-2 space-y-2">
            <label v-for="option in field.options" :key="option.value" class="flex items-center space-x-2">
              <input type="checkbox" :value="option.value" v-model="newRecord[field.model]"
                class="form-checkbox h-4 w-4 text-blue-500" />
              <span>{{ option.text }}</span>
            </label>
          </div>



          <!-- Multiselect -->
          <Multiselect v-else-if="field.type === 'multi'" v-model="newRecord[field.model]" :options="field.options"
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
import http from "@/helpers/http";
import { toast } from "vue3-toastify";
export default {
  props: {
    existingRecord: {
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
      newRecord: {},
      showCreateRecordCategory: false,
      recordCategoryList: null,
      formFields: [
        {
          id: "recordName",
          label: "Record Name",
          model: "name",
          type: "text",
          required: true,
          placeholder: "Enter record name",
        },
        {
          "id": "company",
          "label": "Record Company",
          "model": "company",
          "type": "multi",
          "multiple-select": false,
          "required": true,
          "options": []
        },
        {
          id: "tradingAs",
          label: "Record Trading As",
          model: "trading_as",
          type: "text",
          required: true,
          placeholder: "Enter trading name",
        },
        {
          id: "abn",
          label: "ABN",
          model: "abn_no",
          type: "text",
          required: true,
          placeholder: "Enter ABN",
        },
        {
          id: "acn",
          label: "ACN",
          model: "acn_no",
          type: "text",
          placeholder: "Enter ACN (optional)",
        },
        {
          id: "website",
          label: "Website",
          model: "website",
          type: "text",
          placeholder: "Enter website",
        },
        {
          id: "localOrOverseas",
          label: "Local/Overseas",
          model: "glocal",
          type: "select",
          options: [
            { text: "Local", value: "local" },
            { text: "Overseas", value: "overseas" },
          ],
        },
        {
          id: "address",
          label: "Address",
          model: "address",
          type: "text",
          placeholder: "Enter address",
        },
        {
          id: "country",
          label: "Country",
          model: "country",
          type: "text",
          placeholder: "Enter country",
        },
        {
          id: "state",
          label: "State",
          model: "state",
          type: "text",
          placeholder: "Enter state",
        },
        {
          id: "suburb",
          label: "Suburb",
          model: "suburb",
          type: "text",
          placeholder: "Enter suburb",
        },
        {
          id: "postcode",
          label: "Postcode",
          model: "postal_code",
          type: "text",
          placeholder: "Enter postcode",
        },
        {
          id: "contactPerson",
          label: "Contact Person Name",
          model: "contact_person_name",
          type: "text",
          required: true,
          placeholder: "Enter contact person's name",
        },
        {
          id: "phone",
          label: "Phone",
          model: "phone_no",
          type: "text",
          required: true,
          placeholder: "Enter phone number",
        },
        {
          id: "email",
          label: "Email",
          model: "email",
          type: "text",
          required: true,
          placeholder: "Enter email",
        },
        {
          id: "altContactPerson",
          label: "Alternate Contact Person Name",
          model: "alt_person_name",
          type: "text",
          placeholder: "Enter alternate contact person",
        },
        {
          id: "altPhone",
          label: "Alternate Phone",
          model: "alt_phone_no",
          type: "text",
          placeholder: "Enter alternate phone",
        },
        {
          id: "altEmail",
          label: "Alternate Email",
          model: "alt_email",
          type: "text",
          placeholder: "Enter alternate email",
        },
        {
          id: "recordCategory",
          label: "Record Category",
          model: "record_category",
          type: "select",
          options: [
            { text: "Key Record", value: "Key" },
            { text: "Regular Record", value: "Regular" },
            { text: "One-off Record", value: "One-off" },
          ],
        },
        {
          id: "recordType",
          label: "Record Type",
          model: "record_type",
          type: "text",
          placeholder: "Enter record type",
        },
        {
          id: "dataShared",
          label: "Data Shared with Record",
          model: "data_shared",
          type: "textarea",
          placeholder: "Enter details about data shared",
        },
        {
          id: "department",
          label: "Department Managing Record",
          model: "department_managing",
          type: "text",
          placeholder: "Enter managing department",
        },
        {
          id: "manager",
          label: "Manager",
          model: "manager",
          type: "text",
          placeholder: "Enter manager",
        },
        {
          id: "contractStart",
          label: "Contract Start Date",
          model: "contract_commencement_date",
          type: "date",
        },
        {
          id: "contractEnd",
          label: "Contract End Date",
          model: "contract_end_date",
          type: "date",
        },
        {
          id: "ciaImpacts",
          label: "CIA Impact",
          model: "cia_impact",
          type: "text",
          placeholder: "Enter CIA impact",
        },
        {
          id: "agreement",
          label: "Agreement Signed",
          model: "agreement",
          type: "select",
          options: [
            { text: "Yes", value: "yes" },
            { text: "No", value: "no" },
          ],
        },
        {
          id: "approvalStatus",
          label: "Approval Status",
          model: "approval_status",
          type: "select",
          options: [
            { text: "Draft", value: "draft" },
            { text: "Approved", value: "approved" },
            { text: "Rejected", value: "rejected" },
          ],
        },
      ],
    };
  },
  watch: {
    existingCompany: {
    immediate: true,
    handler(newVal) {
      this.newCompany = this.initializeRecordData(newVal);
    },
  },
  },
  methods: {
    logChange(model, event) {
      console.log(`Changed ${model}:`, event.target.value);
      if (model == "record_category" && event.target.value == "Action") {
        // alert("Create New Record Category");
        this.showCreateRecordCategory = true;
      }
      this.newRecord[model] = event.target.value; // Ensure the model updates immediately
    },
    closeModal() {
      this.showCreateRecordCategory = false;
      this.newCategoryName = "";
    },
    submitNewCategory() {
      if (this.newCategoryName.trim()) {
        console.log(`New Record Category: ${this.newCategoryName}`);
        alert(`New Category "${this.newCategoryName}" has been created.`);
        http
          .post("/api/record-categories", {
            data: { category: this.newCategoryName },
          })
          .then((response) => {
            toast.success("Record Category successfully saved");
            this.isImportModalVisible = false;
            console.log(response);
            // this.fetchSupplier();
            this.recordListKey++;
            this.fetchRecordCategory();
          })
          .catch((error) => {
            console.error(error);
            toast.error("Error importing records");
          });
        this.closeModal();
      }
    },
    initializeRecordData(record = null) { 
      console.log(record);
      return record
        ? { ...record }
        : {
            name: "",
            trading_as: "",
            company: [],
            abn_no: "",
            acn_no: "",
            website: "",
            glocal: "",
            address: "",
            country: "",
            state: "",
            suburb: "",
            postal_code: "",
            contact_person_name: "",
            phone_no: "",
            email: "",
            alt_person_name: "",
            alt_phone_no: "",
            alt_email: "",
            record_category: "",
            record_type: "",
            data_shared: "",
            department_managing: "",
            manager: "",
            contract_commencement_date: "",
            contract_end_date: "",
            cia_impact: "",
            agreement: "",
            approval_status: "",
          };
    },
    submitForm() {
      console.log("Submitted Data:", this.newRecord);
      if (Object.values(this.newRecord).some((value) => value === "")) {
        alert("Please fill in all required fields.");
        return;
      }

      this.callback({ ...this.newRecord });
      this.$emit("close");
    },
    async fetchRecordCategory() {
      console.log("fetch ccategorys");
      try {
        const response = await http.get(`/api/record-categories`);
        console.log(response);
        let categoryIndex = 0;
        response.data.data.forEach((category) => {
          this.formFields.forEach((v, i) => {
            if (v.id == "recordCategory") {
              categoryIndex = i;
              this.formFields[i].options.push({
                text: category.category,
                value: category.category,
              });
              console.log(this.formFields[i]);
            }
          });
        });
        this.formFields[categoryIndex].options.push({
          text: "Create New",
          value: "Action",
        });
      } catch (error) {
        console.error("Error fetching records:", error);
      }
    },
    fetchCompany() {
      console.log("fetch company");
      http
        .get("/api/companies")
        .then((response) => {
          console.log(response);
         const data = response.data.data.map((company) => ({
            label: company.name,
            value: company.name,
          }));

          const company = this.formFields.find(
            (field) => field.model === "company"
          );

      if (company) {
        company.options = data;
        console.log("company main", company)
      }
 
        })
        .catch((error) => {
          console.error("Error fetching companies:", error);
        });
    },
  },
  mounted() {
    this.fetchRecordCategory();
    console.log("Existing Record:", this.recordCategoryList);
    this.newRecord = this.initializeRecordData(this.existingRecord);
    console.log("New Record Data:", this.newRecord);

    this.fetchCompany();
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
