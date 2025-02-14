<template>
  <div class="container flex flex-col w-full h-full overflow-hidden gap-2">
    <HeaderButton title="Create Asset Category" :onClick="goBack" />

    <div class="w-full bg-white h-10 flex items-center">
      <ExcelUpload title="Import Risk Category" @file-read="handleExcelData" />
    </div>
    <form class="overflow-auto" @submit.prevent="submitAssetCategory">
      <!-- Form inputs for category and description -->
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
              {{ company.attributes.name }}
            </option>
          </select>
        </div>
        <div class="mb-4">
          <label class="block text-lg font-medium text-gray-700"
            >Category Type</label
          >
          <select
            v-model="categoryType"
            class="mt-1 block w-full p-2 border border-gray-300 rounded"
          >
            <option
              v-for="category in ['Sub Category', 'Main Category']"
              :key="category"
              :value="category"
            >
              {{ category }}
            </option>
          </select>
        </div>
        <div class="mb-4">
          <label class="block text-lg font-medium text-gray-700"
            >Information Asset Category</label
          >
          <input
            v-model="category"
            type="text"
            required
            class="mt-1 block w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div class="mb-4">
          <label class="block text-lg font-medium text-gray-700"
            >Description of Information asset category</label
          >
          <textarea
            v-model="description"
            rows="5"
            required
            class="mt-1 block w-full p-2 border border-gray-300 rounded text-lg"
          ></textarea>
        </div>
      </div>

      <!-- Display uploaded data when file is uploaded -->
      <div
        v-if="fileUploaded"
        class="grid gap-2 grid-cols-1 w-[100%] p-2 items-center justify-center mt-5"
      >
        <div
          v-for="(item, index) in excelData"
          :key="index"
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
                {{ company.attributes.name }}
              </option>
            </select>
          </div>
          <div class="mb-4">
            <label class="block text-lg font-medium text-gray-700"
              >Category Type</label
            >
            <select
              disabled
              v-model="item['Category Type']"
              class="mt-1 block w-full p-2 border border-gray-300 rounded"
            >
              <option
                v-for="category in ['Sub Category', 'Main Category']"
                :key="category"
                :value="category"
              >
                {{ category }}
              </option>
            </select>
          </div>
          <div class="mb-4">
            <label class="block text-lg font-medium text-gray-700"
              >Information Asset Category</label
            >
            <input
              readonly
              v-model="item['Asset Category']"
              type="text"
              required
              class="mt-1 block w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div class="mb-4">
            <label class="block text-lg font-medium text-gray-700"
              >Description of Information asset category</label
            >
            <textarea
              readonly
              v-model="item['Asset Description']"
              required
              class="mt-1 block w-full p-2 border border-gray-300 rounded text-lg text-wrap"
            ></textarea>
          </div>
        </div>
      </div>
      <button type="submit" class="w-full mt-4 button-style py-2 rounded">
        Submit
      </button>
    </form>
  </div>
</template>

<script>
import HeaderButton from "@/components/reuseable/HeaderButton.vue";
import http from "@/helpers/http";
import ExcelUpload from "@/components/reuseable/ExcelUpload.vue";
import { toast } from "vue3-toastify";
import query from "@/helpers/defaultQuery";

export default {
  components: {
    HeaderButton,
    ExcelUpload,
  },
  data() {
    return {
      category: "",
      description: "",
      categoryType: "",
      excelData: null,
      fileUploaded: false,
      companyList: null,
      selectedCompany: null,
    };
  },
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
      this.category = "";
      this.description = "";
      this.categoryType = "";
      this.excelData = null;
      this.fileUploaded = false;
    },
    async fetchCompany() {
      const res = await query.fetchCompany();
      console.log(res);
      if (res) {
        this.companyList = res.data;
      }
    },
    async submitAssetCategory() {
      if (!this.fileUploaded) {
        // Submit data from form fields
        try {
          const response = await http.post("/api/asset-categories", {
            data: {
              category: this.category,
              description: this.description,
              categoryType: this.categoryType,
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
          const categories = [];
          for (const item of this.excelData) {
            categories.push({
              category: item["Asset Category"],
              categoryType: item["Category Type"],
              description: item["Asset Description"],
              companies: [this.selectedCompany],
            });
          }
          console.log(categories);
          const response = await http.post(
            "/api/create-bulk/asset-categories",
            categories,
          );
          toast.success(response.data.message);
          this.reset();
        } catch (error) {
          toast.error(
            "Error Saving Excel Data: " + error.response?.data?.error?.message,
          );
        }
      }
    },
  },
  mounted() {
    this.fetchCompany();
  },
};
</script>

<style scoped>
.item {
  margin-bottom: 10px;
}
</style>
