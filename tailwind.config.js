module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: "class",
  theme: {
    extend: {
      screens: {
        'dsk': '1110px',
      },
      fontFamily: {
        'sf': ['SF Pro', 'ui-serif', 'Georgia', 'Cambria', "Times New Roman", 'Times', 'serif'],
        'helvetica': ['HelveticaNowDisplay', 'ui-serif', 'Georgia', 'Cambria', "Times New Roman", 'Times', 'serif']
      }
    },
  },
  plugins: [],
};
