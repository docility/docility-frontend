<template>
  <div class="container flex flex-col w-full h-full overflow-hidden ">
    <HeaderButton title="Create Control" :onClick="goBack" />
    <div class="grid gap-2 grid-cols-4 w-[100%] p-1 items-center justify-center">
        <h1>create-control</h1>
    </div>
  </div>

</template>

<script>
import HeaderButton from '@/components/reuseable/HeaderButton.vue';

export default {
  components: {
    HeaderButton
  },
    name: "create-control",
    methods: {
      goBack() {
        this.$router.back(-1)
      }
    },
    mounted() {
      console.log("mounted")
    }
  }
</script>