<template>
  <div class="modal">
    <div class="modal-content">
      <h3>Add New Customer</h3>
      <form @submit.prevent="addCustomer">
        <div class="form-group">
          <label for="customerId">Customer ID:</label>
          <input
            id="customerId"
            v-model="newCustomer.customerId"
            type="text"
            class="form-control"
            required
          />
        </div>
        <div class="form-group">
          <label for="customerName">Name:</label>
          <input
            id="customerName"
            v-model="newCustomer.customerName"
            type="text"
            class="form-control"
            required
          />
        </div>
        <div class="form-group">
          <label for="customerCategory">Category:</label>
          <select
            id="customerCategory"
            v-model="newCustomer.customerCategory"
            class="form-control"
            required
          >
            <option value="Key">Key</option>
            <option value="Regular">Regular</option>
            <option value="One-off">One-off</option>
          </select>
        </div>
        <div class="form-group">
          <label for="contactPerson">Contact Person:</label>
          <input
            id="contactPerson"
            v-model="newCustomer.contactPerson"
            type="text"
            class="form-control"
            required
          />
        </div>
        <div class="form-group">
          <label for="phone">Phone:</label>
          <input
            id="phone"
            v-model="newCustomer.phone"
            type="text"
            class="form-control"
            required
          />
        </div>
        <div class="form-group">
          <label for="email">Email:</label>
          <input
            id="email"
            v-model="newCustomer.email"
            type="email"
            class="form-control"
            required
          />
        </div>
        <div class="modal-actions">
          <button type="submit" class="btn btn-success">Add</button>
          <button type="button" @click="$emit('close')" class="btn btn-secondary">Cancel</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    onAddCustomer: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      newCustomer: {
        customerId: "",
        customerName: "",
        customerCategory: "Key",
        contactPerson: "",
        phone: "",
        email: "",
      },
    };
  },
  methods: {
    addCustomer() {
      this.onAddCustomer(this.newCustomer);
      this.$emit("close");
      this.resetForm();
    },
    resetForm() {
      this.newCustomer = {
        customerId: "",
        customerName: "",
        customerCategory: "Key",
        contactPerson: "",
        phone: "",
        email: "",
      };
    },
  },
};
</script>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  width: 50%;
}
.modal-actions {
  margin-top: 15px;
  display: flex;
  justify-content: space-between;
}
</style>
