<template>
  <div>
    <CustomerList
      @view-customer="showCustomerDetails"
      @add-customer="openAddCustomerModal"
    />
    <CustomerDetailsModal
      v-if="selectedCustomer"
      :customer="selectedCustomer"
      @close="selectedCustomer = null"
    />
    <AddCustomerModal
      v-if="showAddModal"
      @close="showAddModal = false"
      :onAddCustomer="addNewCustomer"
    />
    <button @click="openAddCustomerModal" class="btn btn-primary">
      Add New Customer
    </button>
  </div>
</template>

<script>
import CustomerList from "./customer-list.vue";
import CustomerDetailsModal from "./customer-details.vue";
import AddCustomerModal from "./create-customer.vue";

export default {
  components: {
    CustomerList,
    CustomerDetailsModal,
    AddCustomerModal,
  },
  data() {
    return {
      selectedCustomer: null,
      showAddModal: false,
      customers: [
        {
          customerId: "001",
          customerName: "John Doe",
          customerCategory: "Key",
          contactPerson: "John Doe",
          phone: "123456789",
          email: "john@example.com",
        },
        // Add more sample data here...
      ],
    };
  },
  methods: {
    showCustomerDetails(customer) {
      this.selectedCustomer = customer;
    },
    openAddCustomerModal() {
      this.showAddModal = true;
    },
    addNewCustomer(newCustomer) {
      this.customers.push({ ...newCustomer });
    },
  },
};
</script>
