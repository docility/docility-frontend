<template>
  <nav class="m-5 flex" aria-label="breadcrumb">
    <ol class="flex space-x-2">
      <li v-for="(breadcrumb, index) in breadcrumbs" :key="index">
        <router-link
          v-if="index !== breadcrumbs.length - 1"
          :to="breadcrumb.path"
          class="text-blue-600 hover:underline"
        >
          {{ breadcrumb.name }}
        </router-link>
        <span v-else class="text-gray-500">{{ breadcrumb.name }}</span>
      </li>
    </ol>
    <div class="ml-auto text-sm justify-end">
      <span class="text-gray-500">{{ accountType }}</span>
    </div>
  </nav>
</template>

<script>
export default {
  data() {
    return {
      accountType: ""
    };
  },
  methods: {
    setAccountType() {
      this.accountType = JSON.parse(sessionStorage.getItem("profile")).data.role.name +": "+
        (JSON.parse(sessionStorage.getItem("profile")).data.username).toUpperCase();
      console.log("Account Type:", this.accountType);
    },
  },
  mounted() {
    this.setAccountType();
  },
  computed: {
    breadcrumbs() {
      let pathArray = this.$route.path.split("/");
      pathArray.shift(); // Remove the first empty element

      return pathArray.map((path, index) => {
        return {
          name: (path.charAt(0).toUpperCase() + path.slice(1)).replaceAll(
            "-",
            " ",
          ),
          path: "/" + pathArray.slice(0, index + 1).join("/"),
        };
      });
    },
  },
};
</script>

<style scoped>
/* Style the breadcrumbs */
nav ol {
  padding: 0;
  margin: 0;
  list-style: none;
}

nav ol li::after {
  content: ">";
  margin: 0 5px;
  color: gray;
}

nav ol li:last-child::after {
  content: "";
}
</style>
