<template>
  <div class="w-14">
    <label class="w-4">
      <img class="cursor-pointer hover:scale-110" src="@/assets/import.svg" alt="My Icon" />
      <input type="file" @change="handleFileUpload" accept=".xlsx, .xls" ref="fileInput" />
    </label>
  </div>
</template>

<script>
import * as XLSX from "xlsx";

export default {
  name: "ExcelUpload",
  props: {
    title: {
      type: String,
    },
  },
  methods: {
    handleFileUpload(event) {
      const file = event.target.files[0];
      console.log("change file", file);
      if (file) {
        const reader = new FileReader();

        reader.onload = (e) => {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);

          // Emit the parsed data
          this.$emit("file-read", jsonData);

          // Reset file input to trigger change event on re-uploading the same file
          this.$refs.fileInput.value = '';
        };

        reader.readAsArrayBuffer(file);
      }
    },
  },
};
</script>

<style scoped>
.custom-file-upload {
  width: 1rem;
  height: 1rem;
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
}
.custom-file-upload:hover {
  transform: scale(1.1); /* Adds hover effect */
}

input[type="file"] {
  display: none; /* Hide the default file input */
}
</style>
