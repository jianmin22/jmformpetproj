import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    colors:{
      theme_green:'#80C4B7',
      theme_purple:'#EDCBD2',
      theme_orange:'#E3856B',
      white:'#FFFFFF',
      black:'#000000',
      gray:"#F0F0F0",
      red: {
        normal: '#FF0000',  
        dark: '#800000',         
      },

    },
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
    },
  },
  plugins: [],
} satisfies Config;
