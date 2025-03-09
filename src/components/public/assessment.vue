<template>
  <div class="container mx-auto p-6 bg-white shadow-md rounded-lg gap-2">
    <h1 class="text-2xl font-bold mb-4 text-center">
      {{ questionnaire.type }} ASSESSMENT
    </h1>

    <!-- Company Details Section -->
    <div
      v-if="companyDetails && !questionnaireCompleted"
      class="bg-gray-100 p-4 rounded-lg shadow-sm flex mb-6 flex-col"
    >
      <h2 class="text-lg font-semibold mb-2">
        {{ questionnaire.type }} Details
      </h2>
      <label>
        Name:
        {{
          questionnaire.type === "Supplier"
            ? companyDetails.supplier_name
            : companyDetails.name
        }}
      </label>
      <label>Address: {{ companyDetails.address }}</label>
      <label>
        Email:
        {{
          questionnaire.type === "Supplier"
            ? companyDetails.contact_person_email
            : companyDetails.email
        }}
      </label>
      <label>Status: {{ companyQuestionnaire.status }}</label>
    </div>

    <!-- Show Thank You message if Questionnaire is Completed -->
    <div
      v-if="questionnaireCompleted"
      class="bg-green-100 p-6 text-center text-green-700 rounded-lg shadow-md"
    >
      <h2 class="text-2xl font-semibold">Assessment Completed!</h2>
      <p>Your questionnaire has been submitted successfully.</p>
    </div>

    <!-- Show Thank You message if Form is Submitted -->
    <div
      v-else-if="submitted"
      class="bg-green-100 p-6 text-center text-green-700 rounded-lg shadow-md"
    >
      <h2 class="text-2xl font-semibold">Thank You!</h2>
      <p>Your answers have been submitted successfully.</p>
    </div>

    <!-- Questionnaire & Answers -->
    <div v-else-if="questions" class="bg-gray-100 p-4 rounded-lg shadow-sm">
      <h2 class="text-lg font-semibold mb-2">Topics</h2>
      <form @submit.prevent="submitAnswers">
        <ul class="space-y-4">
          <li
            v-for="(questionsList, topicName) in questions"
            :key="topicName"
            class="text-gray-700 border-b pb-4"
          >
            <div>
              <!-- Accordion Button to Toggle Topics -->
              <button
                type="button"
                @click="toggle(topicName)"
                class="w-full text-left text-blue-500 font-medium"
              >
                {{ topicName }}
              </button>

              <!-- Questions Accordion (shown if active) -->
              <div v-show="activeQuestion === topicName" class="space-y-2 mt-2">
                <div
                  v-for="(question, index) in questionsList"
                  :key="index"
                  class="mb-4"
                >
                  <label
                    :for="'answer-' + topicName + '-' + index"
                    class="block text-sm font-medium text-gray-700"
                  >
                    {{ question.question }}
                  </label>
                  <input
                    :id="'answer-' + topicName + '-' + index"
                    v-model="answers[topicName][index]"
                    type="text"
                    class="w-full px-3 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              </div>
            </div>
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
      topics: [],
      assessmentId: "",
      questions: {}, // Stores API response for questions, grouped by topic name
      answers: {}, // Stores user answers, grouped by topic name
      companyDetails: [],
      companyQuestionnaire: [],
      questionnaire: [],
      submitted: false, // Tracks form submission status
      questionnaireCompleted: false,
      activeQuestion: null, // Track the currently expanded topic
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

        if (response.data?.questionnaireStatus?.toLowerCase() === "completed") {
          this.questionnaireCompleted = true;
        }

        if (response.data.data) {
          // Grouping questions by topic
          let questionData = {};
          response.data.data.questions.map((item) => {
            if (!questionData[item.topic]) questionData[item.topic] = [];
            questionData[item.topic].push(item);
          });
          this.questions = questionData;

          // Initialize answers object
          this.answers = Object.keys(this.questions).reduce(
            (acc, topicName) => {
              acc[topicName] = new Array(this.questions[topicName].length).fill(
                ""
              );
              return acc;
            },
            {}
          );

          this.questionnaire = response.data.data.questionnaire?.[0] || {};
          this.companyDetails = response.data.data.company_details?.[0] || {};
          this.companyQuestionnaire =
            response.data.data.company_questionnaire || {};
        } else {
          console.warn("No valid data found in response.");
        }
      } catch (error) {
        console.error("Error fetching assessment:", error);
      }
    },
    submitAnswers() {
      const submittedData = [];

      // Flatten answers grouped by topics into an array for submission
      Object.keys(this.answers).forEach((topicName) => {
        this.answers[topicName].forEach((answer, index) => {
          const question = this.questions[topicName][index];
          submittedData.push({
            answer: answer || "", // Avoid undefined values
            questionnaire_id: String(
              this.companyQuestionnaire.questionnaire_id
            ),
            question_id: String(question.id),
            company_id:
              this.questionnaire.type === "Supplier"
                ? ""
                : String(this.companyDetails.id),
            supplier_id:
              this.questionnaire.type === "Supplier"
                ? String(this.companyDetails.id)
                : "",
            type:
              this.questionnaire.type === "Supplier" ? "Supplier" : "Company",
          });
        });
      });

      console.log("Submitted Data:", submittedData);

      // API request to submit answers
      http
        .post("/api/create-bulk/submitAnswer", {
          data: submittedData,
          url: this.assessmentId,
        })
        .then((response) => {
          console.log("Submitted successfully:", response);

          if (response.data.is_success) {
            this.submitted = true; // Show thank you message
          }
        })
        .catch((error) => {
          console.error("Submission failed:", error);
        });
    },
    toggle(topicName) {
      // Toggle the active topic (show/hide its questions)
      this.activeQuestion =
        this.activeQuestion === topicName ? null : topicName;
    },
  },
  mounted() {
    this.fetchAssessment();
  },
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
}

button {
  background: none;
  border: none;
  padding: 0;
  text-align: left;
  font-size: 16px;
  cursor: pointer;
}

button:focus {
  outline: none;
}
</style>
