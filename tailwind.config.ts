import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eefcf8",
          100: "#d7f7ee",
          500: "#1f9d7a",
          700: "#15755b"
        }
      }
    }
  },
  plugins: []
};

export default config;
