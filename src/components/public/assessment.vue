<template>
  <div
    class="container w-[50%] mx-auto p-6 bg-white shadow-md rounded-lg gap-2"
  >
    <h1 class="text-2xl font-bold mb-4 text-center">Assessment</h1>
    <div
      v-if="companyDetails"
      class="bg-gray-100 p-4 rounded-lg shadow-sm flex mb-6 flex-col"
    >
      <h2 class="text-lg font-semibold mb-2">Company</h2>
      <label>Company Name: {{ companyDetails.name }}</label>
      <label>Address: {{ companyDetails.address }}</label>
      <label>Email: {{ companyDetails.email }}</label>
      <label>Status: {{ companyQuestionnaire.status }}</label>
    </div>
    <div v-if="questions" class="grid grid-cols-2 gap-6">
      <!-- Left: Questionnaire -->
      <div class="bg-gray-100 p-4 rounded-lg shadow-sm">
        <h2 class="text-lg font-semibold mb-2">Questionnaire</h2>
        <ul class="space-y-2">
          <li
            v-for="(data, index) in questions"
            :key="index"
            class="text-gray-700 border-b pb-2"
          >
            {{ index + 1 }}. {{ data.question }}
          </li>
        </ul>
      </div>

      <!-- Right: Answer Inputs -->
      <div v-if="answers" class="bg-gray-100 p-4 rounded-lg shadow-sm">
        <h2 class="text-lg font-semibold mb-2">Your Answers</h2>
        <form @submit.prevent="submitAnswers">
          <div v-for="(answer, index) in answers" :key="index" class="mb-4">
            <label
              :for="'answer-' + index"
              class="block text-gray-700 font-medium"
            >
              Answer {{ index + 1 }}
            </label>
            <input
              :id="'answer-' + index"
              v-model="answers[index]"
              type="text"
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <button
            type="submit"
            class="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
          >
            Submit
          </button>
        </form>
      </div>
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
      questions: [], // Empty array to store API response
      answers: [], // Empty array to store user answer:
      companyDetails: [],
      companyQuestionnaire: [],
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
          `/api/questionnaire-mapping?id=${this.assessmentId}`,
        );
        console.log(response);

        if (response.data.data && response.data.data.questions) {
          this.questions = response.data.data.questions;
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
        questionId: question.id, // Ensure question has an ID
        answer: this.answers[index] || "", // Avoid undefined values
      }));

      console.log("Submitted Data:", submittedData);

      // You can send the data to the API
      // http.post('/api/submit-answers', { data: submittedData })
      //   .then(response => console.log("Submitted successfully:", response))
      //   .catch(error => console.error("Submission failed:", error));
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
