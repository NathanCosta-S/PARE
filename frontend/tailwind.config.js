/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html','./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    container: { center: true, padding: '1rem' },
    extend: {
      colors: {
        brand: {
          50:  '#fff7f2',
          100: '#fce8de',
          200: '#f7c9b3',
          300: '#f3a883',
          400: '#e97f52',
          500: '#c94e1b',   // claro (principal)
          600: '#b74618',
          700: '#954532',   // escuro
          800: '#733427',
          900: '#4b2018'
        },
        orange: {
          50:  '#fff7f2',
          100: '#fce8de',
          200: '#f7c9b3',
          300: '#f3a883',
          400: '#e97f52',
          500: '#c94e1b',
          600: '#b74618',
          700: '#954532',
          800: '#733427',
          900: '#4b2018'
        }
      },
      boxShadow: {
        soft: '0 1px 2px rgba(16,24,40,.04), 0 1px 3px rgba(16,24,40,.08)',
        card: '0 1px 2px rgba(16,24,40,.06), 0 2px 8px rgba(16,24,40,.06)'
      },
      borderRadius: {
        xl: '0.75rem',
        '2xl': '1rem'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'Segoe UI', 'Roboto', 'Arial', 'sans-serif']
      }
    }
  },
  plugins: [require('@tailwindcss/forms')],
}
