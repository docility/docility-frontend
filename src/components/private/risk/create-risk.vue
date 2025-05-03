<template>
  <div class="modal-overlay flex justify-center items-center fixed inset-0 bg-black bg-opacity-50 z-[99999]">
    <div
      v-if="loading"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100000]"
    >
      <div class="flex flex-col items-center">
        <span class="loader w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></span>
        <p class="text-white mt-4 text-lg font-semibold">Loading...</p>
      </div>
    </div>
    <div  v-else class="modal-content bg-white p-8 rounded-lg max-w-5xl w-full overflow-y-auto h-full shadow-lg">
      <h3 class="text-2xl font-bold mb-6 text-gray-800">
        {{ existingCompany ? "Update Risk" : "New Risk" }}
      </h3>
      <form @submit.prevent="submitForm" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Dynamic Form Fields -->
        <div v-for="field in formFields" :key="field.id" class="form-group flex flex-col">
          <label :for="field.id" class="block text-sm font-medium text-gray-700 mb-1">
            {{ field.label }}
            <span v-if="field.required" class="text-red-500">*</span>
          </label>
 
          <!-- Textarea -->
          <textarea v-if="field.type === 'textarea'" :id="field.id" v-model="newCompany[field.model]"
            :placeholder="field.placeholder" :required="field.required"
            class="form-input mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300 focus:outline-none"></textarea>

          <!-- Text Input -->
          <input v-else-if="field.type === 'text'" :id="field.id" v-model="newCompany[field.model]" :type="field.type"
            :placeholder="field.placeholder" :required="field.required" :readonly="field['read-only']"
            class="form-input mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300 focus:outline-none" />

          <!-- Date Input -->
          <input v-else-if="field.type === 'date'" :id="field.id" v-model="newCompany[field.model]" type="date"
            :placeholder="field.placeholder" :required="field.required"
            class="form-input mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300 focus:outline-none" />

          <!-- Select Dropdown -->
          <select v-else-if="field.type === 'select'" :id="field.id" v-model="newCompany[field.model]"
            :required="field.required"
            class="form-input mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300 focus:outline-none">
            <option v-for="option in field.options" :key="option.value" :value="option.value">
              {{ option.text }}
            </option>
          </select>

          <!-- Checkbox Group -->
          <div v-else-if="field.type === 'checkbox'" class="mt-2 space-y-2">
            <label v-for="option in field.options" :key="option.value" class="flex items-center space-x-2">
              <input type="checkbox" :value="option.value" v-model="newCompany[field.model]"
                class="form-checkbox h-4 w-4 text-blue-500" />
              <span>{{ option.text }}</span>
            </label>
          </div>



          <!-- Multiselect -->
          <Multiselect v-else-if="field.type === 'multi'" v-model="newCompany[field.model]" :options="field.options"
            :multiple="field['multiple-select']" :close-on-select="!field['multiple-select']" :clear-on-select="false"
            :preserve-search="true" placeholder="Select Options" label="label" track-by="value" class="w-full mt-1" />

            <div v-else-if="field.type === 'file'" class="flex flex-col w-full">
              <input
                :id="field.id"
                type="file"
                class="hidden"
                :accept="field.fileTypes || '*'"
                @change="handleFileUpload($event, field.model)"
              />
              <label
                :for="field.id"
                :class="[
                  'flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer',
                  uploadedFiles[field.model] ? 'bg-green-100 border-green-500' : 'bg-gray-50 border-gray-300 hover:bg-gray-100'
                ]"
              >
                <div class="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg
                    v-if="!loadingFiles[field.model]"
                    class="w-8 h-8 mb-4 text-gray-500"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 16"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                    />
                  </svg>
                  <div v-else class="flex items-center space-x-2">
                    <span class="loader w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></span>
                    <span class="text-sm text-gray-500">Uploading...</span>
                  </div>
                  <p class="mb-2 text-sm text-gray-500">
                    <span class="font-semibold">
                      {{ uploadedFiles[field.model]?.name ? "File Uploaded" : "Click to upload or drag and drop" }}
                    </span>
                  </p>
                  <p class="text-xs text-gray-500">
                    {{ uploadedFiles[field.model]?.name ? uploadedFiles[field.model]?.name  : field.fileTypes ? `Accepted: ${field.fileTypes}` : "All file types accepted" }}
                  </p>
                </div>
              </label>
            </div>
        </div>

        <!-- Form Actions -->
        <div class="modal-actions col-span-full flex justify-end mt-6 space-x-4">
          <button type="submit"
            class="btn bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md shadow-md transition duration-200">
            Save
          </button>
          <button type="button" @click="$emit('close')"
            class="btn bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-md shadow-md transition duration-200">
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { createPinia } from "pinia";
import { useCreateRiskField } from "@/stores/CreateRiskFields";

