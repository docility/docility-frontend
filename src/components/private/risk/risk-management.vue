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

        <!-- <ImageButton
          :svg="require('@/assets/email.svg')"
          title="Send Questionnaire"
          :callback="openSendEmailModal"
        /> -->

        <!-- Trigger button for the modal -->
      </div>
    </div>
    <h1 class="text-dark-text-primary text-[60px]">
      {{ this.$route.query.name }}
    </h1>
    <AddCompanyModal
      v-if="showAddModal"
      :existingCompany="existingCompanyData"
      @close="showAddModal = false"
      :callback="addNewCompany"
    />

    <SendCompanyModal
      v-if="showCompanyModal"
      :existingCompany="existingCompanyData"
      @close="showCompanyModal = false"
      :callback="sendEmail"
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
import CompanyList from "./risk-list.vue";
import CompanyDetailsModal from "./risk-details.vue";
import AddCompanyModal from "./create-risk.vue";
import SendCompanyModal from "./send-company.vue";
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
    SendCompanyModal,
    ExcelUpload,
    ImageButton,
  },
  data() {
    return {
      selectedCompany: null,
      showAddModal: false,
      showCompanyModal: false,
      fileUploaded: false,
      isImportModalVisible: false,
      existingCompanyData: null,
      importData: null,
      excelData: null,
      companyListKey: 0,
      ImportFileHeaders: ["Title", "Description"],
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
        title: curr["Title"],
        description: curr["Description"],
      }));
      console.log(mapped);
      // Assuming you want to send this data to the server
      http
        .post("/api/create-bulk/risks", mapped)
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
      this.existingCompanyData = { ...company, id: company.documentId };
      this.showAddModal = true;
    },
    async deleteCompany(company) {
      console.log(company);
      const res = await http.delete(`api/risks/${company}`);
      if (res.status == 200) {
        this.companyListKey++;
      }
    },
    openAddCompanyModal() {
      this.existingCompanyData = null
      this.showAddModal = true;
    },
    openSendEmailModal() {
      this.showCompanyModal = true;
    },
    async addNewCompany(newCompany) {
      console.log("adding new Company", newCompany);
      if (newCompany?.documentId) {
        const id = newCompany.documentId;
        delete newCompany.id;
        delete newCompany.createdAt;
        delete newCompany.updatedAt;
        delete newCompany.documentId;
        http.put(`api/risks/${id}`, {
          data: newCompany,
        }).then((res) => {
          console.log(res);
          this.companyListKey++;
        });
      } else { 
        await http.post("api/risks", { data: newCompany }).then((res) => {
          console.log(res);
          this.companyListKey++;
        });   
      }
    },
  },
};
</script>
