/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#0B0E14",
        elevated: "#0E1219",
        surface: "#131823",
        surface2: "#1A2030",
        line: "#222A36",
        line2: "#2C3644",
        ink: "#E7EAF0",
        muted: "#98A2B3",
        faint: "#6A7385",
        accent: "#2DD4BF",
        "accent-hover": "#27C0AE",
        "accent-ink": "#04221C",
        violet: "#A78BFA",
        danger: "#F87171",
        warn: "#FBBF24",
        success: "#34D399",
        info: "#60A5FA",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
      },
      borderRadius: {
        xl: "14px",
        "2xl": "18px",
      },
      keyframes: {
        "fade-in": { "0%": { opacity: 0, transform: "translateY(4px)" }, "100%": { opacity: 1, transform: "translateY(0)" } },
        "slide-in": { "0%": { transform: "translateX(100%)" }, "100%": { transform: "translateX(0)" } },
        shimmer: { "0%": { backgroundPosition: "-400px 0" }, "100%": { backgroundPosition: "400px 0" } },
      },
      animation: {
        "fade-in": "fade-in 0.2s ease-out",
        "slide-in": "slide-in 0.25s ease-out",
        shimmer: "shimmer 1.4s linear infinite",
      },
    },
  },
  plugins: [],
}
