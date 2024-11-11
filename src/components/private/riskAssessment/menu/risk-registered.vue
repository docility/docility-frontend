<template>
  <div class="container flex flex-col w-full h-full overflow-hidden">
    <HeaderButton title="Risk Registered" :onClick="goBack" />
    <!-- Custom Select Dropdown for controlling visibility with checkboxes -->
    <div class="mb-4 relative z-20 mt-2">
      <div class="flex items-center">
        <label for="column-select" class="text-sm font-medium">Configure View:  </label>
        <svg class="form-select block cursor-pointer ml-2" @click="toggleDropdown" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M19.4 15.4l1.6 1.6-2.3 2.3-1.6-1.6"></path>
          <path d="M4.6 8.6L3 7l2.3-2.3 1.6 1.6"></path>
          <path d="M17 12h3m-3 3h3m-3 3h3m-3-9h3m-9 9H5m0-3H2m3-3H2m3-3H2"></path>
        </svg>
      </div>

      <!-- Dropdown with checkboxes -->
      <div v-show="isDropdownOpen" class="absolute left-0 right-0 mt-1 bg-white shadow-lg border border-gray-300 rounded-md z-10">
        <div class="max-h-60 overflow-auto p-2">
          <label v-for="(header, index) in headers" :key="index" class="flex items-center mb-2">
            <input
              type="checkbox"
              v-model="visibleHeaders[header]"
              class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600"
            />
            <span class="ml-2">{{ header }}</span>
          </label>
        </div>
        <button v-on:click="isDropdownOpen = false" class="mt-2 h-10 self-center pl-2">Close</button>
      </div>
    </div>

    <div class="max-h-[700px] h-[90%] overflow-x-auto w-full" v-on:click="isDropdownOpen = false">
      <table class="min-w-full text-sm text-left rtl:text-right text-primary dark:text-gray-400">
        <thead class="text-xs uppercase text-text-primary">
          <tr class="sticky z-10">
            <th scope="col" class="p-4 bg-primary">
              <div class="flex items-center">
                <input
                  id="checkbox-all-search"
                  type="checkbox"
                  class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label for="checkbox-all-search" class="sr-only">checkbox</label>
              </div>
            </th>
            <!-- Loop through headers and display based on visibility -->
            <th v-for="header in visibleHeaderKeys" :key="header" class="px-6 py-3 bg-primary">
              {{ header }}
            </th>
            <!-- Sticky Actions column (Header) -->
            <th scope="col" class="sticky top-0 right-0 px-6 py-3 z-10 bg-primary border-l-2">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="risk in risks" :key="risk.id" class="bg-background border-b hover:bg-secondary-alternate text-text-primary">
            <td class="w-4 p-4">
              <div class="flex items-center">
                <input
                  :id="'checkbox-table-' + risk.id"
                  type="checkbox"
                  class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label :for="'checkbox-table-' + risk.id" class="sr-only">checkbox</label>
              </div>
            </td>
            <td v-for="header in visibleHeaderKeys" :key="header" class="px-6 py-4 text-nowrap">
              {{ risk.attributes?.[header] || '-' }}
            </td>
            <!-- Sticky Actions column (Body) -->
            <td class="px-6 py-4 gap-2 flex sticky top-0 right-0 bg-white z-10 border-l-2">
              <button @click="editRisk(risk.id)" class="text-blue-600 hover:underline">Edit</button>
              <button @click="deleteRisk(risk.id)" class="text-red-600 hover:underline">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import http from '@/helpers/http';

import HeaderButton from '@/components/reuseable/HeaderButton.vue';

export default {
  components: {
    HeaderButton
  },
  name: "registered-risk",
  data() {
    return {
      risks: [],
      headers: [],  // This will hold all possible headers
      visibleHeaders: {},  // This will control the visibility of each column
      selectedHeaders: [],  // This will store selected column headers
      isDropdownOpen: false,  // Tracks the dropdown visibility
    };
  },
  computed: {
    // Dynamically filter the visible headers
    visibleHeaderKeys() {
      return this.headers.filter(header => this.visibleHeaders[header]);
    }
  },
  methods: {
    goBack() {
      this.$router.back(-1)
    },
    async fetchRisks() {
      const risks = await http.get('/api/risks');
      this.risks = risks.data.data;

      // Dynamically extract headers from the first risk object
      if (this.risks.length > 0) {
        this.headers = Object.keys(this.risks[0].attributes);

        // Check if sessionStorage contains saved header visibility settings
        const storedVisibility = sessionStorage.getItem('headerVisibility');
        if (storedVisibility) {
          this.visibleHeaders = JSON.parse(storedVisibility);
        } else {
          // Set default selection for the first 6 headers
          this.selectedHeaders = this.headers.slice(0, 6);
          this.headers.forEach((header, index) => {
            this.visibleHeaders[header] = index < 6;  // First 6 columns are visible by default
          });
        }
      }
    },
    async editRisk(id) {
      this.$router.push(`risk?id=${id}`);
    },
    async deleteRisk(id) {
      console.log(id);
      // Add delete logic here
    },
    toggleDropdown() {
      this.isDropdownOpen = !this.isDropdownOpen;
    },
    updateVisibilityFromSelection() {
      this.headers.forEach(header => {
        this.visibleHeaders[header] = this.selectedHeaders.includes(header);
      });
     
      // Save visibility settings to sessionStorage
      sessionStorage.setItem('headerVisibility', JSON.stringify(this.visibleHeaders));
      console.log(sessionStorage.getItem('headerVisibility'))
    }
  },
  watch: {
    // Watch the selectedHeaders array and update visibility
    selectedHeaders() {
      this.updateVisibilityFromSelection();
    }
  },
  mounted() {
    console.log("mounted");
    this.fetchRisks();
  },
  beforeUnmount() {
    // This is where you can perform cleanup if needed
    console.log("Component is about to unmount");
  }
}
</script>

<style scoped>
.form-select {
  position: relative;
}

.form-select .sr-only {
  position: absolute;
  left: -9999px;
}

.form-select div {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.form-select span {
  display: block;
}

/* Sticky actions column styles */
.sticky {
  position: sticky;
}

.top-0 {
  top: 0;
  z-index: 10;
}

.right-0 {
  right: 0;
  z-index: 10;
}

.bg-white {
  background-color: white;
}

.z-10 {
  z-index: 10;
}

.max-h-[700px] {
  max-height: 700px;
}

.overflow-x-auto {
  overflow-x: auto;
}

.table-container {
  position: relative;
}
</style>
