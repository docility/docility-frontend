import { createRouter, createWebHistory } from "vue-router";
import UserLogin from "@/components/public/UserLogin.vue";
import Supplier from "@/components/private/supplier/supplier.vue";
import Dashboard from "@/components/Dashboard.vue";
import NotFound from "@/components/NotFound.vue";
import Home from "@/components/private/Home.vue";
import RiskAssessment from "@/components/private/riskAssessment/risk-assessment.vue";
import CreateRisk from "@/components/private/riskAssessment/menu/create-risk-category.vue"; // Import your actual component here
import CreateControl from "@/components/private/riskAssessment/menu/create-control.vue";
import CreateControllAssessment from "@/components/private/riskAssessment/menu/create-controll-assessment.vue";
import CreateInformationAsset from "@/components/private/riskAssessment/menu/create-information-asset.vue";
import CreateRiskCategory from "@/components/private/riskAssessment/menu/create-risk-category.vue";
import CreateTemplate from "@/components/private/riskAssessment/menu/create-template.vue";
import RiskRegistered from "@/components/private/riskAssessment/menu/risk-registered.vue";

// Define your routes
const routes = [
  { path: "/signin", name: "signin", component: UserLogin },
  {
    path: "/dashboard",
    name: "dashboard",
    component: Dashboard,
    children: [
      { path: "", redirect: "/dashboard/home" }, // Redirect root dashboard to home
      { path: "home", name: "home", component: Home },
      { path: "supplier", name: "supplier", component: Supplier },
      {
        path: "risk-assessment",
        name: "risk-assessment",
        component: RiskAssessment,
      },
      {
        path: "risk-assessment/create-control",
        name: "Create Control",
        component: CreateControl,
      },  
      {
        path: "risk-assessment/create-control-assessment",
        name: "Control Assessment",
        component: CreateControllAssessment,
      },  
      {
        path: "risk-assessment/create-information-asset",
        name: "Information Asset",
        component: CreateInformationAsset,
      },  
      {
        path: "risk-assessment/create-risk",
        name: "create-risk",
        component: CreateRisk,
      },  
      {
        path: "risk-assessment/create-risk-category",
        name: "Risk Category",
        component: CreateRiskCategory,
      },  
      {
        path: "risk-assessment/create-risk-template",
        name: "Risk template",
        component: CreateTemplate,
      },  
      {
        path: "risk-assessment/risk-register",
        name: "Risks",
        component: RiskRegistered,
      },  
      { path: "/:catchAll(.*)", name: "NotFound", component: NotFound },
    ],
  },
  { path: "/:catchAll(.*)", name: "NotFound", component: NotFound },
];

// Create the router instance
const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Global navigation guard
router.beforeEach((to, from, next) => {
  const isAuthenticated = sessionStorage.getItem("jwt");
  if (
    to.name !== "signin" &&
    !isAuthenticated &&
    to.name !== "register" &&
    to.name !== "view-grades"
  ) {
    next({ name: "signin" });
  } else if (to.name === "signin" && isAuthenticated) {
    next({ name: "dashboard" }); // Redirect to dashboard if authenticated
  } else {
    next();
  }
});

export default router;
