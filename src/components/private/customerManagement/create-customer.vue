<template>
  <div class="modal-overlay flex justify-center items-center fixed inset-0 bg-black bg-opacity-50">
    <div class="modal-content bg-white p-8 rounded-lg max-w-7xl w-full overflow-y-auto">
      <h3 class="text-xl font-semibold mb-6">{{ existingCustomer ? 'Update Customer' : 'Add New Customer' }}</h3>
      <form @submit.prevent="submitForm" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Basic Information -->
        <div class="form-group">
          <label for="customerName" class="block text-sm font-medium">Customer Name <span class="text-red-500">*</span>:</label>
          <input
            id="customerName"
            v-model="newCustomer.name"
            type="text"
            class="form-input mt-1 block w-full border rounded-md shadow-sm"
            required
            aria-required="true"
            placeholder="Enter customer name"
          />
        </div>

        <div class="form-group">
          <label for="tradingAs" class="block text-sm font-medium">Customer Trading As <span class="text-red-500">*</span>:</label>
          <input
            id="tradingAs"
            v-model="newCustomer.trading_as"
            type="text"
            class="form-input mt-1 block w-full border rounded-md shadow-sm"
            required
            aria-required="true"
            placeholder="Enter trading name"
          />
        </div>

        <!-- Registration Details -->
        <div class="form-group">
          <label for="abn" class="block text-sm font-medium">ABN <span class="text-red-500">*</span>:</label>
          <input
            id="abn"
            v-model="newCustomer.abn_no"
            type="text"
            class="form-input mt-1 block w-full border rounded-md shadow-sm"
            required
            aria-required="true"
            placeholder="Enter ABN"
          />
        </div>

        <div class="form-group">
          <label for="acn" class="block text-sm font-medium">ACN:</label>
          <input
            id="acn"
            v-model="newCustomer.acn_no"
            type="text"
            class="form-input mt-1 block w-full border rounded-md shadow-sm"
            placeholder="Enter ACN (optional)"
          />
        </div>

        <!-- Contact Details -->
        <div class="form-group">
          <label for="website" class="block text-sm font-medium">Website:</label>
          <input
            id="website"
            v-model="newCustomer.website"
            type="text"
            class="form-input mt-1 block w-full border rounded-md shadow-sm"
            placeholder="Enter website"
          />
        </div>

        <div class="form-group">
          <label for="localOrOverseas" class="block text-sm font-medium">Local/Overseas:</label>
          <select
            id="localOrOverseas"
            v-model="newCustomer.glocal"
            class="form-input mt-1 block w-full border rounded-md shadow-sm"
          >
            <option value="local">Local</option>
            <option value="overseas">Overseas</option>
          </select>
        </div>

        <!-- Address -->
        <div class="form-group">
          <label for="address" class="block text-sm font-medium">Address:</label>
          <input
            id="address"
            v-model="newCustomer.address"
            type="text"
            class="form-input mt-1 block w-full border rounded-md shadow-sm"
            placeholder="Enter address"
          />
        </div>

        <div class="form-group">
          <label for="country" class="block text-sm font-medium">Country:</label>
          <input
            id="country"
            v-model="newCustomer.country"
            type="text"
            class="form-input mt-1 block w-full border rounded-md shadow-sm"
            placeholder="Enter country"
          />
        </div>

        <div class="form-group">
          <label for="state" class="block text-sm font-medium">State:</label>
          <input
            id="state"
            v-model="newCustomer.state"
            type="text"
            class="form-input mt-1 block w-full border rounded-md shadow-sm"
            placeholder="Enter state"
          />
        </div>

        <div class="form-group">
          <label for="suburb" class="block text-sm font-medium">Suburb:</label>
          <input
            id="suburb"
            v-model="newCustomer.suburb"
            type="text"
            class="form-input mt-1 block w-full border rounded-md shadow-sm"
            placeholder="Enter suburb"
          />
        </div>

        <div class="form-group">
          <label for="postcode" class="block text-sm font-medium">Postcode:</label>
          <input
            id="postcode"
            v-model="newCustomer.postal_code"
            type="text"
            class="form-input mt-1 block w-full border rounded-md shadow-sm"
            placeholder="Enter postcode"
          />
        </div>

        <!-- Contact Persons -->
        <div class="form-group">
          <label for="contactPerson" class="block text-sm font-medium">Contact Person Name <span class="text-red-500">*</span>:</label>
          <input
            id="contactPerson"
            v-model="newCustomer.contact_person_name"
            type="text"
            class="form-input mt-1 block w-full border rounded-md shadow-sm"
            required
            aria-required="true"
            placeholder="Enter contact person's name"
          />
        </div>

        <div class="form-group">
          <label for="phone" class="block text-sm font-medium">Phone <span class="text-red-500">*</span>:</label>
          <input
            id="phone"
            v-model="newCustomer.phone_no"
            type="text"
            class="form-input mt-1 block w-full border rounded-md shadow-sm"
            required
            aria-required="true"
            placeholder="Enter phone number"
          />
        </div>

        <div class="form-group">
          <label for="email" class="block text-sm font-medium">Email <span class="text-red-500">*</span>:</label>
          <input
            id="email"
            v-model="newCustomer.email"
            type="email"
            class="form-input mt-1 block w-full border rounded-md shadow-sm"
            required
            aria-required="true"
            placeholder="Enter email"
          />
        </div>

        <div class="form-group">
          <label for="altContactPerson" class="block text-sm font-medium">Alternate Contact Person Name:</label>
          <input
            id="altContactPerson"
            v-model="newCustomer.alt_person_name"
            type="text"
            class="form-input mt-1 block w-full border rounded-md shadow-sm"
            placeholder="Enter alternate contact person's name"
          />
        </div>

        <div class="form-group">
          <label for="altPhone" class="block text-sm font-medium">Alternate Phone:</label>
          <input
            id="altPhone"
            v-model="newCustomer.alt_phone_no"
            type="text"
            class="form-input mt-1 block w-full border rounded-md shadow-sm"
            placeholder="Enter alternate phone number"
          />
        </div>

        <div class="form-group">
          <label for="altEmail" class="block text-sm font-medium">Alternate Email:</label>
          <input
            id="altEmail"
            v-model="newCustomer.alt_email"
            type="email"
            class="form-input mt-1 block w-full border rounded-md shadow-sm"
            placeholder="Enter alternate email"
          />
        </div>

        <!-- Customer Category and Type -->
        <div class="form-group">
          <label for="customerCategory" class="block text-sm font-medium">Customer Category:</label>
          <select
            id="customerCategory"
            v-model="newCustomer.customer_category"
            class="form-input mt-1 block w-full border rounded-md shadow-sm"
          >
            <option value="Key">Key Customer</option>
            <option value="Regular">Regular Customer</option>
            <option value="One-off">One-off Customer</option>
          </select>
        </div>

        <div class="form-group">
          <label for="customerType" class="block text-sm font-medium">Customer Type:</label>
          <input
            id="customerType"
            v-model="newCustomer.customer_type"
            type="text"
            class="form-input mt-1 block w-full border rounded-md shadow-sm"
            placeholder="Enter customer type"
          />
        </div>

        <div class="form-group">
          <label for="dataShared" class="block text-sm font-medium">Data Shared with Customer:</label>
          <textarea
            id="dataShared"
            v-model="newCustomer.data_shared"
            class="form-input mt-1 block w-full border rounded-md shadow-sm"
            placeholder="Enter details about data shared"
          ></textarea>
        </div>

        <div class="form-group">
          <label for="department" class="block text-sm font-medium">Department Managing Customer:</label>
          <input
            id="department"
            v-model="newCustomer.department_managing"
            type="text"
            class="form-input mt-1 block w-full border rounded-md shadow-sm"
            placeholder="Enter managing department"
          />
        </div>

        <div class="form-group">
          <label for="manager" class="block text-sm font-medium">Manager:</label>
          <input
            id="manager"
            v-model="newCustomer.manager"
            type="text"
            class="form-input mt-1 block w-full border rounded-md shadow-sm"
            placeholder="Enter manager"
          />
        </div>

        <!-- Contract Details -->
        <div class="form-group">
          <label for="contractStart" class="block text-sm font-medium">Contract Start Date:</label>
          <input
            id="contractStart"
            v-model="newCustomer.contract_commencement_date"
            type="date"
            class="form-input mt-1 block w-full border rounded-md shadow-sm"
          />
        </div>

        <div class="form-group">
          <label for="contractEnd" class="block text-sm font-medium">Contract End Date:</label>
          <input
            id="contractEnd"
            v-model="newCustomer.contract_end_date"
            type="date"
            class="form-input mt-1 block w-full border rounded-md shadow-sm"
          />
        </div>
        <div class="form-group">
          <label for="cia_impacts" class="block text-sm font-medium">CIA Impact:</label>
          <input
            id="manager"
            v-model="newCustomer.cia_impact"
            type="text"
            class="form-input mt-1 block w-full border rounded-md shadow-sm"
            placeholder="Enter manager"
          />
        </div>

        <!-- Agreement and Approval Status -->
        <div class="form-group">
          <label for="agreement" class="block text-sm font-medium">Agreement Signed:</label>
          <select
            id="agreement"
            v-model="newCustomer.agreement"
            class="form-input mt-1 block w-full border rounded-md shadow-sm"
          >
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>

        <div class="form-group">
          <label for="approvalStatus" class="block text-sm font-medium">Approval Status:</label>
          <select
            id="approvalStatus"
            v-model="newCustomer.approval_status"
            class="form-input mt-1 block w-full border rounded-md shadow-sm"
          >
            <option value="draft">Draft</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <!-- Modal Actions -->
        <div class="modal-actions flex justify-end mt-6">
          <button type="submit" class="btn bg-blue-500 hover:bg-blue-600">Save</button>
          <button type="button" @click="$emit('close')" class="btn bg-gray-500 hover:bg-gray-600 ml-2">Cancel</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    existingCustomer: {
      type: Object,
      default: null,
    },
    callback: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
      newCustomer: this.existingCustomer
        ? { ...this.existingCustomer.attributes }
        : {
             
          },
    };
  },
  methods: {
    submitForm() {
      if (this.existingCustomer) {
        console.log('Updating customer:', this.newCustomer);
        this.callback(this.newCustomer); // Update logic
      } else {
        this.callback(this.newCustomer); // Add logic
      }
      this.$emit('close');
    },
  },
};
</script>

<style scoped>
/* Tailwind classes already applied, so no need for custom CSS here */
</style>
