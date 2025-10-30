/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Work Sans"', 'sans-serif'],
      },
      colors: {
        primary: '#0a0b5b',
        'primary-foreground': '#ffffff', // <-- ADD THIS (White Text)

        secondary: '#3690ff',
        'secondary-foreground': '#ffffff', // <-- ADD THIS (White Text)

        ink: '#111',
        muted: '#6b7280',
        status: {
          pending: '#d39e00',
          paid: '#28a745',
          overdue: '#007bff',
          cancelled: '#dc3545',
          unpaid: '#6b7280',
        },
      },
      borderRadius: {
        lg: '12px',
      },
    },
  },
  plugins: [],
}