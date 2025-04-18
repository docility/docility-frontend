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
          :callback="openAddRiskCategoryModal"
        />

        <!-- <ImageButton
          :svg="require('@/assets/email.svg')"
          title="Send Questionnaire"
          :callback="openSendEmailModal"
        /> -->
      </div>
    </div>
    <h1 class="text-dark-text-primary text-[60px]">
      {{ this.$route.query.name }}
    </h1>
    <AddRiskCategoryModal
      v-if="showAddModal"
      :existingRiskCategory="existingRiskCategoryData"
      @close="showAddModal = false"
      :callback="addNewRiskCategory"
    />

    <SendRiskCategoryModal
      v-if="showSendModal"
      :existingRiskCategory="existingRiskCategoryData"
      @close="showSendModal = false"
      :callback="sendEmail"
    />

    <div>
      <RiskCategoryList
        :Update="updateRiskCategory"
        :Delete="deleteRiskCategory"
        :key="riskCategoryListKey"
      />
      <RiskCategoryDetailsModal
        v-if="selectedRiskCategory"
        :riskCategory="selectedRiskCategory"
        @close="selectedRiskCategory = null"
      />
    </div>
    <div v-if="isImportModalVisible" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white p-6 rounded-lg shadow-lg w-3/4 max-w-4xl">
        <TableComponent :headers="importFileHeaders" :data="importData" />
        <div class="mt-4 flex justify-end space-x-4">
          <button @click="handleCancelImport" class="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400">Cancel</button>
          <button @click="handleSubmitImport" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Submit</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import RiskCategoryList from "./category-list.vue";
import RiskCategoryDetailsModal from "./category-details.vue";
import AddRiskCategoryModal from "./create.vue";
import SendRiskCategoryModal from "./send-category.vue";
import http from "@/helpers/http";
import ImageButton from "@/components/reuseable/ImageButton.vue";
import ExcelUpload from "@/components/reuseable/ExcelUpload.vue";
import TableComponent from "@/components/reuseable/TableComponent.vue";
import { toast } from "vue3-toastify";

export default {
  components: {
    TableComponent,
    RiskCategoryList,
    RiskCategoryDetailsModal,
    AddRiskCategoryModal,
    SendRiskCategoryModal,
    ExcelUpload,
    ImageButton,
  },
  data() {
    return {
      selectedRiskCategory: null,
      showAddModal: false,
      showSendModal: false,
      fileUploaded: false,
      isImportModalVisible: false,
      existingRiskCategoryData: null,
      importData: null,
      excelData: null,
      riskCategoryListKey: 0,
      importFileHeaders: ["Risk Category", "Risk Description", "Risk Type"],
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
        category_domain: curr["Risk Category"],
        description: curr["Risk Description"],
        categoryType: curr["Risk Type"],
      }));
      console.log(mapped);
      http
        .post("/api/create-bulk/risk-categories", mapped)
        .then((response) => {
          toast.success("Risk Categories imported successfully");
          this.isImportModalVisible = false;
          console.log(response);
          this.riskCategoryListKey++;
        })
        .catch((error) => {
          console.error(error);
          toast.error("Error importing Risk Categories");
        });
    },
    updateRiskCategory(riskCategory) {
      console.log("Updating Risk Category", riskCategory);
      this.existingRiskCategoryData = { ...riskCategory, id: riskCategory.documentId };
      this.showAddModal = true;
      console.log("show modal", this.showAddModal)
    },
    async deleteRiskCategory(riskCategory) {
      console.log(riskCategory);
      http.delete(`api/risk-categories/${riskCategory.documentId}`).then((response) => {
        toast.success("Risk Category deleted successfully");
        if (response.status == 200 || response.status == 204) {
          toast.success("Risk Category deleted successfully");
          this.riskCategoryListKey++;
        } else {
          toast.error("Error deleting Risk Category");
        }
      }).catch((error) => {
        console.error(error);
        toast.error("Error deleting Risk Category");
      });
    
    },
    openAddRiskCategoryModal() {
      this.showAddModal = true;
    },
    openSendEmailModal() {
      this.showSendModal = true;
    },
    async addNewRiskCategory(newRiskCategory) {
      console.log("Adding new Risk Category", newRiskCategory);
      if (newRiskCategory?.id) {
        const id = newRiskCategory.id;
        delete newRiskCategory.id;
        http.put(`api/risk-categories/${id}`, {
          data: newRiskCategory,
        }).then((res) => {
          if (res.status == 200) {
            toast.success("Risk Category updated successfully");
          } else {
            toast.error("Error updating Risk Category");
          }
          this.riskCategoryListKey++;
        }).catch((error) => {
          console.error(error);
          toast.error("Error updating Risk Category");
        }); 
      } else {
        http.post("api/risk-categories", { data: newRiskCategory }).then((res) => {
          if (res.status == 200 || res.status == 201) {
            toast.success("Risk Category added successfully");
          } else {
            toast.error("Error adding Risk Category");
          }
          this.riskCategoryListKey++;
        }).catch((error) => {
          console.error(error);
          toast.error("Error adding Risk Category");
        }); 
      }
    },
  },
};
</script>
