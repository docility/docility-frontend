<template>
  <div class="container mx-auto p-8  rounded-lg">
    <!-- Header Section -->
    <!-- <h1 class="text-4xl font-bold mb-8 text-center text-gray-800">
      {{ questionnaire.type }} Assessment
    </h1> -->

    <!-- Company Details Section -->
    <div
      v-if="companyDetails && !questionnaireCompleted"
      class="bg-gray-100 p-6 rounded-lg shadow-md mb-8"
    >
      <h2 class="text-xl font-semibold mb-4 text-gray-700">
        {{ questionnaire.type }} Details
      </h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-600">
        <p><strong>Name:</strong> {{ questionnaire.type === "Supplier" ? companyDetails.supplier_name : companyDetails.name }}</p>
        <p><strong>Address:</strong> {{ companyDetails.address }}</p>
        <p><strong>Email:</strong> {{ questionnaire.type === "Supplier" ? companyDetails.contact_person_email : companyDetails.email }}</p>
        <p><strong>Status:</strong> {{ companyQuestionnaire.status }}</p>
        <div><strong>Progress:</strong> <strong class="text-md text-black mb-4">
          {{ totalAnsweredQuestions }} / {{ totalQuestionsAcrossTopics }} questions answered
        </strong> <div class="flex items-center mb-2">
          <!-- Progress bar container -->
          <div class="w-full bg-gray-300 rounded-full h-4 relative">
            <!-- Progress fill -->
            <div
              class="bg-blue-600 h-4 rounded-full transition-all duration-300"
              :style="{ width: globalProgressPercentage + '%' }"
            ></div>
          </div>
        
          <!-- 100% label -->
          <div class="ml-2 border border-gray-400 text-sm px-2 py-0.5 rounded">
            {{ Math.round((totalAnsweredQuestions / totalQuestionsAcrossTopics) * 100) }}%
          </div>
        </div> 
          </div>
      </div>
    </div>
   
   <!-- Thank You Message -->
<div
v-if="questionnaireCompleted"
class="bg-white border border-green-300 p-6 md:p-8 text-center rounded-2xl shadow-lg max-w-xl mx-auto"
>
<div class="flex flex-col items-center space-y-3 self-center">
  <!-- Check Icon -->
  <div class="bg-green-100 text-green-600 rounded-full p-3">
    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
    </svg>
  </div>

  <!-- Heading -->
  <h2 class="text-2xl md:text-3xl font-bold text-green-700">Assessment Completed!</h2>

  <!-- Message -->
  <p class="text-gray-600">Your responses have been submitted successfully. Thank you for your participation!</p>
