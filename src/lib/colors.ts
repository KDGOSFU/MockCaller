/**
 * Single source of truth for the design system color palette.
 * Imported by tailwind.config.ts (for utility classes) and by
 * every styles.ts file (for inline React.CSSProperties).
 */
export const colors = {
  primary:                  '#004d75',
  primaryMid:               '#006699',
  onPrimary:                '#ffffff',
  primaryContainer:         '#e0f2fe',
  onPrimaryContainer:       '#001e30',

  secondary:                '#006a6a',
  onSecondary:              '#ffffff',
  secondaryContainer:       '#90efef',
  onSecondaryContainer:     '#002020',

  tertiary:                 '#713b00',
  tertiaryContainer:        '#ffdcc3',
  onTertiaryContainer:      '#2f1500',

  surface:                  '#f7f9fe',
  onSurface:                '#191c1f',
  surfaceContainerLowest:   '#ffffff',
  surfaceContainerLow:      '#f2f3f8',
  surfaceContainer:         '#eef1f7',
  surfaceContainerHigh:     '#e2e6ef',
  surfaceContainerHighest:  '#dde1ea',

  outline:                  '#707880',
  outlineVariant:           '#c0c7d0',

  error:                    '#ba1a1a',
} as const;
