/* @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  // daisyUI를 Tailwind CSS 플러그인으로 추가
  plugins: [require("daisyui")],
};
