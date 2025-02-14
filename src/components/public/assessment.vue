<template>
  <div
    class="container w-[50%] mx-auto p-6 bg-white shadow-md rounded-lg gap-2"
  >
    <h1 class="text-2xl font-bold mb-4 text-center">Assessment</h1>

    <!-- Company Details Section -->
    <div
      v-if="companyDetails"
      class="bg-gray-100 p-4 rounded-lg shadow-sm flex mb-6 flex-col"
    >
      <h2 class="text-lg font-semibold mb-2">{{}}</h2>
      <label
        >Name:
        {{
          questionnaire.type == "Supplier"
            ? companyDetails.supplier_name
            : companyDetails.name
        }}</label
      >
      <label>Address: {{ companyDetails.address }}</label>
      <label
        >Email:
        {{
          questionnaire.type == "Supplier"
            ? companyDetails.contact_person_email
            : companyDetails.email
        }}</label
      >
      <label>Status: {{ companyQuestionnaire.status }}</label>
    </div>

    <!-- Questionnaire & Answers -->
    <div v-if="questions" class="bg-gray-100 p-4 rounded-lg shadow-sm">
      <h2 class="text-lg font-semibold mb-2">Questionnaire</h2>
      <form @submit.prevent="submitAnswers">
        <ul class="space-y-4">
          <li
            v-for="(data, index) in questions"
            :key="index"
            class="text-gray-700 border-b pb-4"
          >
            <p class="font-medium">{{ index + 1 }}. {{ data.question }}</p>
            <input
              :id="'answer-' + index"
              v-model="answers[index]"
              type="text"
              class="w-full px-3 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </li>
        </ul>
        <button
          type="submit"
          class="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 mt-4"
        >
          Submit
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import http from "@/helpers/http";

export default {
  name: "AssessmentComponent",
  data() {
    return {
      assessmentId: "",
      questions: [], // Stores API response for questions
      answers: [], // Stores user answers
      companyDetails: [],
      companyQuestionnaire: [],
      questionnaire: [],
    };
  },
  methods: {
    async fetchAssessment() {
      this.assessmentId = this.$route.params.id;
      if (!this.assessmentId) {
        this.$router.push({ path: "/not-found" });
        return;
      }

      try {
        const response = await http.get(
          `/api/questionnaire-mapping?id=${this.assessmentId}`
        );
        console.log(response);

        if (response.data.data && response.data.data.questions) {
          this.questions = response.data.data.questions;
          this.questionnaire = response.data.data.questionnaire[0];

          this.answers = new Array(this.questions.length).fill(""); // Initialize answers array
          this.companyDetails = response.data.data.company_details[0];
          this.companyQuestionnaire = response.data.data.company_questionnaire;
        } else {
          console.warn("No questions found in response.");
        }
      } catch (error) {
        console.error("Error fetching assessment:", error);
      }
    },
    submitAnswers() {
      const submittedData = this.questions.map((question, index) => ({
        answer: this.answers[index] || "", // Avoid undefined values
        questionnaire_id: String(this.companyQuestionnaire.questionnaire_id),
        question_id: String(question.id),
        company_id: String(this.companyDetails.id),
      }));

      console.log("Submitted Data:", submittedData);

      // Example API request:
      http
        .post("/api/create-bulk/submitAnswer", { data: submittedData })
        .then((response) => console.log("Submitted successfully:", response))
        .catch((error) => console.error("Submission failed:", error));
    },
  },
  mounted() {
    this.fetchAssessment();
  },
};
</script>

<style scoped>
/* Add additional styles here if needed */
</style>
