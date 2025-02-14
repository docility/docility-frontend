<template>
  <div
    class="modal-overlay flex justify-center items-center fixed inset-0 bg-black bg-opacity-50 z-[99999]"
  >
    <div class="modal-content bg-white p-6 rounded-lg max-w-3xl w-full sm:w-[40%] shadow-lg">
      <!-- Modal Title -->
      <h3 class="text-xl font-semibold mb-4 text-gray-800">
        Send To {{ type }}
      </h3>

      <!-- Form -->
      <form @submit.prevent="submitForm" class="space-y-4">
        <div v-for="field in formFields" :key="field.id">
          <label :for="field.id" class="block text-sm font-medium text-gray-700">
            {{ field.label }}
            <span v-if="field.required" class="text-red-500">*</span>
          </label>

          <component
            :is="field.type === 'textarea' ? 'textarea' : field.type === 'select' ? 'select' : 'input'"
            v-model="newCompany[field.model]"
            :id="field.id"
            :type="field.type === 'textarea' || field.type === 'select' ? undefined : field.type"
            :class="[
              'w-full mt-1 p-2 border rounded-md shadow-sm focus:outline-none focus:ring-2',
              field.type === 'select' ? 'cursor-pointer' : ''
            ]"
            :required="field.required"
            :aria-required="field.required"
            :placeholder="field.placeholder"
            @change="handleSelection(field.model, $event)"
          >
            <option v-for="option in field.options || []" :key="option.value" :value="option.value">
              {{ option.text }}
            </option>
          </component>
        </div>

        <!-- Modal Actions -->
        <div class="flex justify-end space-x-3 mt-4">
          <button
            type="submit"
            class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition"
          >
            Send
          </button>
          <button
            type="button"
            @click="$emit('close')"
            class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import http from "@/helpers/http";
// import { onMounted } from "vue";

export default {
  props: {
    existingCompany: {
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
      newCompany: this.existingCompany
        ? { ...this.existingCompany }
        : { questionnaire_id: this.$route.query.questionaireId },

      type: "", // Stores the selected type
      formFields: [ 
        {
          id: "Company",
          label: "Type",
          model: "type",
          type: "select",
          required: true,
          options: [
            { text: "Company", value: "Company" },
            { text: "Supplier", value: "Supplier" },
          ],
          placeholder: "Enter Questionnaire Type",
        },
        {
          id: "selected",
          label: "Select",
          model: "selected",
          type: "select",
          required: true,
          options: [],
          placeholder: "Select",
        },
      ],
    };
  },
  watch: {
    existingCompany: {
      immediate: true,
      handler(newVal) {
        this.newCompany = newVal ? { ...newVal } : {};
      },
    },
  },
  methods: {
    async handleSelection(model, event) {
      this.newCompany[model] = event.target?.value ?? event;

      if (model === "type") {
        this.type = event.target?.value ?? event;
        this.formFields[1].options = [];

        let apiUrl = this.type === "Supplier" ? "/api/suppliers" : "/api/companies";
        try {
          const response = await http.get(apiUrl);
          this.formFields[1].options = response.data.data.map((item) => ({
            text: this.type === "Supplier" ? item.attributes.supplier_name : item.attributes.name,
            value: item.id,
          }));
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    },

    async submitForm() {
      if (Object.values(this.newCompany).some((value) => !value)) {
        alert("Please fill in all required fields.");
        return;
      }

      const response = await http.post('/api/questionnaire-mapping/send', { data: {
        questionnaire_id: this.$route.query.questionaireId,
        company_id: this.newCompany.selected,
        supplier_id: this.newCompany.selected,
        type: this.type,
        id: 12312312
      } });
      console.log(response)

      this.callback({ ...this.newCompany });
      this.$emit("close");
    },
    
  },
  mounted() {
      this.handleSelection('type', 'Company')
    }
};
</script>

<style scoped>
.modal-overlay {
  backdrop-filter: blur(8px);
}

.modal-content {
  max-height: 90vh;
  overflow-y: auto;
}

button {
  transition: all 0.2s ease-in-out;
}
</style>
