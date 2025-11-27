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
        // Primary Colors
        'calm-beige': '#F3EFE7',
        'deep-navy': '#1D1F24',
        // Secondary Colors
        'warm-gray': '#8A8A8A',
        'sand-brown': '#C5B9A3',
        'soft-white': '#FFFFFF',
        // Status Colors
        success: '#47B881',
        warning: '#F7C948',
        error: '#EC4C47',
        info: '#7089A9',
      },
      fontFamily: {
        sans: ['Noto Sans JP', 'Noto Sans KR', 'Noto Sans', 'sans-serif'],
        serif: ['Playfair Display', 'Pretendard', 'serif'],
      },
      fontSize: {
        h1: ['32px', { lineHeight: '1.3', fontWeight: '700' }],
        h2: ['24px', { lineHeight: '1.4', fontWeight: '600' }],
        h3: ['20px', { lineHeight: '1.4', fontWeight: '600' }],
        body: ['16px', { lineHeight: '1.6', fontWeight: '400' }],
        caption: ['12px', { lineHeight: '1.5', fontWeight: '400' }],
      },
      borderRadius: {
        button: '10px',
        card: '12px',
        'card-lg': '16px',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
      boxShadow: {
        card: '0 2px 8px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 4px 16px rgba(0, 0, 0, 0.12)',
        button: '0 2px 4px rgba(0, 0, 0, 0.1)',
      },
      transitionDuration: {
        DEFAULT: '150ms',
        hover: '200ms',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
    screens: {
      mobile: '375px',
      tablet: '768px',
      desktop: '1024px',
      wide: '1280px',
    },
  },
  plugins: [],
};

export default config;
