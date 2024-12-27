<template>
  <div>
    <h2>Customer List</h2>
    <!-- Search and Filter Section -->
    <div class="filters">
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Search by Name or ID"
        class="form-control"
      />
      <select v-model="selectedCategory" class="form-control">
        <option value="">All Categories</option>
        <option value="Key">Key</option>
        <option value="Regular">Regular</option>
        <option value="One-off">One-off</option>
      </select>
      <button @click="filterCustomers" class="btn btn-primary">Filter</button>
    </div>

    <!-- Customer Table -->
    <table class="min-w-full text-sm text-left rtl:text-right text-primary dark:text-gray-400">
      <thead class="text-xs uppercase text-text-primary">
        <tr class="sticky top-0 px-6 py-3 z-10 text-dark-text bg-dark-background-secondary text-nowrap"> 
          <th scope="col" class="p-4 bg-primary">Customer name </th>
          <th scope="col" class="p-4 bg-primary">Customer trading as </th>
          <th scope="col" class="p-4 bg-primary">Customer registration detail - ABN no</th>
          <th scope="col" class="p-4 bg-primary">Company registration detail - ACN no</th>
          <th scope="col" class="p-4 bg-primary">Website </th>
          <th scope="col" class="p-4 bg-primary">Local / Overseas customer </th>
          <th scope="col" class="p-4 bg-primary">Customer address </th>
          <th scope="col" class="p-4 bg-primary">Country </th>
          <th scope="col" class="p-4 bg-primary">State</th>
          <th scope="col" class="p-4 bg-primary">Suburb</th>
          <th scope="col" class="p-4 bg-primary">Postcode</th>
          <th scope="col" class="p-4 bg-primary">Contact person name</th>
          <th scope="col" class="p-4 bg-primary">Phone number </th>
          <th scope="col" class="p-4 bg-primary">Email</th>   
          <th scope="col" class="p-4 bg-primary">Alternate contact person name (if any) </th>
          <th scope="col" class="p-4 bg-primary">Phone number </th>
          <th scope="col" class="p-4 bg-primary">Email </th>
          <th scope="col" class="p-4 bg-primary">Customer category </th>
          <th scope="col" class="p-4 bg-primary">Customer type </th>
          <th scope="col" class="p-4 bg-primary">Data shared with customer </th>
          <th scope="col" class="p-4 bg-primary">Department managing customer </th>
          <th scope="col" class="p-4 bg-primary">Customer manager </th>
          <th scope="col" class="p-4 bg-primary">Contract Commencement date </th>
          <th scope="col" class="p-4 bg-primary">Contract end date </th>
          <th scope="col" class="p-4 bg-primary">Sensitivity of data involved (CIA Impact)</th>
          <th scope="col" class="p-4 bg-primary">Customer agreement </th>
          <th scope="col" class="p-4 bg-primary">Customer approval status </th>
          <th scope="col" class="p-4 bg-primary">Date entered </th> 
          <th scope="col" class="">
            Actions
          </th>
        </tr>
      </thead>
      <tbody class="text-nowrap">
        <tr v-for="customer in filteredCustomers" :key="customer.id"> 
          <td scope="col" class="p-4 bg-primary">{{ customer.attributes.name }}</td>
          <td scope="col" class="p-4 bg-primary">{{ customer.attributes.trading_as }}</td>
          <td scope="col" class="p-4 bg-primary">{{ customer.attributes.abn_no
          }}</td>
          <td scope="col" class="p-4 bg-primary">{{ customer.attributes.acn_no }}</td>
          <td scope="col" class="p-4 bg-primary">{{ customer.attributes.website }}</td>
          <td scope="col" class="p-4 bg-primary">{{ customer.attributes.glocal }}</td>
          <td scope="col" class="p-4 bg-primary">{{ customer.attributes.address }}</td>
          <td scope="col" class="p-4 bg-primary">{{ customer.attributes.country }}</td>
          <td scope="col" class="p-4 bg-primary">{{ customer.attributes.state }}</td>
          <td scope="col" class="p-4 bg-primary">{{ customer.attributes.suburb }}</td>
          <td scope="col" class="p-4 bg-primary">{{ customer.attributes.postal_code }}</td>
          <td scope="col" class="p-4 bg-primary">{{ customer.attributes.contact_person_name }}</td>
          <td scope="col" class="p-4 bg-primary">{{ customer.attributes.phone_no }}</td>
          <td scope="col" class="p-4 bg-primary">{{ customer.attributes.email }}</td>
          <td scope="col" class="p-4 bg-primary">{{ customer.attributes.alt_person_name
          }}</td>
          <td scope="col" class="p-4 bg-primary">{{ customer.attributes.alt_phone_no }}</td>
          <td scope="col" class="p-4 bg-primary">{{ customer.attributes.alt_email }}</td>
          <td scope="col" class="p-4 bg-primary">{{ customer.attributes.customer_category }}</td>
          <td scope="col" class="p-4 bg-primary">{{ customer.attributes.customer_type }}</td>
          <td scope="col" class="p-4 bg-primary">{{ customer.attributes.data_shared }}</td>
          <td scope="col" class="p-4 bg-primary">{{ customer.attributes.department_managing }}</td>
          <td scope="col" class="p-4 bg-primary">{{ customer.attributes.manager }}</td> 
          <td scope="col" class="p-4 bg-primary">{{ customer.attributes.contract_commencement_date }}</td>
          <td scope="col" class="p-4 bg-primary">{{ customer.attributes.contract_end_date }}</td>
          <td scope="col" class="p-4 bg-primary">{{ customer.attributes.cia_impact }}</td>
          <td scope="col" class="p-4 bg-primary">{{ customer.attributes.agreement }}</td>
          <td scope="col" class="p-4 bg-primary">{{ customer.attributes.approval_status }}</td>
          <td scope="col" class="p-4 bg-primary">{{ customer.attributes.date_entered }}</td> 
          <td class="px-6 py-4 gap-2 flex  top-0 right-0 bg-white z-10 border-l-2">
            <button @click="editRisk(customer.id)" class="text-blue-600 hover:underline">Edit</button>
            <button @click="selectCustomer(customer)" class="text-red-600 hover:underline">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import http from "@/helpers/http";
