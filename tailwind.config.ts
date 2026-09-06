import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: "#2563eb",
          emerald: "#10b981"
        }
      }
    }
  },
  plugins: []
} satisfies Config;

