<template>
  <div class="supplier-component">
    <div class="relative shadow-md sm:rounded-lg">
      <div class="pb-4 bg-white flex p-2 justify-between flex-row">
        <div class="flex justify-center items-center gap-2">
          <ExcelUpload title="Import Risk Category" @file-read="handleExcelData" />

          <ImageButton :svg="require('@/assets/add.svg')" title="New" :callback="addNewSupplier" />
          <!-- Trigger button for the modal -->
        </div>
      </div>

      <!-- Scrollable container with fixed header -->
      <div class="max-h-[700px] overflow-y-auto w-full">
        <div v-if="isImportModalVisible"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div class="bg-white p-6 rounded-lg shadow-lg w-3/4 max-w-4xl">
            <!-- Table inside the modal -->
            <TableComponent :headers="ImportFileHeaders" :data="importData" />

            <!-- Buttons -->
            <div class="mt-4 flex justify-end space-x-4">
              <button @click="handleCancelImport"
                class="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400">
                Cancel
              </button>
              <button @click="handleSubmitImport" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content">
        <span @click="showModal = false" class="close">&times;</span>
        <h1 class="text-2xl font-bold mb-4">
          {{ updateData == true ? "Update" : "New" }} Supplier
        </h1>

        <form class="h-[80%]" @submit.prevent="handleSubmit">
          <div class="overflow-auto h-full p-3">
            <h2 class="text-lg font-semibold mt-6 mb-2">Supplier Details</h2>
            <div class="grid grid-cols-4 gap-4">
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700">Supplier ID:</label>
                <input type="text" v-model="createSupplier.supplier_id"
                  class="mt-1 block w-full p-2 border border-gray-300 rounded" />
              </div>

              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700">Supplier Name:</label>
                <input type="text" v-model="createSupplier.supplier_name"
                  class="mt-1 block w-full p-2 border border-gray-300 rounded" />
              </div>

              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700">Supplier Trading As:</label>
                <input type="text" v-model="createSupplier.supplier_trading_as"
                  class="mt-1 block w-full p-2 border border-gray-300 rounded" />
              </div>

              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700">ABN No.:</label>
                <input type="text" v-model="createSupplier.abn_no"
                  class="mt-1 block w-full p-2 border border-gray-300 rounded" />
              </div>

              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700">ACN No.:</label>
                <input type="text" v-model="createSupplier.acn_no"
                  class="mt-1 block w-full p-2 border border-gray-300 rounded" />
              </div>

              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700">Website:</label>
                <input type="url" v-model="createSupplier.website"
                  class="mt-1 block w-full p-2 border border-gray-300 rounded" />
              </div>

              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700">Supplier Address:</label>
                <input type="text" v-model="createSupplier.supplier_address"
                  class="mt-1 block w-full p-2 border border-gray-300 rounded" />
              </div>

              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700">Country:</label>
                <input type="text" v-model="createSupplier.supplier_country"
                  class="mt-1 block w-full p-2 border border-gray-300 rounded" />
              </div>

              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700">State:</label>
                <input type="text" v-model="createSupplier.supplier_state"
                  class="mt-1 block w-full p-2 border border-gray-300 rounded" />
              </div>

              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700">Suburb:</label>
                <input type="text" v-model="createSupplier.supplier_suburb"
                  class="mt-1 block w-full p-2 border border-gray-300 rounded" />
              </div>

              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700">Postcode:</label>
                <input type="text" v-model="createSupplier.supplier_postal_code"
                  class="mt-1 block w-full p-2 border border-gray-300 rounded" />
              </div>

              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700">Contact Person Name:</label>
                <input type="text" v-model="createSupplier.supplier_contact_person_name"
                  class="mt-1 block w-full p-2 border border-gray-300 rounded" />
              </div>

              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700">Phone Number:</label>
                <input type="tel" v-model="createSupplier.supplier_contact_person_number"
                  class="mt-1 block w-full p-2 border border-gray-300 rounded" />
              </div>

              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700">Email ID:</label>
                <input type="email" v-model="createSupplier.supplier_contact_person_email"
                  class="mt-1 block w-full p-2 border border-gray-300 rounded" />
              </div>

              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700">24x7 Contact Person Name:</label>
                <input type="text" v-model="createSupplier.supplier_24x7_contact_person_name"
                  class="mt-1 block w-full p-2 border border-gray-300 rounded" />
              </div>

              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700">24x7 Phone Number:</label>
                <input type="tel" v-model="createSupplier.supplier_24x7_contact_person_number"
                  class="mt-1 block w-full p-2 border border-gray-300 rounded" />
              </div>

              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700">24x7 Email ID:</label>
                <input type="email" v-model="createSupplier.supplier_24x7_contact_person_email"
                  class="mt-1 block w-full p-2 border border-gray-300 rounded" />
              </div>

              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700">Local / Overseas Supplier:</label>
                <select v-model="createSupplier.supplier_glocal"
                  class="mt-1 block w-full p-2 border border-gray-300 rounded">
                  <option value="local">Local</option>
                  <option value="international">International</option>
                </select>
              </div>

              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700">Payment Terms:</label>
                <input type="text" v-model="createSupplier.supplier_payment_terms"
                  class="mt-1 block w-full p-2 border border-gray-300 rounded" />
              </div>

              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700">Supplier Category:</label>
                <select v-model="createSupplier.supplier_category"
                  class="mt-1 block w-full p-2 border border-gray-300 rounded">
                  <option value="critical">Critical Supplier</option>
                  <option value="non-critical">Non-Critical Supplier</option>
                </select>
              </div>

              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700">Supplier Type:</label>
                <select v-model="createSupplier.supplier_type" @change="checkSupplierType"
                  class="mt-1 block w-full p-2 border border-gray-300 rounded">
                  <option value="cloud">Cloud Service Provider</option>
                  <option value="managed">Managed Service Provider</option>
                  <option value="hr">Human Resource Provider</option>
                  <option value="third-party">
                    Third Party Service Provider
                  </option>
                  <option value="office">Office Supplier</option>
                  <option value="misc">Misc Supplier</option>
                </select>
              </div>
              <!-- <h3 v-if="createSupplier.supplierType === 'cloud'" class="text-lg font-semibold">Cloud Service Provider Terms and Conditions</h3> -->
              <div v-if="createSupplier.supplierType === 'cloud'" class="mb-4">
                <label class="block text-sm font-medium text-gray-700">Terms for Use:</label>
                <input v-model="createSupplier.termsForUse"
                  class="mt-1 block w-full p-2 border border-gray-300 rounded" />
              </div>
              <div v-if="createSupplier.supplierType === 'cloud'" class="mb-4">
                <label class="block text-sm font-medium text-gray-700">Ongoing Management:</label>
                <input v-model="createSupplier.supplier_ongoing_management"
                  class="mt-1 block w-full p-2 border border-gray-300 rounded" />
              </div>
              <div v-if="createSupplier.supplierType === 'cloud'" class="mb-4">
                <label class="block text-sm font-medium text-gray-700">Exit Terms:</label>
                <input v-model="createSupplier.exit_terms"
                  class="mt-1 block w-full p-2 border border-gray-300 rounded" />
              </div>
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700">Data Shared with Supplier:</label>
                <select v-model="createSupplier.supplier_data_shared"
                  class="mt-1 block w-full p-2 border border-gray-300 rounded">
                  <option value="PII">PII</option>
                  <option value="customer-info">Customer Information</option>
                  <option value="company-info">Company Information</option>
                  <option value="no-info">No Information Shared</option>
                </select>
              </div>

              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700">Department Managing Supplier:</label>
                <input type="text" v-model="createSupplier.supplier_department_managing"
                  class="mt-1 block w-full p-2 border border-gray-300 rounded" />
              </div>

              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700">Supplier Owner:</label>
                <input type="text" v-model="createSupplier.supplier_owner"
                  class="mt-1 block w-full p-2 border border-gray-300 rounded" />
              </div>

              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700">SLA Applicable:</label>
                <select v-model="createSupplier.sla_details"
                  class="mt-1 block w-full p-2 border border-gray-300 rounded">
                  <option v-for="boolean in booleanSelect" :key="boolean.value" :value="boolean.value">
                    {{ boolean.text }}
                  </option>
                </select>
              </div>

              <div v-if="
                ['cloud', 'managed'].includes(createSupplier.sla_details)
              " class="mb-4">
                <label class="block text-sm font-medium text-gray-700">SLA Details:</label>
                <input type="file" @change="handleFileUpload" class="block w-full border border-gray-300 rounded" />
              </div>

              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700">Credit Limit:</label>
                <input type="number" v-model="createSupplier.supplier_credit_limit"
                  class="mt-1 block w-full p-2 border border-gray-300 rounded" />
              </div>
              <div class="mb-4 col-span-2">
                <label class="block text-sm font-medium text-gray-700">Special Conditions / Additional Notes:</label>
                <input v-model="createSupplier.supplier_special_condition_notes"
                  class="mt-1 block w-full p-2 border border-gray-300 rounded" />
              </div>
            </div>

            <h2 class="text-lg font-semibold mt-6 mb-2">Bank Details</h2>
            <div class="grid grid-cols-3 gap-4">
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700">BSB:</label>
                <input type="text" v-model="createSupplier.bank_bsb"
                  class="mt-1 block w-full p-2 border border-gray-300 rounded" />
              </div>

              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700">Account No.:</label>
                <input type="text" v-model="createSupplier.bank_account_no"
                  class="mt-1 block w-full p-2 border border-gray-300 rounded" />
              </div>

              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700">Account Name:</label>
                <input type="text" v-model="createSupplier.bank_account_name"
                  class="mt-1 block w-full p-2 border border-gray-300 rounded" />
              </div>
            </div>
            <h2 class="text-lg font-semibold mt-6 mb-2">Certification</h2>
            <div class="grid grid-cols-3 gap-3">
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700">ISO 27001 Certified and Valid:</label>
                <select v-model="createSupplier.certification_iso_27001"
                  class="mt-1 block w-full p-2 border border-gray-300 rounded">
                  <option v-for="boolean in booleanSelect" :key="boolean.value" :value="boolean.value">
                    {{ boolean.text }}
                  </option>
                </select>
                <input v-if="createSupplier.certification_iso_27001 == 1" type="file" @change="handleFileUpload"
                  class="mt-1 block w-full p-2 border border-gray-300 rounded" />
              </div>

              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700">ISO 9001 Certified and Valid:</label>
                <select v-model="createSupplier.certification_iso_9001"
                  class="mt-1 block w-full p-2 border border-gray-300 rounded">
                  <option v-for="boolean in booleanSelect" :key="boolean.value" :value="boolean.value">
                    {{ boolean.text }}
                  </option>
                </select>
                <input v-if="createSupplier.certification_iso_9001 == 1" type="file" @change="handleFileUpload"
                  class="mt-1 block w-full p-2 border border-gray-300 rounded" />
              </div>

              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700">ISO 14001 Certified and Valid:</label>
                <select v-model="createSupplier.certification_iso_14001"
                  class="mt-1 block w-full p-2 border border-gray-300 rounded">
                  <option v-for="boolean in booleanSelect" :key="boolean.value" :value="boolean.value">
                    {{ boolean.text }}
                  </option>
                </select>
                <input v-if="createSupplier.certification_iso_14001 == 1" type="file" @change="handleFileUpload"
                  class="mt-1 block w-full p-2 border border-gray-300 rounded" />
              </div>

              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700">ISO 45001 Certified and Valid:</label>
                <select v-model="createSupplier.certification_iso_45001"
                  class="mt-1 block w-full p-2 border border-gray-300 rounded">
                  <option v-for="boolean in booleanSelect" :key="boolean.value" :value="boolean.value">
                    {{ boolean.text }}
                  </option>
                </select>
                <input v-if="createSupplier.certification_iso_45001 == 1" type="file" @change="handleFileUpload"
                  class="mt-1 block w-full p-2 border border-gray-300 rounded" />
              </div>

              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700">Modern Slavery Act Applicable:</label>
                <select v-model="createSupplier.certification_modern_slavery_act"
                  class="mt-1 block w-full p-2 border border-gray-300 rounded">
                  <option v-for="boolean in booleanSelect" :key="boolean.value" :value="boolean.value">
                    {{ boolean.text }}
                  </option>
                </select>
                <input v-if="createSupplier.certification_modern_slavery_act == 1" type="file"
                  @change="handleFileUpload" class="mt-1 block w-full p-2 border border-gray-300 rounded" />
              </div>

              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700">Estimated Annual Budget Value:</label>
                <input type="number" v-model="createSupplier.estimated_annual_budget"
                  class="mt-1 block w-full p-2 border border-gray-300 rounded" />
              </div>

              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700">Contract Commencement Date:</label>
                <input type="date" v-model="createSupplier.contract_commencement_date"
                  class="mt-1 block w-full p-2 border border-gray-300 rounded" />
              </div>

              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700">Contract End Date:</label>
                <input type="date" v-model="createSupplier.contract_end_date"
                  class="mt-1 block w-full p-2 border border-gray-300 rounded" />
              </div>
              <div></div>
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700">Modern Slavery Published Date:</label>
                <input type="date" v-model="createSupplier.modern_slavery_published_date"
                  class="mt-1 block w-full p-2 border border-gray-300 rounded" />
                <input type="file" @change="handleFileUpload"
                  class="mt-1 block w-full p-2 border border-gray-300 rounded" />
              </div>

              <div class="mb-4 col-span-2">
                <label class="block text-sm font-medium text-gray-700">Any Other Certification:</label>

                <input type="text" v-model="createSupplier.other_certification"
                  class="mt-1 block w-full p-2 border border-gray-300 rounded" />
                <div class="flex">
                  <div class="flex flex-row">
                    <select v-model="createSupplier.other_certification_exists"
                      class="mt-1 block w-full p-2 border border-gray-300 rounded">
                      <option v-for="boolean in booleanSelect" :key="boolean.value" :value="boolean.value">
                        {{ boolean.text }}
                      </option>
                    </select>
                    <input v-if="createSupplier.otherCertificationExists == 1" type="file" @change="handleFileUpload"
                      class="mt-1 block w-full p-2 border border-gray-300 rounded" />
                  </div>
                </div>
              </div>
            </div>

            <h2 class="text-lg font-semibold mt-6 mb-2">Assessment</h2>
            <div class="grid grid-cols-3 gap-3">
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700">Sensitivity of Data Involved (CIA
                  Impact):</label>
                <select v-model="createSupplier.assessment_cia_impact"
                  class="mt-1 block w-full p-2 border border-gray-300 rounded">
                  <option value="confidentiality">Confidentiality</option>
                  <option value="integrity">Integrity</option>
                  <option value="availability">Availability</option>
                </select>
              </div>

              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700">Threat:</label>
                <input type="text" v-model="createSupplier.assessment_threat"
                  class="mt-1 block w-full p-2 border border-gray-300 rounded" />
              </div>

              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700">Matrix to be Used for Risk Assessment:</label>
                <select v-model="createSupplier.assessment_risk_assessment_matrix" @change="updateLikelihoodImpact"
                  class="mt-1 block w-full p-2 border border-gray-300 rounded">
                  <option value="3x3">3x3</option>
                  <option value="5x5">5x5</option>
                </select>
              </div>

              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700">Likelihood:</label>
                <select v-model="createSupplier.assessment_likelihood"
                  class="mt-1 block w-full p-2 border border-gray-300 rounded">
                  <option v-for="option in likelihoodOptions" :key="option.value" :value="option.value">
                    {{ option.text }}
                  </option>
                </select>
              </div>

              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700">Impact:</label>
                <select v-model="createSupplier.assessment_impact"
                  class="mt-1 block w-full p-2 border border-gray-300 rounded">
                  <option v-for="option in impactOptions" :key="option.value" :value="option.value">
                    {{ option.text }}
                  </option>
                </select>
              </div>

              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700">Inherent Risk Level/Rating:</label>
                <input type="text" :value="calculateRiskLevel()" readonly
                  class="mt-1 block w-full p-2 border border-gray-300 rounded bg-gray-100" />
              </div>

              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700">Risk Assessment Completed:</label>
                <select v-model="createSupplier.assessment_risk_completed"
                  class="mt-1 block w-full p-2 border border-gray-300 rounded">
                  <option v-for="boolean in booleanSelect" :key="boolean.value" :value="boolean.value">
                    {{ boolean.text }}
                  </option>
                </select>
              </div>

              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700">Supplier Assessment Required:</label>
                <select v-model="createSupplier.supplier_assessment_required"
                  class="mt-1 block w-full p-2 border border-gray-300 rounded">
                  <option v-for="boolean in booleanSelect" :key="boolean.value" :value="boolean.value">
                    {{ boolean.text }}
                  </option>
                </select>
              </div>

              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700">Supplier Assessment Due Date:</label>
                <input type="date" v-model="createSupplier.assessment_due_date"
                  class="mt-1 block w-full p-2 border border-gray-300 rounded" />
              </div>

              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700">Supplier Assessment Status:</label>
                <select v-model="createSupplier.assessment_status"
                  class="mt-1 block w-full p-2 border border-gray-300 rounded">
                  <option value="not-due">Not Due</option>
                  <option value="not-started">Not Yet Started</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700">Supplier Assessment Reviewer Person:</label>
                <input type="text" v-model="createSupplier.assessment_reviewer_person"
                  class="mt-1 block w-full p-2 border border-gray-300 rounded" />
              </div>

              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700">Supplier Agreement:</label>
                <select v-model="createSupplier.supplier_assessment_agreement"
                  class="mt-1 block w-full p-2 border border-gray-300 rounded">
                  <option v-for="boolean in booleanSelect" :key="boolean.value" :value="boolean.value">
                    {{ boolean.text }}
                  </option>
                </select>
                <input v-if="createSupplier.supplier_assessment_agreement == 1" type="file" @change="handleFileUpload"
                  class="mt-1 block w-full p-2 border border-gray-300 rounded" />
              </div>

              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700">Supplier Approval Status:</label>
                <select v-model="createSupplier.supplier_approval_status"
                  class="mt-1 block w-full p-2 border border-gray-300 rounded">
                  <option value="draft">Draft</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700">Date Entered:</label>
                <input type="date" v-model="createSupplier.supplier_date_entered"
                  class="mt-1 block w-full p-2 border border-gray-300 rounded" />
              </div>

              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700">Decision Date:</label>
                <input type="date" v-model="createSupplier.supplier_decision_date"
                  class="mt-1 block w-full p-2 border border-gray-300 rounded" />
              </div>
            </div>
          </div>
          <div>
            <button type="submit" class="w-full mt-4 py-2 rounded button-style">
              Submit
            </button>
            <button v-on:click="closeModals()" class="w-full mt-4 py-2 rounded cancel-button-style">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
    <SupplierList :Update="editSupplier" :Delete="deleteSupplier" />
  </div>
