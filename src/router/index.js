import { createRouter, createWebHistory } from "vue-router";
import UserLogin from "@/components/public/UserLogin.vue";
import Supplier from "@/components/private/supplier/supplier.vue";
import Dashboard from "@/components/Dashboard.vue";
import NotFound from "@/components/NotFound.vue";
import Home from "@/components/private/Home.vue";
import RiskAssessment from "@/components/private/riskAssessment/risk-assessment.vue";
import CreateRisk from "@/components/private/riskAssessment/menu/create-risk.vue"; // Import your actual component here
// import CreateControl from "@/components/private/riskAssessment/menu/create-control.vue";
import CreateControl from "@/components/private/riskAssessment/menu/create-control.vue";
import CreateInformationAsset from "@/components/private/riskAssessment/menu/create-information-asset.vue";
import CreateRiskCategory from "@/components/private/riskAssessment/menu/create-risk-category.vue";
import CreateTemplate from "@/components/private/riskAssessment/menu/create-template.vue";
import RiskRegistered from "@/components/private/riskAssessment/menu/risks/risk-registered.vue";
import NewAssessmentChecklist from "@/components/private/riskAssessment/menu/assessment-checklist/new-assessment-checklist.vue";
import CustomerManagement from "@/components/private/customerManagement/customer-management.vue";
import CompanyManagement from "@/components/private/companyManagement/company-management.vue";
import PrivacyPolicy from "@/components/public/PrivacyPolicy.vue";
import CreateControlAssessment from "@/components/private/riskAssessment/menu/create-controll-assessment.vue";


// Define your routes
const routes = [
  { path: "/signin", name: "signin", component: UserLogin },
  { path: "/privacy-policy", name: "privacy-policy", component: PrivacyPolicy },
  {
    path: "/dashboard",
    name: "dashboard",
    component: Dashboard,
    children: [
      { path: "/", redirect: "/dashboard/home" }, // Redirect root dashboard to home
      { path: "home", name: "home", component: Home },
      { path: "supplier", name: "supplier", component: Supplier },
      {
        path: "risk-assessment",
        name: "Risk Assessment",
        component: RiskAssessment,
      },
      // {
      //   path: "risk-assessment/create-control",
      //   name: "Create Control",
      //   component: CreateControl,
      // },
      {
        path: "risk-assessment/create-control",
        name: "Control Assessment",
        component: CreateControl,
      },
      {
        path: "risk-assessment/create-control-assessment",
        name: "New Control Assessment",
        component: CreateControlAssessment,
      },
      {
        path: "risk-assessment/create-control/new-control",
        name: "New Assessment Checklist",
        component: NewAssessmentChecklist,
      },
      {
        path: "risk-assessment/create-information-asset",
        name: "Information Asset",
        component: CreateInformationAsset,
      },
      {
        path: "risk-assessment/risk",
        name: "Risk",
        component: CreateRisk,
      },
      {
        path: "risk-assessment/create-risk-category",
        name: "Risk Category",
        component: CreateRiskCategory,
      },
      {
        path: "risk-assessment/create-risk-treatment",
        name: "Risk Treatment",
        component: CreateTemplate,
      },
      {
        path: "risk-assessment/risk-register",
        name: "Risks List",
        component: RiskRegistered,
      },
      {
        path: "customer-management",
        name: "Customer management",
        component: CustomerManagement,
      },
      {
        path: "company-management",
        name: "Company management",
        component: CompanyManagement,
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
    to.name !== "privacy-policy"
  ) {
    next({ name: "signin" });
  } else if (to.name === "signin" && isAuthenticated) {
    next({ name: "dashboard" }); // Redirect to dashboard if authenticated
  } else {
    next();
  }
});


export default router;
