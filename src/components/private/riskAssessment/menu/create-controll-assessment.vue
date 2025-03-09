<template>
  <div class="table-container">
    <label class="custom-file-upload save-button">
      <input type="file" @change="onFileChange" />
      Import File
    </label>
    <button @click="exportToExcel" class="export-button">Export to Excel</button>

    <!-- <RenameModal v-if="isRenameModalVisible" :newFileName="newFileName" @close="closeRenameModal" @save="renameFile" /> -->
    <!-- <LoadingModal v-if="loading" /> -->

    <div class="hot-table">
      <hot-table
        ref="hotTableRef"
        :data="data"
        :settings="hotSettings"
        :rowHeaders="true"
        :colHeaders="true"
        licenseKey="non-commercial-and-evaluation"
        class="overflow-auto"
      />
    </div>
    <button @click="saveAssessment" class="w-full rounded button-style">Save</button>
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";
import { HotTable } from "@handsontable/vue3";
import { registerAllModules } from "handsontable/registry";
// import * as XLSX from "xlsx";
import "handsontable/dist/handsontable.full.css";
import { HyperFormula } from "hyperformula";
import http from "@/helpers/http";
import { toast } from "vue3-toastify";
// import RenameModal from "@/components/RenameModal.vue";
// import LoadingModal from "@/components/LoadingModal.vue";

registerAllModules();

export default defineComponent({
  components: {
    HotTable,
    // RenameModal,
    // LoadingModal,
  },
  setup() {
    const hotTableRef = ref(null);
    const data = ref([]);
    const selectedFile = ref(null);
    const loading = ref(false);
    const isRenameModalVisible = ref(false);
    const newFileName = ref("");

    const hotSettings = ref({
      colHeaders: true,
      rowHeaders: true,
      mergeCells: true,
      manualColumnMove: true,
      manualColumnResize: true,
      manualRowResize: true,
      manualRowMove: true,
      contextMenu: true,
      hiddenColumns: { indicators: true },
      formulas: { engine: HyperFormula },
    });

    const openRenameModal = () => {
      if (selectedFile.value) {
        newFileName.value = selectedFile.value.name;
        isRenameModalVisible.value = true;
      }
    };

    const closeRenameModal = () => {
      isRenameModalVisible.value = false;
    };

    const renameFile = () => {
      isRenameModalVisible.value = false;
      // saveToExcel();
    };

    const saveAssessment = async () => {
      try {
        const hotInstance = hotTableRef.value.hotInstance;
        if (!hotInstance) return;
        
        const jsonData = hotInstance.getData().map(row => row.map(cell => cell || ""));

        if (!validateHeaders(jsonData[0])) {
          alert("Data is not in valid format");
          return;
        }

        const controls = jsonData.slice(1).map(row => ({
          domain: row[0],
          annexControl: row[1],
          controlHeading: row[2],
          controlDescription: row[3],
        }));

        const response = await http.post("/api/create-bulk/assessment-controls", controls);
        toast.success(response.data.message);
      } catch (error) {
        toast.error("Error Saving Excel Data: " + error.response?.data?.error?.message);
      } finally {
        resetTable();
      }
    };

    const validateHeaders = headers => {
      return ["Domain", "Annex. A Control", "Control Heading", "Control Description"].every((header, index) => headers[index] === header);
    };

    const resetTable = () => {
      const hotInstance = hotTableRef.value.hotInstance;
      if (hotInstance) {
        hotInstance.loadData([]);
      }
      selectedFile.value = null;
      loading.value = false;
      isRenameModalVisible.value = false;
    };

    return {
      hotTableRef,
      data,
      selectedFile,
      loading,
      isRenameModalVisible,
      newFileName,
      hotSettings,
      openRenameModal,
      closeRenameModal,
      renameFile,
      saveAssessment,
    };
  },
});
</script>

<style scoped>
.table-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.custom-file-upload {
  cursor: pointer;
}
</style>
