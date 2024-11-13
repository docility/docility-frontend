<template>
  <div class="table-container">
    <!-- <div class="flex flex-row gap-2">
       

      <label for="file-select" class="file-select-label"
        >Select Class Records:</label
      >
      <select
        id="file-select"
        v-model="selectedFile"
        @change="loadFile"
        class="file-select"
      >
        <option value="" disabled>Select a file</option>
        <option v-for="file in files" :key="file.name" :value="file">
          {{ file.name }}
        </option>
      </select>
      <button @click="fetchDefaultExcel" class="save-button">
        Class Record
      </button>
      <button @click="openRenameModal" class="save-button">Save Changes</button>
      <button @click="submitToAdmin" class="save-button">Submit Grades</button>
      
    </div> -->
    <!-- Custom File Import Button -->
    <label class="custom-file-upload  save-button">
      <input type="file" @change="onFileChange" />
      Import File
    </label>
    <button @click="exportToExcel" class="export-button ">Export to Excel</button>

    <div v-if="isRenameModalVisible" class="rename-modal">
      <div class="rename-content">
        <h3>Rename File</h3>
        <input v-model="newFileName" placeholder="Save File?" />
        <button @click="renameFile">Save</button>
        <button @click="closeRenameModal">Cancel</button>
      </div>
    </div>

    <!-- Loading Modal -->
    <div v-if="loading" class="loading-modal">
      <div class="loading-content">
        <div class="spinner"></div>
      </div>
    </div>

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
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";
import { HotTable } from "@handsontable/vue3";
import { registerAllModules } from "handsontable/registry";
import * as XLSX from "xlsx";
import "handsontable/dist/handsontable.full.css";
import { HyperFormula } from "hyperformula";
import axios from "axios";
import * as ExcelJS from "exceljs"; 
// Register Handsontable's modules
registerAllModules();

