<template>
  <div class="container flex flex-col w-full h-full overflow-hidden">
    <div
      class="grid gap-2 grid-cols-4 w-[100%] p-1 items-center justify-center"
    >
      <router-link
        to="risk-assessment/create-risk-category"
        type="submit"
        class="w-full bg-primary-text mt-4 text-secondary-text font-semibold py-2 rounded hover:shadow-lg shadow-slate-300 hover:scale-2 buttons flex items-center justify-end gap-8 flex-col"
      >
      <svg fill="#837272" width="120px" height="100px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32" xml:space="preserve" stroke="#837272"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path id="application--security_2_" d="M10,14.36H4c-0.199,0-0.36-0.161-0.36-0.36S3.802,13.64,4,13.64h6 c0.199,0,0.36,0.161,0.36,0.36S10.199,14.36,10,14.36z M10,11.36H4c-0.199,0-0.36-0.161-0.36-0.36S3.802,10.64,4,10.64h6 c0.199,0,0.36,0.161,0.36,0.36S10.199,11.36,10,11.36z M10,8.36H4C3.801,8.36,3.64,8.199,3.64,8S3.802,7.64,4,7.64h6 c0.199,0,0.36,0.161,0.36,0.36S10.199,8.36,10,8.36z M29,2.5C29,2.776,28.776,3,28.5,3S28,2.776,28,2.5S28.224,2,28.5,2 S29,2.224,29,2.5z M27,2.5C27,2.776,26.776,3,26.5,3S26,2.776,26,2.5S26.224,2,26.5,2S27,2.224,27,2.5z M25,2.5 C25,2.776,24.776,3,24.5,3S24,2.776,24,2.5S24.224,2,24.5,2S25,2.224,25,2.5z M15,23.36H1c-0.199,0-0.36-0.161-0.36-0.36V1 c0-0.199,0.161-0.36,0.36-0.36h30c0.199,0,0.36,0.161,0.36,0.36v22h-0.72V4.36H1.36v18.28H15V23.36z M1.36,3.64h29.28V1.36H1.36 V3.64z M23,31.36c-3.507,0-6.36-2.854-6.36-6.36v-7.223l6.36-3.18l6.36,3.18V25C29.36,28.507,26.507,31.36,23,31.36z M17.36,18.223 V25c0,3.11,2.529,5.64,5.64,5.64s5.64-2.529,5.64-5.64v-6.777L23,15.402L17.36,18.223z"></path> <rect id="_Transparent_Rectangle" style="fill:none;" width="32" height="32"></rect> </g></svg>
        <p>Create New Risk Category</p>
      </router-link>

      <router-link
        to="risk-assessment/create-information-asset"
        type="submit"
        class="w-full bg-primary-text mt-4 text-secondary-text font-semibold py-2 rounded hover:shadow-lg shadow-slate-300 hover:scale-2 buttons flex items-center justify-end gap-8 flex-col"
      >
      <svg viewBox="0 0 64 64" width="120px" height="100px"  xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--emojione" preserveAspectRatio="xMidYMid meet" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <circle cx="32" cy="32" r="30" fill="#6d8283"> </circle> <g fill="#ffffff"> <path d="M27 27.8h10v24H27z"> </path> <circle cx="32" cy="17.2" r="5"> </circle> </g> </g></svg>
        <p>Create New Asset category</p>
      </router-link>
      <router-link
        to="risk-assessment/create-risk-treatment"
        type="submit"
        class="w-full bg-primary-text mt-4 text-secondary-text font-semibold py-2 rounded hover:shadow-lg shadow-slate-300 hover:scale-2 buttons flex items-center justify-end gap-8 flex-col"
        >
        <svg fill="#6b5b5b" width="120px" height="100px"  viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" stroke="#6b5b5b"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g data-name="Layer 2"> <g data-name="options"> <rect width="24" height="24" opacity="0"></rect> <path d="M7 14.18V3a1 1 0 0 0-2 0v11.18a3 3 0 0 0 0 5.64V21a1 1 0 0 0 2 0v-1.18a3 3 0 0 0 0-5.64zM6 18a1 1 0 1 1 1-1 1 1 0 0 1-1 1z"></path> <path d="M21 13a3 3 0 0 0-2-2.82V3a1 1 0 0 0-2 0v7.18a3 3 0 0 0 0 5.64V21a1 1 0 0 0 2 0v-5.18A3 3 0 0 0 21 13zm-3 1a1 1 0 1 1 1-1 1 1 0 0 1-1 1z"></path> <path d="M15 5a3 3 0 1 0-4 2.82V21a1 1 0 0 0 2 0V7.82A3 3 0 0 0 15 5zm-3 1a1 1 0 1 1 1-1 1 1 0 0 1-1 1z"></path> </g> </g> </g></svg>
        <p>Create New Risk Treatment Option</p>
      </router-link>
      <router-link
        to="risk-assessment/risk"
        type="submit"
        class="w-full bg-primary-text mt-4 text-secondary-text font-semibold py-2 rounded hover:shadow-lg shadow-slate-300 hover:scale-2 buttons flex items-center justify-end gap-8 flex-col"
        >
        <svg viewBox="0 0 32 32"  width="120px" height="100px"  version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns" fill="#816565" stroke="#816565"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>new</title> <desc>Created with Sketch Beta.</desc> <defs> </defs> <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" sketch:type="MSPage"> <g id="Icon-Set" sketch:type="MSLayerGroup" transform="translate(-516.000000, -99.000000)" fill="#746363"> <path d="M527.786,122.02 L522.414,125.273 C521.925,125.501 521.485,125.029 521.713,124.571 L524.965,119.195 L527.786,122.02 L527.786,122.02 Z M537.239,106.222 L540.776,109.712 L529.536,120.959 C528.22,119.641 526.397,117.817 526.024,117.444 L537.239,106.222 L537.239,106.222 Z M540.776,102.683 C541.164,102.294 541.793,102.294 542.182,102.683 L544.289,104.791 C544.677,105.18 544.677,105.809 544.289,106.197 L542.182,108.306 L538.719,104.74 L540.776,102.683 L540.776,102.683 Z M524.11,117.068 L519.81,125.773 C519.449,126.754 520.233,127.632 521.213,127.177 L529.912,122.874 C530.287,122.801 530.651,122.655 530.941,122.365 L546.396,106.899 C547.172,106.124 547.172,104.864 546.396,104.088 L542.884,100.573 C542.107,99.797 540.85,99.797 540.074,100.573 L524.619,116.038 C524.328,116.329 524.184,116.693 524.11,117.068 L524.11,117.068 Z M546,111 L546,127 C546,128.099 544.914,129.012 543.817,129.012 L519.974,129.012 C518.877,129.012 517.987,128.122 517.987,127.023 L517.987,103.165 C517.987,102.066 518.902,101 520,101 L536,101 L536,99 L520,99 C517.806,99 516,100.969 516,103.165 L516,127.023 C516,129.22 517.779,131 519.974,131 L543.817,131 C546.012,131 548,129.196 548,127 L548,111 L546,111 L546,111 Z" id="new" sketch:type="MSShapeGroup"> </path> </g> </g> </g></svg>
        
        <p>Create New Risk</p>
      </router-link>
      <router-link
        to="risk-assessment/create-control"
        type="submit"
        class="w-full bg-primary-text mt-4 text-secondary-text font-semibold py-2 rounded hover:shadow-lg shadow-slate-300 hover:scale-2 buttons flex items-center justify-end gap-8 flex-col"
        >
        <svg viewBox="0 0 24 24" width="120px" height="100px"  fill="none" xmlns="http://www.w3.org/2000/svg" aria-labelledby="controlCentreIconTitle" stroke="#756161" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" color="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title id="controlCentreIconTitle">Control Centre</title> <path d="M4 6.5C4 4.567 5.567 3 7.5 3L16.5 3C18.433 3 20 4.567 20 6.5V6.5C20 8.433 18.433 10 16.5 10L7.5 10C5.567 10 4 8.433 4 6.5V6.5Z"></path> <path d="M20 17.5C20 19.433 18.433 21 16.5 21L7.5 21C5.567 21 4 19.433 4 17.5V17.5C4 15.567 5.567 14 7.5 14L16.5 14C18.433 14 20 15.567 20 17.5V17.5Z"></path> <circle cx="16.5" cy="17.5" r="1"></circle> <circle cx="7.5" cy="6.5" r="1"></circle> </g></svg>
       
        <p>Create New Control Assessment</p>
      </router-link>
      <router-link
        to="risk-assessment/risk-register"
        type="submit"
       class="w-full bg-primary-text mt-4 text-secondary-text font-semibold py-2 rounded hover:shadow-lg shadow-slate-300 hover:scale-2 buttons flex items-center justify-end gap-8 flex-col"
        >
        <svg viewBox="0 0 24 24"  width="120px" height="100px"  fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M5 4H17M5 8H13M5 12H9M5 16H8M5 20H11M16.4729 17.4525C17.046 16.8743 17.4 16.0785 17.4 15.2C17.4 13.4327 15.9673 12 14.2 12C12.4327 12 11 13.4327 11 15.2C11 16.9673 12.4327 18.4 14.2 18.4C15.0888 18.4 15.893 18.0376 16.4729 17.4525ZM16.4729 17.4525L19 20" stroke="#464455" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
        
        <p>View Risk</p>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "RiskAssessment",
  data() {
    return {};
  },
  methods: {
    createRisk() {
      this.$router.push("risk-assessment/create-risk");
    },
  },
};
</script>

<style>
.buttons {
  box-shadow: 1cm;
  width: 100%;
  height: 200px;
  text-anchor: end;
  text-align: center;
  text-justify: auto;
}
</style>
