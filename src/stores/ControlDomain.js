import { defineStore } from 'pinia'; 

export const useCreateRiskField = defineStore('CreateRiskFields', () => {
  const fields = [
    {
      "id": "dateCreated",
      "label": "Date Created",
      "model": "dateCreated",
      "type": "date",
      "required": true,
      "options": []
    },
    {
      "id": "riskId",
      "label": "Risk ID",
      "model": "riskId",
      "type": "text",
      "read-only": true,
      "required": false,
      "options": []
    },
    {
      "id": "riskOwner",
      "label": "Risk Owner",
      "model": "riskOwner",
      "type": "text",
      "read-only": false,
      "required": true,
      "options": []
    },
    {
      "id": "riskOwnerEmail",
      "label": "Risk Owner Email",
      "model": "riskOwnerEmail",
      "type": "text",
      "required": true,
      "options": []
    },
    {
      "id": "riskCategory",
      "label": "Risk Category",
      "model": "riskCategory",
      "type": "multi",
      "required": true,
      "multiple-select": false,
      "options": []
    },
    {
      "id": "threat",
      "label": "Threat",
      "model": "threat",
      "type": "text",
      "read-only": false,
      "required": true,
      "options": []
    },
    {
      "id": "vulnerability",
      "label": "Vulnerability",
      "model": "vulnerability",
      "type": "text",
      "read-only": false,
      "required": true,
      "options": []
    },    {
      "id": "assetMainCategory",
      "label": "Asset Main Category",
      "model": "assetMainCategory",
      "type": "multi",
      "multiple-select": false,
      "required": true,
      "options": []
    },
    {
      "id": "assetSubCategory",
      "label": "Asset Sub Category",
      "model": "assetSubCategory",
      "type": "multi",
      "multiple-select": false,
      "required": true,
      "options": []
    },

    // {
    //   "id": "assetCategory",
    //   "label": "Asset Category",
    //   "model": "assetCategory",
    //   "type": "text",
    //   "required": true,
    //   "options": []
    // },
    {
      "id": "ciaImpact",
      "label": "Cia Impact",
      "model": "ciaImpact",
      "type": "multi",
      "required": true,
      "multiple-select": true,
      "options": [
        { label: 'Confidentiality', value: 'Confidentiality' },
        { label: 'Integrity', value: 'Integrity' },
        { label: 'Availability', value: 'Availability' },
      ]
    },
    {
      "id": "matrix",
      "label": "Matrix to be used for risk assessment",
      "model": "matrix",
      "type": "multi",
      "multiple-select": false,
      "required": true,
      "options": [{
        label: '3x3',
        value: '3x3',
      },
      {
        label: '5x5',
        value: '5x5',
      }
      ]
    },
    {
      "id": "likelihood",
      "label": "Initial Likelihood",
      "model": "likelihood",
      "type": "select",
      "required": true,
      "options": []
    },
    {
      "id": "initialImpact",
      "label": "Initial Impact",
      "model": "initialImpact",
      "type": "select",
      "multiple-select": false,
      "required": true,
      "options": []
    },
    // {
    //   "id": "risidualImpact",
    //   "label": "Residual Impact",
    //   "model": "risidualImpact",
    //   "type": "multi",
    //   "multiple-select": false,
    //   "required": true,
    //   "options": []
    // },
    {
      "id": "riskLevel",
      "label": "Inherent Risk level/rating",
      "model": "riskLevel",
      "type": "text",
      "read-only": true,
      "required": false,
      "options": []
    },
    {
      "id": "currentControlInPlace",
      "label": "Current Control In Place",
      "model": "currentControlInPlace",
      "type": "text",
      "read-only": false,
      "required": true,
      "options": []
    },
    {
      "id": "currentControlEffective",
      "label": "Current Controls Are Effective",
      "model": "currentControlEffective",
      "type": "multi",
      "multiple-select": false,
      "required": true,
      "options": [{
        label: 'Yes',
        value: 'Yes',
      },
      {
        label: 'No',
        value: 'No',
      }]
    },
    {
      "id": "controlDomain",
      "label": "Control Domain",
      "model": "controlDomain",
      "type": "multi",
      "multiple-select": true,
      "read-only": false,
      "required": true,
      "options": []
    },
    {
      "id": "controlMapped",
      "label": "Control Mapped",
      "model": "controlMapped",
      "type": "multi",
      "multiple-select": true,
      "read-only": false,
      "required": true,
      "options": []
    },
    {
      "id": "riskAcceptable",
      "label": "Risk Acceptable",
      "model": "riskAcceptable",
      "type": "multi",
      "multiple-select": false,
      "required": true,
      "options": [{
        label: 'Yes',
        value: 'Yes',
      },
      {
        label: 'No',
        value: 'No',
      }]
    },
    {
      "id": "riskTreatment",
      "label": "Risk treatment option",
      "model": "riskTreatment",
      "type": "multi",
      "read-only": false,
      "multiple-select": true,
      "required": true,
      "options": []
    },
    {
      "id": "riskTreatmentPlan",
      "label": "Risk Treatment Plan",
      "model": "riskTreatmentPlan",
      "type": "text",
      "required": true,
      "options": []
    },
    {
      "id": "riskControlDomain",
      "label": "Risk Treatment Control domain",
      "model": "riskControlDomain",
      "type": "multi",
      "multiple-select": true,
      "read-only": false,
      "required": true,
      "options": []
    },
    {
      "id": "riskControlMap",
      "label": "Risk Treatment Controls mapped",
      "model": "riskControlMap",
      "type": "multi",
      "multiple-select": false,
      "read-only": false,
      "required": true,
      "options": []
    },
    {
      "id": "personResponsibleToImplement",
      "label": "Person Responsible To Implement",
      "model": "personResponsibleToImplement",
      "type": "text",
      "read-only": false,
      "required": true,
      "options": []
    },

    {
      "id": "treatmentApprovalDate",
      "label": "Treatment Approval Date",
      "model": "treatmentApprovalDate",
      "type": "date",
      "read-only": false,
      "required": true,
      "options": []
    },

    {
      "id": "treatmentApprovalEvidence",
      "label": "Treatment Approval Evidence",
      "model": "treatmentApprovalEvidence",
      "type": "text",
      "required": true,
      "options": []
    },

    {
      "id": "treatmentCompletionDate",
      "label": "Expected treatment completion date",
      "model": "treatmentCompletionDate",
      "type": "date",
      "required": true,
      "options": []
    },

    {
      "id": "treatmentStatus",
      "label": "Treatment Status",
      "model": "treatmentStatus",
      "type": "select",
      "required": true,
      "options": [{
        text: 'Not Started',
        value: 'Not Started',
      },
      {
        text: 'In-Progress',
        value: 'In-Progress',
      },
      {
        text: 'Completed',
        value: 'Completed',
      }
      ]
    },

    {
      "id": "notes",
      "label": "Notes",
      "model": "notes",
      "type": "text",
      "required": true,
      "options": []
    },

    {
      "id": "residualLikelihood",
      "label": "Residual Likelihood",
      "model": "residualLikelihood",
      "type": "select",
      "read-only": false,
      "required": true,
      "options": []
    },

    {
      "id": "residualImpact",
      "label": "Residual Impact",
      "model": "residualImpact",
      "type": "select",
      "multiple-select": false,
      "required": true,
      "options": []
    },

    {
      "id": "residualRiskLevel",
      "label": "Residual Risk Level",
      "model": "residualRiskLevel",
      "type": "text",
      "read-only": false,
      "required": true,
      "options": []
    },
    {
      "id": "residualTreatmentApprovalDate",
      "label": "Residual Treatment Approval Date",
      "model": "residualTreatmentApprovalDate",
      "type": "date",
      "required": true,
      "options": []
    },

    {
      "id": "riskApprovalEvidence",
      "label": "Risidual Approval Evidence",
      "model": "riskApprovalEvidence",
      "type": "text",
      "read-only": false,
      "required": true,
      "options": []
    },

    {
      "id": "nextReviewDate",
      "label": "Next Review Date",
      "model": "nextReviewDate",
      "type": "date",
      "required": true,
      "options": []
    },
    {
      "id": "riskApprovalDate",
      "label": "Risk Approval Date",
      "model": "riskApprovalDate",
      "type": "date",
      "read-only": false,
      "required": true,
      "options": []
    },

    {
      "id": "approvalEvidence",
      "label": "Risk Approval Evidence",
      "model": "approvalEvidence",
      "type": "text",
      "required": true,
      "options": []
    },

    {
      "id": "riskAssessmentCompleted",
      "label": "Risk Assessment Completed",
      "model": "riskAssessmentCompleted",
      "type": "select",
      "read-only": false,
      "required": true,
      "options": [{
        text: 'No',
        value: 'No',
      },
      {
        text: 'Yes',
        value: 'Yes',
      },
      ]
    },
    {
      "id": "treatmentPlanFile",
      "label": "Upload Treatment Plan",
      "model": "treatmentPlanFile",
      "type": "file",
      "required": false,
      "options": [],
      "fileTypes": ".pdf,.doc,.docx",
    },
    {
      "id": "treatmentApprovalEvidenceFile",
      "label": "Upload Treatment Approval Evidence",
      "model": "treatmentApprovalEvidenceFile",
      "type": "file",
      "required": false,
      "options": [],
      "fileTypes": ".pdf,.doc,.docx",
    },
    {
      "id": "residualRiskApprovalFile",
      "label": "Upload Residual Risk Approval",
      "model": "residualRiskApprovalFile",
      "type": "file",
      "required": false,
      "options": [],
      "fileTypes": ".pdf,.doc,.docx",
    },
  ]

  return { 
    fields,
  }
});