export default defineComponent({
  components: {
    HotTable,
  },
  setup() {
    const hotTableRef = ref(null);
    const data = ref([ 
    ]);
    const files = ref([]); 
    const selectedFile = ref(null); 
    const loading = ref(false); // New loading state
    const isRenameModalVisible = ref(false);
    const newFileName = ref("");
    const styles = ref({
      /* define your style object here */
    });
    const extension = ""
 
    const hotSettings = ref({
      colHeaders: true,
      rowHeaders: true,
      mergeCells: true,
      manualColumnMove: true,
      manualColumnResize: true,
      manualRowResize: true,
      manualRowMove: true,
      contextMenu: true,
      hiddenColumns: {
        indicators: true,
      },
      formulas: {
        engine: HyperFormula,
      },
      width: "100%",
      height: "100%",
      cells() {
        const cellProperties = {};
        cellProperties.renderer = customCellRenderer;
        return cellProperties;
      }, 
    });

    const openRenameModal = () => {
      if (selectedFile.value) {
        newFileName.value = selectedFile.value.name; // Pre-fill the current name
        isRenameModalVisible.value = true;
      }
    };

    const closeRenameModal = () => {
      isRenameModalVisible.value = false;
    };

    const renameFile = async () => {
      isRenameModalVisible.value = false;
      saveToExcel();
    };

     

    const fetchDefaultExcel = async () => {
      try {
        loading.value = true; // Start loading
        const response = await fetch(
          `https://api.nemsu-grading.online/uploads/Book2_65c69ff6e1.xlsx`
        );
        if (!response.ok) throw new Error("Network response was not ok");
        const arrayBuffer = await response.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: "array" });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const excelData = XLSX.utils.sheet_to_json(firstSheet, {
          header: 1,
          raw: false,
        });
        const merges = firstSheet["!merges"] || [];
        const workbook2 = new ExcelJS.Workbook();

        // Load the workbook from the ArrayBuffer
        await workbook2.xlsx.load(arrayBuffer);

        // Access the first worksheet
        const worksheet = workbook2.worksheets[0];

        const processedData = processMergedCells(excelData, merges);
        addFormula(worksheet, processedData.data);
        data.value = processedData.data;
        hotSettings.value.mergeCells = processedData.mergeCells;
        const hotInstance = hotTableRef.value.hotInstance;
        selectedFile.value = response;
        if (hotInstance) {
          hotInstance.loadData(processedData.data);
          hotInstance.updateSettings({ cells: hotSettings.value.cells });
          loading.value = false; // Start loading
        }
      } catch (error) {
        console.error("Error loading file:", error);

        const hotInstance = hotTableRef.value.hotInstance;
        if (hotInstance) {
          hotInstance.loadData([]);
          hotInstance.updateSettings({ cells: hotSettings.value.cells });
          loading.value = false; // Start loading
        }
        loading.value = false;
      }
    };

    // Load file function
    const loadFile = async () => {
      if (selectedFile.value) {
        // try {
        try {
          loading.value = true; // Start loading
          const response = await fetch(
            `https://api.nemsu-grading.online${selectedFile.value.url}`
          );
          if (!response.ok) throw new Error("Network response was not ok");
          const arrayBuffer = await response.arrayBuffer();
          const workbook = XLSX.read(arrayBuffer, { type: "array" });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const excelData = XLSX.utils.sheet_to_json(firstSheet, {
            header: 1,
            raw: false,
          });
          const merges = firstSheet["!merges"] || [];
          const workbook2 = new ExcelJS.Workbook();

          // Load the workbook from the ArrayBuffer
          await workbook2.xlsx.load(arrayBuffer);

          // Access the first worksheet
          const worksheet = workbook2.worksheets[0];

          const processedData = processMergedCells(excelData, merges);
          addFormula(worksheet, processedData.data);
          data.value = processedData.data;
          hotSettings.value.mergeCells = processedData.mergeCells;
          const hotInstance = hotTableRef.value.hotInstance;
          if (hotInstance) {
            hotInstance.loadData(processedData.data);
            hotInstance.updateSettings({ cells: hotSettings.value.cells });
            loading.value = false; // Start loading
          }
        } catch (error) {
          console.error("Error loading file:", error);

          const hotInstance = hotTableRef.value.hotInstance;
          if (hotInstance) {
            hotInstance.loadData([]);
            hotInstance.updateSettings({ cells: hotSettings.value.cells });
            loading.value = false; // Start loading
          }
          loading.value = false;
        }
        //   loading.value = true; // Start loading
        //   const response = await fetch(`https://api.nemsu-grading.online${selectedFile.value.url}`);
        //   if (!response.ok) throw new Error('Network response was not ok');

        //   const arrayBuffer = await response.arrayBuffer();
        //   const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        //   const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        //   const excelData = XLSX.utils.sheet_to_json(firstSheet, { header: 1, raw: false });
        //   const merges = firstSheet['!merges'] || [];

        //   const processedData = processMergedCells(excelData, merges);
        //   data.value = processedData.data;
        //   hotSettings.value.mergeCells = processedData.mergeCells;
        //   const hotInstance = hotTableRef.value.hotInstance;

        //   if (hotInstance) {
        //     hotInstance.loadData(processedData.data);
        //     hotInstance.updateSettings({ cells: hotSettings.value.cells });
        //     loading.value = false; // Start loading
        //   }
        // } catch (error) {
        //   console.error('Error loading file:', error);

        //   const hotInstance = hotTableRef.value.hotInstance;
        //   if (hotInstance) {
        //     hotInstance.loadData([]);
        //     hotInstance.updateSettings({ cells: hotSettings.value.cells });
        //     loading.value = false; // Start loading
        //   }
        //   loading.value = false
        // }
      }
    };
 

    // Handle file change
    const onFileChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          loading.value = true;
          selectedFile.value = file;

          const arrayBuffer = new Uint8Array(event.target.result);
          const workbook = XLSX.read(arrayBuffer, { type: "array" });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const excelData = XLSX.utils.sheet_to_json(firstSheet, {
            header: 1,
            raw: false,
          });
          const merges = firstSheet["!merges"] || [];

          const processedData = processMergedCells(excelData, merges);
          data.value = processedData.data;
          hotSettings.value.mergeCells = processedData.mergeCells;
          const hotInstance = hotTableRef.value.hotInstance;

          if (hotInstance) {
            hotInstance.loadData(processedData.data);
            hotInstance.updateSettings({ cells: hotSettings.value.cells });
            loading.value = false; // Start loading
          }
        };

        reader.readAsArrayBuffer(file);
      }
    };

    // Export to Excel
    const exportToExcel = () => {
      const wb = XLSX.utils.book_new(); // Create a new workbook
      const ws = XLSX.utils.aoa_to_sheet(data.value); // Convert data to a worksheet

      const mergeCells =
        hotTableRef.value.hotInstance.getSettings().mergeCells || [];
      if (mergeCells.length > 0) {
        ws["!merges"] = mergeCells.map((merge) => ({
          s: { r: merge.row, c: merge.col },
          e: {
            r: merge.row + merge.rowspan - 1,
            c: merge.col + merge.colspan - 1,
          },
        }));
      }

      XLSX.utils.book_append_sheet(wb, ws, "Sheet1"); // Append the worksheet to the workbook
      XLSX.writeFile(wb, "exported_data.xlsx"); // Export the workbook as an Excel file
    };

    // Save changes to Excel
    // Save changes to Excel
    const saveToExcel = async () => {
      if (selectedFile.value.length == 0) return;
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet(data.value);
      loading.value = true;
      // Get merged cells from the Handsontable instance
      const mergeCells =
        hotTableRef.value.hotInstance.getSettings().mergeCells || [];
      if (mergeCells.length > 0) {
        ws["!merges"] = mergeCells.map((merge) => ({
          s: { r: merge.row, c: merge.col },
          e: {
            r: merge.row + merge.rowspan - 1,
            c: merge.col + merge.colspan - 1,
          },
        }));
      }

      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

      // Convert workbook to binary string
      const excelData = XLSX.write(wb, { bookType: "xlsx", type: "binary" });
      const blob = new Blob([s2ab(excelData)], {
        type: "application/octet-stream",
      });

      // Prepare FormData to send to the server
      const formData = new FormData();

      formData.append("files", blob, newFileName.value + "" + extension.value); // Change filename if needed

      try {
        try {
          await axios.delete(
            `https://api.nemsu-grading.online/api/upload/files/${selectedFile.value.id}`
          );
        } catch (error) {
          //
        }

        // Make an API request to Strapi to save the file
        const response = await fetch(
          "https://api.nemsu-grading.online/api/upload/",
          {
            method: "POST",
            body: formData,
            // Uncomment if you need to send authorization token
            // headers: { 'Authorization': `Bearer ${token}` },
          }
        );

        await response.json();
      } catch (error) {
        console.error("Error saving file:", error);
      } finally {
        const hotInstance = hotTableRef.value.hotInstance;

        if (hotInstance) {
          hotInstance.loadData([]);
          hotInstance.updateSettings({ cells: hotSettings.value.cells });
          loading.value = false; // Start loading
        }
        selectedFile.value = [];
        loading.value = false;
        isRenameModalVisible.value = false; 
      }
    };
  

    // Function to convert string to ArrayBuffer
    const s2ab = (s) => {
      const buf = new ArrayBuffer(s.length);
      const view = new Uint8Array(buf);
      for (let i = 0; i < s.length; i++) {
        view[i] = s.charCodeAt(i) & 0xff;
      }
      return buf;
    };

    // const cellSettings = (row, col) => {
    //   const cellKey = XLSX.utils.encode_cell({ r: row, c: col });
    //   const cellStyle = data.value[cellKey] || {}; // Use 'data.value' instead of 'dataTable'

    //   return {
    //     className: cellStyle.fill ? 'highlight-cell' : '',
    //     style: {
    //       fontFamily: 'Arial',
    //       fontSize: '12px',
    //       border: cellStyle.border ? formatBorders(cellStyle.border) : undefined,
    //     },
    //   };
    // };

    const addFormula = (worksheet, data) => {
      const cellStyles = [];
      worksheet.eachRow((row) => {
        row.eachCell((cell) => {
          // const cellValue = cell.value;
          if (cell.formula) {
            data[cell.row - 1][cell.col - 1] = `=${cell.formula}`;
          }

          const cellStyle = {
            row: cell.row - 1,
            col: cell.col - 1,
          };

          if (cell.font) {
            cellStyle.fontStyle = {
              color: cell.font.color ? `#${cell.font.color}` : undefined,
              bold: cell.font.bold || false,
              italic: cell.font.italic || false,
            };
          }
          if (cell.fill) {
            // const fillColor = cell.fill.fgColor ? `#${cell.fill.fgColor}` : undefined;
            cellStyle.backgroundColor = cell.fill.bgColor;
          }
          if (cell.alignment) {
            cellStyle.alignment = cell.alignment;
          }

          cellStyles.push(cellStyle);
        });
      });
      styles.value = cellStyles;
    };

    const customCellRenderer = (
      instance,
      td,
      row,
      col,
      prop,
      value,
      cellProperties
    ) => {
      // Apply cell value
      console.debug(instance, prop, cellProperties, value);
      td.innerText = value;
      // Apply background color
      // console.log(styles.value[row], row, styles.value[row].col, col)

      styles.value ?? styles.value.map((style) => {
        if (style.row == row && style.col == col) {
          // console.log("match", styles.value[row])
          if (style.fill && style.fill.fgColor) {
            td.style.backgroundColor = `#${style.fill.fgColor}`;
          }

          // Font styles
          if (style.fontStyle) {
            // console.log("color", style.fontStyle)
            td.style.fontWeight = style.fontStyle.bold ? "bold" : "normal";
            td.style.fontStyle = style.fontStyle.italic ? "italic" : "normal";
            td.style.color = style.fontStyle.color
              ? `#${style.fontStyle.color}`
              : "black";
            td.style.italic = style.fontStyle.italic;
          }

          // Alignment
          if (style.alignment) {
            td.style.textAlign = style.alignment.horizontal || "left";
            td.style.verticalAlign = style.alignment.vertical || "middle";
          }
        }
        return td;
      });
    };

    const processMergedCells = (excelData, merges) => {
      const mergedData = excelData.map((row) => {
        return row.map((cell) =>
          cell && typeof cell === "object" ? cell.v : cell
        );
      });
      const mergeSettings = [];

      merges.forEach((merge) => {
        const { s: start, e: end } = merge;

        let mergedValue = mergedData[start.r][start.c];

        for (let row = start.r; row <= end.r; row++) {
          for (let col = start.c; col <= end.c; col++) {
            if (row === start.r && col === start.c) {
              mergedData[row][col] = mergedValue;
            } else {
              mergedData[row][col] = null;
            }
          }
        }

        mergeSettings.push({
          row: start.r,
          col: start.c,
          rowspan: end.r - start.r + 1,
          colspan: end.c - start.c + 1,
        });
      });

      return { data: mergedData, mergeCells: mergeSettings };
    };

  
     
 
    // Fetch files when component is mounted 
  
    return { 
      hotTableRef,
      data,
      hotSettings,
      files,
      selectedFile,
      loading,
      exportToExcel,
      isRenameModalVisible,
      newFileName,
      openRenameModal,
      closeRenameModal,
      renameFile,
      onFileChange,
      saveToExcel,
      loadFile, 
      fetchDefaultExcel,
      customCellRenderer,
    };
  },
});
</script>

