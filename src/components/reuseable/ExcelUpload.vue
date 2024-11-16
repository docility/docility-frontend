<template>
  <div class="excel-upload">
    <label class="custom-file-upload">
    <input type="file" @change="handleFileUpload" accept=".xlsx, .xls" />
    {{ title }}
  </label>
  </div>
</template>

<script>
import * as XLSX from 'xlsx';

export default {
  name: 'ExcelUpload',
  props: {
    title: {
      type: String
    }
  }, 
  methods: {
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        
        reader.onload = (e) => {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);

          // Emit the parsed data
          this.$emit('file-read', jsonData);
        };
        
        reader.readAsArrayBuffer(file);
      }
    },
  },
};
</script>

<style scoped>
 
.custom-file-upload {
  display: inline-block;
  padding: 10px 20px;
  cursor: pointer;
  background-color: #42f5e0;
  color: white;
  border-radius: 4px;
  text-align: center;
  margin: 10px; /* Add margin for spacing */
  transition: background-color 0.2s ease; /* Smooth transition */
  width: 200px;
}
.custom-file-upload:hover {
  background-color: #6cd0c4;
}

.custom-file-upload input[type="file"] {
  display: none; /* Hide the default file input */
}
</style>
