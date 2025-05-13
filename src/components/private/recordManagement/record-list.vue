<template>
  <div class="container mx-auto p-6 bg-white shadow-lg rounded-lg">
    <!-- Add Record Modal -->
    <AddRecordModal
      v-if="showUpdateModal"
      @close="showUpdateModal = false"
      :existingRecord="selectedRecord"
      :callback="updateRecord()"
    />

    <ExportButtons :headers="headers" :data="filteredRecords" />

    <!-- Page Size and Search -->
    <div class="flex justify-between items-center mb-4">
      <div class="flex items-center space-x-2">
        <label for="pageSize" class="text-sm text-gray-600">Page Size:</label>
        <select
          id="pageSize"
          v-model="pageSize"
          @change="fetchRecords"
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

    <!-- Record Table -->
    <div
      class="overflow-x-auto max-h-[600px] overflow-y-auto bg-white shadow rounded-lg"
    >
      <table class="w-full text-left text-sm text-gray-700">
        <thead class="bg-blue-600 text-white text-xs uppercase flex-nowrap text-nowrap">
          <tr>
            <th class="p-4">Actions</th>
            <th class="p-4">Record Name</th>
            <th class="p-4">Trading As</th>
            <th class="p-4">ABN</th>
            <th class="p-4">ACN</th>
            <th class="p-4">Website</th>
            <th class="p-4">Record Address</th>
            <th class="p-4">Country</th>
            <th class="p-4">Contact Person</th>
            <th class="p-4">Email</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="record in filteredRecords"
            :key="record.id"
            class="border-b hover:bg-gray-50 text-nowrap"
          >
            <td class="p-4 space-x-2">
              <button
                @click="UpdateAction(record)"
                class="px-3 py-1 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700 transition"
              >
                Edit
              </button>
              <button
                @click="deleteRecord(record)"
                 class="px-3 py-1 bg-red-600 text-white text-xs rounded-md hover:bg-red-700 transition"
              >
                Delete
              </button>
            </td>
            <td class="p-4">{{ record.name }}</td>
            <td class="p-4">{{ record.trading_as }}</td>
            <td class="p-4">{{ record.abn_no }}</td>
            <td class="p-4">{{ record.acn_no }}</td>
            <td class="p-4">{{ record.website }}</td>
            <td class="p-4">{{ record.address }}</td>
            <td class="p-4">{{ record.country }}</td>
            <td class="p-4">{{ record.contact_person_name }}</td>
            <td class="p-4">{{ record.email }}</td>
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
import AddRecordModal from "./record-create.vue";
import ExportButtons from "@/components/reuseable/ExportButtons.vue";

export default {
  components: {
    AddRecordModal,
    ExportButtons,
  },
  props: {
    Update: {
      type: Function,
      required: true,
    },
    Delete: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      headers: {
        name: "Record Name",
        trading_as: "Trading As",
        abn_no: "ABN",
        acn_no: "ACN",
        website: "Website",
        address: "Record Address",
        country: "Country",
        contact_person_name: "Contact Person",
        email: "Email",
      },
      records: [],
      searchQuery: "",
      selectedRecord: null,
      showUpdateModal: false,
      currentPage: 1,
      pageSize: 10,
      totalPages: 1,
    };
  },
  mounted() {
    this.fetchRecords();
  },
  methods: {
    async fetchRecords() {
      try {
        const response = await http.get(
          `/api/record-managements?pagination[page]=${this.currentPage}&pagination[pageSize]=${this.pageSize}`,
        );
        this.records = response.data.data;
        this.totalPages = response.data.meta.pagination.pageCount;
      } catch (error) {
        console.error("Error fetching records:", error);
      }
    },
    selectRecord(record) {
      this.selectedRecord = record;
      this.showUpdateModal = true;
    },
    UpdateAction(record) {
      this.Update(record);
    },
    deleteRecord(record) {
      this.Delete(record);
    },
    changePage(page) {
      if (page < 1 || page > this.totalPages) return;
      this.currentPage = page;
      this.fetchRecords();
    },
  },
  computed: {
    filteredRecords() {
      return this.records.filter((record) =>
        JSON.stringify(record)
          .toLowerCase()
          .includes(this.searchQuery.toLowerCase()),
      );
    },
  },
};
</script>
