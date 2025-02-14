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
          class="bg-dark-background-primary text-nowrap text-xs uppercase sticky top-0 z-10"
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
                class="text-blue-600 hover:underline"
              >
                Edit
              </button>
              <button
                @click="DeleteAction(supplier.id)"
                class="text-red-600 hover:underline"
              >
                Delete
              </button>
            </td>
            <td
              v-for="(headerKeys, index) in Object.keys(headers)"
              :key="index"
              class="p-4"
            >
              {{ supplier.attributes[headerKeys] }}
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
        supplier_name: "Supplier Name",
        trading_as: "Supplier Trading As",
        abn_no: "ABN No",
        acn_no: "ACN No",
        website: "Website",
        bsb: "BSB",
        bank_acc_no: "Bank Account No",
        bank_acc_name: "Bank Account Name",
        glocal: "GLocal",
        supplier_type: "Supplier Type",
        address: "Address",
        country: "Country",
        state: "State",
        suburb: "SubUrb",
        postal_code: "Postal Code",
        contact_person_name: "Contact Person Name",
        contact_person_number: "Contact Person Number",
        contact_person_email: "Contact Person Email",
        support_person_name: "Support Person Name",
        support_person_number: "Support Person Number",
        support_person_email: "Support Person Email",
        payment_terms: "Payment Term",
        notes: "Notes",
        supplier_category: "Supplier Category",
        terms_for_use: "Terms For Use",
        ongoing_management: "Ongoing Management",
        exit_terms: "Exit Terms",
        supplier_purpose: "Supplier Purpose",
        service_provider: "Service Provider",
        data_shared: "Data Shared",
        department_managing: "Department Managing",
        owner: "Owner",
        is_sla: "Is SLA",
        sla_details: "SLA Details",
        credit_limit: "Credit Limit",
        iso_27001: "Iso 27001",
        iso_9001: "ISO 9001",
        iso_14001: "ISO 14001",
        iso_45001: "ISO 45001",
        modern_slavery_act: "Modern Slavery Act",
        modern_slavery_statement_date: "Modern Slavery Statement Date",
        certification: "Certification",
        other_certification_exists: "Other Certification Exists",
        annual_budget: "Annual Budget",
        contract_commencement_date: "Contract Commencement Date",
        contract_end_date: "Contract End Date",
        cia_impact: "CIA Impact",
        threat: "Threat",
        matrix: "Matrix",
        likelihood: "Likelihood",
        impact: "Impact",
        inherent_risk_level: "Inherent Risk Level",
        risk_assessment_completed: "Risk Assessment Completed",
        risk_assessment_required: "Risk Assessment Required",
        assessment_due_date: "Assessment Due Date",
        assessment_status: "Assessment Status",
        assessment_reviewer_person: "Assessment Reviewer Person",
        supplier_agreement: "Supplier Agreement",
        approval_status: "Approval Status",
        date_entered: "Date Entered",
        decision_date: "Decision Date",
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
