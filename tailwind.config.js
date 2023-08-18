/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./views/**/*.hbs", "./public/**/*.js", "./public/**/*.html", "./routes/**/*.js"],
    theme: {
      extend: {},
    },
    plugins: [
        require("daisyui"),
    ],
    daisyui: {
        themes: [
            'emerald'
        ]
    },
  }
