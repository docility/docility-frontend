<template>
  <div class="container flex flex-col w-full h-full overflow-hidden">
    <div
      class="grid gap-2 grid-cols-4 w-[100%] p-1 items-center justify-center"
    >
      <router-link
        to="create-control/new-control"
        type="submit"
        class="button-card hover:shadow-lg hover:scale-2 buttons"
      >
        <svg
          fill="#837272"
          width="120px"
          height="100px"
          version="1.1"
          id="Layer_1"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          viewBox="0 0 32 32"
          xml:space="preserve"
          stroke="#837272"
        >
          <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
          <g
            id="SVGRepo_tracerCarrier"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></g>
          <g id="SVGRepo_iconCarrier">
            <path
              id="application--security_2_"
              d="M10,14.36H4c-0.199,0-0.36-0.161-0.36-0.36S3.802,13.64,4,13.64h6 c0.199,0,0.36,0.161,0.36,0.36S10.199,14.36,10,14.36z M10,11.36H4c-0.199,0-0.36-0.161-0.36-0.36S3.802,10.64,4,10.64h6 c0.199,0,0.36,0.161,0.36,0.36S10.199,11.36,10,11.36z M10,8.36H4C3.801,8.36,3.64,8.199,3.64,8S3.802,7.64,4,7.64h6 c0.199,0,0.36,0.161,0.36,0.36S10.199,8.36,10,8.36z M29,2.5C29,2.776,28.776,3,28.5,3S28,2.776,28,2.5S28.224,2,28.5,2 S29,2.224,29,2.5z M27,2.5C27,2.776,26.776,3,26.5,3S26,2.776,26,2.5S26.224,2,26.5,2S27,2.224,27,2.5z M25,2.5 C25,2.776,24.776,3,24.5,3S24,2.776,24,2.5S24.224,2,24.5,2S25,2.224,25,2.5z M15,23.36H1c-0.199,0-0.36-0.161-0.36-0.36V1 c0-0.199,0.161-0.36,0.36-0.36h30c0.199,0,0.36,0.161,0.36,0.36v22h-0.72V4.36H1.36v18.28H15V23.36z M1.36,3.64h29.28V1.36H1.36 V3.64z M23,31.36c-3.507,0-6.36-2.854-6.36-6.36v-7.223l6.36-3.18l6.36,3.18V25C29.36,28.507,26.507,31.36,23,31.36z M17.36,18.223 V25c0,3.11,2.529,5.64,5.64,5.64s5.64-2.529,5.64-5.64v-6.777L23,15.402L17.36,18.223z"
            ></path>
            <rect
              id="_Transparent_Rectangle"
              style="fill: none"
              width="32"
              height="32"
            ></rect>
          </g>
        </svg>
        <p>Create new control</p>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "create-control",
  methods: {},
  mounted() {
    console.log("mounted");
  },
};
</script>
