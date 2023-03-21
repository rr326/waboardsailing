/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["theme/static/css/*.css", "theme/templates/*.html"],
  theme: {
    extend: {},
    fontFamily: {
      sans: ['Montserrat, Roboto,"Helvetica Neue", sans-serif']
    }
  },
  plugins: [ require('@tailwindcss/typography')]
}
