<template>
  <div
    class="modal-overlay flex justify-center items-center fixed inset-0 bg-black bg-opacity-50 z-[99999]"
  >
    <div
      class="modal-content bg-white p-8 rounded-lg max-w-7xl w-full overflow-y-auto"
    >
      <h3 class="text-xl font-semibold mb-6">
        {{ existingCustomer ? "Update Customer" : "Add New Customer" }}
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
            v-model="newCustomer[field.model]"
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
      <div v-if="showCreateCustomerCategory" class="modal-backdrop">
        <div class="modal">
          <h3>Create New Customer Category</h3>
          <form @submit.prevent="submitNewCategory">
            <div class="flex flex-row">
              <label class="text-nowrap" for="newCategoryName"
                >Category Name:</label
              >
              <input
                class="border-2"
                id="newCategoryName"
                v-model="newCategoryName"
                type="text"
                required
              />
            </div>

            <div class="modal-buttons">
              <button type="submit" class="btn-save">Save</button>
              <button type="button" class="btn-cancel" @click="closeModal">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import http from "@/helpers/http";
import { toast } from "vue3-toastify";
export default {
  props: {
    existingCustomer: {
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
      newCustomer: this.initializeCustomerData(this.existingCustomer),
      showCreateCustomerCategory: false,
      customerCategoryList: null,
      formFields: [
        {
          id: "customerName",
          label: "Customer Name",
          model: "name",
          type: "text",
          required: true,
          placeholder: "Enter customer name",
        },
        {
          id: "tradingAs",
          label: "Customer Trading As",
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
          type: "email",
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
          type: "email",
          placeholder: "Enter alternate email",
        },
        {
          id: "customerCategory",
          label: "Customer Category",
          model: "customer_category",
          type: "select",
          options: [
            { text: "Key Customer", value: "Key" },
            { text: "Regular Customer", value: "Regular" },
            { text: "One-off Customer", value: "One-off" },
          ],
        },
        {
          id: "customerType",
          label: "Customer Type",
          model: "customer_type",
          type: "text",
          placeholder: "Enter customer type",
        },
        {
          id: "dataShared",
          label: "Data Shared with Customer",
          model: "data_shared",
          type: "textarea",
          placeholder: "Enter details about data shared",
        },
        {
          id: "department",
          label: "Department Managing Customer",
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
    existingCustomer: {
      immediate: true,
      handler(newVal) {
        this.newCustomer = this.initializeCustomerData(newVal);
      },
    },
  },
  methods: {
    logChange(model, event) {
      console.log(`Changed ${model}:`, event.target.value);
      if (model == "customer_category" && event.target.value == "Action") {
        // alert("Create New Customer Category");
        this.showCreateCustomerCategory = true;
      }
      this.newCustomer[model] = event.target.value; // Ensure the model updates immediately
    },
    closeModal() {
      this.showCreateCustomerCategory = false;
      this.newCategoryName = "";
    },
    submitNewCategory() {
      if (this.newCategoryName.trim()) {
        console.log(`New Customer Category: ${this.newCategoryName}`);
        alert(`New Category "${this.newCategoryName}" has been created.`);
        http
          .post("/api/customer-categories", {
            data: { category: this.newCategoryName },
          })
          .then((response) => {
            toast.success("Customer Category successfully saved");
            this.isImportModalVisible = false;
            console.log(response);
            // this.fetchSupplier();
            this.customerListKey++;
            this.fetchCustomerCategory();
          })
          .catch((error) => {
            console.error(error);
            toast.error("Error importing customers");
          });
        this.closeModal();
      }
    },
    initializeCustomerData(customer = null) {
      console.log(customer);
      return customer
        ? { ...customer }
        : {
            name: "",
            trading_as: "",
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
            customer_category: "",
            customer_type: "",
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
      console.log("Submitted Data:", this.newCustomer);
      if (Object.values(this.newCustomer).some((value) => value === "")) {
        alert("Please fill in all required fields.");
        return;
      }

      this.callback({ ...this.newCustomer });
      this.$emit("close");
    },
    async fetchCustomerCategory() {
      console.log("fetch ccategorys");
      try {
        const response = await http.get(`/api/customer-categories`);
        console.log(response);
        let categoryIndex = 0;
        response.data.data.forEach((category) => {
          this.formFields.forEach((v, i) => {
            if (v.id == "customerCategory") {
              categoryIndex = i;
              this.formFields[i].options.push({
                text: category.attributes.category,
                value: category.attributes.category,
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
        console.error("Error fetching customers:", error);
      }
    },
  },
  mounted() {
    this.fetchCustomerCategory();
    console.log("Existing Customer:", this.customerCategoryList);
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
