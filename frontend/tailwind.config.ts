import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        rose: {
          DEFAULT: '#C8587A',
          deep: '#A03460',
          neon: '#D4607A',
          glow: 'rgba(200,88,122,0.15)',
          dim: 'rgba(200,88,122,0.08)',
          border: 'rgba(200,88,122,0.12)',
        },
        gold: {
          DEFAULT: '#E8BF50',
          light: '#F5D878',
        },
        bg: {
          DEFAULT: '#06030F',
          mid: '#0C0620',
          soft: '#120830',
        },
        cream: '#FDF0F7',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['Nunito', 'sans-serif'],
      },
      animation: {
        'breath': 'breath 6s ease-in-out infinite',
        'float': 'float 8s ease-in-out infinite',
        'pulse-rose': 'pulse-rose 2.2s ease-in-out infinite',
        'halo-spin': 'haloSpin linear infinite',
        'sep-flow': 'sepFlow 3.5s linear infinite',
      },
      keyframes: {
        breath: {
          '0%, 100%': { boxShadow: '0 4px 20px rgba(255,255,255,0.04)' },
          '50%': { boxShadow: '0 4px 40px rgba(200,88,122,0.18), 0 0 80px rgba(200,88,122,0.08)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-9px)' },
        },
        'pulse-rose': {
          '0%, 100%': { boxShadow: '0 4px 20px rgba(160,52,96,0.4)' },
          '50%': { boxShadow: '0 4px 40px rgba(200,88,122,0.78), 0 0 55px rgba(200,88,122,0.22)' },
        },
        haloSpin: {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        sepFlow: {
          '0%': { backgroundPosition: '100% 0' },
          '100%': { backgroundPosition: '-100% 0' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
