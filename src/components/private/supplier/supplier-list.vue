<template>
  <div class="mx-auto p-4">
    <ExportButtons :headers="headers" :data="filteredSupplier" />

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
            v-for="supplier in filteredSupplier"
            :key="supplier.id"
            class="border-b hover:bg-gray-50 text-nowrap"
          >
            <td class="p-4 space-x-2">
              <button
                @click="UpdateAction(supplier)"
                class="px-3 py-1 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700 transition"
              >
                Edit
              </button>
              <button
                @click="DeleteAction(supplier.id)"
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
              {{ supplier[headerKeys] }}
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
        id: "ID",
    "supplier_id": "",
    "supplier_name": "",
    "supplier_trading_as": "",
    "abn_no": "",
    "acn_no": "",
    "website": "",
    "supplier_address": "",
    "supplier_country": "",
    "supplier_state": "",
    "supplier_suburb": "",
    "supplier_postal_code": "",
    "supplier_contact_person_name": "",
    "supplier_contact_person_number": "",
    "supplier_contact_person_email": "",
    "supplier_24x7_contact_person_name": "",
    "supplier_24x7_contact_person_number": "",
    "supplier_24x7_contact_person_email": "",
    "supplier_glocal": "",
    "supplier_payment_terms": "",
    "supplier_category": "",
    "supplier_type": "",
    "supplier_data_shared": "",
    "supplier_department_managing": "",
    "supplier_owner": "",
    "sla_details": "",
    "supplier_sla_applicable":"",
    "supplier_credit_limit": "",
    "supplier_special_condition_notes": "",
    "bank_bsb": "",
    "supplier_purpose": "",
    "bank_account_no": "",
    "bank_account_name": "",
    "supplier_ongoing_management": "",
    "exit_terms": "",
    "certification_iso_27001": "",
    "certification_iso_9001": "",
    "certification_iso_14001": "",
    "certification_iso_45001": "",
    "certification_modern_slavery_act": "",
    "estimated_annual_budget": "",
    "contract_commencement_date": "",
    "contract_end_date": "",
    "modern_slavery_published_date": "",
    "other_certification": "",
    "other_certification_exists": "",
    "assessment_cia_impact": "",
    "assessment_threat": "",
    "assessment_risk_assessment_matrix": "",
    "assessment_likelihood": "",
    "assessment_impact": "",
    "assessment_inherent_risl_level": "",
    "assessment_risk_completed": "",
    "supplier_assessment_required": "",
    "assessment_due_date": "",
    "assessment_status": "",
    "assessment_reviewer_person": "",
    "supplier_assessment_agreement": "",
    "supplier_approval_status": "",
    "supplier_date_entered": "",
    "supplier_decision_date":"",
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
    async DeleteAction(id) {
      await this.Delete(id);
      this.fetchSupplier();
    },
    async UpdateAction(supplier) {
      await this.Update(supplier);
      this.fetchSupplier();
    },
    async fetchSupplier() {
      try {
        const response = await http.get(
          `/api/suppliers?pagination[page]=${this.currentPage}&pagination[pageSize]=${this.pageSize}`,
        );

        console.log("Suppliers:", response.data.data);
        this.suppliers = response.data.data;
        this.totalPages = response.data.meta.pagination.pageCount;
      } catch (error) {
        console.error("Error fetching suppliers:", error);
      }
    },
    selectSupplier(suppliers) {
      this.selectedSuppliers = suppliers;
      this.showUpdateModal = true;
    },
    updateSupplier() {
      console.log("Updating supplier");
    },
    changePage(page) {
      if (page < 1 || page > this.totalPages) return;
      this.currentPage = page;
      this.fetchSupplier();
    },
  },
  computed: {
    filteredSupplier() {
      return this.suppliers.filter((supplier) =>
        JSON.stringify(supplier)
          .toLowerCase()
          .includes(this.searchQuery.toLowerCase()),
      );
    },
  },
};
</script>
