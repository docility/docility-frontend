<template>
  <div class="flex h-screen bg-gray-100 flex-col md:flex-row">
    <!-- Sidebar -->
    <aside
      :class="[
        'bg-blue-900 text-white transition-all duration-300 shadow-lg',
        sidebarStore.showSidebar ? 'translate-x-0' : '-translate-x-full',
        'fixed md:relative top-0 left-0 w-64 md:w-56 h-full z-50 md:z-0',
      ]"
    >
      <div class="p-4">
        <div class="flex justify-center">
          <img src="@/assets/logo.png" alt="School Logo" class="h-16 w-auto" />
        </div>
        <ul class="mt-6 space-y-2">
          <li
            v-for="(item, index) in sidebarStore.dashBoardMenu"
            :key="item.name"
            class="relative"
            ref="menuRefs"
          >
            <div
              @click="handleMenuClick(index, item)"
              class="flex items-center justify-between px-4 py-2 rounded-md cursor-pointer transition-all duration-200 hover:bg-blue-700"
              :class="{ 'bg-blue-800': sidebarStore.activeMenu === item.name }"
            >
              <span class="text-lg font-medium">{{ item.name }}</span>
              <span v-if="item.subMenu.length">{{
                activeSubMenu === index ? "▲" : "▼"
              }}</span>
            </div>

            <!-- Sub-menu Tooltip -->
            <div
              v-if="activeSubMenu === index"
              class="absolute left-full top-0 ml-2 bg-white text-black shadow-lg rounded-md p-2 w-48 top-most"
            >
              <ul class="space-y-1">
                <li v-for="sub in item.subMenu" :key="sub.name">
                  <router-link
                    :to="sub.to"
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-300 rounded-md transition-all duration-200"
                    :class="{
                      'bg-gray-200': sidebarStore.activeMenu === sub.name,
                    }"
                    @click="setActiveMenu(sub.name)"
                  >
                    {{ sub.name }}
                  </router-link>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </div>

      <!-- Logout Button -->
      <div class="absolute bottom-4 left-4 right-4">
        <button
          @click="sidebarStore.showLogoutModal = true"
          class="w-full flex items-center justify-center px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition-all duration-200"
        >
          Logout 
        </button>
        <small class="text-center text-gray-400 mt-2">
          version 1.0.3
        </small>
      </div>
    </aside>
   
    <!-- Toggle Sidebar Button (Mobile) -->
    <button
      @click="sidebarStore.toggleSidebar"
      class="md:hidden fixed top-4 right-4 bg-blue-600 text-white p-3 rounded-full shadow-lg z-50"
    >
      ☰
    </button>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col h-full overflow-auto mt-20 md:mt-0">
      <bread-crumb />
      <div class="flex-1 flex justify-center p-4 overflow-x-auto bg-gray-50">
        <div class="w-full min-w-full h-full min-h-[100%]">
          <router-view></router-view>
        </div>
      </div>
    </main>
     
    <!-- Logout Modal -->
    <div
      v-if="sidebarStore.showLogoutModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
    >
      <div class="bg-white p-6 rounded-lg shadow-lg">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">
          Do you want to logout?
        </h3>
        <div class="flex justify-end space-x-4">
          <button
            @click="sidebarStore.handleLogout($router)"
            class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Yes
          </button>
          <button
            @click="sidebarStore.showLogoutModal = false"
            class="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useSidebarStore } from "@/stores/SideBar";
import { useRouter } from "vue-router";
import BreadCrumb from "./reuseable/BreadCrumb.vue";

const sidebarStore = useSidebarStore();
const router = useRouter();
const activeSubMenu = ref(null);
const menuRefs = ref([]);

// Handle menu click
const handleMenuClick = (index, item) => {
  if (item.subMenu.length) {
    activeSubMenu.value = activeSubMenu.value === index ? null : index;
  } else {
    sidebarStore.activeMenu = item.name; // Set active menu for main menu
    router.push(item.to); // Redirect if no submenu
  }
};

// Set active menu for submenus
const setActiveMenu = (menuName) => {
  sidebarStore.activeMenu = menuName; // Set active menu for submenus
  activeSubMenu.value = null; // Close the submenu
};

// Close submenu when clicking outside
const closeSubMenu = (event) => {
  if (!menuRefs.value.some((menu) => menu?.contains(event.target))) {
    activeSubMenu.value = null;
  }
};

// Attach event listeners
onMounted(() => {
  document.addEventListener("click", closeSubMenu);
});

// Remove event listeners
onUnmounted(() => {
  document.removeEventListener("click", closeSubMenu);
});
</script>

<style>
.top-most {
  z-index: 9999 !important;
}
</style>