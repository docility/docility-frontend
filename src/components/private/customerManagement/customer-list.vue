<template>
  <div class="container mx-auto p-4">
    <AddCustomerModal
      v-if="showUpdateModal"
      @close="showUpdateModal = false"
      :existingCustomer="selectedCustomer"
      :callback="updateCustomer()"
    />
    <!-- Search and Filter Section -->
    <div class="flex flex-col md:flex-row gap-4 mb-4">
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Search by Name or ID"
        class="form-control w-full md:w-1/3"
      />
      <select v-model="selectedCategory" class="form-control w-full md:w-1/4">
        <option value="">All Categories</option>
        <option value="Key">Key</option>
        <option value="Regular">Regular</option>
        <option value="One-off">One-off</option>
      </select>
      <button @click="filterCustomers" class="btn btn-primary">
        Filter
      </button>
    </div>

    <!-- Customer Table -->
    <div class="overflow-x-auto">
      <table class="min-w-full text-sm text-left text-gray-700">
        <thead class="text-xs uppercase bg-gray-200 text-gray-600">
          <tr>
            <th scope="col" class="p-4">Actions</th>
            <th scope="col" class="p-4">Customer Name</th>
            <th scope="col" class="p-4">Trading As</th>
            <th scope="col" class="p-4">ABN</th>
            <th scope="col" class="p-4">ACN</th>
            <th scope="col" class="p-4">Website</th>
            <th scope="col" class="p-4">Customer Address</th>
            <th scope="col" class="p-4">Country</th>
            <th scope="col" class="p-4">Contact Person</th>
            <th scope="col" class="p-4">Email</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="customer in filteredCustomers"
            :key="customer.id"
            class="bg-white border-b hover:bg-gray-100"
          >
            <td class="p-4 flex gap-2">
              <button
                @click="selectCustomer(customer)"
                class="text-blue-600 hover:underline"
              >
                Edit
              </button>
              <button
                @click="selectCustomer(customer)"
                class="text-red-600 hover:underline"
              >
                Delete
              </button>
            </td>
            <td class="p-4">{{ customer.attributes.name }}</td>
            <td class="p-4">{{ customer.attributes.trading_as }}</td>
            <td class="p-4">{{ customer.attributes.abn_no }}</td>
            <td class="p-4">{{ customer.attributes.acn_no }}</td>
            <td class="p-4">{{ customer.attributes.website }}</td>
            <td class="p-4">{{ customer.attributes.address }}</td>
            <td class="p-4">{{ customer.attributes.country }}</td>
            <td class="p-4">{{ customer.attributes.contact_person_name }}</td>
            <td class="p-4">{{ customer.attributes.email }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import http from "@/helpers/http";
// import { ref, computed, onMounted } from "vue";
import AddCustomerModal from "./create-customer.vue";

export default {
  components: {
    AddCustomerModal,
  },
  emits: ["view-customer"],
  data() {
    return {
      customers: [],
      searchQuery: "",
      selectedCategory: "",
      selectedCustomer: null,
      showUpdateModal: false
    };
  },
  mounted() {
    this.fetchCustomers();
  },
  methods: {
    async fetchCustomers() {
      try {
        const response = await http.get("/api/customer-managements");
        this.customers = response.data.data;
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    },

    filterCustomers() {
      console.log("Filters applied");
    },

    selectCustomer(customer) {
      this.selectedCustomer = customer;
      this.showUpdateModal = true;
    },

    updateCustomer(customer) {
      console.log("Editing customer:", customer);
      
    }
  },
  computed: {
    filteredCustomers() {
      return this.customers.filter((customer) => {
        const matchesQuery =
          this.searchQuery === "" ||
          customer?.attributes.name
            .toLowerCase()
            .includes(this.searchQuery.toLowerCase());
        const matchesCategory =
          this.selectedCategory === "" ||
          customer.attributes.customer_category === this.selectedCategory;
        return matchesQuery && matchesCategory;
      });
    },
  },
};
</script>

<style scoped>
.container {
  max-width: "100%";
}

.table {
  border-collapse: collapse;
}

.form-control {
  border: 1px solid #ccc;
  padding: 0.5rem;
  border-radius: 0.25rem;
}

.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
}

.btn-primary {
  background-color: #007bff;
  color: #fff;
}

.btn-primary:hover {
  background-color: #0056b3;
}
</style>
