import { transform } from 'lodash';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,css}",
  ],
  theme: {
    extend: {
      keyframes:{
        slide:{
          '0%':{transform: 'translateY(15px)',opacity:'0'},
          '50%':{transform: 'translateY(0px)',opacity:'1',},
          '75%':{transform:'translateY(0px)',opacity:'1',},
          '100%':{transform:'translateY(-100px)',opacity:'0'}
        },

        fade:{
          '0%':{opacity:'0'},
          '100%':{opacity:'1'}
        }
      },
      animation:{
        slide: 'slide 2.0s ease-in-out 1',
        fade: 'fade 6.0s ease-in 1'
      }
    },
  },
  plugins: [
    require("tailwind-animation-delay"),
  ],
   darkMode: 'class',
}

