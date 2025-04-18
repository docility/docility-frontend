<template>
  <div class="mx-auto p-4">
    <!-- Add Category Modal (Update) -->
    <AddCategoryModal
      v-if="showUpdateModal"
      @close="showUpdateModal = false"
      :existingCategory="selectedCategory"
      :callback="updateCategory"
    />

    <!-- Page Size and Search -->
    <div class="flex justify-between items-center mb-4">
      <div class="flex items-center space-x-2">
        <label for="pageSize" class="text-sm text-gray-600">Page Size:</label>
        <select
          id="pageSize"
          v-model="pageSize"
          @change="fetchCategories(1)"
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
          placeholder="Search for categories"
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

    <!-- Category Table -->
    <div
      class="overflow-x-auto max-h-[600px] overflow-y-auto bg-white shadow rounded-lg"
    >
      <table class="w-full text-left text-sm text-gray-700">
        <thead class="bg-blue-600 text-white text-xs uppercase">
          <tr>
            <th class="p-4">Actions</th>
            <th class="p-4">Id</th>
            <th class="p-4">Category</th>
            <th class="p-4">Category Type</th>
            <th class="p-4">Description</th> 
            <th class="p-4">Options</th> 
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="category in filteredCategories"
            :key="category.id"
            class="border-b hover:bg-gray-200 text-nowrap"
          >
            <td class="p-4 space-x-2">
              <button
                @click="updateCategoryAction(category)"
                class="px-3 py-1 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700 transition"
              >
                Edit
              </button>
              <button
                @click="deleteCategoryAction(category)"
               class="px-3 py-1 bg-red-600 text-white text-xs rounded-md hover:bg-red-700 transition"
              >
                Delete
              </button>
            </td>
            <td class="p-4">{{ category.id }}</td>
            <td class="p-4">{{ category.category }}</td> 
            <td class="p-4">{{ category.categoryType }}</td> 
            <td class="p-4">{{ category.description }}</td> 
            <td class="p-4">{{ category.options }}</td> 
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
import AddCategoryModal from "./create.vue";

export default {
  components: {
    AddCategoryModal,
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
        name: "Title",
        address: "Description",
      },
      categories: [],
      searchQuery: "",
      selectedCategory: null,
      showUpdateModal: false,
      currentPage: 1,
      pageSize: 10,
      totalPages: 1,
    };
  },
  mounted() {
    this.fetchCategories(this.currentPage || 1);
  },
  methods: {
    async fetchCategories(page) {
      this.currentPage = page
      try {
        const response = await http.get(
          `/api/information-asset-categories?pagination[page]=${page}&pagination[pageSize]=${this.pageSize}`,
        );
        this.categories = response.data.data;
        this.totalPages = response.data.meta.pagination.pageCount;
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    },
    updateCategoryAction(category) {
      console.log("update", category);
     
      this.Update(category);
    },
    deleteCategoryAction(category) {
      this.Delete(category); 
    },
    changePage(page) {
      if (page < 1 || page > this.totalPages) return;
      this.currentPage = page;
      this.fetchCategories(this.currentPage);
    },
  },
  computed: {
    filteredCategories() {
      return this.categories.filter((category) =>
        JSON.stringify(category)
          .toLowerCase()
          .includes(this.searchQuery.toLowerCase())
      );
    },
  },
};
</script>
