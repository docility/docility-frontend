import { createRouter, createWebHistory } from "vue-router";
import UserLogin from "@/components/public/UserLogin.vue";
import Supplier from "@/components/private/supplier/supplier.vue";
import DashboardComponent from "@/components/DashboardComponent.vue";
import NotFound from "@/components/NotFound.vue";
import Home from "@/components/private/Home.vue";
// import RiskAssessment from "@/components/private/riskAssessment/risk-assessment.vue";
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
import QuestionnaireManagement from "@/components/private/questionnaireManagement/questionnaire-management.vue";
import QuestionsManagement from "@/components/private/questionsManagement/questions-management.vue";
import PrivacyPolicy from "@/components/public/PrivacyPolicy.vue";
import CreateControlAssessment from "@/components/private/riskAssessment/menu/create-controll-assessment.vue";
import Assessment from "@/components/public/assessment.vue";
import RiskCategory from "@/components/private/riskAssessment/risk-category/risk-category.vue"
import AssetCategory from "@/components/private/riskAssessment/asset-category/asset-category.vue"
import RiskTreatment from "@/components/private/riskAssessment/risk-treatment/risk-treatment.vue";

// Define your routes
const routes = [
  { path: "/signin", name: "signin", component: UserLogin },
  { path: "/privacy-policy", name: "privacy-policy", component: PrivacyPolicy },
  {
    path: "/assessment/:id",
    name: "assessment",
    component: Assessment,
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: DashboardComponent,
    children: [
      { path: "/", redirect: "/dashboard/home" }, // Redirect root dashboard to home
      { path: "home", name: "home", component: Home },
      { path: "/dashboard", redirect: "/dashboard/home" },
      { path: "supplier", name: "supplier", component: Supplier }, 
      // {
      //   path: "/create-control",
      //   name: "Create Control",
      //   component: CreateControl,
      // },
      {
        path: "/dashboard/create-control",
        name: "Control Assessment",
        component: CreateControl,
      },
      {
        path: "/dashboard/create-control-assessment",
        name: "New Control Assessment",
        component: CreateControlAssessment,
      },
      {
        path: "/dashboard/create-control/new-control",
        name: "New Assessment Checklist",
        component: NewAssessmentChecklist,
      },
      {
        path: "/dashboard/create-information-asset",
        name: "Information Asset",
        component: CreateInformationAsset,
      },
      {
        path: "/dashboard/risk",
        name: "Risk",
        component: CreateRisk,
      },
      {
        path: "/dashboard/create-risk-category",
        name: "Risk Category",
        component: CreateRiskCategory,
      },
      {
        path: "/dashboard/create-risk-treatment",
        name: "Risk Treatment",
        component: CreateTemplate,
      },
      {
        path: "/dashboard/risk-register",
        name: "Risks List",
        component: RiskRegistered,
      },
      {
        path: "/dashboard/risk-category",
        name: "New Risk Category",
        component: RiskCategory,
      },
      {
        path: "/dashboard/asset-category",
        name: "New Asset Category",
        component: AssetCategory,
      },
      {
        path: "/dashboard/risk-treatment",
        name: "New Risk Treatment",
        component: RiskTreatment,
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
      {
        path: "questionnaire-management",
        name: "Questionnaire management",
        component: QuestionnaireManagement,
      },
      {
        path: "questions-management",
        name: "Questions",
        component: QuestionsManagement,
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

  console.log(to.name);

  if (
    to.name !== "signin" &&
    !isAuthenticated &&
    to.name !== "register" &&
    to.name !== "privacy-policy" &&
    to.name !== "assessment"
  ) {
    next({ name: "signin" });
  } else if (to.name === "signin" && isAuthenticated) {
    next({ name: "dashboard" }); // Redirect to dashboard if authenticated
  } else {
    next();
  }
});

export default router;
