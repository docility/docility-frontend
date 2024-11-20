<template>
  <div class="container flex flex-col w-full h-full overflow-hidden">
    <HeaderButton title="Risk" :onClick="goBack" />

    <ExcelUpload title="Import Category" @file-read="handleExcelData" />
    <div
      v-if="isModalOpen"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50"
    >
      <div class="bg-white p-6 rounded-md w-1/3 gap-2 flex flex-col">
        <h2 class="text-xl font-semibold mb-4 border-b-2 uppercase">
          {{ selectedRiskTreatment.treatmentOption }}
        </h2>
        <p class="font-semibold">
          When To Use:
          <small class="text-wrap font-normal text-sm">{{
            selectedRiskTreatment.whenToUse
          }}</small>
        </p>
        <p class="font-semibold">
          Description:
          <small class="text-wrap font-normal text-sm">{{
            selectedRiskTreatment.description
          }}</small>
        </p>
        <button
          @click="closeModal"
          class="bg-red-500 text-white px-4 py-2 rounded mt-1 self-end"
        >
          Close
        </button>
      </div>
    </div>

    <form
      v-if="fetchData == false"
      @submit="submit"
      class="flex flex-col h-[90%]"
    >
      <div
        class="grid gap-2 grid-cols-1 w-[100%] p-2 items-center justify-center mt-5 bg-primary-text overflow-scroll"
      >
        <div v-if="!fileUploaded">
          <div class="mb-4">
            <label class="block text-lg font-medium text-gray-700"
              >Date Created
            </label>
            <input
              type="date"
              required
              v-model="dateCreated"
              class="mt-1 block w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div class="mb-4">
            <label class="block text-lg font-medium text-gray-700"
              >Risk Owner
            </label>
            <select
              required
              v-model="riskOwner"
              class="mt-1 block w-full p-2 border border-gray-300 rounded"
            >
              <option
                v-for="owner in riskOwnerList"
                :key="owner.attributes.user_id"
                :value="owner.attributes.user_id"
              >
                {{ owner.attributes.name }}
              </option>
            </select>
          </div>
          <div class="mb-4">
            <label class="block text-lg font-medium text-gray-700"
              >Risk Category / Domain
            </label>
            <select
              required
              v-model="riskCategory"
              class="mt-1 block w-full p-2 border border-gray-300 rounded"
            >
              <option
                v-for="category in riskCategoryList"
                :key="category.id"
                :value="category.id"
              >
                {{ category.attributes.annexCategory }}
                {{ category.attributes.category_domain }}
              </option>
            </select>
          </div>
          <div class="mb-4">
            <label class="block text-lg font-medium text-gray-700"
              >Threat
            </label>
            <input
              v-model="threat"
              type="text"
              required
              class="mt-1 block w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div class="mb-4">
            <label class="block text-lg font-medium text-gray-700"
              >Vulnerability
            </label>
            <input
              v-model="vulnerability"
              type="text"
              required
              class="mt-1 block w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div class="mb-4">
            <label class="block text-lg font-medium text-gray-700"
              >Information Asset category
            </label>
            <input
              v-model="informationAsset"
              type="text"
              required
              class="mt-1 block w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div class="mb-4">
            <label class="block text-lg font-medium text-gray-700"
              >CIA Impact
            </label>
            <input
              v-model="ciaImpact"
              type="text"
              required
              class="mt-1 block w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div class="mb-4">
            <label class="block text-lg font-medium text-gray-700"
              >Matrix to be used for risk assessment
            </label>
            <select
              required
              v-model="matrix"
              @change="updateLikelihoodImpact"
              class="mt-1 block w-full p-2 border border-gray-300 rounded"
            >
              <option value="3x3">3x3</option>
              <option value="5x5">5x5</option>
            </select>
          </div>
          <div class="mb-4">
            <label class="block text-lg font-medium text-gray-700"
              >Initial Likelihood
            </label>
            <select
              required
              v-model="likelihood"
              class="mt-1 block w-full p-2 border border-gray-300 rounded"
            >
              <option
                v-for="option in likelihoodOptions"
                :key="option.value"
                :value="option.value"
              >
                {{ option.text }}
              </option>
            </select>
          </div>
          <div class="mb-4">
            <label class="block text-lg font-medium text-gray-700"
              >Initial Impact
            </label>
            <select
              required
              v-model="initialImpact"
              class="mt-1 block w-full p-2 border border-gray-300 rounded"
            >
              <option
                v-for="option in impactOptions"
                :key="option.value"
                :value="option.value"
              >
                {{ option.text }}
              </option>
            </select>
          </div>
          <div class="mb-4">
            <label class="block text-lg font-medium text-gray-700"
              >Current Control In Place
            </label>
            <input
              v-model="currentControlInPlace"
              type="text"
              required
              class="mt-1 block w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div class="mb-4">
            <label class="block text-lg font-medium text-gray-700"
              >Current Controls Are Effective
            </label>
            <select
              required
              v-model="currentControlEffective"
              class="mt-1 block w-full p-2 border border-gray-300 rounded"
            >
              <option
                v-for="option in ['YES', 'NO']"
                :key="option"
                :value="option"
              >
                {{ option }}
              </option>
            </select>
          </div>
          <div class="mb-4">
            <label class="block text-lg font-medium text-gray-700"
              >Control domain
            </label>
            <select
              v-model="riskControlDomain"
              class="mt-1 h-10 block w-full p-2 border border-gray-300 rounded"
            >
              <option
                v-for="group in riskTreatmentDomain"
                :key="group"
                :value="group[0]"
              >
                {{ group[0] }}
              </option>
            </select>
          </div>
          <div class="mb-4">
            <label class="block text-lg font-medium text-gray-700"
              >Controls mapped
            </label>
            <select
              v-model="controlMapped"
              class="mt-1 h-10 block w-full p-2 border border-gray-300 rounded"
            >
              <option
                v-for="group in riskControlMapping"
                :key="group"
                :value="group.id"
              >
                {{ group.attributes.controlHeading }}
              </option>
            </select>
          </div>
          <div class="mb-4">
            <label class="block text-lg font-medium text-gray-700"
              >Inherent Risk level/rating
            </label>
            <input
              required
              type="text"
              :value="calculateRiskLevel()"
              readonly
              class="mt-1 block w-full p-2 border border-gray-300 rounded bg-gray-100"
            />
          </div>
          <div class="mb-4">
            <label class="block text-lg font-medium text-gray-700"
              >Risk acceptable
            </label>
            <select
              required
              v-model="riskAcceptable"
              class="mt-1 block w-full p-2 border border-gray-300 rounded"
            >
              <option
                v-for="option in ['YES', 'NO']"
                :key="option"
                :value="option"
              >
                {{ option }}
              </option>
            </select>
          </div>

          <!-- risk treatment plan form -->
          <div v-if="riskAcceptable == 'NO'">
            <div class="mb-4">
              <label class="block text-lg font-medium text-gray-700"
                >Risk treatment option
              </label>
              <select
                @change="openModal"
                v-model="riskTreatment"
                class="mt-1 block w-full p-2 border border-gray-300 rounded"
              >
                <option
                  v-for="option in riskTreatmentListOptions"
                  :key="option.id"
                  :value="option.id"
                >
                  {{ option.attributes.treatmentOption }}
                </option>
              </select>
            </div>

            <div class="mb-4">
              <label class="block text-lg font-medium text-gray-700"
                >Risk Treatment Plan
              </label>
              <input
                v-model="riskTreatmentPlan"
                type="text"
                required
                class="mt-1 block w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div class="mb-4">
              <label class="block text-lg font-medium text-gray-700"
                >Control domain
              </label>
              <select
                v-model="controlDomain"
                class="mt-1 h-10 block w-full p-2 border border-gray-300 rounded"
              >
                <option
                  v-for="group in riskTreatmentDomain"
                  :key="group"
                  :value="group[0]"
                >
                  {{ group[0] }}
                </option>
              </select>
            </div>

            <div class="mb-4">
              <label class="block text-lg font-medium text-gray-700"
                >Controls mapped
              </label>
              <select
                v-model="controlMapped"
                class="mt-1 h-10 block w-full p-2 border border-gray-300 rounded"
              >
                <option
                  v-for="group in riskTreatmentControlMapping"
                  :key="group"
                  :value="group.id"
                >
                  {{ group.attributes.controlHeading }}
                </option>
              </select>
            </div>
            <div class="mb-4">
              <label class="block text-lg font-medium text-gray-700"
                >Person responsible to implement the Risk Treatment Plan
              </label>
              <select
                required
                v-model="personResponsibleToImplement"
                class="mt-1 block w-full p-2 border border-gray-300 rounded"
              >
                <option
                  v-for="owner in riskOwnerList"
                  :key="owner.attributes.user_id"
                  :value="owner.attributes.user_id"
                >
                  {{ owner.attributes.name }}
                </option>
              </select>
            </div>
            <div class="mb-4">
              <label class="block text-lg font-medium text-gray-700"
                >Treatment approval date
              </label>
              <input
                required
                type="date"
                v-model="treatmentApprovalDate"
                class="mt-1 block w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div class="mb-4">
              <label class="block text-lg font-medium text-gray-700"
                >Treatment approval evidence
              </label>
              <input
                v-model="treatmentApprovalEvidence"
                type="text"
                required
                class="mt-1 block w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div class="mb-4">
              <label class="block text-lg font-medium text-gray-700"
                >Expected treatment completion date
              </label>
              <input
                required
                type="date"
                v-model="treatmentCompletionDate"
                class="mt-1 block w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div class="mb-4">
              <label class="block text-lg font-medium text-gray-700"
                >Treatment status
              </label>
              <select
                required
                v-model="treatmentStatus"
                class="mt-1 block w-full p-2 border border-gray-300 rounded"
              >
                <option
                  v-for="option in ['NOT STARTED', 'IN-PROGRESS', 'COMPLETED']"
                  :key="option"
                  :value="option"
                >
                  {{ option }}
                </option>
              </select>
            </div>
            <div class="mb-4">
              <label class="block text-lg font-medium text-gray-700"
                >Notes
              </label>
              <input
                v-model="notes"
                type="text"
                required
                class="mt-1 block w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div class="mb-4">
              <label class="block text-lg font-medium text-gray-700"
                >Residual Likelihood
              </label>
              <select
                required
                v-model="residualLikelihood"
                class="mt-1 block w-full p-2 border border-gray-300 rounded"
              >
                <option
                  v-for="option in residualLikelihoodOptions"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.text }}
                </option>
              </select>
            </div>

            <div class="mb-4">
              <label class="block text-lg font-medium text-gray-700"
                >Residual Impact
              </label>
              <select
                required
                v-model="residualImpact"
                class="mt-1 block w-full p-2 border border-gray-300 rounded"
              >
                <option
                  v-for="option in residualImpactOptions"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.text }}
                </option>
              </select>
            </div>
            <div class="mb-4">
              <label class="block text-lg font-medium text-gray-700"
                >Residual Risk level/rating
              </label>
              <input
                required
                type="text"
                :value="calculateResidualRiskLevel()"
                readonly
                class="mt-1 block w-full p-2 border border-gray-300 rounded bg-gray-100"
              />
            </div>
            <div class="mb-4">
              <label class="block text-lg font-medium text-gray-700"
                >Residual risk and treatment approval date
              </label>
              <input
                required
                type="date"
                @change="calculateNextReviewDate()"
                v-model="residualTreatmentApprovalDate"
                class="mt-1 block w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div class="mb-4">
              <label class="block text-lg font-medium text-gray-700"
                >Residual risk and treatment approval evidence
              </label>
              <input
                v-model="approvalEvidence"
                type="text"
                required
                class="mt-1 block w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div class="mb-4">
              <label class="block text-lg font-medium text-gray-700"
                >Next review date
              </label>
              <input
                v-model="nextReviewDate"
                type="text"
                required
                class="mt-1 block w-full p-2 border border-gray-300 rounded"
              />
            </div>
          </div>
          <!-- end treatment -->

          <div class="mb-4">
            <label class="block text-lg font-medium text-gray-700"
              >Risk approval date
            </label>
            <input
              required
              type="date"
              v-model="riskApprovalDate"
              class="mt-1 block w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div class="mb-4">
            <label class="block text-lg font-medium text-gray-700"
              >Risk approval evidence
            </label>
            <input
              v-model="riskApprovalEvidence"
              type="text"
              required
              class="mt-1 block w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div class="mb-4">
            <label class="block text-lg font-medium text-gray-700"
              >Risk assessment completed
            </label>
            <select
              required
              v-model="riskAssessmentCompleted"
              class="mt-1 block w-full p-2 border border-gray-300 rounded"
            >
              <option
                v-for="option in ['YES', 'NO']"
                :key="option"
                :value="option"
              >
                {{ option }}
              </option>
            </select>
          </div>
        </div>
        <div v-if="fileUploaded">
          <div class="mb-4 relative z-20 mt-2">
            <div class="flex items-center">
              <label for="column-select" class="text-sm font-medium"
                >Configure View:
              </label>
              <svg
                class="form-select block cursor-pointer ml-2"
                @click="toggleDropdown"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M19.4 15.4l1.6 1.6-2.3 2.3-1.6-1.6"></path>
                <path d="M4.6 8.6L3 7l2.3-2.3 1.6 1.6"></path>
                <path
                  d="M17 12h3m-3 3h3m-3 3h3m-3-9h3m-9 9H5m0-3H2m3-3H2m3-3H2"
                ></path>
              </svg>
            </div>

            <!-- Dropdown with checkboxes -->
            <div
              v-show="isDropdownOpen"
              class="absolute left-0 right-0 mt-1 bg-white shadow-lg border border-gray-300 rounded-md z-10"
            >
              <div class="max-h-60 overflow-auto p-2">
                <label
                  v-for="(header, index) in headers"
                  :key="index"
                  class="flex items-center mb-2"
                >
                  <input
                    type="checkbox"
                    v-model="visibleHeaders[header]"
                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600"
                  />
                  <span class="ml-2">{{ header }}</span>
                </label>
              </div>
              <button
                v-on:click="isDropdownOpen = false"
                class="mt-2 h-10 self-center pl-2"
              >
                Close
              </button>
            </div>
          </div>
          <table
            class="min-w-full text-sm text-left rtl:text-right text-primary dark:text-gray-400"
          >
            <thead class="text-xs uppercase text-text-primary">
              <tr
                class="sticky top-0 px-6 py-3 z-10 text-dark-text bg-dark-background-secondary"
              >
                <th scope="col" class="p-4 bg-primary">
                  <div class="flex items-center">
                    <input
                      id="checkbox-all-search"
                      type="checkbox"
                      class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label for="checkbox-all-search" class="sr-only"
                      >checkbox</label
                    >
                  </div>
                </th>
                <!-- Loop through headers and display based on visibility -->
                <th
                  v-for="header in visibleHeaderKeys"
                  :key="header"
                  class="px-6 py-3 bg-primary"
                >
                  {{ header }}
                </th>
                <!-- Sticky Actions column (Header) -->
                <th scope="col" class="">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="risk in excelData"
                :key="risk.id"
                class="bg-background border-b hover:bg-secondary-alternate text-text-primary"
              >
                <td class="w-4 p-4">
                  <div class="flex items-center">
                    <input
                      :id="'checkbox-table-' + risk.id"
                      type="checkbox"
                      class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label :for="'checkbox-table-' + risk.id" class="sr-only"
                      >checkbox</label
                    >
                  </div>
                </td>
                <td
                  v-for="header in visibleHeaderKeys"
                  :key="header"
                  class="px-6 py-4 text-nowrap"
                >
                  {{ risk[header] || "-" }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <button type="submit" class="w-full button-style">
          {{ updateRisk ? "Update" : "Submit" }}
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import HeaderButton from "@/components/reuseable/HeaderButton.vue";
import http from "@/helpers/http";
import ExcelUpload from "@/components/reuseable/ExcelUpload.vue";
import { toast } from "vue3-toastify";

export default {
  components: {
    HeaderButton,
    ExcelUpload,
  },
  computed: {
    groupedItems() {
      // Group items by a category property
      return this.controlCategoryList.reduce((groups, item) => {
        console.log(item);
        const category = item.attributes.controlHeading || "Others";
        if (!groups[category]) groups[category] = [];
        groups[category].push(item);
        return groups;
      }, {});
    },
    riskTreatmentDomain() {
      // Group items by a category property
      return this.controlCategoryList.reduce((groups, item) => {
        const category = item.attributes.annexControl+"|"+item.attributes.domain;

        if (groups[category]) return groups;

        groups[category] = [];
        groups[category].push(category);

        return groups;
      }, {});
    },
    riskTreatmentControlMapping() { 
      const annexControl = this.controlDomain.split("|")[0]
      const domain = this.controlDomain.split("|")[1]
      return this.controlCategoryList.filter(
        (item) => item.attributes.domain == domain && item.attributes.annexControl == annexControl
      );
    },
    riskControlMapping() {
      console.log("categorys",this.riskControlDomain);
      const annexControl = this.riskControlDomain.split("|")[0]
      const domain = this.riskControlDomain.split("|")[1]
      console.log(annexControl, domain)
      return this.controlCategoryList.filter(
        (item) => item.attributes.domain == domain && item.attributes.annexControl == annexControl
      );
    },
    visibleHeaderKeys() {
      return this.headers.filter((header) => this.visibleHeaders[header]);
    },
  },
  data() {
    return {
      riskControlDomain: '',
      headers: [],
      visibleHeaders: {},
      isModalOpen: false,
      dateCreated: "",
      riskOwner: "",
      riskCategory: "",
      threat: "",
      vulnerability: "",
      informationAsset: "",
      ciaImpact: "",
      matrix: "",
      likelihood: "",
      initialImpact: "",
      residualImpact: "",
      residualLikelihood: "",
      riskLevel: "",
      residualRiskLevel: "",
      riskAcceptable: "",
      riskApprovalDate: "",
      riskApprovalEvidence: "",
      riskAssessmentCompleted: "",
      riskTreatment: "",
      controlDomain: "",
      personResponsibleToImplement: "",
      treatmentApprovalDate: "",
      treatmentCompletionDate: "",
      residualTreatmentApprovalDate: "",
      approvalEvidence: "",
      nextReviewDate: "",
      riskTreatmentPlan: "",
      treatmentApprovalEvidence: "",
      controlMapped: "",
      notes: "",
      treatmentStatus: "",
      riskControlMap: "",
      currentControlEffective: "",
      currentControlInPlace: "",

      riskOwnerList: null,
      riskCategoryList: null,
      controlCategoryList: [],
      riskTreatmentListOptions: [],
      controlDomainListOptions: [],
      likelihoodOptions: [],
      residualLikelihoodOptions: [],
      impactOptions: [],
      residualImpactOptions: [],
      selectedRiskTreatment: null,

      fetchData: false,
      updateRisk: false,

      excelData: null,
      fileUploaded: false,
      isDropdownOpen: false,
    };
  },
  name: "create-risk",
  methods: {
    toggleDropdown() {
      this.isDropdownOpen = !this.isDropdownOpen;
    },
    goBack() {
      this.$router.back(-1);
    },
    reset() {
      this.treatmentOption = "";
      this.description = "";
    },

    handleExcelData(data) {
      this.excelData = data;
      console.log(data);
      this.fileUploaded = true;
      // Dynamically extract headers from the first risk object
      if (this.excelData.length > 0) {
        this.headers = Object.keys(this.excelData[0]);
        console.log(this.headers);
        // Check if sessionStorage contains saved header visibility settings
        const storedVisibility = sessionStorage.getItem("headerVisibility");
        if (storedVisibility) {
          this.visibleHeaders = JSON.parse(storedVisibility);
        } else {
          // Set default selection for the first 6 headers
          this.selectedHeaders = this.headers.slice(0, 6);
          this.headers.forEach((header, index) => {
            this.visibleHeaders[header] = index < 6; // First 6 columns are visible by default
          });
        }
      }

      console.log(this.visibleHeaders);
    },
    openModal() {
      if (this.riskTreatment && this.riskTreatmentListOptions) {
        this.selectedRiskTreatment = this.riskTreatmentListOptions.filter(
          (f) => f.id == this.riskTreatment
        )[0].attributes;

        this.isModalOpen = true;
      }
    },
    closeModal() {
      // Close the modal
      this.isModalOpen = false;
    },
    calculateNextReviewDate() {
      const date = new Date(this.residualTreatmentApprovalDate);
      date.setDate(date.getDate() + 300);

      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();

      this.nextReviewDate = `${month}/${day}/${year}`;
    },
    updateLikelihoodImpact() {
      // Update options based on selected matrix
      if (this.matrix === "3x3") {
        this.likelihoodOptions = [
          { value: 3, text: "Almost Certain" },
          { value: 2, text: "Possible" },
          { value: 1, text: "Rare" },
        ];
        this.impactOptions = [
          { value: 3, text: "Significant" },
          { value: 2, text: "Moderate" },
          { value: 1, text: "Insignificant" },
        ];
        this.residualLikelihoodOptions = [
          { value: 3, text: "Almost Certain" },
          { value: 2, text: "Possible" },
          { value: 1, text: "Rare" },
        ];
        this.residualImpactOptions = [
          { value: 3, text: "Significant" },
          { value: 2, text: "Moderate" },
          { value: 1, text: "Insignificant" },
        ];
      } else {
        this.likelihoodOptions = [
          { value: 5, text: "Almost Certain" },
          { value: 4, text: "Likely" },
          { value: 3, text: "Possible" },
          { value: 2, text: "Unlikely" },
          { value: 1, text: "Rare" },
        ];
        this.impactOptions = [
          { value: 5, text: "Severe" },
          { value: 4, text: "Major" },
          { value: 3, text: "Moderate" },
          { value: 2, text: "Minor" },
          { value: 1, text: "Insignificant" },
        ];
        this.residualLikelihoodOptions = [
          { value: 5, text: "Almost Certain" },
          { value: 4, text: "Likely" },
          { value: 3, text: "Possible" },
          { value: 2, text: "Unlikely" },
          { value: 1, text: "Rare" },
        ];
        this.residualImpactOptions = [
          { value: 5, text: "Severe" },
          { value: 4, text: "Major" },
          { value: 3, text: "Moderate" },
          { value: 2, text: "Minor" },
          { value: 1, text: "Insignificant" },
        ];
      }
    },
    calculateRiskLevel() {
      const likelihoodValue = parseInt(this.likelihood);
      const impactValue = parseInt(this.initialImpact);
      const riskLevel = likelihoodValue + impactValue;

      if (riskLevel <= 3) return "Low";
      else if (riskLevel <= 6) return "Medium";
      else if (riskLevel <= 9) return "High";
      else if (riskLevel > 9) return "Extreme";
      return "";
    },
    calculateResidualRiskLevel() {
      const residualLikelihoodValue = parseInt(this.residualLikelihood);
      const residualImpactValue = parseInt(this.residualImpact);
      const riskLevel = residualLikelihoodValue + residualImpactValue;

      if (riskLevel <= 3) return "Low";
      else if (riskLevel <= 6) return "Medium";
      else if (riskLevel <= 9) return "High";
      else if (riskLevel > 9) return "Extreme";
      return "";
    },
    async submit(e) {
      e.preventDefault();
      if (!this.fileUploaded) {
        try {
          const data = {
            data: {
              dateCreated: this.dateCreated,
              riskOwner: this.riskOwner,
              riskCategory: this.riskCategory.toString(),
              threat: this.threat,
              vulnerability: this.vulnerability,
              informationAsset: this.informationAsset,
              ciaImpact: this.ciaImpact,
              matrix: this.matrix,
              likelihood: this.likelihood.toString(),
              initialImpact: this.initialImpact.toString(),
              risidualImpact: this.residualImpact.toString(),
              residualLikelihood: this.residualLikelihood.toString(),
              riskLevel: this.calculateRiskLevel(),
              residualRiskLevel: this.calculateResidualRiskLevel(),
              riskAcceptable: this.riskAcceptable,
              riskApprovalDate: this.riskApprovalDate,
              riskApprovalEvidence: this.riskApprovalEvidence,
              riskAssessmentCompleted: this.riskAssessmentCompleted,
              riskTreatment: this.riskTreatment.toString(),
              controlDomain: this.controlDomain.toString(),
              personResponsibleToImplement: this.personResponsibleToImplement,
              treatmentApprovalDate: this.treatmentApprovalDate,
              treatmentCompletionDate: this.treatmentCompletionDate,
              residualTreatmentApprovalDate: this.residualTreatmentApprovalDate,
              approvalEvidence: this.approvalEvidence,
              nextReviewDate: this.nextReviewDate,
              treatmentStatus: this.treatmentStatus.toString(),
              riskControlMap: this.riskControlMap.toString(),
              currentControlEffective: this.currentControlEffective.toString(),
              currentControlInPlace: this.currentControlInPlace.toString(),

              riskTreatmentPlan: this.riskTreatmentPlan,
              treatmentApprovalEvidence: this.treatmentApprovalEvidence,
              controlMapped: this.controlMapped.toString(),
              notes: this.notes,
            },
          };

          let response = null;
          if (this.updateRisk == true) {
            response = await http.put(
              `/api/risks/${this.$route.query.id}`,
              data
            );
          } else {
            response = await http.post("/api/risks", data);
          }
          // const response = await http.post("/api/risks", );
          if (response.status == 200) {
            toast.success("New Category Successfully Saved");
          } else {
            toast.success("Error on Saving Category");
          }
        } catch (error) {
          console.log(error);
          toast.error("Error " + error.response?.data?.error?.message);
        } finally {
          this.reset();
          this.updateRisk ?? this.fetchRiskDetails();
        }
      } else {
        try {
          const risks = []
          for (const item of this.excelData) { 
            risks.push({  

              dateCreated: item['Date Created'],
              riskOwner: item['Risk Owner'],
              riskCategory:  item['Risk Category / Domain'],
              threat:  item['Threat'],
              vulnerability:  item['Vulnerability'],
              informationAsset:  item['Information Asset category'],
              ciaImpact:  item['CIA Impact'],
              matrix: item['Matrix to be used for risk assessment'],
              likelihood:  item['Initial Likelihood'],
              initialImpact:  item['Initial Impact'],
              risidualImpact:  item['Residual Impact'],
              residualLikelihood: item['Residual Likelihood'],
              riskLevel:  item['Risk Level'],
              residualRiskLevel: item['Residual Risk level/rating'],
              riskAcceptable:  item['Risk acceptable'],
              riskApprovalDate:  item['Risk approval date'],
              riskApprovalEvidence:  item['Residual risk and treatment approval evidence'],
              riskAssessmentCompleted:  item['Expected treatment completion date'],
              riskTreatment:  item['Risk treatment option'],
              controlDomain:  item['Control domain'],
              personResponsibleToImplement:  item['Person responsible to implement the Risk Treatment Plan'],
              treatmentApprovalDate:  item['Treatment approval date'],
              treatmentCompletionDate:  item['Expected treatment completion date'],
              residualTreatmentApprovalDate:  item['Residual risk and treatment approval date'],
              approvalEvidence:  item['Treatment approval evidence'],
              nextReviewDate:  item['Next Review Date'],
              treatmentStatus:  item['Treatment status'],
              riskControlMap:  item['Controls mapped'],
              currentControlEffective:  item['Current Controls Are Effective'],
              currentControlInPlace:  item['Current Control In Place'],

              riskTreatmentPlan:  item['Risk Treatment Plan'],
              treatmentApprovalEvidence:  item['Risk Owner'],
              controlMapped: item['Control Mapping'],
              notes:  item['Notes'],
            })
          }
          console.log(risks)
          const response = await http.post('/api/create-bulk/risks', 
          risks,
          ); 
          toast.success(response.data.message);
          this.reset();
        } catch (error) {
          toast.error('Error Saving Excel Data: ' + error.response?.data?.error?.message);
        } finally {
          this.reset()
        }
      }
    },
    async fetchRiskOwnerList() {
      try {
        const ownerList = await http.get("/api/risk-owners");
        this.riskOwnerList = ownerList.data.data;
      } catch (error) {
        toast.error(
          "Internal Server Error: " + error.response?.data?.error?.message
        );
      }
    },
    async fetchRiskCategory() {
      try {
        const categoryList = await http.get("/api/risk-categories");
        this.riskCategoryList = categoryList.data.data;
      } catch (error) {
        toast.error(
          "Internal Server Error: " + error.response?.data?.error?.message
        );
      }
    },
    async fetchControl() {
      try {
        const controlList = await http.get("/api/control-assessments");
        console.log(controlList);
        this.controlCategoryList = controlList.data.data;
      } catch (error) {
        toast.error(
          "Internal Server Error: " + error.response?.data?.error?.message
        );
      }
    },
    async fetchRiskTreatment() {
      try {
        const riskTreatment = await http.get("/api/risk-treatments");
        this.riskTreatmentListOptions = riskTreatment.data.data;
      } catch (error) {
        toast.error(
          "Internal Server Error: " + error.response?.data?.error?.message
        );
      }
    },
    async fetchControlDomain() {
      try {
        const controlDomains = await http.get("/api/control-domains");
        this.controlDomainListOptions = controlDomains.data.data;
      } catch (error) {
        toast.error(
          "Internal Server Error: " + error.response?.data?.error?.message
        );
      }
    },
    async fetchRiskDetails() {
      try {
        let riskDetails = await http.get(`/api/risks/${this.$route.query.id}`);
        const risk = riskDetails.data.data;
        this.dateCreated = risk.attributes.dateCreated;
        this.riskOwner = risk.attributes.riskOwner;
        this.riskCategory = risk.attributes.riskCategory;
        this.threat = risk.attributes.threat;
        this.vulnerability = risk.attributes.vulnerability;
        this.informationAsset = risk.attributes.informationAsset;
        this.ciaImpact = risk.attributes.ciaImpact;
        this.matrix = risk.attributes.matrix;
        this.likelihood = risk.attributes.likelihood;
        this.initialImpact = risk.attributes.initialImpact;
        this.residualImpact = risk.attributes.risidualImpact;
        this.residualLikelihood = risk.attributes.residualLikelihood;
        this.riskLevel = risk.attributes.riskLevel;
        this.residualRiskLevel = risk.attributes.residualRiskLevel;
        this.riskAcceptable = risk.attributes.riskAcceptable;
        this.riskApprovalDate = risk.attributes.riskApprovalDate;
        this.riskApprovalEvidence = risk.attributes.riskApprovalEvidence;
        this.riskAssessmentCompleted = risk.attributes.riskAssessmentCompleted;
        this.riskTreatment = risk.attributes.riskTreatment;
        this.controlDomain = risk.attributes.controlDomain;
        this.personResponsibleToImplement =
          risk.attributes.personResponsibleToImplement;
        this.treatmentApprovalDate = risk.attributes.treatmentApprovalDate;
        this.treatmentCompletionDate = risk.attributes.treatmentCompletionDate;
        this.residualTreatmentApprovalDate =
          risk.attributes.residualTreatmentApprovalDate;
        this.approvalEvidence = risk.attributes.approvalEvidence;
        this.nextReviewDate = risk.attributes.nextReviewDate;
        this.riskTreatmentPlan = risk.attributes.riskTreatmentPlan;
        this.treatmentApprovalEvidence =
          risk.attributes.treatmentApprovalEvidence;
        this.controlMapped = risk.attributes.controlMapped;
        this.notes = risk.attributes.notes;
        this.treatmentStatus = risk.attributes.treatmentStatus;
        this.riskControlMap = risk.attributes.riskControlMap;
        this.currentControlEffective = risk.attributes.currentControlEffective;
        this.currentControlInPlace = risk.attributes.currentControlInPlace;
      } catch (error) {
        toast.error("Error: " + error.response?.data?.error?.message);
      } finally {
        this.fetchData = false;
        this.updateLikelihoodImpact();
      }
    },
  },
  mounted() {
    console.log("mounted");
    this.fetchRiskOwnerList();
    this.fetchRiskCategory();
    this.fetchRiskTreatment();
    this.fetchControlDomain();
    this.fetchControl();
    if (this.$route.query.id) {
      this.fetchData = true;
      this.updateRisk = true;
      console.log("fetchData");
      this.fetchRiskDetails();
    }
  },
};
</script>

<style>
.fixed {
  position: fixed;
}
.bg-gray-600 {
  background-color: rgba(0, 0, 0, 0.6);
}
.bg-opacity-50 {
  background-opacity: 0.5;
}
.z-50 {
  z-index: 50;
}
</style>
