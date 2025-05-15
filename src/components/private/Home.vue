<template>
  <div class="max-w-6xl mx-auto p-8 bg-gray-50 rounded-lg shadow-lg">
    <!-- Header Section -->
    <div class="text-center mb-10">
      <img
        src="@/assets/logo.jpg"
        alt="Assessment Platform Logo"
        class="h-20 mx-auto mb-4"
      />
      <h1 class="text-5xl font-extrabold text-gray-800">
        Welcome to the Assessment Dashboard
      </h1>
      <p class="text-lg text-gray-600 mt-4">
        Your one-stop platform to track assessments, view results, and manage deadlines efficiently.
      </p>
    </div>

    <!-- Key Features and Upcoming Events -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
      <!-- Key Features -->
      <div class="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h3 class="text-2xl font-semibold text-blue-600 mb-4">Key Features</h3>
        <ul class="list-disc list-inside text-gray-700 space-y-2">
          <li>View and manage your assessments.</li>
          <li>Track progress and deadlines in real-time.</li>
          <li>Access detailed reports and analytics.</li>
        </ul>
      </div>

      <!-- Upcoming Events -->
      <div class="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h3 class="text-2xl font-semibold text-blue-600 mb-4">Upcoming Events</h3>
        <ul class="list-disc list-inside text-gray-700 space-y-2">
          <li>October 30th: Events Submission</li>
          <li>November 15th: Assessment Review Meeting</li>
          <li>December 1st: Final Assessment Deadline</li>
        </ul>
      </div>
    </div>

    <!-- Announcements Section -->
    <div class="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-10">
      <h3 class="text-2xl font-semibold text-blue-600 mb-4">Important Announcements</h3>
      <ul class="list-decimal list-inside text-gray-700 space-y-2">
        <li>
          Assessment guidelines have been updated. Please check the resources section for details.
        </li>
        <li>
          New training sessions are available for assessment coordinators.
        </li>
        <li>
          Ensure all submissions are completed before the deadlines.
        </li>
      </ul>
    </div>

    <!-- Call to Action Section -->
    <div class="bg-gradient-to-r from-blue-500 to-blue-700 text-white p-6 rounded-lg shadow-md text-center">
      <h3 class="text-3xl font-bold mb-4">Ready to Get Started?</h3>
      <p class="text-lg mb-6">
        Begin your journey by exploring assessments or creating new ones.
      </p>
      <div class="flex justify-center space-x-4">
        <button
          class="bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg shadow hover:bg-gray-100 transition duration-200"
        >
          View Assessments
        </button>
        <button
          class="bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg shadow hover:bg-blue-800 transition duration-200"
        >
          Create New Assessment
        </button>
      </div>
    </div>

    <!-- Footer -->
    <footer class="text-center text-gray-500 text-sm mt-10">
      <p>&copy; 2024 Assessment Platform. All rights reserved.</p>
    </footer>
  </div>
</template>

<script>
export default {
  name: "HomeComponent",
};
</script>

<style scoped>
.bg-gray-50 {
  background-color: #f9fafb; /* Light gray background for the main container */
}
.bg-white {
  background-color: #ffffff; /* White background for cards */
}
.text-blue-600 {
  color: #2563eb; /* Blue text for headings */
}
.bg-blue-600 {
  background-color: #2563eb; /* Blue background for buttons */
}
.bg-blue-700 {
  background-color: #1d4ed8; /* Darker blue for hover states */
}
.bg-gradient-to-r {
  background: linear-gradient(to right, #2563eb, #1d4ed8); /* Gradient for call-to-action */
}
.shadow-md {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Medium shadow for depth */
}
.shadow-lg {
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1); /* Larger shadow for depth */
}
</style>