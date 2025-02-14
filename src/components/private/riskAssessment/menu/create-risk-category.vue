<template>
  <div class="container flex flex-col w-full h-full overflow-hidden gap-2">
    <HeaderButton title="Create Risk Category" :onClick="goBack" />
    <div class="w-full bg-white h-10 flex items-center">
      <ExcelUpload title="Import Risk Category" @file-read="handleExcelData" />
    </div>

    <form class="overflow-auto" @submit.prevent="submitRiskCategory">
      <!-- Form inputs for category and description -->
      <div
        v-if="!fileUploaded"
        class="grid gap-2 grid-cols-1 w-[100%] p-2 items-center justify-center mt-5 bg-primary-text"
      >
        <div class="mb-4">
          <label class="block text-lg font-medium text-gray-700"
            >Category Type</label
          >
          <input
            v-model="categoryType"
            type="text"
            required
            class="mt-1 block w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div class="mb-4">
          <label class="block text-lg font-medium text-gray-700"
            >Risk category/domain</label
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
            >Description of risk category/domain</label
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
              >Risk Type</label
            >
            <input
              readonly
              v-model="item['Risk Type']"
              type="text"
              required
              class="mt-1 block w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div class="mb-4">
            <label class="block text-lg font-medium text-gray-700"
              >Risk category/domain</label
            >
            <input
              readonly
              v-model="item['Risk Category']"
              type="text"
              required
              class="mt-1 block w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div class="mb-4">
            <label class="block text-lg font-medium text-gray-700"
              >Description of risk category/domain</label
            >
            <textarea
              readonly
              v-model="item['Risk Description']"
              required
              class="mt-1 block w-full p-2 border border-gray-300 rounded text-lg text-wrap"
            ></textarea>
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
import ExcelUpload from "@/components/reuseable/ExcelUpload.vue";
import { toast } from "vue3-toastify";

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
    async submitRiskCategory() {
      if (!this.fileUploaded) {
        // Submit data from form fields
        try {
          const response = await http.post("/api/risk-categories", {
            data: {
              category_domain: this.category,
              description: this.description,
              categoryType: this.categoryType,
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
              category_domain: item["Risk Category"],
              categoryType: item["Risk Type"],
              description: item["Risk Description"],
            });
          }
          console.log(categories);
          const response = await http.post(
            "/api/create-bulk/risk-categories",
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
};
</script>

<style scoped>
.item {
  margin-bottom: 10px;
}
</style>
