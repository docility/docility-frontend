<template>
  <div class="container flex flex-col w-full h-full overflow-hidden gap-2">
    <HeaderButton title="Risk" :onClick="goBack" />
    <div class="w-full bg-white h-10 flex items-center">
      <ExcelUpload title="Import Risk Category" @file-read="handleExcelData" />
    </div>

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
            <!-- <select
              required
              v-model="riskOwner"
              class="mt-1 block w-full p-2 border border-gray-300 rounded"
            >
              <option
                v-for="owner in riskOwnerList"
                :key="owner.id"
                :value="owner.id"
              >
                {{ owner.name }}
              </option>
            </select> -->
            <input
              type="text"
              required
              v-model="riskOwner"
              class="mt-1 block w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div class="mb-4">
            <label class="block text-lg font-medium text-gray-700"
              >Risk Owner Email
            </label>
            <input
              type="text"
              required
              v-model="riskOwnerEmail"
              class="mt-1 block w-full p-2 border border-gray-300 rounded"
            />
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
                {{ category.annexCategory }}
                {{ category.category_domain }}
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
            <Multiselect
                v-model="informationAsset.category"
                :options="informationAsset"
                :multiple="false"
                :close-on-select="true"
                :clear-on-select="true"
                :preserve-search="true"
                placeholder="Select Information Asset"
                label="label"
                track-by="value"
                class="w-full"
              /> 
          </div>
          <div class="mb-4">
            <label class="block text-lg font-medium text-gray-700"
              >Asset category
            </label>
            <input
              v-model="assetCategory"
              type="text"
              required
              class="mt-1 block w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div class="mb-4">
            <label class="block text-lg font-medium text-gray-700"
              >CIA Impact
            </label>
            <!-- <input
              v-model="ciaImpact"
              type="text"
              required
              class="mt-1 block w-full p-2 border border-gray-300 rounded"
            /> --> 
              <Multiselect
                v-model="ciaImpact"
                :options="ciaOptions"
                :multiple="true"
                :close-on-select="false"
                :clear-on-select="false"
                :preserve-search="true"
                placeholder="Select CIA Impact"
                label="label"
                track-by="value"
                class="w-full"
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
            
            <Multiselect
            v-model="riskControlDomain"
            :options="controlDomain"
            :multiple="true"
            :close-on-select="false"
            :clear-on-select="false"
            :preserve-search="true"
            placeholder="Select CIA Impact"
            label="label"
            track-by="value"
            class="w-full"
          /> 
          </div>
          <div class="mb-4">
            <label class="block text-lg font-medium text-gray-700"
              >Controls mapped
            </label>
            
            <Multiselect
              v-model="controlMapped"
              :options="riskControlMapping"
              :multiple="true"
              :close-on-select="false"
              :clear-on-select="false"
              :preserve-search="true"
              placeholder="Select Control Mapped"
              label="label"
              track-by="value"
              class="w-full"
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
                  {{ option.treatmentOption }}
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
                >Risk Treatment Control domain
              </label> 

              <Multiselect
                v-model="treatmentControlDomain"
                :options="controlDomain"
                :multiple="true"
                :close-on-select="false"
                :clear-on-select="false"
                :preserve-search="true"
                placeholder="Select Control Domain"
                label="label"
                track-by="value"
                class="w-full"
              />
            </div>

            <div class="mb-4">
              <label class="block text-lg font-medium text-gray-700"
                >Treatment Controls mapped
              </label>
              <!-- <select
                v-model="controlMapped"
                class="mt-1 h-10 block w-full p-2 border border-gray-300 rounded"
              >
                <option
                  v-for="group in riskTreatmentControlMapping"
                  :key="group"
                  :value="group.id"
                >
                  {{ group.controlHeading }}
                </option>
              </select> -->
              <Multiselect
              v-model="riskControlMapping"
              :options="riskTreatmentControlMapping"
              :multiple="true"
              :close-on-select="false"
              :clear-on-select="false"
              :preserve-search="true"
              placeholder="Select Control Domain"
              label="label"
              track-by="value"
              class="w-full"
            />
              
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
                  :key="owner.user_id"
                  :value="owner.user_id"
                >
                  {{ owner.name }}
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
                v-model="risidualImpact"
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
    <div
      v-if="isImportModalVisible"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div class="bg-white p-6 rounded-lg shadow-lg w-3/4 max-w-4xl">
        <!-- Table inside the modal -->
        <TableComponent :headers="ImportFileHeaders" :data="importData" />

        <!-- Buttons -->
        <div class="mt-4 flex justify-end space-x-4">
          <button
            @click="handleCancelImport"
            class="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            @click="handleSubmitImport"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import HeaderButton from "@/components/reuseable/HeaderButton.vue";
