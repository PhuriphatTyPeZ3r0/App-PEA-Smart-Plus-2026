import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#9b2785',
        'primary-light': '#fdeaf6',
        'bg-color': '#f9f9fc',
        'text-dark': '#333',
        'text-gray': '#6b6b6b',
        'border-color': '#eee',
        success: '#2e7d32',
        'success-bg': '#e8f5e9',
        danger: '#d32f2f',
      },
      fontFamily: {
        prompt: ['var(--font-prompt)'],
      },
    },
  },
  plugins: [],
};

export default config;
