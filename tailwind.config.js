// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "soft-green": "#D1FAE5", // misol: yengil yashil
        "soft-purple": "#EDE9FE", // misol: yengil binafsha
        primary: "#3BA6FF",
        "primary-dark": "#1E7FD9",
        "primary-light": "#EAF4FF",
        "primary-soft": "#F4F9FF",
        accent: "#6BCBFF",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        shimmer: "shimmer 1.6s linear infinite",
      },
    },
  },
  plugins: [],
};
