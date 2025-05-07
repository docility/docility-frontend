<template>
  <div class="container mx-auto p-6 bg-white shadow-lg zIndex rounded-lg">
    <ExportButtons :headers="headers" :data="filteredRisks" />

    <!-- Page Size and Search -->
    <div class="flex justify-between items-center mb-4 z-0">
      <div class="flex items-center space-x-2">
        <label for="pageSize" class="text-sm text-gray-600">Page Size:</label>
        <select
          id="pageSize"
          v-model="pageSize"
          @change="fetchCustomers"
          class="border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
        >
          <option v-for="size in [10, 20, 30, 50]" :key="size" :value="size">
            {{ size }}
          </option>
        </select>
      </div>

      <div class="relative">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Search for items"
          id="table-search"
          class="w-80 h-10 px-10 border border-gray-300 rounded-lg text-sm bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
        />
        <svg
          class="absolute left-2 top-2 w-5 h-5 text-gray-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
    </div>

    <!-- Customer Table -->
    <div
      class="overflow-x-auto max-h-[600px] overflow-y-auto bg-white shadow rounded-lg"
    >
      <table class="w-full text-left text-sm text-gray-700">
        <thead class="bg-blue-600 text-white text-xs uppercase flex-nowrap text-nowrap">
          <tr>
            <th class="p-4">Actions</th>
            <th v-for="(header, index) in headers" :key="index" class="p-4">
              {{ header }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="risk in filteredRisks"
            :key="risk.id"
            class="border-b hover:bg-gray-50 text-nowrap"
          >
            <td class="p-4 space-x-2">
              <button
                @click="updateAction(risk)"
                class="px-3 py-1 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700 transition"
              >
                Edit
              </button>
              <button
                @click="deleteAction(risk.documentId)"
                class="px-3 py-1 bg-red-600 text-white text-xs rounded-md hover:bg-red-700 transition"
              >
                Delete
              </button>
            </td>
            <td
              v-for="(headerKeys, index) in Object.keys(headers)"
              :key="index"
              class="p-4"
            >
              {{ risk[headerKeys] }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
 
    <!-- Pagination Controls -->
    <div class="flex justify-between mt-4 items-center">
      <button
        @click="changePage(currentPage - 1)"
        :disabled="currentPage === 1"
        class="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 disabled:bg-gray-200 disabled:cursor-not-allowed"
      >
        Previous
      </button>
      <span class="text-sm">Page {{ currentPage }} of {{ totalPages }}</span>
      <button
        @click="changePage(currentPage + 1)"
        :disabled="currentPage === totalPages"
        class="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 disabled:bg-gray-200 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script>
import http from "@/helpers/http";
// import AddCustomerModal from "./create-customer.vue";
import ExportButtons from "@/components/reuseable/ExportButtons.vue";

export default {
  components: {
    ExportButtons,
  },
  props: {
    Delete: {
      type: Function,
      required: true,
    },
    Update: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      headers: {
        documentId: "Document ID",
        domain: "Domain",
        control_no: "Control Control",
        control_description: "Control Description",
      },
      suppliers: [],
      searchQuery: "",
      selectedCustomer: null,
      showUpdateModal: false,
      currentPage: 1,
      pageSize: 10,
      totalPages: 1,
    };
  },
  mounted() {
    this.fetchSupplier();
  },
  methods: {
    async fetchSupplier() {
    try {
      const response = await http.get(
        `/api/control-domains?pagination[page]=${this.currentPage}&pagination[pageSize]=${this.pageSize}&populate=*`,
      );

      console.log("Suppliers (Before Processing):", response.data.data);

      // Process the fetched data to handle JSON values
      this.suppliers = response.data.data.map((supplier) => {
        const processedSupplier = { ...supplier };

        // Process each field in the supplier object
        Object.keys(processedSupplier).forEach((key) => {
          if (
            typeof processedSupplier[key] === "object" &&
            processedSupplier[key] !== null
          ) {
            // If it's an array of objects, extract the 'value' field
            if (Array.isArray(processedSupplier[key])) {
              processedSupplier[key] = processedSupplier[key]
                .map((item) => (item.value ? item.value : item))
                .join(", "); // Join array items into a comma-separated string
            } else if (processedSupplier[key].value) {
              // If it's a single object with a 'value' field
              processedSupplier[key] = processedSupplier[key].value;
            } else {
              // Otherwise, stringify the object
              processedSupplier[key] = JSON.stringify(processedSupplier[key]);
            }
          }
        });

        return processedSupplier;
      });

      console.log("Suppliers (After Processing):", this.suppliers);

      // Update pagination details
      this.totalPages = response.data.meta.pagination.pageCount;
    } catch (error) {
      console.error("Error fetching suppliers:", error);
    }
  },
    selectSupplier(suppliers) {
      this.selectedSuppliers = suppliers;
      this.showUpdateModal = true;
    },
    async updateAction(id) {
      await this.Update(id);
      this.fetchSupplier();
    },
    async deleteAction(id) {
      await this.Delete(id);
      this.fetchSupplier();
    },
    changePage(page) {
      if (page < 1 || page > this.totalPages) return;
      this.currentPage = page;
      this.fetchSupplier();
    },
  },
  computed: {
    filteredRisks() {
    return this.suppliers.map((supplier) => {
      const processedSupplier = { ...supplier };

      // Process each field in the supplier object
      Object.keys(processedSupplier).forEach((key) => {
        if (typeof processedSupplier[key] === "string") {
          try {
            // Attempt to parse JSON strings back into objects or arrays
            const parsedValue = JSON.parse(processedSupplier[key]);
            if (typeof parsedValue === "object" && parsedValue !== null) {
              processedSupplier[key] = parsedValue.value
                ? parsedValue.value
                : parsedValue;
            }
            if (Array.isArray(parsedValue) && parsedValue !== null) {
              let value = " "
              parsedValue.forEach((item) => {
                if (typeof item === "object" && item !== null) {
                  value += item.value
                    ? item.value+", "
                    : item+", ";
                }
              });
              
              processedSupplier[key] =  value;
            } 
          } catch (error) {
            // If parsing fails, keep the original string value
            processedSupplier[key] = String(processedSupplier[key]);
          }
        }
      });

      return processedSupplier;
    }).filter((supplier) =>
      JSON.stringify(supplier)
        .toLowerCase()
        .includes(this.searchQuery.toLowerCase()),
    );
  },
},
};
</script>

<style>
.zIndex {
  z-index: -10 !important;
}
</style>