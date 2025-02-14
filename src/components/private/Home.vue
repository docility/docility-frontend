<template>
  <div class="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
    <div class="text-center mb-6">
      <img
        src="@/assets/logo.jpg"
        alt="Assessment Platform Logo"
        class="h-24 mx-auto"
      />
    </div>
    <h2 class="text-4xl font-bold text-center mb-6">
      Welcome to the Assessment Dashboard
    </h2>
    <p class="text-lg text-gray-700 text-center mb-8">
      Track your assessments, view results, and manage deadlines all in one
      place.
    </p>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <div class="bg-gray-100 p-4 rounded-lg border border-gray-200">
        <h3 class="text-2xl font-semibold mb-3">Key Features</h3>
        <ul class="list-disc list-inside text-gray-700">
          <li>View and manage your assessments.</li>
        </ul>
      </div>

      <div class="bg-gray-100 p-4 rounded-lg border border-gray-200">
        <h3 class="text-2xl font-semibold mb-3">Upcoming Events</h3>
        <ul class="list-disc list-inside text-gray-700">
          <li>October 30th: Events Submission</li>
        </ul>
      </div>
    </div>

    <div class="bg-white p-4 rounded-lg border border-gray-200 mb-6 shadow">
      <h3 class="text-2xl font-semibold mb-3">Important Announcements</h3>
      <ul class="list-decimal list-inside text-gray-700">
        <li>
          Assessment guidelines have been updated; please check the resources
          section.
        </li>
      </ul>
    </div>

    <footer class="text-center text-gray-500 text-sm">
      <p>&copy; 2024 Assessment Platform. All rights reserved.</p>
    </footer>
  </div>
</template>

<script>
export default {
  name: "AssessmentComponent",
};
</script>

<style scoped>
.bg-gray-100 {
  background-color: #f7fafc; /* Light gray background */
}
.bg-white {
  background-color: #ffffff; /* White background */
}
.border {
  border-width: 1px;
}
.shadow-lg {
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1); /* Larger shadow for depth */
}
</style>
