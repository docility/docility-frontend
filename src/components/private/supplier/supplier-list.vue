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
        <thead
          class="bg-blue-600 text-white text-xs uppercase flex-nowrap text-nowrap"
        >
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
                @click="DeleteAction(supplier.documentId)"
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
        documentId: "Document ID", 
        supplier_id: "Supplier Id",
        supplier_name: "Supplier Name",
        supplier_trading_as: "Supplier Trading As",
        abn_no: "ABN No.",
        acn_no: "ACN No.",
        website: "Website",
        supplier_address: "Supplier Address",
        supplier_country: "Supplier Country",
        supplier_state: "Supplier State",
        supplier_suburb: "Supplier SubUrb",
        supplier_postal_code: "Supplier Postal Code",
        supplier_contact_person_name: "Supplier Contact Person",
        supplier_contact_person_number: "Supplier Contact Person Number",
        supplier_contact_person_email: "Supplier Contact Person Email",
        supplier_24x7_contact_person_name: "Supplier 24x7 Contact Person",
        supplier_24x7_contact_person_number: "Supplier 24x7 Contact Person Number",
        supplier_24x7_contact_person_email: "Supplier 24x7 Contact Person Email",
        supplier_glocal: "Supplier GLocal",
        supplier_payment_terms: "Supplier Payment Terms",
        supplier_category: "Supplier Category",
        supplier_type: "Supplier Type",
        supplier_data_shared: "Supplier Data Shared",
        supplier_department_managing: "Supplier Department Managing",
        supplier_owner: "Supplier Owner",
        sla_details: "Sla Details",
        supplier_sla_applicable: "SLA Applicable",
        supplier_credit_limit: "Credit Limit",
        supplier_special_condition_notes: "Special Condition Notes",
        bank_bsb: "Bank BSB",
        supplier_purpose: "Purpose",
        bank_account_no: "Bank Account No",
        bank_account_name: "Bank Account Name",
        supplier_ongoing_management: "Outgoing Management",
        exit_terms: "Exit Terms",
        certification_iso_27001: "ISO 27001",
        certification_iso_9001: "ISO 9001",
        certification_iso_14001: "ISO 14001",
        certification_iso_45001: "ISO 45001",
        certification_modern_slavery_act: "Modern Slavery Act",
        estimated_annual_budget: "Estimated Annual Budget",
        contract_commencement_date: "Commencement Date",
        contract_end_date: "End Date",
        modern_slavery_published_date: "Modern Slavery Published Date",
        other_certification: "Other Certification",
        other_certification_exists: "Other Certification Exists",
        assessment_cia_impact: "CIA Impact",
        assessment_threat: "Threat",
        assessment_risk_assessment_matrix: "Risk Assessment Matrix",
        assessment_likelihood: "Likelihood",
        assessment_impact: "Impact",
        assessment_inherent_risl_level: "Inherent Risk Level",
        assessment_risk_completed: "Risk Completed",
        supplier_assessment_required: "Assessment Required",
        assessment_due_date: "Due Date",
        assessment_status: "Status",
        assessment_reviewer_person: "Reviewer Person",
        supplier_assessment_agreement: "Assessment Agreement",
        supplier_approval_status: "Approval Status",
        supplier_date_entered: "Date Entered",
        supplier_decision_date: "Decision Date",
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
          `/api/supplier-managements?pagination[page]=${this.currentPage}&pagination[pageSize]=${this.pageSize}`
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
          .includes(this.searchQuery.toLowerCase())
      );
    },
  },
};
</script>