<style scoped>
.table-container {
  font-size: 12px;
  width: 1500px;
  height: 100%;
  padding: 5px;
  padding-bottom: 50px;
  background-color: #f9f9f9; /* Light background for contrast */
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); /* Soft shadow for depth */
  overflow: hidden; /* Prevent overflow */
}

.file-select {
  margin-bottom: 10px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%; /* Full width */
  font-size: 12px; /* Font size for better readability */
}

.export-button,
.save-button {
  margin-bottom: 10px;
  padding: 10px 16px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px; /* Consistent font size */
  transition: background-color 0.3s; /* Smooth hover effect */
}

.export-button:hover,
.save-button:hover {
  background-color: #45a049;
}
 

.hot-table {
  transition: transform 0.2s ease; /* Smooth transition for zoom */
  overflow: hidden; /* Allow scrolling for large tables */
  height: 95%;
}

/* Loading Modal Styles */
.loading-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; /* Ensure it is on top */
}

.loading-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  text-align: center;
}

.spinner {
  border: 8px solid #f3f3f3; /* Light grey */
  border-top: 8px solid #3498db; /* Blue */
  border-radius: 50%;
  width: 50px; /* Size of the spinner */
  height: 50px; /* Size of the spinner */
  animation: spin 1s linear infinite; /* Spin animation */
  margin-bottom: 10px; /* Space between spinner and text */
}

/* Rename Modal Styles */
.rename-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.custom-file-upload {
  display: inline-block;
  padding: 10px 20px;
  cursor: pointer;
  background-color: #4caf50;
  color: white;
  border-radius: 4px;
  text-align: center;
  margin-bottom: 10px; /* Add margin for spacing */
  transition: background-color 0.2s ease; /* Smooth transition */
}

.custom-file-upload:hover {
  background-color: #45a049;
}

.custom-file-upload input[type="file"] {
  display: none; /* Hide the default file input */
}

.rename-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  text-align: center;
}

.rename-content input {
  margin-bottom: 10px;
  padding: 8px;
  border: 1px solid #ccc; /* Styled input */
  border-radius: 4px; /* Consistent border radius */
  width: calc(100% - 20px); /* Adjust for padding */
}

.file-select-label {
  font-size: 14px; /* Adjust the font size */
  margin-bottom: 5px; /* Space between label and select */
  display: block; /* Make label take the full width */
}
 

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
