<template>
  <div class="container flex flex-col w-full h-full overflow-hidden">
    <HeaderButton title="Risk Registered" :onClick="goBack" />
    <!-- Custom Select Dropdown for controlling visibility with checkboxes -->
    <div class="mb-4 relative z-20 mt-2">
      <div class="flex items-center">
        <label for="column-select" class="text-sm font-medium">Filter:  </label>
        <svg class="form-select block cursor-pointer ml-2"  width="24" height="24"  @click="toggleDropdown" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M21 6H19M21 12H16M21 18H16M7 20V13.5612C7 13.3532 7 13.2492 6.97958 13.1497C6.96147 13.0615 6.93151 12.9761 6.89052 12.8958C6.84431 12.8054 6.77934 12.7242 6.64939 12.5617L3.35061 8.43826C3.22066 8.27583 3.15569 8.19461 3.10948 8.10417C3.06849 8.02393 3.03853 7.93852 3.02042 7.85026C3 7.75078 3 7.64677 3 7.43875V5.6C3 5.03995 3 4.75992 3.10899 4.54601C3.20487 4.35785 3.35785 4.20487 3.54601 4.10899C3.75992 4 4.03995 4 4.6 4H13.4C13.9601 4 14.2401 4 14.454 4.10899C14.6422 4.20487 14.7951 4.35785 14.891 4.54601C15 4.75992 15 5.03995 15 5.6V7.43875C15 7.64677 15 7.75078 14.9796 7.85026C14.9615 7.93852 14.9315 8.02393 14.8905 8.10417C14.8443 8.19461 14.7793 8.27583 14.6494 8.43826L11.3506 12.5617C11.2207 12.7242 11.1557 12.8054 11.1095 12.8958C11.0685 12.9761 11.0385 13.0615 11.0204 13.1497C11 13.2492 11 13.3532 11 13.5612V17L7 20Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
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
          <tr class="sticky top-0 px-6 py-3 z-10 text-dark-text bg-dark-background-secondary">
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
            <th scope="col" class="">
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
            <td class="px-6 py-4 gap-2 flex  top-0 right-0 bg-white z-10 border-l-2">
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
