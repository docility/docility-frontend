<template>
  <div class="container flex flex-col w-full h-full overflow-hidden">
    <HeaderButton title="Risk Registered" :onClick="goBack" />
    <!-- Custom Select Dropdown for controlling visibility with checkboxes -->
    <div class="mb-4 relative z-20">
      <RiskList :Update="editRisk" :Delete="deleteRisk" />
    </div>
  </div>
</template>

<script>
import http from "@/helpers/http";
import { toast } from "vue3-toastify";

import HeaderButton from "@/components/reuseable/HeaderButton.vue";
import RiskList from "./risk-list.vue";

export default {
  components: {
    HeaderButton,
    RiskList,
  },
  name: "registered-risk",
  data() {
    return {
      risks: [],
      headers: [], // This will hold all possible headers
      visibleHeaders: {}, // This will control the visibility of each column
      selectedHeaders: [], // This will store selected column headers
      isDropdownOpen: false, // Tracks the dropdown visibility
    };
  },
  computed: {
    // Dynamically filter the visible headers
    visibleHeaderKeys() {
      return this.headers.filter((header) => this.visibleHeaders[header]);
    },
  },
  methods: {
    goBack() {
      this.$router.back(-1);
    },
    async fetchRisks() {
      const risks = await http.get("/api/risks");
      this.risks = risks.data.data;

      // Dynamically extract headers from the first risk object
      if (this.risks.length > 0) {
        this.headers = Object.keys(this.risks[0].attributes);

        // Check if sessionStorage contains saved header visibility settings
        const storedVisibility = sessionStorage.getItem("headerVisibility");
        if (storedVisibility) {
          this.visibleHeaders = JSON.parse(storedVisibility);
        } else {
          // Set default selection for the first 6 headers
          this.selectedHeaders = this.headers.slice(0, 6);
          this.headers.forEach((header, index) => {
            this.visibleHeaders[header] = index < 6; // First 6 columns are visible by default
          });
        }
      }
    },
    async editRisk(id) {
      this.$router.push(`risk?id=${id}`);
    },
    async deleteRisk(id) {
      try {
        await http.delete(`api/risks/${id}`);
        toast.success("Supplier Successfully Deleted");
      } catch (error) {
        toast.error(
          "Error Deleting Supplier:" +
            toast.error(error.response.data.error.message),
        );
      }
    },
    toggleDropdown() {
      this.isDropdownOpen = !this.isDropdownOpen;
    },
    updateVisibilityFromSelection() {
      this.headers.forEach((header) => {
        this.visibleHeaders[header] = this.selectedHeaders.includes(header);
      });

      // Save visibility settings to sessionStorage
      sessionStorage.setItem(
        "headerVisibility",
        JSON.stringify(this.visibleHeaders),
      );
      console.log(sessionStorage.getItem("headerVisibility"));
    },
  },
  watch: {
    // Watch the selectedHeaders array and update visibility
    selectedHeaders() {
      this.updateVisibilityFromSelection();
    },
  },
  mounted() {
    console.log("mounted");
    this.fetchRisks();
  },
  beforeUnmount() {
    // This is where you can perform cleanup if needed
    console.log("Component is about to unmount");
  },
};
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
