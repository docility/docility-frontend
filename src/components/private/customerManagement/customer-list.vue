<template>
  <div class="mx-auto p-4">
    <!-- Add Customer Modal -->
    <AddCustomerModal
      v-if="showUpdateModal"
      @close="showUpdateModal = false"
      :existingCustomer="selectedCustomer"
      :callback="updateCustomer()"
    />

    <!-- Page Size and Search -->
    <div class="flex justify-between items-center mb-4">
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
    <div class="overflow-x-auto max-h-[600px] overflow-y-auto bg-white shadow rounded-lg">
      <table class="w-full text-left text-sm text-gray-700">
        <thead class="bg-gray-100 text-xs uppercase sticky top-0 z-10">
          <tr>
            <th class="p-4">Actions</th>
            <th class="p-4">Customer Name</th>
            <th class="p-4">Trading As</th>
            <th class="p-4">ABN</th>
            <th class="p-4">ACN</th>
            <th class="p-4">Website</th>
            <th class="p-4">Customer Address</th>
            <th class="p-4">Country</th>
            <th class="p-4">Contact Person</th>
            <th class="p-4">Email</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="customer in filteredCustomers"
            :key="customer.id"
            class="border-b hover:bg-gray-50"
          >
            <td class="p-4 space-x-2">
              <button
                @click="selectCustomer(customer)"
                class="text-blue-600 hover:underline"
              >
                Edit
              </button>
              <button
                @click="selectCustomer(customer)"
                class="text-red-600 hover:underline"
              >
                Delete
              </button>
            </td>
            <td class="p-4">{{ customer.attributes.name }}</td>
            <td class="p-4">{{ customer.attributes.trading_as }}</td>
            <td class="p-4">{{ customer.attributes.abn_no }}</td>
            <td class="p-4">{{ customer.attributes.acn_no }}</td>
            <td class="p-4">{{ customer.attributes.website }}</td>
            <td class="p-4">{{ customer.attributes.address }}</td>
            <td class="p-4">{{ customer.attributes.country }}</td>
            <td class="p-4">{{ customer.attributes.contact_person_name }}</td>
            <td class="p-4">{{ customer.attributes.email }}</td>
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
import AddCustomerModal from "./create-customer.vue";

export default {
  components: {
    AddCustomerModal,
  },
  data() {
    return {
      customers: [],
      searchQuery: "",
      selectedCustomer: null,
      showUpdateModal: false,
      currentPage: 1,
      pageSize: 10,
      totalPages: 1,
    };
  },
  mounted() {
    this.fetchCustomers();
  },
  methods: {
    async fetchCustomers() {
      try {
        const response = await http.get(
          `/api/customer-managements?pagination[page]=${this.currentPage}&pagination[pageSize]=${this.pageSize}`
        );
        this.customers = response.data.data;
        this.totalPages = response.data.meta.pagination.pageCount;
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    },
    selectCustomer(customer) {
      this.selectedCustomer = customer;
      this.showUpdateModal = true;
    },
    updateCustomer() {
      console.log("Updating customer");
    },
    changePage(page) {
      if (page < 1 || page > this.totalPages) return;
      this.currentPage = page;
      this.fetchCustomers();
    },
  },
  computed: {
    filteredCustomers() {
      return this.customers.filter((customer) =>
        JSON.stringify(customer)
          .toLowerCase()
          .includes(this.searchQuery.toLowerCase())
      );
    },
  },
};
</script>
