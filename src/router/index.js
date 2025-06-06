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
// import CreateTemplate from "@/components/private/riskAssessment/menu/create-template.vue";
import RiskRegistered from "@/components/private/riskAssessment/menu/risks/risk-registered.vue";
import NewAssessmentChecklist from "@/components/private/riskAssessment/menu/assessment-checklist/new-assessment-checklist.vue";
import CustomerManagement from "@/components/private/customerManagement/customer-management.vue";
import CompanyManagement from "@/components/private/companyManagement/company-management.vue";
import QuestionnaireManagement from "@/components/private/questionnaireManagement/questionnaire-management.vue";
import QuestionsManagement from "@/components/private/questionsManagement/questions-management.vue";
import PrivacyPolicy from "@/components/public/PrivacyPolicy.vue";
import CreateControlAssessment from "@/components/private/riskAssessment/menu/create-controll-assessment.vue";
import Assessment from "@/components/public/assessment.vue";
import RiskCategory from "@/components/private/riskAssessment/risk-category/risk-category.vue";
import AssetCategory from "@/components/private/riskAssessment/asset-category/asset-category.vue";
import RiskTreatment from "@/components/private/riskAssessment/risk-treatment/risk-treatment.vue";
import CreateRisk2 from "@/components/private/risk/risk-management.vue";
import controlAssessment from "@/components/private/controlAssessment/control-assessment-management.vue";
import controlDomain from "@/components/private/controlDomain/control-domain-management.vue";
import recordManagement from "@/components/private/recordManagement/record-management.vue";
import SubscriptionManagement from "@/components/private/subscriptionManagement/subscription-management.vue";

const ControlRoutes = {
  QuestionsManagement: QuestionsManagement,
  CreateControl: CreateControl,
  "Risk Register": CreateRisk,
  CreateInformationAsset: CreateInformationAsset,
  CreateRiskCategory: CreateRiskCategory,
  // CreateTemplate: CreateTemplate,
  RiskRegistered: RiskRegistered,
  NewAssessmentChecklist: NewAssessmentChecklist,
  CreateControlAssessment: CreateControlAssessment,
  RiskCategory: RiskCategory,
  AssetCategory: AssetCategory,
  CreateTemplate: RiskTreatment,

  CreateRisk2: CreateRisk2,
  controlAssessment: controlAssessment,
  controlDomain: controlDomain,
  recordManagement: recordManagement,
  CustomerManagement: CustomerManagement,
  CompanyManagement: CompanyManagement,
  QuestionnaireManagement: QuestionnaireManagement, 
  PrivacyPolicy: PrivacyPolicy,
  Supplier: Supplier,
  SubscriptionManagement: SubscriptionManagement,
};

let UserAccess = JSON.parse(sessionStorage.getItem("accessModule")) || [];
// UserAccess = UserAccess
//   .split('\n')                // split by line
//   .map(line => JSON.parse(line));
console.log(UserAccess)
// const UserAccess1 = [
//   {
//     name: "CreateRisk",
//     path: "/dashboard/risks",
//     component: "CreateRisk2",
//   },
//   { path: "supplier", name: "supplier", component: "Supplier" },
//   {
//     path: "/dashboard/create-control",
//     name: "Control Assessment",
//     component: "CreateControl",
//   },
//   {
//     path: "/dashboard/create-control-assessment",
//     name: "New Control Assessment",
//     component: "CreateControlAssessment",
//   },
//   {
//     path: "/dashboard/risks",
//     name: "New Risks",
//     component: "CreateRisk2",
//   },
//   {
//     path: "/dashboard/create-control/new-control",
//     name: "New Assessment Checklist",
//     component: "NewAssessmentChecklist",
//   },
//   {
//     path: "/dashboard/create-information-asset",
//     name: "Information Asset",
//     component: "CreateInformationAsset",
//   },
//   {
//     path: "/dashboard/risk",
//     name: "Risk",
//     component: "CreateRisk",
//   },
//   {
//     path: "/dashboard/create-risk-category",
//     name: "Risk Category",
//     component: "CreateRiskCategory",
//   },
//   {
//     path: "/dashboard/control-domain",
//     name: "Control Domain",
//     component: "controlDomain",
//   },
//   {
//     path: "/dashboard/control-assessment",
//     name: "Control Assessment",
//     component: "controlAssessment",
//   },
//   {
//     path: "/dashboard/create-risk-treatment",
//     name: "Risk Treatment",
//     component: "CreateTemplate",
//   },
//   {
//     path: "/dashboard/risk-register",
//     name: "Risks List",
//     component: "RiskRegistered",
//   },
//   {
//     path: "/dashboard/risk-category",
//     name: "New Risk Category",
//     component: "RiskCategory",
//   },
//   {
//     path: "/dashboard/asset-category",
//     name: "New Asset Category",
//     component: "AssetCategory",
//   },
//   {
//     path: "/dashboard/risk-treatment",
//     name: "New Risk Treatment",
//     component: "RiskTreatment",
//   },
//   {
//     path: "customer-management",
//     name: "Customer management",
//     component: "CustomerManagement",
//   },
//   {
//     path: "record-management",
//     name: "Record management",
//     component: "recordManagement",
//   },
//   {
//     path: "company-management",
//     name: "Company management",
//     component: "CompanyManagement",
//   },
//   {
//     path: "questionnaire-management",
//     name: "Questionnaire management",
//     component: "QuestionnaireManagement",
//   },
//   {
//     path: "questions-management",
//     name: "Questions",
//     component: "QuestionsManagement",
//   },
//   {
//     path: "subscription-management",
//     name: "Subscription management",
//     component: "SubscriptionManagement",
//   }
// ];

const DashBoardControls = UserAccess.map((control) => {
  control.component = ControlRoutes[control.component];
  return control;
});

console.log(DashBoardControls);
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
      ...DashBoardControls,
      { path: "home", name: "home", component: Home },
      { path: "/dashboard", redirect: "/dashboard/home" },
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
    to.name !== "assessment" &&
    to.name !== "v1/api/auth/local"
  ) {
    next({ name: "signin" });
  } else if (to.name === "signin" && isAuthenticated) {
    next({ name: "dashboard" }); // Redirect to dashboard if authenticated
  } else {
    next();
  }
});

export default router;