import { ref, computed, onMounted } from "vue";

export default {
  emits: ["view-customer"],
  setup(_, { emit }) {
    const customers = ref([]);

    const fetchCustomers = async () => {
      try {
        const response = await http.get('/api/customer-managements');
        customers.value = response.data.data;
        console.log(response)
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    };

    onMounted(() => {
      fetchCustomers();
    });

    const searchQuery = ref("");
    const selectedCategory = ref("");

    const filteredCustomers = computed(() => {
      console.log("length",customers.value.length == 0, customers.value)
      if (customers.value.length == 0) {
        return  
      } else {
        return customers.value.filter((customer) => {
        const matchesQuery =
          searchQuery.value === "" ||
          customer.attributes.name
            .toLowerCase()
            .includes(searchQuery.value.toLowerCase()) ||
          customer.id
            .toLowerCase()
            .includes(searchQuery.value.toLowerCase());
        const matchesCategory =
          selectedCategory.value === "" ||
          customer.attributes.customer_category === selectedCategory.value;

        return matchesQuery && matchesCategory;
      })
      }
      
    } 
    );

    const filterCustomers = () => {
      console.log("Filters applied");
    };

    const selectCustomer = (customer) => {
      emit("view-customer", customer);
    };

    const editCustomer = (customer) => {
      console.log("Editing customer:", customer);
    };

    const deleteCustomer = (customerId) => {
      console.log("Deleting customer with ID:", customerId);
    };

    return {
      searchQuery,
      selectedCategory,
      filteredCustomers,
      filterCustomers,
      selectCustomer,
      editCustomer,
      deleteCustomer,
    };
  },
};
</script>
