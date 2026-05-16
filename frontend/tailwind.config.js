/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        tariki: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a5f',
          950: '#172554',
        },
        traffic: {
          fluid: '#22c55e',
          moderate: '#eab308',
          congested: '#ef4444',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        'logo-pulse': {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.04)', opacity: '0.92' },
        },
        'traffic-dot': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.55' },
        },
        'traffic-4d': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.75', transform: 'scale(1.22)' },
        },
        'logo-4d-glow': {
          '0%, 100%': { opacity: '0.35', transform: 'scale(0.92)' },
          '50%': { opacity: '0.7', transform: 'scale(1.08)' },
        },
        'robot-float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        'robot-blink': {
          '0%, 92%, 100%': { transform: 'scaleY(1)' },
          '96%': { transform: 'scaleY(0.1)' },
        },
        'robot-wave': {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(-12deg)' },
          '75%': { transform: 'rotate(8deg)' },
        },
        'robot-antenna': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
      animation: {
        'logo-pulse': 'logo-pulse 2.5s ease-in-out infinite',
        'traffic-dot': 'traffic-dot 1.8s ease-in-out infinite',
        'traffic-4d': 'traffic-4d 1.4s ease-in-out infinite',
        'logo-4d-glow': 'logo-4d-glow 3s ease-in-out infinite',
        'robot-float': 'robot-float 2.8s ease-in-out infinite',
        'robot-blink': 'robot-blink 3.5s ease-in-out infinite',
        'robot-wave': 'robot-wave 0.6s ease-in-out infinite',
        'robot-antenna': 'robot-antenna 1.2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
