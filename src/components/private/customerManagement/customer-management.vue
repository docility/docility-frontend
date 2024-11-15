<template>
  <div class="home">
    <HeaderButton title="Create Control" :onClick="goBack" />
    <!-- Use the UnderConstruction component here -->
    <UnderConstruction />
  </div>
</template>

<script>
// Import the UnderConstruction component
import UnderConstruction from '@/components/UnderConstruction.vue';
import HeaderButton from '@/components/reuseable/HeaderButton.vue';

export default {
  name: 'CustomerManagement',
  components: {
    UnderConstruction, 
    HeaderButton
  },
};
</script>

<style scoped>
 
</style>