</template>

<script>
import http from "@/helpers/http";
import { toast } from "vue3-toastify";

import TableComponent from "@/components/reuseable/TableComponent.vue";
import ImageButton from "@/components/reuseable/ImageButton.vue";
import ExcelUpload from "@/components/reuseable/ExcelUpload.vue";
import SupplierList from "./supplier-list.vue";

export default {
  name: "SupplierComponent",
  components: {
    ExcelUpload,
    TableComponent,
    ImageButton,
    SupplierList,
  },
  data() {
    return {
      isImportModalVisible: false,
      excelData: null,
      fileUploaded: false,
      showModal: false,
      searchQuery: "",
      updateData: false,
      supplierList: [],
      selectedSupplierId: null,
      ImportFileHeaders: [
        "Supplier Name",
        "Supplier Trading As",
        "ABN No",
        "CAN No",
        "Website",
        "BSB",
        "Bank Account No",
        "Bank Account Name",
        "GLocal",
        "Supplier Type",
        "Address",
        "Country",
        "State",
        "SubUrb",
        "Postal Code",
        "Contact Person Name",
        "Contact Person Number",
        "Contact Person Email",
        "Support Person Name",
        "Support Person Number",
        "Support Person Email",
        "Payment Term",
        "Notes",
        "Supplier Category",
        "Terms For Use",
        "Ongoing Management",
        "Exit Terms",
        "Supplier Purpose",
        "Service Provider",
        "Data Shared",
        "Department Managing",
        "Owner",
        "Is SLA",
        "SLA Details",
        "Credit Limit",
        "Iso 27001",
        "ISO 9001",
        "ISO 14001",
        "ISO 45001",
        "Modern Slavery Act",
        "Modern Slavery Statement Date",
        "Certification",
        "Other Certification Exists",
        "Annual Budget",
        "Contract Commencement Date",
        "Contract End Date",
        "CIA Impact",
        "Threat",
        "Matrix",
        "Likelihood",
        "Impact",
        "Inherent Risk Level",
        "Risk Assessment Completed",
        "Risk Assessment Required",
        "Assessment Due Date",
        "Assessment Status",
        "Assessment Reviewer Person",
        "Supplier Agreement",
        "Approval Status",
        "Date Entered",
        "Decision Date",
      ],
      importData: null,
      createSupplier: {
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
        "supplier_sla_applicable": "",
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
        "supplier_decision_date": "",
      },

      likelihoodOptions: [],
      booleanSelect: [
        { value: "1", text: "YES" },
        { value: "0", text: "NO" },
      ],
      impactOptions: [],
    };
  },
  methods: {
    handleExcelData(data) {
      this.excelData = data;
      console.log(data);
      this.importData = data;
      this.fileUploaded = true;
      this.isImportModalVisible = true;
    },
    addNewSupplier() {
      (this.showModal = true), this.resetData();
    },
    closeModals() {
      this.resetData();
      this.showModal = false;
    },
    handleCancelImport() {
      this.isImportModalVisible = false;
    },
    handleSubmitImport() {
      console.log(this.excelData);
      const mapped = this.excelData.map((curr) => ({
        supplier_id: curr["Supplier ID"],
        supplier_name: curr["Supplier Name"],
        trading_as: curr["Supplier Trading As"],
        abn_no: curr["ABN No"],
        acn_no: curr["CAN No"],
        website: curr["Website"],
        bsb: curr["BSB"],
        bank_acc_no: curr["Bank Account No"],
        bank_acc_name: curr["Bank Account Name"],
        glocal: curr["GLocal"],
        supplier_type: curr["Supplier Type"],
        address: curr["Address"],
        country: curr["Country"],
        state: curr["State"],
        suburb: curr["SubUrb"],
        postal_code: curr["Postal Code"],
        contact_person_name: curr["Contact Person Name"],
        contact_person_number: curr["Contact Person Number"],
        contact_person_email: curr["Contact Person Email"],
        support_person_name: curr["Support Person Name"],
        support_person_number: curr["Support Person Number"],
        support_person_email: curr["Support Person Email"],
        payment_terms: curr["Payment Term"],
        notes: curr["Notes"],
        supplier_category: curr["Supplier Category"],
        supplier_ongoing_management: curr["Ongoing Management"],
        exit_terms: curr["Exit Terms"],
        supplier_purpose: curr["Supplier Purpose"],
        service_provider: curr["Service Provider"],
        data_shared: curr["Data Shared"],
        department_managing: curr["Department Managing"],
        owner: curr["Owner"],
        is_sla: curr["Is SLA"],
        sla_details: curr["SLA Details"],
        credit_limit: curr["Credit Limit"],
        iso_27001: curr["Iso 27001"],
        iso_9001: curr["ISO 9001"],
        iso_14001: curr["ISO 14001"],
        iso_45001: curr["ISO 45001"],
        modern_slavery_act: curr["Modern Slavery Act"],
        modern_slavery_statement_date: curr["Modern Slavery Statement Date"],
        certification: curr["Certification"],
        other_certification: curr["Other Certification Exists"],
        annual_budget: curr["Annual Budget"],
        contract_commencement_date: curr["Contract Commencement Date"],
        contract_end_date: curr["Contract End Date"],
        cia_impact: curr["CIA Impact"],
        threat: curr["Threat"],
        matrix: curr["Matrix"],
        likelihood: curr["Likelihood"],
        impact: curr["Impact"],
        inherent_risk_level: curr["Inherent Risk Level"],
        risk_assessment_completed: curr["Risk Assessment Completed"],
        risk_assessment_required: curr["Risk Assessment Required"],
        assessment_due_date: curr["Assessment Due Date"],
        assessment_status: curr["Assessment Status"],
        assessment_reviewer_person: curr["Assessment Reviewer Person"],
        supplier_agreement: curr["Supplier Agreement"],
        approval_status: curr["Approval Status"],
        date_entered: curr["Date Entered"],
        decision_date: curr["Decision Date"],
      }));
      console.log(mapped);
      // Assuming you want to send this data to the server
      http
        .post("/api/create-bulk/supplier", mapped)
        .then((response) => {
          toast.success("Suppliers imported successfully");
          this.isImportModalVisible = false;
          console.log(response);
          this.fetchSupplier();
        })
        .catch((error) => {
          console.error(error);
          toast.error("Error importing suppliers");
        });
    },
    resetData() {
      (this.selectedSupplierId = null), (this.updateData = false);
      this.createSupplier = {
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
        "supplier_sla_applicable": "",
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
        "supplier_decision_date": "",
      };
    },
    async handleSubmit() {
      // Submit logic here
      console.log("Form submitted:", this.createSupplier);
      this.createSupplier.supplier_credit_limit = String(this.createSupplier.supplier_credit_limit)

      this.createSupplier.estimated_annual_budget = String(this.createSupplier.estimated_annual_budget)

      this.createSupplier.assessment_likelihood = String(this.createSupplier.assessment_likelihood)
      this.createSupplier.assessment_impact = String(this.createSupplier.assessment_impact)

      const payload = {
        ...this.createSupplier
      }

      try {
        if (this.updateData) {
          delete payload.id
          delete payload.documentId
          delete payload.createdAt
          delete payload.updatedAt

          await http.put(`api/suppliers/${this.selectedSupplierId}`, {
            data: payload,
          });
          toast.success("Supplier Details Updated");
        } else {
          await http.post("api/suppliers", { data: payload });
          toast.success("New Supplier Added");
        }
        this.fetchSupplier();
      } catch (error) {
        console.log(error);
        toast.error(
          "Error Adding Supplier:" +
          toast.error(error.response.data.error.message),
        );
      }
    },
    async editSupplier(supplierData) {
      this.showModal = true;
      this.updateData = true;
      this.selectedSupplierId = supplierData.id;
      const supplier = supplierData;
      this.createSupplier = {
        ...supplier
      }
    },
    handleFileUpload(event) {
      // Handle file upload logic here
      console.log("File uploaded:", event.target.files);
    },
    checkSupplierType() {
      // Automatically populate SLA applicable based on supplier type
      if (
        this.createSupplier.supplier_type === "cloud" ||
        this.createSupplier.supplier_type === "managed"
      ) {
        this.createSupplier.supplier_sla_applicable = "yes";
      } else {
        this.createSupplier.supplier_sla_applicable = "no";
      }
      this.updateLikelihoodImpact();
    },
    updateLikelihoodImpact() {
      // Update options based on selected matrix
      if (this.createSupplier.assessment_risk_assessment_matrix === "3x3") {
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
      }
    },
    calculateRiskLevel() {
      const likelihoodValue = parseInt(
        this.createSupplier.assessment_likelihood,
      );
      const impactValue = parseInt(this.createSupplier.assessment_impact);
      const riskLevel = likelihoodValue + impactValue;
      console.log(likelihoodValue, impactValue, riskLevel);
      if (riskLevel <= 3) return "Low";
      else if (riskLevel <= 6) return "Medium";
      else if (riskLevel <= 9) return "High";
      return "Extreme";
    },
    async fetchSupplier() {
      try {
        const suppliers = await http.get("api/suppliers", "");
        console.log(suppliers);
        this.supplierList = suppliers.data;
      } catch (error) {
        toast.error("Error on Retrieving Suppliers");
      }
    },
    async deleteSupplier(id) {
      try {
        const suppliers = await http.delete(`api/suppliers/${id}`);
        console.log(suppliers);
        this.supplierList = suppliers.data;
        toast.success("Supplier Successfully Deleted");
        this.fetchSupplier();
      } catch (error) {
        toast.error(
          "Error Deleting Supplier:" +
          toast.error(error.response.data.error.message),
        );
      }
    },
  },
  created() {
    this.updateLikelihoodImpact();
    this.fetchSupplier();
  },
  computed: {
    filteredSuppliers() {
      try {
        if (!this.supplierList || !this.supplierList.data) {
          return [];
        }
        const query = this.searchQuery.toLowerCase();
        return this.supplierList.data.filter((supplier) => {
          let {
            supplier_name = "",
            supplier_purpose = "",
            country = "",
          } = supplier;

          if (supplier_name === null) {
            supplier_name = "";
          }
          if (supplier_purpose === null) {
            supplier_purpose = "";
          }
          if (country === null) {
            country = "";
          }
          return (
            supplier_name.toLowerCase().includes(query) ||
            supplier_purpose.toLowerCase().includes(query) ||
            country.toLowerCase().includes(query)
          );
        });
      } catch (error) {
        console.log(error);
        return [];
      }
    },
  },
};
</script>

<style scoped>
.supplier-component {
  max-width: 100%;
  width: 100%;
  text-align: start;
  overflow: hidden;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 5px;
  position: relative;
  width: 100%;
  height: 90%;
  max-width: 1000px;
}

.close {
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
  font-size: 20px;
}

.input-field {
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 5px;
  width: 100%;
}
</style>
