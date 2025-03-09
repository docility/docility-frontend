// tailwind.config.js
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        dark: {
          background: {
            primary: "#42f5e0",
            secondary: "#279386",
            DEFAULT: "#ffffff",
          },
          select: {
            DEFAULT: "#2eab9c",
          },
          text: {
            DEFAULT: "#ecfefb",
            primary: "#0d312c",
            secondary: "#1a6259",
          },
        },
      },
    },
  },
  plugins: [require('tailwind-scrollbar')],
};