const pinia = createPinia();
const createRiskFields = useCreateRiskField(pinia);
import http from "@/helpers/http";
import Multiselect from 'vue-multiselect';
import { toast } from "vue3-toastify";

export default {
  components: {
    Multiselect
  },
  props: {
    existingCompany: {
      type: Object,
      default: null,
    },
    callback: {
      type: Function,
      default: () => { },
    },
  },
  data() {
    return {
      loading: false, 
      loadingFiles: {}, 
      uploadedFiles: {},
      topics: [], // Initially empty, will be filled after fetch
      newCompany: {},
      controlCategoryList: [],
      formFields: createRiskFields.fields,
    };
  },
  watch: {
    existingCompany: {
      immediate: true,
      handler(newVal) {
        this.newCompany = this.initializeCompanyData(newVal);
      },
    },
    "newCompany.matrix": {
      immediate: true,
      handler(newValue) {
        this.updateLikelihoodImpact(newValue);
      },
    },
    "newCompany.likelihood": {
      immediate: true,
      handler() {
        this.calculateRiskLevel();
      },
    },
    "newCompany.initialImpact": {
      immediate: true,
      handler() {
        this.calculateRiskLevel();
      },
    },
    "newCompany.residualLikelihood": {
      immediate: true,
      handler() {
        this.calculateResidualRiskLevel();
      },
    },
    "newCompany.residualImpact": {
      immediate: true,
      handler() {
        this.calculateResidualRiskLevel();
      },
    },
    "newCompany.riskControlDomain": {
      immediate: true,
      handler() {
        this.riskControlDomainMapped();
      },
    },
    "newCompany.controlDomain": {
      immediate: true,
      handler() {
        this.controlDomainMapped();
      },
    },
  },
  methods: {
    async handleFileUpload(event, model) {
      console.log("model", model);
      const file = event.target.files[0]; // Get the selected file
      if (!file) {
        alert("No file selected.");
        return;
      }

      const formData = new FormData();
      formData.append("files", file); // Append the file to the form data

      // Set loading state to true
      this.loadingFiles[model] = true;

      try {
        const response = await this.uploadFile(formData); // Call the upload API
        console.log("File uploaded successfully:", response.data);

        // Store the uploaded file details
        this.newCompany[model] = {
          name: file.name,
          url: response.data[0].url, 
          value: response.data[0].url
        };

        this.uploadedFiles[model] = {
          name: file.name,
          url: response.data[0].url, // Assuming the API returns the file URL
        };

        toast.success("Successfully uploaded a file");
      } catch (error) {
        toast.error("Error uploading file");
      } finally {
        // Reset loading state
        this.loadingFiles[model] = false;
      }
    },
    async uploadFile(formData) {
      // Replace the URL with your actual upload API endpoint
      const apiUrl = "/api/upload";
      return await http.post(apiUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
    async initializeCompanyData(company = null) {
  if (!company) {
    return {}; // Return an empty object if no company is provided
  }

  try {
    this.loading = true;
    const data = await this.fetchRisk(company.documentId);
    console.log("Fetched risk data:", data);

    // Parse JSON-stringified fields
    const parsedData = { ...data };
    const jsonFields = ["riskCategory", "informationAsset", "ciaImpact", "matrix", "riskAcceptable", "riskTreatment","controlDomain", "controlMapped", "riskControlMap", "currentControlEffective", "riskControlDomain", "treatmentPlanFile", "treatmentApprovalEvidenceFile", "residualRiskApprovalFile"]; // Replace with actual field names that are JSON-stringified

    jsonFields.forEach((field) => {
      if (parsedData[field] && typeof parsedData[field] === "string") {
        try {
          parsedData[field] = JSON.parse(parsedData[field]);
        } catch (error) {
          console.error(`Error parsing JSON for field ${field}:`, error);
        }
      }
    });
    this.loading = false;
    return parsedData;
  } catch (error) {
    console.error("Error initializing company data:", error);
    return {}; // Return an empty object on error
  }
},
    async fetchRisk(riskId) {
    try {
      const response = await http.get(
        `/api/risks/${riskId}`,
      );

      console.log("risk (after fetching):", response.data.data);

       return response.data.data
    } catch (error) {
      console.error("Error fetching suppliers:", error);
    }
  },
    submitForm() {
      // Convert all values in newCompany to strings
      // Convert all values in newCompany to strings
      Object.keys(this.newCompany).forEach((key) => {
        if (this.newCompany[key] !== null && this.newCompany[key] !== undefined) {
          // Check if the value is an object or array (JSON)
          if (typeof this.newCompany[key] === "object") {
            this.newCompany[key] = JSON.stringify(this.newCompany[key]); // Convert JSON to string
          } else {
            this.newCompany[key] = String(this.newCompany[key]); // Convert other types to string
          }
        }
      });

      console.log("Submitted Data:", this.newCompany);
      if (Object.values(this.newCompany).some((value) => value === "")) { 
        toast.info("Please fill in all required fields."); 
        return;
      }



      // Stringify options if necessary before submission
      // this.newCompany.options = JSON.stringify({
      //   // options: this.newCompany.options,
      // });

      this.newCompany.id = this.existingCompany?.id;

      console.log(this.existingCompany);

      this.callback({ ...this.newCompany });
      this.$emit("close");
    },
    async fetchCategoryDomain() {
      let categoryDomainData = [];
      try {
        const categories = await http.get("/api/risk-categories");
        if (categories?.data?.data.length > 0) {
          categories.data.data.forEach((item) => {
            categoryDomainData.push({
              label: `${item.category_domain}`, // Display text
              value: item.category_domain, // Actual value
            });
          });
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }

      // Update the options for the 'riskCategory' field
      const riskCategoryField = this.formFields.find(
        (field) => field.id === "riskCategory"
      );
      if (riskCategoryField) {
        riskCategoryField.options = categoryDomainData;
      }
    },
    async fetchInformationAsset() {
      let informationAsset = [];
      try {
        const categories = await http.get("/api/information-asset-categories");
        if (categories?.data?.data.length > 0) {
          categories.data.data.forEach((item) => {
            informationAsset.push({
              label: `${item.category}`, // Display text
              value: item.category, // Actual value
            });
          });
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }

      // Update the options for the 'riskCategory' field
      const riskCategoryField = this.formFields.find(
        (field) => field.id === "informationAsset"
      );
      if (riskCategoryField) {
        riskCategoryField.options = informationAsset;
      }
    },
    updateLikelihoodImpact(data) {
      // Update options based on selected matrix
      const likelihood = this.formFields.find(
        (field) => field.id === "likelihood"
      );
      const residualLikelihood = this.formFields.find(
        (field) => field.id === "residualLikelihood"
      );
      const initialImpact = this.formFields.find(
        (field) => field.id === "initialImpact"
      );
      const residualImpact = this.formFields.find(
        (field) => field.id === "residualImpact"
      );

      console.log("likelihood", data?.value);
      console.log("residualLikelihood", residualLikelihood);
      if (data?.value === "3x3") {
        likelihood.options = [
          { value: "Almost Certain", text: "Almost Certain" },
          { value: "Possible", text: "Possible" },
          { value: "Rare", text: "Rare" },
        ];
        initialImpact.options = [
          { value: "Significant", text: "Significant" },
          { value: "Moderate", text: "Moderate" },
          { value: "Insignificant", text: "Insignificant" },
        ];
        residualLikelihood.options = [
          { value: "Almost Certain", text: "Almost Certain" },
          { value: "Possible", text: "Possible" },
          { value: "Rare", text: "Rare" },
        ];
        residualImpact.options = [
          { value: "Significant", text: "Significant" },
          { value: "Moderate", text: "Moderate" },
          { value: "Insignificant", text: "Insignificant" },
        ];
      } else if (data?.value === "5x5") {
        likelihood.options = [
          { value: "Almost Certain", text: "Almost Certain" },
          { value: "Likely", text: "Likely" },
          { value: "Possible", text: "Possible" },
          { value: "Unlikely", text: "Unlikely" },
          { value: "Rare", text: "Rare" },
        ];
        initialImpact.options = [
          { value: "Severe", text: "Severe" },
          { value: "Major", text: "Major" },
          { value: "Moderate", text: "Moderate" },
          { value: "Minor", text: "Minor" },
          { value: "Insignificant", text: "Insignificant" },
        ];
        residualLikelihood.options = [
          { value: "Almost Certain", text: "Almost Certain" },
          { value: "Likely", text: "Likely" },
          { value: "Possible", text: "Possible" },
          { value: "Unlikely", text: "Unlikely" },
          { value: "Rare", text: "Rare" },
        ];
        residualImpact.options = [
          { value: "Severe", text: "Severe" },
          { value: "Major", text: "Major" },
          { value: "Moderate", text: "Moderate" },
          { value: "Minor", text: "Minor" },
          { value: "Insignificant", text: "Insignificant" },
        ];
      }
    },
    calculateRiskLevel() {
      // Define mappings for likelihood and impact based on the selected matrix
      const likelihoodMapping3x3 = {
        "Almost Certain": 3,
        Possible: 2,
        Rare: 1,
      };

      const impactMapping3x3 = {
        Significant: 3,
        Moderate: 2,
        Insignificant: 1,
      };

      const likelihoodMapping5x5 = {
        "Almost Certain": 5,
        Likely: 4,
        Possible: 3,
        Unlikely: 2,
        Rare: 1,
      };

      const impactMapping5x5 = {
        Severe: 5,
        Major: 4,
        Moderate: 3,
        Minor: 2,
        Insignificant: 1,
      };

      // Determine the current matrix
      const matrix = this.newCompany.matrix?.value || this.newCompany.matrix;

      // Select the appropriate mappings based on the matrix
      const likelihoodMapping =
        matrix === "3x3" ? likelihoodMapping3x3 : likelihoodMapping5x5;
      const impactMapping =
        matrix === "3x3" ? impactMapping3x3 : impactMapping5x5;

      // Get the numeric values for likelihood and initialImpact
      const likelihoodValue = likelihoodMapping[this.newCompany.likelihood];
      const impactValue = impactMapping[this.newCompany.initialImpact];

      // Validate the values
      if (likelihoodValue === 0 || impactValue === 0) {
        this.newCompany.riskLevel = ""; // Clear the risk level if inputs are invalid
        return;
      }

      // Calculate the risk level
      const riskLevel = likelihoodValue * impactValue;
      console.log("riskLevel", riskLevel);
      console.log("matrix", matrix);
      // Determine the risk level based on the calculated value
      if (matrix === "3x3") {
        if (riskLevel <= 3) {
          this.newCompany.riskLevel = "Low";
        } else if (riskLevel <= 6) {
          this.newCompany.riskLevel = "Medium";
        } else {
          this.newCompany.riskLevel = "High";
        }
      } else if (matrix === "5x5") {
        if (riskLevel <= 4) {
          this.newCompany.riskLevel = "Low";
        } else if (riskLevel <= 9) {
          this.newCompany.riskLevel = "Medium";
        } else if (riskLevel <= 15) {
          this.newCompany.riskLevel = "High";
        } else {
          this.newCompany.riskLevel = "Extreme";
        }
      }

      console.log("riskLevel", this.newCompany.riskLevel);
    },
    calculateResidualRiskLevel() {
      // Define mappings for likelihood and impact based on the selected matrix
      const likelihoodMapping3x3 = {
        "Almost Certain": 3,
        Possible: 2,
        Rare: 1,
      };

      const impactMapping3x3 = {
        Significant: 3,
        Moderate: 2,
        Insignificant: 1,
      };

      const likelihoodMapping5x5 = {
        "Almost Certain": 5,
        Likely: 4,
        Possible: 3,
        Unlikely: 2,
        Rare: 1,
      };

      const impactMapping5x5 = {
        Severe: 5,
        Major: 4,
        Moderate: 3,
        Minor: 2,
        Insignificant: 1,
      };

      // Determine the current matrix
      const matrix = this.newCompany.matrix?.value || this.newCompany.matrix;

      // Select the appropriate mappings based on the matrix
      const likelihoodMapping =
        matrix === "3x3" ? likelihoodMapping3x3 : likelihoodMapping5x5;
      const impactMapping =
        matrix === "3x3" ? impactMapping3x3 : impactMapping5x5;

      // Get the numeric values for likelihood and initialImpact
      const likelihoodValue = likelihoodMapping[this.newCompany.residualLikelihood];
      const impactValue = impactMapping[this.newCompany.residualImpact];

      // Validate the values
      if (likelihoodValue === 0 || impactValue === 0) {
        this.newCompany.residualRiskLevel = ""; // Clear the risk level if inputs are invalid
        return;
      }

      // Calculate the risk level
      const riskLevel = likelihoodValue * impactValue;
      console.log("riskLevel", riskLevel);
      console.log("matrix", matrix);
      // Determine the risk level based on the calculated value
      if (matrix === "3x3") {
        if (riskLevel <= 3) {
          this.newCompany.residualRiskLevel = "Low";
        } else if (riskLevel <= 6) {
          this.newCompany.residualRiskLevel = "Medium";
        } else {
          this.newCompany.residualRiskLevel = "High";
        }
      } else if (matrix === "5x5") {
        if (riskLevel <= 4) {
          this.newCompany.residualRiskLevel = "Low";
        } else if (riskLevel <= 9) {
          this.newCompany.residualRiskLevel = "Medium";
        } else if (riskLevel <= 15) {
          this.newCompany.residualRiskLevel = "High";
        } else {
          this.newCompany.residualRiskLevel = "Extreme";
        }
      }

      console.log("riskLevel", this.newCompany.residualRiskLevel);
    },

    async fetchControlDomainList() {
      let categoryDomainData = [];
      try {
        const categories = await http.get("/api/control-domains");
        if (categories?.data?.data.length > 0) {
          categories.data.data.forEach((item) => {
            categoryDomainData.push({
              label: `${item.control_no}|${item.domain}`, // Display text
              value: `${item.control_no}|${item.domain}`, // Actual value
            });
          });
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }

      // Update the options for the 'riskCategory' field
      const riskControlDomain = this.formFields.find(
        (field) => field.id === "riskControlDomain"
      );
      if (riskControlDomain) {
        riskControlDomain.options = categoryDomainData;
      }

      const controlDomain = this.formFields.find(
        (field) => field.id === "controlDomain"
      );
      if (controlDomain) {
        controlDomain.options = categoryDomainData;
      }
    },
    async riskControlDomainMapped() {
      try {
        let data = this.newCompany?.riskControlDomain.map(item => {
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

        const controlMapped = this.formFields.find(
          (field) => field.id === "riskControlMap"
        );

        if (controlMapped) {
          controlMapped.options = data;
        }
      } catch (error) {
        console.error("Error in riskControlMapping:", error);
        return [];
      }

    },
    async controlDomainMapped() {
      try {
        let data = this.newCompany?.controlDomain.map(item => {
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

        const controlMapped = this.formFields.find(
          (field) => field.id === "controlMapped"
        );

        if (controlMapped) {
          controlMapped.options = data;
        }
      } catch (error) {
        console.error("Error in riskControlMapping:", error);
        return [];
      }

    },
    async fetchControl() {
      try {
        const controlList = await http.get("/api/control-assessments");
        console.log(controlList);
        this.controlCategoryList = controlList.data.data;
      } catch (error) {
        console.error("Error fetching control assessments:", error);
      }
    },
    async fetchRiskTreatment() {
      let data = [];
      try {
        const result = await http.get("/api/risk-treatments");
        if (result?.data?.data.length > 0) {
          result.data.data.forEach((item) => {
            data.push({
              label: `${item.treatmentOption}`, // Display text
              value: item.documentId, // Actual value
            });
          });
        }

        const controlMapped = this.formFields.find(
          (field) => field.id === "riskTreatment"
        );

        if (controlMapped) {
          controlMapped.options = data;
        }
      } catch (error) {
        console.error("Error fetching risk treatments:", error);
      }
    },
  },
  mounted() {
    // Fetch topics when the component is mounted 
    this.fetchCategoryDomain();
    this.fetchInformationAsset();
    this.fetchControlDomainList();
    this.fetchControl();
    this.fetchRiskTreatment();

    // Initialize newCompany asynchronously
    if (this.existingCompany) {
      this.initializeCompanyData(this.existingCompany).then((data) => {
        this.newCompany = data;
      });
    }
  },
};
</script>

<style>
@import "vue-multiselect/dist/vue-multiselect.min.css";

/* Modal Overlay */
.modal-overlay {
  backdrop-filter: blur(4px);
}

/* Form Input Styling */
.form-input {
  padding: 0.5rem;
  font-size: 0.875rem;
  color: #333;
}

/* Button Styling */
.btn {
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease-in-out;
}
</style>