import http from "@/helpers/http";
import ExcelUpload from "@/components/reuseable/ExcelUpload.vue";
import { toast } from "vue3-toastify";
import TableComponent from "@/components/reuseable/TableComponent.vue";
import Multiselect from 'vue-multiselect'

export default {
  components: {
    HeaderButton,
    ExcelUpload,
    TableComponent,
    Multiselect
  },
  computed: {
    groupedItems() {
      // Group items by a category property
      return this.controlCategoryList.reduce((groups, item) => {
        console.log(item);
        const category = item.controlHeading || "Others";
        if (!groups[category]) groups[category] = [];
        groups[category].push(item);
        return groups;
      }, {});
    },
    // riskTreatmentDomain() {
    //   // console.log("riskTreatment", this.controlDomain);
    //   // // Group items by a category property
    //   // return this.controlCategoryList.reduce((groups, item) => {
    //   //   const category =
    //   //     item.annexControl + "|" + item.domain;

    //   //   if (groups[category]) return groups;

    //   //   groups[category] = [];
    //   //   groups[category].push(category);

    //   //   return groups;
    //   // }, {});
    // },
    // // riskTreatmentControlMapping() {
    // //   console.log("risk control mapping", this.riskControlDomain);
    // //   console.log("categorys", this.riskControlDomain[0]?.value);
    // //   const annexControl = this.riskControlDomain[0]?.value.split("|")[0];
    // //   const domain = this.riskControlDomain[0]?.value.split("|")[1];
    // //   console.log(annexControl, domain);
    // //   return this.controlCategoryList.filter(
    // //     (item) =>
    // //       item.domain == domain &&
    // //       item.annexControl == annexControl,
    // //   );
    // // },
    // // riskControlMapping() {
    // //   console.log("risk control mapping", this.riskControlDomain);
    // //   console.log("categorys", this.riskControlDomain[0]?.value);
    // //   const annexControl = this.riskControlDomain[0]?.value.split("|")[0];
    // //   const domain = this.riskControlDomain[0]?.value.split("|")[1];
    // //   console.log(annexControl, domain);
    // //   return this.controlCategoryList.filter(
    // //     (item) =>
    // //       item.domain == domain &&
    // //       item.annexControl == annexControl,
    // //   );
    // // },
    riskControlMapping() {
      try {
        console.log("risk control mapping", this.riskControlDomain);
      let data = this.riskControlDomain?.map(item => {
        console.log("item", item);
        const annexControl = item.value.split("|")[0];
        const domain = item.value.split("|")[1];
        console.log(annexControl, domain);
        return this.controlCategoryList.filter(
          (item) =>
            item.domain == domain &&
            item.annexControl == annexControl,
        );
      });
 
       data = data.map((item) => {
        console.log("item", item);
        return { 
          label: item[0].controlHeading, 
          value: item[0].documentId,
        }; 
      })

      console.log(data);
      return data
      } catch (error) {
        console.error("Error in riskControlMapping:", error);
        return [];
      }
      
    },
    riskTreatmentControlMapping() {
      try {
        console.log("risk control mapping", this.treatmentControlDomain);
      let data = this.treatmentControlDomain?.map(item => {
        console.log("item", item);
        const annexControl = item.value.split("|")[0];
        const domain = item.value.split("|")[1];
        console.log(annexControl, domain);
        return this.controlCategoryList.filter(
          (item) =>
            item.domain == domain &&
            item.annexControl == annexControl,
        );
      });
 
       data = data.map((item) => {
        console.log("item", item);
        return { 
          label: item[0].controlHeading, 
          value: item[0].documentId,
        }; 
      })

      console.log(data);
      return data
      } catch (error) {
        console.error("Error in riskControlMapping:", error);
        return [];
      }
      
    },
    visibleHeaderKeys() {
      return this.headers.filter((header) => this.visibleHeaders[header]);
    },
  },
  data() {
    return {
      ciaImpact: [],
      ciaOptions: [
        { label: 'Confidentiality', value: 'Confidentiality' },
        { label: 'Integrity', value: 'Integrity' },
        { label: 'Availability', value: 'Availability' },
      ],
      isImportModalVisible: false,
      importData: null,
      ImportFileHeaders: [
        "Date Created",
        "Risk Owner",
        "Risk Category / Domain",
        "Threat",
        "Vulnerability",
        "Information Asset category",
        "CIA Impact",
        "Matrix to be used for risk assessment",
        "Initial Likelihood",
        "Initial Impact",
        "Current Control In Place",
        "Current Controls Are Effective",
        "Control Mapping",
        "Risk acceptable",
        "Risk treatment option",
        "Risk Treatment Plan",
        "Control domain",
        "Controls mapped",
        "Person responsible to implement the Risk Treatment Plan",
        "Treatment approval date",
        "Risk Level",
        "Treatment approval evidence",
        "Expected treatment completion date",
        "Treatment status",
        "Notes",
        "Residual Likelihood",
        "Residual Impact",
        "Residual Risk level/rating",
        "Residual risk and treatment approval date",
        "Residual risk and treatment approval evidence",
        "Risk approval date",
        "Risk approval evidence",
        "Risk assessment completed",
        "Next Review Date",
      ],
      riskControlDomain: "",
      headers: [],
      visibleHeaders: {},
      isModalOpen: false,
      dateCreated: "",
      riskOwner: "",
      riskOwnerEmail: "",
      riskCategory: "",
      threat: "",
      vulnerability: "",
      informationAsset: "",
      assetCategory: "",
      // ciaImpact: "",
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
      treatmentControlMapped: "",
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
      treatmentControlDomain: "",

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
    handleCancelImport() {
      this.isImportModalVisible = false;
    },
    handleExcelData(data) {
      this.excelData = data;
      console.log("handleexcel", data);
      // Dynamically extract headers from the first risk object
      if (this.excelData.length > 0) {
        this.importData = this.excelData;
        this.isImportModalVisible = true;
      }
    },
    async handleSubmitImport() {
      const mappedData = this.excelData.map((row) => ({
        dateCreated: row["Date Created"],
        riskOwner: row["Risk Owner"],
        riskOwnerEmail: row["Risk Owner Email"],
        riskCategory: row["Risk Category / Domain"],
        threat: row["Threat"],
        vulnerability: row["Vulnerability"],
        informationAsset: row["Information Asset category"],
        assetCategory: row["Asset category"],
        ciaImpact: row["CIA Impact"],
        matrix: row["Matrix to be used for risk assessment"],
        likelihood: row["Initial Likelihood"],
        initialImpact: row["Initial Impact"],
        residualImpact: row["Residual Impact"],
        residualLikelihood: row["Residual Likelihood"],
        riskLevel: row["Risk Level"],
        residualRiskLevel: row["Residual Risk level/rating"],
        riskAcceptable: row["Risk acceptable"],
        riskApprovalDate: row["Risk approval date"],
        riskApprovalEvidence: row["Risk approval evidence"],
        riskAssessmentCompleted: row["Risk assessment completed"],
        riskTreatment: row["Risk treatment option"],
        controlDomain: row["Control domain"],
        personResponsibleToImplement:
          row["Person responsible to implement the Risk Treatment Plan"],
        treatmentApprovalDate: row["Treatment approval date"],
        treatmentCompletionDate: row["Expected treatment completion date"],
        residualTreatmentApprovalDate:
          row["Residual risk and treatment approval date"],
        approvalEvidence: row["Residual risk and treatment approval evidence"],
        nextReviewDate: row["Next Review Date"],
        treatmentStatus: row["Treatment status"],
        riskControlMap: row["Control Mapping"],
        currentControlEffective: row["Current Controls Are Effective"],
        currentControlInPlace: row["Current Control In Place"],
        riskTreatmentPlan: row["Risk Treatment Plan"],
        treatmentApprovalEvidence: row["Treatment approval evidence"],
        controlMapped: row["Controls mapped"],
        treatmentControlMapped: row["Treatment Control Mapped"],
        notes: row["Notes"],
      }));
      const response = await http.post("/api/create-bulk/risks", mappedData);
      toast.success(response.data.message);
      this.reset();
      this.isImportModalVisible = false;
      console.log(mappedData);
    },
    openModal() {
      if (this.riskTreatment && this.riskTreatmentListOptions) {
        this.selectedRiskTreatment = this.riskTreatmentListOptions.filter(
          (f) => f.id == this.riskTreatment,
        )[0];

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
              dateCreated: this.dateCreated || "",
              riskOwner: this.riskOwner || "",
              riskOwnerEmail: this.riskOwnerEmail || "",
              riskCategory: this.riskCategory
                ? this.riskCategory.toString()
                : "",
              threat: this.threat || "",
              vulnerability: this.vulnerability || "",
              informationAsset: this.informationAsset || "",
              assetCategory: this.assetCategory || "",
              ciaImpact: JSON.stringify(this.ciaImpact) || "",
              matrix: this.matrix || "",
              likelihood: this.likelihood ? this.likelihood.toString() : "",
              initialImpact: this.initialImpact
                ? this.initialImpact.toString()
                : "",
              residualImpact: this.residualImpact
                ? this.residualImpact.toString()
                : "",
              residualLikelihood: this.residualLikelihood
                ? this.residualLikelihood.toString()
                : "",
              riskLevel: this.calculateRiskLevel() || "",
              residualRiskLevel: this.calculateResidualRiskLevel() || "",
              riskAcceptable: this.riskAcceptable || "",
              riskApprovalDate: this.riskApprovalDate || "",
              riskApprovalEvidence: this.riskApprovalEvidence || "",
              riskAssessmentCompleted: this.riskAssessmentCompleted || "",
              treatmentControlDomain: this.treatmentControlDomain
                ? this.treatmentControlDomain.toString()
                : "",
              riskTreatment: this.riskTreatment
                ? this.riskTreatment.toString()
                : "",
              controlDomain: this.controlDomain
                ? this.controlDomain.toString()
                : "",
              personResponsibleToImplement:
                this.personResponsibleToImplement || "",
              treatmentApprovalDate: this.treatmentApprovalDate || "",
              treatmentCompletionDate: this.treatmentCompletionDate || "",
              residualTreatmentApprovalDate:
                this.residualTreatmentApprovalDate || "",
              approvalEvidence: this.approvalEvidence || "",
              nextReviewDate: this.nextReviewDate || "",
              treatmentStatus: this.treatmentStatus
                ? this.treatmentStatus.toString()
                : "",
              riskControlMap: this.riskControlMap
                ? this.riskControlMap.toString()
                : "",
              currentControlEffective: this.currentControlEffective
                ? this.currentControlEffective.toString()
                : "",
              currentControlInPlace: this.currentControlInPlace
                ? this.currentControlInPlace.toString()
                : "",
              riskTreatmentPlan: this.riskTreatmentPlan || "",
              treatmentApprovalEvidence: this.treatmentApprovalEvidence || "",
              controlMapped: this.controlMapped
                ? this.controlMapped.toString()
                : "",
              treatmentControlMapped: this.treatmentControlMapped
              ? this.treatmentControlMapped.toString()
              : "",
              notes: this.notes || "",
            },
          };

          let response = null;
          if (this.updateRisk == true) {
            response = await http.put(
              `/api/risks/${this.$route.query.id}`,
              data,
            );
          } else {
            response = await http.post("/api/risks", data);
          }
          // const response = await http.post("/api/risks", );
          if (response.status == 200 || response.status == 201) {
            toast.success("New Category Successfully Saved");
          } else {
            toast.error("Error on Saving Category");
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
          const risks = [];
          for (const item of this.excelData) {
            risks.push({
              dateCreated: item["Date Created"],
              riskOwner: item["Risk Owner"],
              riskOwnerEmail: item["Risk Owner Email"],
              riskCategory: item["Risk Category / Domain"],
              threat: item["Threat"],
              vulnerability: item["Vulnerability"],
              informationAsset: item["Information Asset category"],
              assetCategory: item["Asset category"],
              ciaImpact: String(item["CIA Impact"]),
              matrix: item["Matrix to be used for risk assessment"],
              likelihood: item["Initial Likelihood"],
              initialImpact: item["Initial Impact"],
              risidualImpact: item["Residual Impact"],
              residualLikelihood: item["Residual Likelihood"],
              riskLevel: item["Risk Level"],
              residualRiskLevel: item["Residual Risk level/rating"],
              riskAcceptable: item["Risk acceptable"],
              riskApprovalDate: item["Risk approval date"],
              riskApprovalEvidence:
                item["Residual risk and treatment approval evidence"],
              riskAssessmentCompleted:
                item["Expected treatment completion date"],
              riskTreatment: item["Risk treatment option"],
              controlDomain: item["Control domain"],
              personResponsibleToImplement:
                item["Person responsible to implement the Risk Treatment Plan"],
              treatmentApprovalDate: item["Treatment approval date"],
              treatmentCompletionDate:
                item["Expected treatment completion date"],
              residualTreatmentApprovalDate:
                item["Residual risk and treatment approval date"],
              approvalEvidence: item["Treatment approval evidence"],
              nextReviewDate: item["Next Review Date"],
              treatmentStatus: item["Treatment status"],
              riskControlMap: item["Controls mapped"],
              currentControlEffective: item["Current Controls Are Effective"],
              currentControlInPlace: item["Current Control In Place"],

              riskTreatmentPlan: item["Risk Treatment Plan"],
              treatmentApprovalEvidence: item["Risk Owner"],
              controlMapped: item["Control Mapping"],
              treatmentControlMapped: item["Treatment Control Mapped"],
              notes: item["Notes"],
            });
          }
          console.log(risks);
          const response = await http.post("/api/create-bulk/risks", risks);
          toast.success(response.data.message);
          this.reset();
        } catch (error) {
          toast.error(
            "Error Saving Excel Data: " + error.response?.data?.error?.message,
          );
        } finally {
          this.reset();
        }
      }
    },
    async fetchRiskOwnerList() {
      try {
        console.log("fetchRiskOwnerList");
        const ownerList = await http.get("/api/risk-owners");
        this.riskOwnerList = ownerList.data.data;
      } catch (error) {
        toast.error(
          "Internal Server Error: " + error.response?.data?.error?.message,
        );
      }
    },
    async fetchControlDomainList() {
      try {
        console.log("fetchControlDomainList");
        const ownerList = await http.get("/api/control-domains");
        this.controlDomain = ownerList.data.data.map((item) => {
          return {
            label: item?.control_no,
            value: item?.control_no + "|" + item?.domain,
          };
        });
      } catch (error) {
        toast.error(
          "Internal Server Error: " + error.response?.data?.error?.message,
        );
      }
    },
    async fetchRiskCategory() {
      try {
        const categoryList = await http.get("/api/risk-categories");
        this.riskCategoryList = categoryList.data.data;
      } catch (error) {
        toast.error(
          "Internal Server Error: " + error.response?.data?.error?.message,
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
          "Internal Server Error: " + error.response?.data?.error?.message,
        );
      }
    },
    async fetchRiskTreatment() {
      try {
        const riskTreatment = await http.get("/api/risk-treatments");
        this.riskTreatmentListOptions = riskTreatment.data.data;
      } catch (error) {
        toast.error(
          "Internal Server Error: " + error.response?.data?.error?.message,
        );
      }
    },
    async fetchInformationAssetCategory() {
      try {
        const informationAssetCategory = await http.get("/api/information-asset-categories");
        this.informationAsset = informationAssetCategory.data.data.map((item) => {
          return {
            label: item.category,
            value: item.id,
          };
        });
      } catch (error) {
        toast.error(
          "Internal Server Error: " + error.response?.data?.error?.message,
        );
      }
    },
    async fetchControlDomain() {
      try {
        const controlDomains = await http.get("/api/control-domains");
        this.controlDomainListOptions = controlDomains.data.data;
      } catch (error) {
        toast.error(
          "Internal Server Error: " + error.response?.data?.error?.message,
        );
      }
    },
    async fetchRiskDetails() {
      try {
        console.log("fetchRiskDetails");
        let riskDetails = await http.get(`/api/risks/${this.$route.query.id}`);
        
        const risk = riskDetails.data.data;
        this.dateCreated = risk.dateCreated;
        this.riskOwner = risk.riskOwner;
        this.riskOwnerEmail = risk.riskOwnerEmail;
        this.riskCategory = risk.riskCategory;
        this.threat = risk.threat;
        this.vulnerability = risk.vulnerability;
        this.informationAsset = risk.informationAsset;
        this.assetCategory = risk.assetCategory;
        this.ciaImpact = JSON.parse(risk.ciaImpact);
        this.matrix = risk.matrix;
        this.likelihood = risk.likelihood;
        this.initialImpact = risk.initialImpact;
        this.residualImpact = risk.risidualImpact;
        this.residualLikelihood = risk.residualLikelihood;
        this.riskLevel = risk.riskLevel;
        this.residualRiskLevel = risk.residualRiskLevel;
        this.riskAcceptable = risk.riskAcceptable;
        this.riskApprovalDate = risk.riskApprovalDate;
        this.riskApprovalEvidence = risk.riskApprovalEvidence;
        this.riskAssessmentCompleted = risk.riskAssessmentCompleted;
        this.riskTreatment = risk.riskTreatment;
        this.controlDomain = risk.controlDomain;
        this.personResponsibleToImplement =
          risk.personResponsibleToImplement;
        this.treatmentApprovalDate = risk.treatmentApprovalDate;
        this.treatmentCompletionDate = risk.treatmentCompletionDate;
        this.residualTreatmentApprovalDate =
          risk.residualTreatmentApprovalDate;
        this.approvalEvidence = risk.approvalEvidence;
        this.nextReviewDate = risk.nextReviewDate;
        this.riskTreatmentPlan = risk.riskTreatmentPlan;
        this.treatmentApprovalEvidence =
          risk.treatmentApprovalEvidence;
        this.controlMapped = risk.controlMapped;
        this.treatmentControlMapped =
          risk.treatmentControlMapped;
        this.notes = risk.notes;
        this.treatmentStatus = risk.treatmentStatus;
        this.riskControlMap = risk.riskControlMap;
        this.currentControlEffective = risk.currentControlEffective;
        this.currentControlInPlace = risk.currentControlInPlace;
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
    this.fetchControlDomainList();
    this.fetchInformationAssetCategory();
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
@import "vue-multiselect/dist/vue-multiselect.min.css";

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
