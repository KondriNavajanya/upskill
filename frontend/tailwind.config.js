/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        ink: "#0f172a",
        paper: "#f8fafc",
        accent: {
          50: "#fdf2f8",
          100: "#fce7f3",
          500: "#ec4899",
          600: "#db2777",
          700: "#be185d"
        },
        ocean: {
          500: "#0f766e",
          600: "#0d9488"
        },
        gold: "#f59e0b"
      },
      boxShadow: {
        glow: "0 24px 80px rgba(15, 23, 42, 0.16)"
      },
      backgroundImage: {
        "hero-mesh":
          "radial-gradient(circle at top left, rgba(236, 72, 153, 0.22), transparent 35%), radial-gradient(circle at top right, rgba(13, 148, 136, 0.24), transparent 30%), linear-gradient(135deg, rgba(248,250,252,1) 0%, rgba(241,245,249,0.96) 100%)",
        "hero-mesh-dark":
          "radial-gradient(circle at top left, rgba(236, 72, 153, 0.16), transparent 35%), radial-gradient(circle at top right, rgba(45, 212, 191, 0.15), transparent 30%), linear-gradient(135deg, rgba(15,23,42,1) 0%, rgba(2,6,23,1) 100%)"
      }
    }
  },
  plugins: []
};
