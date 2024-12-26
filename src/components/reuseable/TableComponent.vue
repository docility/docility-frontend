<template>
  <div class="container mx-auto p-4">
    <div class="overflow-x-auto">
      <table class="min-w-full border-collapse border border-gray-200 shadow-sm rounded-lg">
        <thead>
          <tr class="bg-gray-100 text-nowrap">
            <th
              v-for="(header, index) in headers"
              :key="index"
              class="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider border-b border-gray-200"
            >
              {{ header }}
            </th>
          </tr>
        </thead>
        <tbody>
          <!-- Check if data is available -->
          <template v-if="data && data.length > 0">
            <tr v-for="(row, rowIndex) in data" :key="rowIndex">
              <td
                v-for="(header, index) in headers"
                :key="index"
                class="px-6 py-3 text-sm text-gray-700 border-b border-gray-200"
              >
                {{ row[header] || '' }}
              </td>
            </tr>
          </template>
          <!-- Show message if no data -->
          <template v-else>
            <tr>
              <td colspan="100%" class="px-6 py-3 text-sm text-gray-700 text-center border-b border-gray-200">
                No data available.
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: "TableComponent",
  props: {
    headers: {
      type: Array,
      required: true, // Pass all the required headers as a prop
    },
    data: {
      type: Array,
      required: true, // Input data array with multiple rows
    },
  },
};
</script>

<style scoped>
/* Add custom styles if needed */
</style>