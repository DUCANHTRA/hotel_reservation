export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#1A1A1A',
          50: '#F5F5F0',
          100: '#E8E8E3',
          200: '#999999',
          300: '#666666',
          400: '#333333',
          500: '#1A1A1A',
        },
        paper: {
          DEFAULT: '#F5F5F0',
          light: '#FFFFFF',
          dark: '#E8E8E3',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans JP', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        readable: '70ch',
      },
    },
  },
  plugins: [],
};
