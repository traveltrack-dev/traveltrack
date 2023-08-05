/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./views/**/*.hbs", "./public/**/*.js", "./public/**/*.html"],
    theme: {
      extend: {},
    },
    plugins: [
        require("daisyui"),
    ],
    daisyui: {
        themes: [
            'corporate'
        ]
    },
  }
