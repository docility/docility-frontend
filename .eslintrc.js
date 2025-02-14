module.exports = {
  env: {
    browser: true,
    node: true, // Add Node.js support
    es2021: true,
  },
  extends: [
    "eslint:recommended", // Recommended ESLint rules
    "plugin:vue/essential", // Essential Vue.js rules
    "standard", // StandardJS rules
    "prettier", // Disable conflicting rules with Prettier
  ],
  parserOptions: {
    ecmaVersion: 2021, // Use latest ES2021 features
    sourceType: "module",
  },
  plugins: ["vue", "prettier"],
  rules: {
    "prettier/prettier": "error", // Ensure Prettier rules are enforced
  },
};
