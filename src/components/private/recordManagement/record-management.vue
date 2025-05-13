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
          :callback="openAddRecordModal"
        />
        <!-- Trigger button for the modal -->
      </div>
    </div>
    <AddRecordModal
      v-if="showAddModal"
      :existingRecord="existingRecordData"
      @close="showAddModal = false"
      :callback="addNewRecord"
    />

    <div>
      <RecordList
        :Update="updateRecord"
        :Delete="deleteRecord"
        :key="recordListKey"
      />
      <RecordDetailsModal
        v-if="selectedRecord"
        :record="selectedRecord"
        @close="selectedRecord = null"
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
import RecordList from "./record-list.vue";
import RecordDetailsModal from "./record-details.vue";
import AddRecordModal from "./record-create.vue";
import http from "@/helpers/http";
import ImageButton from "@/components/reuseable/ImageButton.vue";
import ExcelUpload from "@/components/reuseable/ExcelUpload.vue";
import TableComponent from "@/components/reuseable/TableComponent.vue";

import { toast } from "vue3-toastify";

export default {
  components: {
    TableComponent,
    RecordList,
    RecordDetailsModal,
    AddRecordModal,
    ExcelUpload,
    ImageButton,
  },
  data() {
    return {
      selectedRecord: null,
      showAddModal: false,
      fileUploaded: false,
      isImportModalVisible: false,
      existingRecordData: null,
      importData: null,
      excelData: null,
      recordListKey: 0,
      ImportFileHeaders: [
        "Record name",
        "Record trading as",
        "ABN no",
        "ACN no",
        "Website",
        "GLOCAL",
        "Record address",
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
        "Record category",
        "Record type",
        "Data shared with record",
        "Department managing record",
        "Record manager",
        "Contract Commencement date",
        "Contract end date",
        "Sensitivity of data involved (CIA Impact)",
        "Record agreement",
        "Record approval status",
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
        name: curr["Record name"],
        trading_as: curr["Record trading as"],
        abn_no: curr["ABN no"],
        acn_no: curr["ACN no"],
        website: curr["Website"],
        glocal: curr["GLOCAL"],
        address: curr["Record address"],
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
        record_category: curr["Record category"],
        record_type: curr["Record type"],
        data_shared: curr["Data shared with record"],
        department_managing: curr["Department managing record"],
        manager: curr["Record manager"],
        contract_commencement_date: curr["Contract Commencement date"],
        contract_end_date: curr["Contract end date"],
        cia_impact: curr["Sensitivity of data involved (CIA Impact)"],
        agreement: curr["Record agreement"],
        approval_status: curr["Record approval status"],
        date_entered: curr["Date entered"],
      }));
      console.log(mapped);
      // Assuming you want to send this data to the server
      http
        .post("/api/create-bulk/records", mapped)
        .then((response) => {
          toast.success("Record imported successfully");
          this.isImportModalVisible = false;
          console.log(response);
          // this.fetchSupplier();
          this.recordListKey++;
        })
        .catch((error) => {
          console.error(error);
          toast.error("Error importing records");
        });
    },
    showRecordDetails(record) {
      this.selectedRecord = record;
    },
    updateRecord(record) {
      console.log("updating record", record);
      this.existingRecordData = record;
      this.showAddModal = true;
    },
    deleteRecord(record) {
      console.log(record); 
      http
        .delete(`api/record-managements/${record.documentId}`)
        .then((response) => {
          toast.success("Record imported successfully");
          if (response.status == 200 || response.status == 204) {
            toast.success("Record deleted successfully");
            this.recordListKey++;
          } else {
            toast.error("Error deleting record");
          }
          this.recordListKey++;
        })
        .catch((error) => {
          console.error(error);
          toast.error("Error importing records");
        });
     
    },
    openAddRecordModal() {
      this.showAddModal = true;
      this.existingRecordData = null;
    },
    async addNewRecord(newRecord) {
      
      console.log("adding new Company", newRecord);
      if (newRecord?.documentId) {
        const id = newRecord.documentId;
        delete newRecord.id;
        delete newRecord.createdAt;
        delete newRecord.updatedAt;
        delete newRecord.documentId;
        http.put(`api/record-managements/${id}`, {
          data: newRecord,
        }).then((res) => {
          console.log(res);
          toast.success("Company added successfully");
          this.recordListKey++;
        });
      } else { 
        await http.post("api/record-managements", { data: newRecord }).then((res) => {
          console.log(res); 
          toast.success("Company added successfully");
          this.recordListKey++;
        });   
      }
    },
  },
};
</script>
