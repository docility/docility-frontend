/* eslint-disable quotes */
const { defineConfig } = require("@vue/cli-service");

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      '/v1': {
        target: process.env.VUE_APP_ENVI === "production"
        ? process.env.VUE_APP_API_URL_PROD
        : process.env.VUE_APP_API_URL,// Your backend server
        changeOrigin: true,
        pathRewrite: {
          '^/v1': '', // Optional: remove /api prefix before relaying
        },
      },
    },
  },
});
