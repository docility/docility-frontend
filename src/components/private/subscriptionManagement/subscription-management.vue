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
          :callback="openAddEntryModal"
        />
        <!-- Trigger button for the modal -->
      </div>
    </div>
    <AddEntryModal
      v-if="showAddModal"
      :existingEntry="existingEntry"
      @close="showAddModal = false"
      :callback="addNewEntry"
    />

    <div>
      <EntryList
        :Update="updateEntry"
        :Delete="deleteEntry"
        :key="dataListKey"
      />
      <EntryDetailsModal
        v-if="selectedEntry"
        :data="selectedEntry"
        @close="selectedEntry = null"
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
import EntryList from "./subscription-list.vue";
import EntryDetailsModal from "./subscription-details.vue";
import AddEntryModal from "./create-subscription.vue";
import http from "@/helpers/http";
import ImageButton from "@/components/reuseable/ImageButton.vue";
import ExcelUpload from "@/components/reuseable/ExcelUpload.vue";
import TableComponent from "@/components/reuseable/TableComponent.vue";

import { toast } from "vue3-toastify";

export default {
  components: {
    TableComponent,
    EntryList,
    EntryDetailsModal,
    AddEntryModal,
    ExcelUpload,
    ImageButton,
  },
  data() {
    return {
      selectedEntry: null,
      showAddModal: false,
      fileUploaded: false,
      isImportModalVisible: false,
      existingEntry: null,
      importData: null,
      excelData: null,
      dataListKey: 0,
      ImportFileHeaders: ["Entry Name", "Address", "Email"],
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
        name: curr["Entry Name"],
        address: curr["Address"],
        email: curr["Email"],
      }));
      console.log(mapped);
      // Assuming you want to send this data to the server
      http
        .post("/api/create-bulk/companies", mapped)
        .then((response) => {
          toast.success("Entry imported successfully");
          this.isImportModalVisible = false;
          console.log(response);
          // this.fetchSupplier();
          this.dataListKey++;
        })
        .catch((error) => {
          console.error(error);
          toast.error("Error importing Entry");
        });
    },
    showEntryDetails(data) {
      this.selectedEntry = data;
    },
    updateEntry(data) {
      console.log("updating Entry", data);
      this.existingEntry = data;
      this.showAddModal = true;
    },
    deleteEntry(data) {
      console.log(data);
      http.delete(`api/subscription-managements/${data.documentId}`).then((response) => {
        toast.success("Entry deleted successfully");
        if (response.status == 200 || response.status == 204) {
          toast.success("Entry deleted successfully");
          this.dataListKey++;
        } else {
          toast.error("Error deleting Entry");
        }
      }); 
    },
    openAddEntryModal() {
      this.showAddModal = true;
      this.existingEntry = null;
    },
    async addNewEntry(newEntry) {
      
      console.log("adding new Entry", newEntry);
      newEntry.accessModule = JSON.stringify(newEntry.accessModule);
      if (newEntry?.documentId) {
        const id = newEntry.documentId;
        delete newEntry.id;
        delete newEntry.createdAt;
        delete newEntry.updatedAt;
        delete newEntry.documentId; 
        
        http.put(`api/subscription-managements/${id}`, {
          data: newEntry,
        }).then((res) => {
          console.log(res);
          toast.success("Entry added successfully");
          this.dataListKey++;
        });
      } else { 
        await http.post("api/subscription-managements", { data: newEntry }).then((res) => {
          console.log(res); 
          toast.success("Entry added successfully");
          this.dataListKey++;
        });   
      }
    },
  },
};
</script>
