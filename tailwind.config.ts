import type { Config } from 'tailwindcss';
import { colors } from './src/lib/colors';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary:                    colors.primary,
        'primary-mid':              colors.primaryMid,
        'on-primary':               colors.onPrimary,
        'primary-container':        colors.primaryContainer,
        'on-primary-container':     colors.onPrimaryContainer,

        secondary:                  colors.secondary,
        'on-secondary':             colors.onSecondary,
        'secondary-container':      colors.secondaryContainer,
        'on-secondary-container':   colors.onSecondaryContainer,

        tertiary:                   colors.tertiary,
        'tertiary-container':       colors.tertiaryContainer,
        'on-tertiary-container':    colors.onTertiaryContainer,

        surface:                    colors.surface,
        'on-surface':               colors.onSurface,
        'surface-container-lowest': colors.surfaceContainerLowest,
        'surface-container-low':    colors.surfaceContainerLow,
        'surface-container':        colors.surfaceContainer,
        'surface-container-high':   colors.surfaceContainerHigh,
        'surface-container-highest':colors.surfaceContainerHighest,

        outline:                    colors.outline,
        'outline-variant':          colors.outlineVariant,

        error:                      colors.error,
      },
      fontFamily: {
        headline: ['Manrope', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        body:     ['Inter',   'ui-sans-serif', 'system-ui', 'sans-serif'],
        label:    ['Inter',   'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '8px',
        md:      '0.75rem',
        lg:      '12px',
        xl:      '16px',
      },
      boxShadow: {
        ambient: '0 20px 40px rgba(0, 30, 49, 0.06)',
      },
    },
  },
  plugins: [],
};

export default config;