</div>
</div>


    <!-- Form Submitted Message -->
    <div
      v-else-if="submitted"
      class="bg-green-100 p-8 text-center text-green-700 rounded-lg shadow-md"
    >
      <h2 class="text-3xl font-semibold">Thank You!</h2>
      <p class="mt-2">Your answers have been submitted successfully.</p>
    </div>
  
    <!-- Assessment Section -->
    <div v-else-if="questions" class="flex flex-col md:flex-row bg-gray-50 p-6 rounded-lg shadow-md">
      <!-- Topics Section -->
     
      <div class="w-full md:w-1/3 pr-4 border-b md:border-b-0 md:border-r mb-4 md:mb-0">
        <h2 class="text-xl font-semibold mb-4 text-gray-700">Topics</h2>
        <ul class="space-y-3">
          <li
            v-for="(questionsList, topicName) in questions"
            :key="topicName"
            class="text-gray-700"
          >
            <button
              type="button"
              @click="toggle(topicName)"
              :class="{
                'text-white  bg-blue-600 p-2 font-bold': activeQuestion === topicName,
                'text-gray-600  bg-none font-medium hover:underline hover:bg-yellow-500': activeQuestion !== topicName,
              }"
              class="w-full   text-left"
            >
              {{ String(topicName).toUpperCase() }}
            </button>
          </li>
        </ul>
      </div>

      <!-- Questions Section -->
      <div class="w-full md:w-2/3 pl-0 md:pl-6">
        <h2 class="text-xl font-semibold mb-6 text-gray-700">
          {{ String(activeQuestion || "Select a Topic").toUpperCase() }}
        </h2>
      
     
        <form v-if="activeQuestion" @submit.prevent="submitAnswers">
          <!-- Scrollable Form Container -->
          <div class="max-h-full overflow-y-auto pr-2 h-[100%]">
            <div
              v-for="(question, index) in paginatedQuestions"
              :key="index"
              class="mb-6"
            >
              <label
                :for="'answer-' + activeQuestion + '-' + index"
                class="block text-sm font-medium text-gray-700 mb-2"
              >
                {{ question.question }}
              </label>
              <input
                :id="'answer-' + activeQuestion + '-' + index"
                v-model="answers[activeQuestion][index + (currentPage - 1) * questionsPerPage]"
                type="text"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Type your answer here"
              />
            </div>
          </div>
      
          <!-- Pagination Controls -->
          <div class="flex justify-between items-center mt-4">
            <!-- Previous Page Button -->
            <button
              type="button"
              @click="prevPage"
              :disabled="currentPage === 1"
              class="px-4 py-2 bg-blue-600 text-gray-700 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
      
            <!-- Page Indicator -->
            <span class="text-gray-600">
              Page {{ currentPage }} of {{ totalPages }}
            </span>
      
            <!-- Next Page or Next Topic Button -->
            <div>
              <button
                v-if="currentPage < totalPages"
                type="button"
                @click="nextPage"
                :disabled="!canProceed"
                class="px-4 py-2 bg-blue-600 text-gray-700 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
              <button
                v-else-if="!isLastTopic"
                type="button"
                @click="goToNextTopic"
                :disabled="!canProceed"
                 class="px-4 py-2 bg-blue-600 text-gray-700 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next Topic
              </button>
              <button
                v-else
                type="submit"
                :disabled="!canProceed"
                class="px-4 py-2 bg-yellow-600 text-gray-700 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit
              </button>
            </div>
          </div>
        </form>
        <p v-else class="text-gray-500">Please select a topic to view questions.</p>
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
      currentPage: 1, // Current page for pagination
      questionsPerPage: 5, // Number of questions per page
    };
  },
  computed: {
    paginatedQuestions() {
    if (!this.activeQuestion) return [];
    const start = (this.currentPage - 1) * this.questionsPerPage;
    const end = start + this.questionsPerPage;
    return this.questions[this.activeQuestion].slice(start, end);
  },
  totalPages() {
    if (!this.activeQuestion) return 0;
    return Math.ceil(
      this.questions[this.activeQuestion].length / this.questionsPerPage
    );
  },
  isLastTopic() {
    const topicNames = Object.keys(this.questions);
    const currentIndex = topicNames.indexOf(this.activeQuestion);
    return currentIndex === topicNames.length - 1; // True if the current topic is the last one
  },
  answeredQuestions() {
    if (!this.activeQuestion) return 0;
    return this.answers[this.activeQuestion].filter((answer) => answer.trim() !== "").length;
  },
  totalQuestions() {
    if (!this.activeQuestion) return 0;
    return this.questions[this.activeQuestion].length;
  },
  progressPercentage() {
    if (!this.activeQuestion) return 0;
    return Math.round((this.answeredQuestions / this.totalQuestions) * 100);
  },
  canProceed() {
    // Ensure all questions on the current page are answered
    const start = (this.currentPage - 1) * this.questionsPerPage;
    const end = start + this.questionsPerPage;
    return this.answers[this.activeQuestion]
      .slice(start, end)
      .every((answer) => answer.trim() !== ""); 
  },
  // Global progress across all topics
  totalAnsweredQuestions() {
    return Object.values(this.answers).reduce((total, topicAnswers) => {
      return total + topicAnswers.filter((answer) => answer.trim() !== "").length;
    }, 0);
  },
  totalQuestionsAcrossTopics() {
    return Object.values(this.questions).reduce((total, topicQuestions) => {
      return total + topicQuestions.length;
    }, 0);
  },
  globalProgressPercentage() {
    if (this.totalQuestionsAcrossTopics === 0) return 0;
    return Math.round((this.totalAnsweredQuestions / this.totalQuestionsAcrossTopics) * 100);
  },
  },
  methods: {
    toggle(topicName) {
      // Toggle the active topic (show/hide its questions)
      if (this.activeQuestion === topicName) {
        this.activeQuestion = null;
      } else {
        this.activeQuestion = topicName;
        this.currentPage = 1; // Reset to the first page when switching topics
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    goToNextTopic() {
      const topicNames = Object.keys(this.questions);
      const currentIndex = topicNames.indexOf(this.activeQuestion);

      if (currentIndex !== -1 && currentIndex < topicNames.length - 1) {
        this.activeQuestion = topicNames[currentIndex + 1]; // Move to the next topic
        this.currentPage = 1; // Reset to the first page of the new topic
      } else {
        console.log("No more topics available.");
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
        this.toggle(response.data.data.questions[0].topic); // Set the first topic as active
        console.log("Questions:", this.questions);
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
              acc[topicName] = new Array(this.questions[topicName].length).fill("");
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
  padding: 5px 10px;
  text-align: left;
  font-size: 16px;
  cursor: pointer;
}

button:focus {
  outline: none;
}

.max-h-[500px] {
  max-height: 500px;
  overflow-y: auto;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>