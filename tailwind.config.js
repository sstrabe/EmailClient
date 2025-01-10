/** @type {import('tailwindcss').Config} */
export default {
  content: ["./dist/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        background: "#302f2f",
        foreground: "var(--foreground)",
        primary: "#202225",
        secondary: "#d1d5db",
        icon: "#f43f5e"
      },
      backgroundImage: {
        'triangles': "url('../public/background.svg')"
      }
    },
  },
  plugins: [],
}

