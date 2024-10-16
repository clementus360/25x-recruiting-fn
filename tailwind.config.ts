import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1579BE",
        accent: "#1579BE",
        lightBlue: "#F2FAFF",
        lightViolet: "#fce6da",
        grey: "#787878",
        white: '#FeFeFe'
      },
    },
  },
  plugins: [],
};
export default config;
