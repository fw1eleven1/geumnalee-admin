import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // 1024px(iPad 가로 등)까지 모바일 레이아웃, 1025px부터 데스크톱
      screens: {
        lg: "1025px",
      },
    },
  },
  plugins: [],
};

export default config;
