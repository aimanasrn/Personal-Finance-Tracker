import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        accent: {
          400: "#38bdf8",
          500: "#22d3ee",
          600: "#818cf8"
        }
      },
      boxShadow: {
        panel: "0 24px 60px rgba(0, 0, 0, 0.28)"
      }
    }
  },
  plugins: []
} satisfies Config;
