<template>
  <div>
    <div class="pb-4 bg-white flex p-2 justify-between">
      <div class="flex justify-center items-center gap-2">
        <ExcelUpload
          title="Import Risk Category"
          @file-read="handleExcelData"
        />

        <ImageButton
          :svg="require('@/assets/add.svg')"
          title="New"
          :callback="openAddCustomerModal"
        />
        <!-- Trigger button for the modal -->
      </div>
    </div>
    <AddCustomerModal
      v-if="showAddModal"
      :existingCustomer="existingCustomerData"
      @close="showAddModal = false"
      :callback="addNewCustomer"
    />

    <div>
      <CustomerList
        :Update="updateCustomer"
        :Delete="deleteCustomer"
        :key="customerListKey"
      />
      <CustomerDetailsModal
        v-if="selectedCustomer"
        :customer="selectedCustomer"
        @close="selectedCustomer = null"
      />
    </div>
    <div
      v-if="isImportModalVisible"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div class="bg-white p-6 rounded-lg shadow-lg w-3/4 max-w-4xl">
        <!-- Table inside the modal -->
        <TableComponent :headers="ImportFileHeaders" :data="importData" />

        <!-- Buttons -->
        <div class="mt-4 flex justify-end space-x-4">
          <button
            @click="handleCancelImport"
            class="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            @click="handleSubmitImport"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CustomerList from "./customer-list.vue";
import CustomerDetailsModal from "./customer-details.vue";
import AddCustomerModal from "./create-customer.vue";
import http from "@/helpers/http";
import ImageButton from "@/components/reuseable/ImageButton.vue";
import ExcelUpload from "@/components/reuseable/ExcelUpload.vue";
import TableComponent from "@/components/reuseable/TableComponent.vue";

import { toast } from "vue3-toastify";

export default {
  components: {
    TableComponent,
    CustomerList,
    CustomerDetailsModal,
    AddCustomerModal,
    ExcelUpload,
    ImageButton,
  },
  data() {
    return {
      selectedCustomer: null,
      showAddModal: false,
      fileUploaded: false,
      isImportModalVisible: false,
      existingCustomerData: null,
      importData: null,
      excelData: null,
      customerListKey: 0,
      ImportFileHeaders: [
        "Customer name",
        "Customer trading as",
        "ABN no",
        "ACN no",
        "Website",
        "GLOCAL",
        "Customer address",
        "Country",
        "State",
        "Suburb",
        "Postcode",
        "Contact person name",
        "Phone number",
        "Email",
        "Alternate contact person name",
        "Alternative Phone number",
        "Alternative Contact Email",
        "Customer category",
        "Customer type",
        "Data shared with customer",
        "Department managing customer",
        "Customer manager",
        "Contract Commencement date",
        "Contract end date",
        "Sensitivity of data involved (CIA Impact)",
        "Customer agreement",
        "Customer approval status",
        "Date entered",
      ],
    };
  },
  methods: {
    handleCancelImport() {
      this.isImportModalVisible = false;
    },
    handleExcelData(data) {
      this.excelData = data;
      this.importData = data;
      console.log(data);
      this.fileUploaded = true;
      this.isImportModalVisible = true;
    },
    handleSubmitImport() {
      console.log(this.excelData);
      const mapped = this.excelData.map((curr) => ({
        name: curr["Customer name"],
        trading_as: curr["Customer trading as"],
        abn_no: curr["ABN no"],
        acn_no: curr["ACN no"],
        website: curr["Website"],
        glocal: curr["GLOCAL"],
        address: curr["Customer address"],
        country: curr["Country"],
        state: curr["State"],
        suburb: curr["Suburb"],
        postal_code: curr["Postcode"],
        contact_person_name: curr["Contact person name"],
        phone_no: curr["Phone number"],
        email: curr["Email"],
        alt_person_name: curr["Alternate contact person name"],
        alt_phone_no: curr["Alternative Phone number"],
        alt_email: curr["Alternative Contact Email"],
        customer_category: curr["Customer category"],
        customer_type: curr["Customer type"],
        data_shared: curr["Data shared with customer"],
        department_managing: curr["Department managing customer"],
        manager: curr["Customer manager"],
        contract_commencement_date: curr["Contract Commencement date"],
        contract_end_date: curr["Contract end date"],
        cia_impact: curr["Sensitivity of data involved (CIA Impact)"],
        agreement: curr["Customer agreement"],
        approval_status: curr["Customer approval status"],
        date_entered: curr["Date entered"],
      }));
      console.log(mapped);
      // Assuming you want to send this data to the server
      http
        .post("/api/create-bulk/customers", mapped)
        .then((response) => {
          toast.success("Customer imported successfully");
          this.isImportModalVisible = false;
          console.log(response);
          // this.fetchSupplier();
          this.customerListKey++;
        })
        .catch((error) => {
          console.error(error);
          toast.error("Error importing customers");
        });
    },
    showCustomerDetails(customer) {
      this.selectedCustomer = customer;
    },
    updateCustomer(customer) {
      console.log("updating customer", customer);
      this.existingCustomerData = customer;
      this.showAddModal = true;
    },
    deleteCustomer(customer) {
      console.log(customer); 
      http
        .delete(`api/customer-managements/${customer.documentId}`)
        .then((response) => {
          toast.success("Customer imported successfully");
          if (response.status == 200 || response.status == 204) {
            toast.success("Customer deleted successfully");
            this.customerListKey++;
          } else {
            toast.error("Error deleting customer");
          }
          this.customerListKey++;
        })
        .catch((error) => {
          console.error(error);
          toast.error("Error importing customers");
        });
     
    },
    openAddCustomerModal() {
      this.showAddModal = true;
      this.existingCustomerData = null;
    },
    async addNewCustomer(newCustomer) {
      
      console.log("adding new Company", newCustomer);
      if (newCustomer?.documentId) {
        const id = newCustomer.documentId;
        delete newCustomer.id;
        delete newCustomer.createdAt;
        delete newCustomer.updatedAt;
        delete newCustomer.documentId;
        http.put(`api/customer-managements/${id}`, {
          data: newCustomer,
        }).then((res) => {
          console.log(res);
          toast.success("Company added successfully");
          this.customerListKey++;
        });
      } else { 
        await http.post("api/customer-managements", { data: newCustomer }).then((res) => {
          console.log(res); 
          toast.success("Company added successfully");
          this.customerListKey++;
        });   
      }
    },
  },
};
</script>
