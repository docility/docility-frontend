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
              path: "supplier",
              name: "supplier",
              component: "Supplier",
            }),
          },
          {
            label: "Control Assessment",
            value: JSON.stringify({
              path: "/dashboard/create-control",
              name: "Control Assessment",
              component: "CreateControl",
            }),
          },
          {
            label: "New Control Assessment",
            value: JSON.stringify({
              path: "/dashboard/create-control-assessment",
              name: "New Control Assessment",
              component: "CreateControlAssessment",
            }),
          },
          {
            label: "Risk",
            value: JSON.stringify({
              path: "/dashboard/risks",
              name: "New Risks",
              component: "CreateRisk2",
            }),
          },
          {
            label: "New Assessment Checklist",
            value: JSON.stringify({
              path: "/dashboard/create-control/new-control",
              name: "New Assessment Checklist",
              component: "NewAssessmentChecklist",
            }),
          },
          {
            label: "Information Asset",
            value: JSON.stringify({
              path: "/dashboard/create-information-asset",
              name: "Information Asset",
              component: "CreateInformationAsset",
            }),
          },
          {
            label: "Risk Category",
            value: JSON.stringify({
              path: "/dashboard/create-risk-category",
              name: "Risk Category",
              component: "CreateRiskCategory",
            }),
          },
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
          {
            label: "Risks List",
            value: JSON.stringify({
              path: "/dashboard/risk-register",
              name: "Risks List",
              component: "RiskRegistered",
            }),
          },
          {
            label: "New Risk Category",
            value: JSON.stringify({
              path: "/dashboard/risk-category",
              name: "New Risk Category",
              component: "RiskCategory",
            }),
          },
          {
            label: "New Asset Category",
            value: JSON.stringify({
              path: "/dashboard/asset-category",
              name: "New Asset Category",
              component: "AssetCategory",
            }),
          },
          {
            label: "Customer management",
            value: JSON.stringify({
              path: "customer-management",
              name: "Customer management",
              component: "CustomerManagement",
            }),
          },
          {
            label: "Record management",
            value: JSON.stringify({
              path: "record-management",
              name: "Record management",
              component: "recordManagement",
            }),
          },
          {
            label: "Company management",
            value: JSON.stringify({
              path: "company-management",
              name: "Company management",
              component: "CompanyManagement",
            }),
          },
          {
            label: "Questionnaire management",
            value: JSON.stringify({
              path: "questionnaire-management",
              name: "Questionnaire management",
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
              name: "Subscription management",
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
