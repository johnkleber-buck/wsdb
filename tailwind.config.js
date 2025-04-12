/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundColor: {
        primary: '#3b82f6',
        secondary: '#f1f5f9',
        accent: '#0ea5e9',
        destructive: '#ef4444',
        success: '#22c55e',
        warning: '#f59e0b',
        card: '#ffffff',
        muted: '#f8fafc',
        popover: '#ffffff',
      },
      textColor: {
        primary: '#3b82f6',
        secondary: '#64748b',
        accent: '#0ea5e9',
        destructive: '#ef4444',
        success: '#22c55e',
        warning: '#f59e0b',
        'primary-foreground': '#ffffff',
        'secondary-foreground': '#1e293b',
        'accent-foreground': '#ffffff',
        'destructive-foreground': '#ffffff',
        'success-foreground': '#ffffff',
        'warning-foreground': '#ffffff',
        'card-foreground': '#1e293b',
        'muted-foreground': '#64748b',
        'popover-foreground': '#1e293b',
      },
      borderColor: {
        DEFAULT: '#e2e8f0',
        primary: '#3b82f6',
        secondary: '#e2e8f0',
        accent: '#0ea5e9',
        destructive: '#ef4444',
        success: '#22c55e',
        warning: '#f59e0b',
        muted: '#f1f5f9',
      },
      borderRadius: {
        lg: '0.5rem',
        md: '0.375rem',
        sm: '0.25rem',
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}