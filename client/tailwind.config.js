/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        playwrite: ["Playwrite AU SA", "sans-serif"],
      },
      animation: {
        "ping-once": "ping 1s cubic-bezier(0, 0, 0.2, 1) infinite",
      },
      keyframes: {
        ping: {
          "0%": {
            transform: "scale(1)",
            opacity: 1,
          },
          "75%, 100%": {
            transform: "scale(1.5)",
            opacity: 0,
          },
        },
      },
    },
  },
  plugins: [],
};
