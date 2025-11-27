// tailwind.config.js
module.exports = {
  darkMode: 'class',
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        'primary-orange': '#f97316',
        'primary-orange-dark': '#ea580c',
        'primary-black': '#000000',
        'text-dark': '#1f2937',
        'text-gray': '#6b7280',
        'text-light': '#9ca3af',
        'bg-gray': '#f9fafb',
        'border-color': '#e5e7eb',
        'white': '#ffffff',
        'success': '#10b981',
        'error': '#ef4444',
        'warning': '#f59e0b',
      }
    },
  },
  plugins: [],
}