/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#646cff',
          hover: '#535bf2',
        },
        background: {
          dark: '#242424',
          light: '#ffffff',
        },
        text: {
          dark: 'rgba(255, 255, 255, 0.87)',
          light: '#213547',
        },
        toast: {
          success: {
            from: '#2ecc71',
            to: '#27ae60',
          },
          error: {
            from: '#e74c3c',
            to: '#c0392b',
          },
          info: {
            from: '#3498db',
            to: '#2c82c9',
          },
        },
      },
      animation: {
        'logo-spin': 'spin 20s linear infinite',
        'gradient-shift': 'gradientShift 3s ease infinite',
        'grain': 'grain 8s steps(10) infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse': 'pulse 2s ease-in-out infinite',
      },
      keyframes: {
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        grain: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '10%': { transform: 'translate(-1%, -1%)' },
          '20%': { transform: 'translate(1%, 1%)' },
          '30%': { transform: 'translate(-1%, 1%)' },
          '40%': { transform: 'translate(1%, -1%)' },
          '50%': { transform: 'translate(-1%, -1%)' },
          '60%': { transform: 'translate(1%, 1%)' },
          '70%': { transform: 'translate(-1%, 1%)' },
          '80%': { transform: 'translate(1%, -1%)' },
          '90%': { transform: 'translate(-1%, -1%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        pulse: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.1)', opacity: '0.8' },
        },
      },
    },
  },
  plugins: [],
}