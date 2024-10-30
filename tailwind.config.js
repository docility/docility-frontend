// tailwind.config.js
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: {
          light: '#f4f4f4',
          DEFAULT: '#ffffff',
        },
        primary: {
          DEFAULT: '#42f5e0',
          text: '#ffffff', // Text color for primary buttons
        },
        secondary: {
          DEFAULT: '#f54242', // Red
          alternate: '#f5e142', // Yellow
          text: '#333333', // Text color for secondary buttons
        },
        text: {
          DEFAULT: '#333333', 
          primary: "#333333",
          secondary: '#f54242'
        }
      },
    },
  },
  plugins: [],
}
