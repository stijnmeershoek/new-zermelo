/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "theme": "#ee3b33",
        "themeDark": "#1a1a1a",
        "themeWhite": "#f8f8f8"
      },
      screens: {
        'dsk': '1110px',
      },
      fontFamily: {
        'helvetica': ['HelveticaNowDisplay', 'ui-serif', 'Georgia', 'Cambria', "Times New Roman", 'Times', 'serif']
      }
    },
  },
  experimental: {
    optimizeUniversalDefaults: true
  },
  plugins: [],
};
