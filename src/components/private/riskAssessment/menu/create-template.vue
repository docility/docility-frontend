<template>
  <div class="container flex flex-col w-full h-full overflow-hidden ">
    
    <HeaderButton title="Create Risk Treatment" :onClick="goBack" />
    <form @submit="submitInformationAssetCategory">
      <div class="grid gap-2 grid-cols-1 w-[100%] p-2 items-center justify-center mt-5 bg-primary-text">
        <div class="mb-4">
          <label class="block text-lg font-medium text-gray-700">Risk treatment option  </label>
          <input v-model="treatmentOption" type="text" required  class="mt-1 block w-full p-2 border border-gray-300 rounded" />
        </div>
        <div class="mb-4">
          <label class="block text-lg font-medium text-gray-700">Risk treatment description   </label>
          <textarea  v-model="description" rows="5" type="text" required class="mt-1 block w-full p-2 border border-gray-300 rounded text-lg" />
        </div>  
      </div>
      <button type="submit" class="w-full mt-4 bg-primary text-secondary-text font-semibold py-2 rounded hover:bg-secondary-alternate">Submit</button> 
    </form> 
  </div>

</template>

<script>
import HeaderButton from '@/components/reuseable/HeaderButton.vue';
import http from '@/helpers/http';
import { toast } from 'vue3-toastify';

  export default {
    components: {
      HeaderButton
    },
    data() {
      return {
        treatmentOption: '',
        description: ''
      }
    },
    name: "create-risk-treatment",
    methods: {
      goBack() {
        this.$router.push("/dashboard/risk-assessment")
      },
      reset() {
        this.treatmentOption = '';
        this.description = '';
      },
      async submitInformationAssetCategory(e) { 
        e.preventDefault() 
        try {
          const response = await http.post("/api/risk-treatments", { data: { treatmentOption: this.treatmentOption, description: this.description } });
          if (response.status == 200) {
            toast.success("New Category Successfully Saved")
          } else {
            toast.success("Error on Saving Category")
          }
        } catch (error) {
          toast.error("Internal Server Error: "+ error.response?.data?.error?.message)
        } finally {
          this.reset()
        }
      }
    },
    mounted() {
      console.log("mounted")
    }
  }
</script>