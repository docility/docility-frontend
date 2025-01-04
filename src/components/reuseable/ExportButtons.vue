<template>
  <div class="flex space-x-4 mb-4">
    <button
      @click="exportToExcel"
      class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
    >
      Export to Excel
    </button>
    <button
      @click="exportToPdf"
      class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
    >
      Export to PDF
    </button>
    <button
      @click="exportToWord"
      class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
    >
      Export to Word
    </button>
  </div>
</template>

<script>
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import "jspdf-autotable"; // Ensure this plugin is installed and imported
// import PizZip from "pizzip";
// import Docxtemplater from "docxtemplater";

export default {
  props: {
    headers: {
      type: Object,
      required: true,
    },
    data: {
      type: Array,
      required: true,
    },
  },
  methods: {
    exportToExcel() {
  // Create a worksheet from data
  const formattedData = this.data.map((row) => {
    const formattedRow = {};
    Object.keys(this.headers).forEach((header) => {
      formattedRow[this.headers[header]] = row.attributes[header] || ""; // Ensure data matches headers
    });
    return formattedRow;
  });

  console.log(formattedData);

  const ws = XLSX.utils.json_to_sheet(formattedData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Data");
  XLSX.writeFile(wb, "data.xlsx");
},
    exportToPdf() {
      const doc = new jsPDF();
      const tableData = this.data.map((item) => {
         return Object.keys(this.headers).map((header) => item.attributes[header] || "")
        }
      );

      const headerList = []
      Object.keys(this.headers).forEach((header) => {
        headerList.push(this.headers[header])
      });
 
      doc.autoTable({
        head: [headerList],
        body: tableData,
      });
      doc.save("data.pdf");
    },
    exportToWord() {
  const rows = this.data.map((item) => {
    let row = {};
    Object.keys(this.headers).forEach((header) => {
      row[header] = item.attributes[header] || "";
    });
    return row;
  });

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>Exported Data</title>
        <style>
          table {
            border-collapse: collapse;
            width: 100%;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 8px;
          }
          th {
            background-color: #f2f2f2;
            text-align: left;
          }
        </style>
      </head>
      <body>
        <table>
          <thead>
            <tr>
              ${Object.keys(this.headers)
                .map((header) => `<th>${this.headers[header]}</th>`)
                .join("")}
            </tr>
          </thead>
          <tbody>
            ${rows
              .map(
                (row) =>
                  `<tr>${Object.keys(this.headers)
                    .map((header) => `<td>${row[header]}</td>`)
                    .join("")}</tr>`
              )
              .join("")}
          </tbody>
        </table>
      </body>
    </html>
  `;

  // Create a Blob with the correct MIME type
  const blob = new Blob(["\ufeff", htmlContent], { type: "application/msword" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "data.doc";
  link.click();
},
  },
};
</script>
