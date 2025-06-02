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
          :callback="openAddCompanyModal"
        />
        <!-- Trigger button for the modal -->
      </div>
    </div>
    <AddCompanyModal
      v-if="showAddModal"
      :existingCompany="existingCompanyData"
      @close="showAddModal = false"
      :callback="addNewCompany"
    />

    <div>
      <CompanyList
        :Update="updateCompany"
        :Delete="deleteCompany"
        :key="companyListKey"
      />
      <CompanyDetailsModal
        v-if="selectedCompany"
        :company="selectedCompany"
        @close="selectedCompany = null"
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
import CompanyList from "./company-list.vue";
import CompanyDetailsModal from "./company-details.vue";
import AddCompanyModal from "./create-company.vue";
import http from "@/helpers/http";
import ImageButton from "@/components/reuseable/ImageButton.vue";
import ExcelUpload from "@/components/reuseable/ExcelUpload.vue";
import TableComponent from "@/components/reuseable/TableComponent.vue";

import { toast } from "vue3-toastify";

export default {
  components: {
    TableComponent,
    CompanyList,
    CompanyDetailsModal,
    AddCompanyModal,
    ExcelUpload,
    ImageButton,
  },
  data() {
    return {
      selectedCompany: null,
      showAddModal: false,
      fileUploaded: false,
      isImportModalVisible: false,
      existingCompanyData: null,
      importData: null,
      excelData: null,
      companyListKey: 0,
      ImportFileHeaders: ["Company Name", "Address", "Email"],
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
        name: curr["Company Name"],
        address: curr["Address"],
        email: curr["Email"],
      }));
      console.log(mapped);
      // Assuming you want to send this data to the server
      http
        .post("/api/create-bulk/companies", mapped)
        .then((response) => {
          toast.success("Company imported successfully");
          this.isImportModalVisible = false;
          console.log(response);
          // this.fetchSupplier();
          this.companyListKey++;
        })
        .catch((error) => {
          console.error(error);
          toast.error("Error importing Company");
        });
    },
    showCompanyDetails(company) {
      this.selectedCompany = company;
    },
    updateCompany(company) {
      console.log("updating Company", company);
      this.existingCompanyData = company;
      this.showAddModal = true;
    },
    deleteCompany(company) {
      console.log(company);
      http.delete(`api/companies/${company.documentId}`).then((response) => {
        toast.success("Company deleted successfully");
        if (response.status == 200 || response.status == 204) {
          toast.success("Company deleted successfully");
          this.companyListKey++;
        } else {
          toast.error("Error deleting Company");
        }
      }); 
    },
    openAddCompanyModal() {
      this.showAddModal = true;
      this.existingCompanyData = null;
    },
    async addNewCompany(newCompany, close) {

      try {
        
      
      console.log("adding new Company", newCompany);
      if (newCompany?.documentId) {
        const id = newCompany.documentId;
        delete newCompany.id;
        delete newCompany.createdAt;
        delete newCompany.updatedAt;
        delete newCompany.documentId;
        newCompany.accessModule = JSON.stringify(newCompany.accessModule);
        newCompany.hasMultipleSites = JSON.stringify(newCompany.hasMultipleSites);
        newCompany.subscriptionAllocated = JSON.stringify(newCompany.subscriptionAllocated);
         newCompany.moduleAssigned = JSON.stringify(newCompany.moduleAssigned);
        http.put(`api/companies/${id}`, {
          data: newCompany,
        }).then((res) => {
          console.log(res);
          toast.success("Company added successfully");
          this.companyListKey++;
        
        });
      } else { 
        newCompany.accessModule = JSON.stringify(newCompany.accessModule);
        newCompany.hasMultipleSites = JSON.stringify(newCompany.hasMultipleSites);
        newCompany.subscriptionAllocated = JSON.stringify(newCompany.subscriptionAllocated);
         newCompany.moduleAssigned = JSON.stringify(newCompany.moduleAssigned);
        await http.post("api/companies", { data: newCompany }).then((res) => {
          console.log(res); 
          toast.success("Company added successfully");
          this.companyListKey++; 
        });   
      }
      } catch (error) { 
          toast.error("Error parsing newCompany:", error);
      } finally {
        close();
        this.showAddModal = false;
      }
    },
  },
};
</script>
