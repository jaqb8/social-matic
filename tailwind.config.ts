import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#f1f5f9",
        secondary: "#9ca3af",
      },
    },
  },
  plugins: [],
} satisfies Config;
