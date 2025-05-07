import { defineStore } from 'pinia'; 

export const useControlAssessment = defineStore('ControlAssessment', () => {
  const fields = [
    {
      "id": "domain",
      "label": "Domain",
      "model": "domain",
      "type": "text",
      "required": true,
      "options": []
    },
    {
      "id": "annexControl",
      "label": "Annex Control",
      "model": "annexControl",
      "type": "text",
      "required": true,
      "options": []
    },
    {
      "id": "controlHeading",
      "label": "Control Heading",
      "model": "controlHeading",
      "type": "text",
      "required": true,
      "options": []
    },
    {
      "id": "controlDescription",
      "label": "Control Description",
      "model": "controlDescription",
      "type": "text",
      "required": true,
      "options": []
    },
  ]

  return { 
    fields,
  }
});