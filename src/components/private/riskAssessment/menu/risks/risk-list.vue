<template>
  <div class="mx-auto p-4">
    <ExportButtons :headers="headers" :data="filteredRisks" />

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
              {{ header }}</th>
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
                @click="updateAction(risk.id)"
                class="text-blue-600 hover:underline"
              >
                Edit
              </button>
              <button
                @click="deleteAction(risk.id)"
                class="text-red-600 hover:underline"
              >
                Delete
              </button>
            </td>
            <td v-for="(headerKeys, index) in Object.keys(headers)" :key="index" class="p-4">{{ risk.attributes[headerKeys] }}</td>
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
        riskOwner: "Risk Owner",
        riskCategory: "Risk Category",
        threat: "Threat",
        vulnerability: "Vulnerability",
        informationAsset: "Information Asset",
        ciaImpact: "CIA Impact",
        matrix: "Matrix",
        likelihood: "Likelihood",
        initialImpact: "Initial Impact",
        risidualImpact: "Residual Impact",
        residualLikelihood: "Residual Likelihood",
        riskLevel: "Risk Level",
        residualRiskLevel: "Residual Risk Level",
        riskAcceptable: "Risk Acceptable",
        riskApprovalDate: "Risk Approval Date",
        riskApprovalEvidence: "Risk Approval Evidence",
        riskAssessmentCompleted: "Risk Assessment Completed",
        riskTreatment: "Risk Treatment",
        controlDomain: "Control Domain",
        personResponsibleToImplement: "Person Responsible To Implement",
        treatmentApprovalDate: "Treatment Approval Date",
        treatmentCompletionDate: "Treatment Completion Date",
        residualTreatmentApprovalDate: "Residual Treatment Approval Date",
        approvalEvidence: "Approval Evidence",
        nextReviewDate: "Next Review Date",
        riskTreatmentPlan: "Risk Treatment Plan",
        treatmentApprovalEvidence: "Treatment Approval Evidence",
        controlMapped: "Control Mapped",
        notes: "Notes",
        treatmentStatus: "Treatment Status",
        riskControlMap: "Risk Control Map",
        currentControlEffective: "Current Control Effective",
        currentControlInPlace: "Current Control In Place",
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
          `/api/risks?pagination[page]=${this.currentPage}&pagination[pageSize]=${this.pageSize}`
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
      return this.suppliers.filter((supplier) =>
        JSON.stringify(supplier)
          .toLowerCase()
          .includes(this.searchQuery.toLowerCase())
      );
    },
  },
};
</script>
