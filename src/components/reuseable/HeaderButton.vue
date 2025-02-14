<template>
  <div
    class="w-full gap-2 p-5 flex flex-row justify-start items-center bg-white h-[70px]"
  >
    <svg
      class="hover:scale-110 cursor-pointer"
      @click="handleClick"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      :width="iconSize"
      :height="iconSize"
    >
      <path
        d="M19 12H5M5 12l7-7M5 12l7 7"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
    <h1 class="font-semibold">{{ title }}</h1>
  </div>
</template>

<script>
export default {
  name: "BackArrowHeader",
  props: {
    title: {
      type: String,
      required: true,
      default: "",
    },
    iconSize: {
      type: String,
      default: "24",
    },
    // Optional callback for click event
    onClick: {
      type: Function,
      default: () => {},
    },
  },
  methods: {
    handleClick() {
      // Trigger the onClick prop function when clicked
      this.onClick();
    },
  },
};
</script>

<style scoped>
/* You can add custom styles if needed */
</style>
