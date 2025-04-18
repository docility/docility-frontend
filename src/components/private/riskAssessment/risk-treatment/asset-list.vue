<template>
  <div class="container mx-auto p-6 bg-white shadow-lg rounded-lg">
    <!-- Add Category Modal -->
    <AddCategoryModal
      v-if="showUpdateModal"
      @close="showUpdateModal = false"
      :existingCategory="selectedCategory"
      :callback="updateCategory"
    />

    <!-- Controls (Search & Page Size) -->
    <div class="flex justify-between items-center mb-6">
      <div class="flex items-center space-x-3">
        <label for="pageSize" class="text-sm font-medium text-gray-700">Page Size:</label>
        <select
          id="pageSize"
          v-model="pageSize"
          @change="fetchCategories(1)"
          class="border-gray-300 rounded-md text-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option v-for="size in [10, 20, 30, 50]" :key="size" :value="size">
            {{ size }}
          </option>
        </select>
      </div>

      <div class="relative w-80 gap-2">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Search categories..."
          class="w-full px-8 py-2 border border-gray-300 rounded-md text-sm shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
        <svg
          class="absolute left-3 top-2.5 w-5 h-5 text-gray-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    </div>

    <!-- Category Table -->
    <div class="overflow-x-auto bg-white shadow-md rounded-lg">
      <table class="w-full text-left text-sm text-gray-700">
        <thead class="bg-blue-600 text-white text-xs uppercase">
          <tr>
            <th class="p-4">Actions</th>
            <th class="p-4">ID</th>
            <th class="p-4">Treatment Option</th>
            <th class="p-4">When To Use</th>
            <th class="p-4">Description</th>
            <th class="p-4">Options</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="category in filteredCategories"
            :key="category.id"
            class="border-b hover:bg-gray-100 text-nowrap"
          >
            <td class="p-4 flex space-x-2">
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
            <td class="p-4">{{ category.treatmentOption }}</td>
            <td class="p-4">{{ category.whenToUse }}</td>
            <td class="p-4">{{ category.description }}</td>
            <td class="p-4">{{ category.options }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination Controls -->
    <div class="flex justify-between mt-6 items-center">
      <button
        @click="changePage(currentPage - 1)"
        :disabled="currentPage === 1"
        class="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 disabled:bg-gray-200 disabled:cursor-not-allowed transition"
      >
        Previous
      </button>
      <span class="text-sm font-medium">Page {{ currentPage }} of {{ totalPages }}</span>
      <button
        @click="changePage(currentPage + 1)"
        :disabled="currentPage === totalPages"
        class="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 disabled:bg-gray-200 disabled:cursor-not-allowed transition"
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
      this.currentPage = page;
      try {
        const response = await http.get(
          `/api/risk-treatments?pagination[page]=${page}&pagination[pageSize]=${this.pageSize}`
        );
        this.categories = response.data.data;
        this.totalPages = response.data.meta.pagination.pageCount;
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    },
    updateCategoryAction(category) {
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
        JSON.stringify(category).toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
  },
};
</script>

