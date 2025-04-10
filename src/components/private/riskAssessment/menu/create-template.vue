<template>
  <div class="container flex flex-col w-full h-full overflow-hidden gap-2">
    <HeaderButton title="Create Risk Treatment" :onClick="goBack" />
    <div class="w-full bg-white h-10 flex items-center">
      <ExcelUpload title="Import Risk Category" @file-read="handleExcelData" />
    </div>
    <form class="overflow-auto" @submit="submitInformationAssetCategory">
      <div
        v-if="!fileUploaded"
        class="grid gap-2 grid-cols-1 w-[100%] p-2 items-center justify-center mt-5 bg-primary-text"
      >
        <div class="mb-4">
          <label class="block text-lg font-medium text-gray-700"
            >Company
          </label>
          <select
            v-model="selectedCompany"
            class="mt-1 block w-full p-2 border border-gray-300 rounded"
          >
            <option
              v-for="company in companyList"
              :key="company.id"
              :value="company.id"
            >
              {{ company.name }}
            </option>
          </select>
        </div>

        <div class="mb-4">
          <label class="block text-lg font-medium text-gray-700"
            >Risk treatment option
          </label>
          <input
            v-model="treatmentOption"
            type="text"
            required
            class="mt-1 block w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div class="mb-4">
          <label class="block text-lg font-medium text-gray-700"
            >Risk treatment description
          </label>
          <textarea
            v-model="description"
            rows="5"
            type="text"
            required
            class="mt-1 block w-full p-2 border border-gray-300 rounded text-lg"
          />
        </div>
        <div class="mb-4">
          <label class="block text-lg font-medium text-gray-700"
            >When To Use
          </label>
          <textarea
            v-model="whenToUse"
            rows="5"
            type="text"
            required
            class="mt-1 block w-full p-2 border border-gray-300 rounded text-lg"
          />
        </div>
      </div>

      <div
        v-if="fileUploaded"
        class="grid gap-2 grid-cols-1 w-[100%] p-2 items-center justify-center mt-5 bg-primary-text"
      >
        <div
          v-for="(item, index) in excelData"
          :key="index"
          class="grid gap-2 grid-cols-1 w-[100%] p-2 items-center justify-center mt-5 bg-primary-text"
        >
          <div class="mb-4">
            <label class="block text-lg font-medium text-gray-700"
              >Company</label
            >
            <input
              readonly
              v-model="item['Companies']"
              type="text"
              required
              class="mt-1 block w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div class="mb-4">
            <label class="block text-lg font-medium text-gray-700"
              >Risk treatment option
            </label>
            <input
              readonly
              v-model="item['Treatment Option']"
              type="text"
              required
              class="mt-1 block w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div class="mb-4">
            <label class="block text-lg font-medium text-gray-700"
              >Risk treatment description
            </label>
            <input
              readonly
              v-model="item['Description']"
              type="text"
              required
              class="mt-1 block w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div class="mb-4">
            <label class="block text-lg font-medium text-gray-700"
              >When To Use
            </label>
            <input
              readonly
              v-model="item['When To Use']"
              type="text"
              required
              class="mt-1 block w-full p-2 border border-gray-300 rounded"
            />
          </div>
        </div>
      </div>
      <button type="submit" class="w-full mt-4 py-2 rounded button-style">
        Submit
      </button>
    </form>
  </div>
</template>

<script>
import HeaderButton from "@/components/reuseable/HeaderButton.vue";
import http from "@/helpers/http";
import query from "@/helpers/defaultQuery";
import ExcelUpload from "@/components/reuseable/ExcelUpload.vue";
import { toast } from "vue3-toastify";

export default {
  components: {
    HeaderButton,
    ExcelUpload,
  },

  data() {
    return {
      treatmentOption: "",
      description: "",
      whenToUse: "",
      companyList: null,
      selectedCompany: null,
      excelData: null,
      fileUploaded: false,
    };
  },
  name: "create-risk-treatment",
  methods: {
    goBack() {
      this.$router.push("/dashboard/risk-assessment");
    },

    handleExcelData(data) {
      this.excelData = data;
      console.log(data);
      this.fileUploaded = true;
    },
    reset() {
      this.treatmentOption = "";
      this.description = "";
      this.whenToUse = "";
      this.selectedCompany = null;
      this.fileUploaded = false;
      this.excelData = null;
    },
    async fetchCompany() {
      const res = await query.fetchCompany();
      console.log(res);
      if (res) {
        this.companyList = res.data;
      }
    },
    async submitInformationAssetCategory(e) {
      e.preventDefault();

      if (!this.fileUploaded) {
        // Submit data from form fields
        try {
          const response = await http.post("/api/risk-treatments", {
            data: {
              treatmentOption: this.treatmentOption,
              description: this.description,
              whenToUse: this.whenToUse,
              companies: [this.selectedCompany],
            },
          });
          if (response.status === 200) {
            toast.success("New Category Successfully Saved");
          } else {
            toast.error("Error on Saving Category");
          }
        } catch (error) {
          toast.error(
            "Internal Server Error: " + error.response?.data?.error?.message,
          );
        } finally {
          this.reset();
        }
      } else {
        // Submit data from each item in excelData
        try {
          const treatment = [];
          for (const item of this.excelData) {
            treatment.push({
              company: item["Companies"],
              treatmentOption: item["Treatment Option"],
              whenToUse: item["When To Use"],
              description: item["Description"],
            });
          }
          console.log(treatment);
          const response = await http.post(
            "/api/create-bulk/risk-treatment",
            treatment,
          );
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
  },
  mounted() {
    this.fetchCompany();
  },
};
</script>
