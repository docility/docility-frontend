import { defineStore } from "pinia";

export const useSubscriptionManagement = defineStore(
  "SubscriptionManagement",
  () => {
    const fields = [
      {
        id: "name",
        label: "Tier Name",
        model: "name",
        type: "text",
        required: true,
        placeholder: "Enter Tier name",
      },
      {
        id: "description",
        label: "Description",
        model: "description",
        type: "text",
        required: true,
        placeholder: "Enter Description",
      },
      {
        id: "accessModule",
        label: "Access Module",
        model: "accessModule",
        type: "multi",
        required: true,
        "multiple-select": true,
        options: [
          {
            label: "Supplier",
            value: JSON.stringify({
              path: "/dashboard/supplier",
              name: "Supplier",
              component: "Supplier",
            }),
          },
          // {
          //   label: "Control Assessment",
          //   value: JSON.stringify({
          //     path: "/dashboard/create-control",
          //     name: "Control Assessment",
          //     component: "CreateControl",
          //   }),
          // }, 
          {
            label: "Risk",
            value: JSON.stringify({
              path: "/dashboard/risks",
              name: "Risk Register",
              component: "CreateRisk2",
            }),
          },  
          // {
          //   label: "Risk Category",
          //   value: JSON.stringify({
          //     path: "/dashboard/create-risk-category",
          //     name: "Risk Category",
          //     component: "CreateRiskCategory",
          //   }),
          // },
          {
            label: "Control Domain",
            value: JSON.stringify({
              path: "/dashboard/control-domain",
              name: "Control Domain",
              component: "controlDomain",
            }),
          },
          {
            label: "Control Assessment",
            value: JSON.stringify({
              path: "/dashboard/control-assessment",
              name: "Control Assessment",
              component: "controlAssessment",
            }),
          },
          {
            label: "Risk Treatment",
            value: JSON.stringify({
              path: "/dashboard/create-risk-treatment",
              name: "Risk Treatment",
              component: "CreateTemplate",
            }),
          },
          // {
          //   label: "Risks Register",
          //   value: JSON.stringify({
          //     path: "/dashboard/risks",
          //     name: "Risks Register",
          //     component: "RiskRegistered",
          //   }),
          // },
          {
            label: "Risk Category",
            value: JSON.stringify({
              path: "/dashboard/risk-category",
              name: "Risk Category",
              component: "RiskCategory",
            }),
          },
          {
            label: "Asset Category",
            value: JSON.stringify({
              path: "/dashboard/asset-category",
              name: "Asset Category",
              component: "AssetCategory",
            }),
          },
          {
            label: "Customer management",
            value: JSON.stringify({
              path: "customer-management",
              name: "Customer",
              component: "CustomerManagement",
            }),
          },
          {
            label: "Record management",
            value: JSON.stringify({
              path: "record-management",
              name: "Record",
              component: "recordManagement",
            }),
          },
          {
            label: "Company management",
            value: JSON.stringify({
              path: "company-management",
              name: "Company",
              component: "CompanyManagement",
            }),
          },
          {
            label: "Questionnaire management",
            value: JSON.stringify({
              path: "questionnaire-management",
              name: "Questionnaire",
              component: "QuestionnaireManagement",
            }),
          },
          {
            label: "Questions management",
            value: JSON.stringify({
              path: "questions-management",
              name: "Questions",
              component: "QuestionsManagement",
            }),
          },
          {
            label: "Subscription management",
            value: JSON.stringify({
              path: "subscription-management",
              name: "Subscription",
              component: "SubscriptionManagement",
            }),
          },
        ],
      },
    ];

    return {
      fields,
    };
  }
);
