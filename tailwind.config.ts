import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
        "card-hover": "0 8px 25px rgba(0,0,0,0.10), 0 4px 10px rgba(0,0,0,0.06)",
      },
      animation: {
        "float": "float 6s ease-in-out infinite",
        "float2": "float2 8s ease-in-out infinite",
        "float3": "float3 5s ease-in-out infinite",
        "fade-in-up": "fadeInUp 0.6s ease-out both",
        "slide-in-left": "slideInLeft 0.5s ease-out both",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "shimmer": "shimmer 1.5s infinite",
      },
    },
  },
  plugins: [],
  safelist: [
    "platform-android",
    "platform-windows",
    "platform-mac",
    "platform-ios",
    "platform-linux",
    "platform-web",
  ],
};

export default config;
