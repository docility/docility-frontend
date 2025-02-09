<template>
  <div class="flex h-screen bg-gray-100 flex-col md:flex-row">
    <!-- Sidebar -->
    <aside
      :class="[
        'bg-dark-background-primary text-white transition-transform duration-300',
        showSidebar ? 'translate-x-0' : '-translate-x-full',
        'fixed md:relative top-0 left-0 w-full md:w-40 h-auto md:h-full z-40 md:z-0',
      ]"
    >
      <div class="p-4">
        <img src="@/assets/logo.png" alt="School Logo" class="h-30 w-full" />
        <ul class="mt-6 space-y-2">
          <li class="hover:bg-secondary-alternate">
            <router-link
              to="/dashboard/home"
              :class="[
                'block px-4 py-2 rounded',
                isActive('/dashboard/home') ? 'active-button-style' : 'button-style',
              ]"
              class="text-lg"
            >
              Dashboard
            </router-link>
          </li>
          <li>
            <router-link
              to="/dashboard/supplier"
              :class="[
                'block px-4 py-2 rounded',
                isActive('/dashboard/supplier') ? 'active-button-style' : 'button-style',
              ]"
            >
              Supplier
            </router-link>
          </li>
          <li>
            <router-link
              to="/dashboard/risk-assessment"
              :class="[
                'block px-4 py-2 rounded',
                isActive('/dashboard/risk-assessment') ? 'active-button-style' : 'button-style',
              ]"
            >
              Risk Assessment
            </router-link>
          </li>
          <li>
            <router-link
              to="/dashboard/customer-management"
              :class="[
                'block px-4 py-2 rounded',
                isActive('/dashboard/customer-management') ?  'active-button-style' : 'button-style',
              ]"
            >
              Customer
            </router-link>
          </li>
          <li>
            <router-link
              to="/dashboard/company-management"
              :class="[
                'block px-4 py-2 rounded',
                isActive('/dashboard/company-management') ?  'active-button-style' : 'button-style',
              ]"
            >
              Company
            </router-link>
          </li>
          <li>
            <router-link
              to="/dashboard/questionnaire-management"
              :class="[
                'block px-4 py-2 rounded',
                isActive('/dashboard/questionnaire-management') ?  'active-button-style' : 'button-style',
              ]"
            >
              Questionnaire
            </router-link>
          </li>
        </ul>
        <button
          @click="showLogoutModal = true"
          class="fixed m-2 bottom-0 left-2 px-4 py-2 rounded button-style w-[80%] z-50 items-center justify-center flex gap-2"
        >
        <svg fill="#000000" height="24px" width="24px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 384.971 384.971" xml:space="preserve" transform="matrix(1, 0, 0, 1, 0, 0)" stroke="#000000" stroke-width="12.319072"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g id="Sign_Out"> <path d="M180.455,360.91H24.061V24.061h156.394c6.641,0,12.03-5.39,12.03-12.03s-5.39-12.03-12.03-12.03H12.03 C5.39,0.001,0,5.39,0,12.031V372.94c0,6.641,5.39,12.03,12.03,12.03h168.424c6.641,0,12.03-5.39,12.03-12.03 C192.485,366.299,187.095,360.91,180.455,360.91z"></path> <path d="M381.481,184.088l-83.009-84.2c-4.704-4.752-12.319-4.74-17.011,0c-4.704,4.74-4.704,12.439,0,17.179l62.558,63.46H96.279 c-6.641,0-12.03,5.438-12.03,12.151c0,6.713,5.39,12.151,12.03,12.151h247.74l-62.558,63.46c-4.704,4.752-4.704,12.439,0,17.179 c4.704,4.752,12.319,4.752,17.011,0l82.997-84.2C386.113,196.588,386.161,188.756,381.481,184.088z"></path> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> </g> </g></svg>
          Logout
        </button>
      </div>
    </aside>

    <!-- Toggle Sidebar Button (Visible on mobile only) -->
    <button
      @click="toggleSidebar"
      class="md:hidden fixed top-4 right-4 bg-primary text-white p-2 rounded-full z-50"
    >
      ☰
    </button>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col h-full overflow-auto mt-20 md:mt-0">
      <bread-crumb />
      <div class="flex-1 flex justify-center p-2 overflow-x-auto bg-slate-100">
        <div class="w-full min-w-full h-full min-h-[100%]">
          <router-view></router-view>
        </div>
      </div>
    </main>

    <!-- Modal -->
    <div
      v-if="showLogoutModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
    >
      <div class="bg-white p-6 rounded-lg shadow-lg">
        <h3 class="text-lg font-semibold mb-4">Do you want to logout?</h3>
        <div class="flex justify-end space-x-4">
          <button
            @click="handleLogout"
            class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Yes
          </button>
          <button
            @click="showLogoutModal = false"
            class="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BreadCrumb from './reuseable/BreadCrumb.vue'; 
import { toast } from "vue3-toastify";

export default {
  components: { BreadCrumb },
  name: 'DashBoard',
  data() {
    return {
      role: '',
      showSidebar: true,
      showLogoutModal: false,
    };
  },
  methods: {
    toggleSidebar() {
      this.showSidebar = !this.showSidebar;
    },
    isActive(route) {
      return this.$route.path.includes(route);
    },
    handleLogout() {
      sessionStorage.removeItem('jwt');
      sessionStorage.removeItem('profile');
      sessionStorage.removeItem('role');
      sessionStorage.removeItem('headerVisibility');
      
      this.$router.push('/signin');
    },
    handleMessageSocket(data) { 
      toast[data.type](`${data.message}`);
    },
  },
  mounted() { 
    this.role = sessionStorage.getItem('role');
  },
};
</script>

<style scoped>
  .logo {
    margin-left: 0;
    padding: 0;
    height: 55px;
    width: 203px;
    transition: all 300ms linear 0s;
  }
</style>
