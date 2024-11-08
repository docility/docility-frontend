<template>
  <div class="container flex flex-col w-full h-full overflow-hidden">
    <div
      class="grid gap-2 grid-cols-4 w-[100%] p-1 items-center justify-center"
    >
      <router-link
        to="risk-assessment/create-risk-category"
        type="submit"
        class="w-full bg-primary-text mt-4 text-secondary-text font-semibold py-2 rounded hover:shadow-lg shadow-slate-300 hover:scale-2 buttons flex justify-center items-end"
      >
        Create Risk Category/Domain
      </router-link>

      <router-link
        to="risk-assessment/create-information-asset"
        type="submit"
        class="w-full bg-primary-text mt-4 text-secondary-text font-semibold py-2 rounded hover:shadow-lg shadow-slate-300 hover:scale-2 buttons flex justify-center items-end" 
        >Create Information asset category
      </router-link>
      <router-link
        to="risk-assessment/create-control"
        type="submit"
       class="w-full bg-primary-text mt-4 text-secondary-text font-semibold py-2 rounded hover:shadow-lg shadow-slate-300 hover:scale-2 buttons flex justify-center items-end"
        >Create Control
      </router-link>
      <router-link
        to="risk-assessment/create-risk-template"
        type="submit"
        class="w-full bg-primary-text mt-4 text-secondary-text font-semibold py-2 rounded hover:shadow-lg shadow-slate-300 hover:scale-2 buttons flex justify-center items-end"
        >Create Risk Treatment option
      </router-link>
      <router-link
        to="risk-assessment/create-risk"
        type="submit"
        class="w-full bg-primary-text mt-4 text-secondary-text font-semibold py-2 rounded hover:shadow-lg shadow-slate-300 hover:scale-2 buttons flex justify-center items-end"
        >Create New Risk
      </router-link>
      <router-link
        to="risk-assessment/create-control-assessment"
        type="submit"
        class="w-full bg-primary-text mt-4 text-secondary-text font-semibold py-2 rounded hover:shadow-lg shadow-slate-300 hover:scale-2 buttons flex justify-center items-end"
        >Control Assessment
      </router-link>
      <router-link
        to="risk-assessment/risk-register"
        type="submit"
       class="w-full bg-primary-text mt-4 text-secondary-text font-semibold py-2 rounded hover:shadow-lg shadow-slate-300 hover:scale-2 buttons flex justify-center items-end"
        >Risk Register
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
