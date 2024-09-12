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
        accent: "#902C8B",
        lightBlue: "#F2FAFF",
        lightViolet: "#E3D4E3",
        grey: "#787878"
      },
    },
  },
  plugins: [],
};
export default config;
