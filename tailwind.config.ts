import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#006699',
        'on-primary': '#ffffff',
        'primary-container': '#e0f2fe',
        'on-primary-container': '#001e30',
        secondary: '#006a6a',
        'on-secondary': '#ffffff',
        'secondary-container': '#90efef',
        'on-secondary-container': '#002020',
        tertiary: '#713b00',
        'tertiary-container': '#ffdcc3',
        'on-tertiary-container': '#2f1500',
        surface: '#f8fafc',
        'on-surface': '#0f172a',
        'surface-container': '#f1f5f9',
        'surface-container-high': '#e2e8f0',
        outline: '#94a3b8',
        'outline-variant': '#cbd5e1',
        error: '#b91c1c',
      },
      fontFamily: {
        headline: ['Manrope', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        body: ['Manrope', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        label: ['Manrope', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '8px',
        lg: '12px',
        xl: '16px',
      },
    },
  },
  plugins: [],
}
export default config
