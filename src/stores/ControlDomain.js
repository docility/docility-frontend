import { defineStore } from 'pinia'; 

export const useControlDomain = defineStore('ControlDomain', () => {
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
      "id": "control_no",
      "label": "Control Number",
      "model": "control_no",
      "type": "text",
      "required": true,
      "options": []
    },
    {
      "id": "control_description",
      "label": "Control Description",
      "model": "control_description",
      "type": "text",
      "required": true,
      "options": []
    }, 
  ]

  return { 
    fields,
  }
});