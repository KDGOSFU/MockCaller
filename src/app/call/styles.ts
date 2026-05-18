import { colors } from '@/lib/colors';
export { colors };

const font = {
  headline: 'Manrope, sans-serif',
  body:     'Inter, ui-sans-serif, sans-serif',
} as const;

/* ── Page shell ─────────────────────────────────────────────────── */
export const pageStyle: React.CSSProperties = {
  backgroundColor: colors.surface,
  fontFamily:      font.body,
};

/* ── Header ─────────────────────────────────────────────────────── */
export const headerStyle: React.CSSProperties = {
  padding:                  '0 40px',
  height:                   '60px',
  backgroundColor:          'rgba(255,255,255,0.72)',
  backdropFilter:           'blur(24px)',
  WebkitBackdropFilter:     'blur(24px)',
  position:                 'sticky',
  top:                      0,
  zIndex:                   10,
  boxShadow:                '0 1px 0 rgba(0,30,49,0.07)',
};

export const logoStyle: React.CSSProperties = {
  fontFamily:    font.headline,
  fontWeight:    700,
  fontSize:      '1.2rem',
  color:         colors.primary,
  letterSpacing: '-0.01em',
};

export const sessionLabelStyle: React.CSSProperties = {
  fontSize: '0.875rem',
  color:    colors.outline,
};

export const settingsBtnStyle: React.CSSProperties = {
  color:      colors.outline,
  background: 'none',
  border:     'none',
  cursor:     'pointer',
  display:    'flex',
  alignItems: 'center',
};

/* ── Body wrapper ───────────────────────────────────────────────── */
export const bodyStyle: React.CSSProperties = {
  padding: '24px 40px',
};

/* ── Left card ──────────────────────────────────────────────────── */
export const callCardStyle: React.CSSProperties = {
  backgroundColor: colors.surfaceContainerLowest,
  boxShadow:       '0 4px 24px rgba(0,30,49,0.08)',
  marginBottom:    '24px',
};

export const aiPillStyle: React.CSSProperties = {
  padding:         '8px 20px',
  gap:             '8px',
  backgroundColor: colors.surfaceContainerLow,
  color:           colors.primary,
};

export const avatarOuterStyle: React.CSSProperties = {
  width:           256,
  height:          256,
  backgroundColor: '#4fa8d5',
  opacity:         0.35,
  borderRadius:    '50%',
};

export const avatarMidStyle: React.CSSProperties = {
  width:           208,
  height:          208,
  backgroundColor: '#2d8ab5',
  opacity:         0.25,
  borderRadius:    '50%',
};

export const avatarInnerStyle: React.CSSProperties = {
  width:           144,
  height:          144,
  backgroundColor: colors.surfaceContainerLowest,
  boxShadow:       '0 8px 32px rgba(0,30,49,0.12)',
  borderRadius:    '50%',
};

export const captionHeadingStyle: React.CSSProperties = {
  fontFamily:   font.headline,
  fontWeight:   700,
  fontSize:     '1.5rem',
  color:        colors.onSurface,
  marginBottom: '8px',
};

export const captionSubStyle: React.CSSProperties = {
  fontSize:  '0.875rem',
  color:     colors.outline,
  lineHeight: 1.6,
  maxWidth:  '280px',
};

/* ── Controls bar ───────────────────────────────────────────────── */
export const controlsBarStyle: React.CSSProperties = {
  backgroundColor: colors.surfaceContainerLow,
  padding:         '16px 32px',
  gap:             '12px',
};

export const startCallBtnStyle: React.CSSProperties = {
  display:      'inline-flex',
  alignItems:   'center',
  gap:          '10px',
  padding:      '12px 32px',
  borderRadius: '12px',
  background:   `linear-gradient(135deg, ${colors.primary}, ${colors.primaryMid})`,
  color:        '#ffffff',
  fontSize:     '0.875rem',
  fontWeight:   500,
  border:       'none',
  cursor:       'pointer',
  fontFamily:   font.body,
};

export const muteBtnStyle: React.CSSProperties = {
  padding:         '12px 24px',
  gap:             '10px',
  backgroundColor: colors.surfaceContainerLowest,
  color:           colors.onSurface,
  borderRadius:    '12px',
  border:          'none',
  fontSize:        '0.875rem',
  fontWeight:      500,
  cursor:          'pointer',
  fontFamily:      font.body,
  boxShadow:       '0 1px 4px rgba(0,0,0,0.08)',
};

export const endCallBtnStyle: React.CSSProperties = {
  padding:      '12px 24px',
  gap:          '10px',
  background:   `linear-gradient(135deg, ${colors.primary}, ${colors.primaryMid})`,
  color:        '#ffffff',
  borderRadius: '12px',
  border:       'none',
  fontSize:     '0.875rem',
  fontWeight:   500,
  cursor:       'pointer',
  fontFamily:   font.body,
};

/* ── Right panel cards ──────────────────────────────────────────── */
export const infoPanelCardStyle: React.CSSProperties = {
  backgroundColor: colors.surfaceContainerLowest,
  boxShadow:       '0 4px 24px rgba(0,30,49,0.08)',
  padding:         '24px',
};

export const cardHeadingStyle: React.CSSProperties = {
  fontFamily:   font.headline,
  fontWeight:   600,
  fontSize:     '1rem',
  color:        colors.onSurface,
  marginBottom: '16px',
};

export const rowLabelStyle: React.CSSProperties = {
  fontSize: '0.875rem',
  color:    colors.outline,
};

export const rowValueStyle = (color: string = colors.onSurface): React.CSSProperties => ({
  fontSize:   '0.875rem',
  fontWeight: 600,
  color,
  textAlign:  'right',
  flex:       1,
});

/* ── Contact card ───────────────────────────────────────────────── */
export const contactHeaderStyle: React.CSSProperties = {
  marginBottom: '20px',
};

export const avatarBadgeStyle: React.CSSProperties = {
  width:           40,
  height:          40,
  backgroundColor: colors.primaryContainer,
  borderRadius:    '50%',
  display:         'flex',
  alignItems:      'center',
  justifyContent:  'center',
  flexShrink:      0,
};

export const contactNameStyle: React.CSSProperties = {
  fontFamily:  font.headline,
  fontWeight:  600,
  fontSize:    '1rem',
  color:       colors.onSurface,
  lineHeight:  1.2,
};

export const primaryContactBadgeStyle: React.CSSProperties = {
  fontSize:      '0.75rem',
  fontWeight:    700,
  color:         colors.secondary,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  marginTop:     '3px',
};

export const addressStyle: React.CSSProperties = {
  fontSize:    '0.875rem',
  color:       colors.outline,
  lineHeight:  1.6,
};

export const detailsListStyle: React.CSSProperties = {
  display:       'flex',
  flexDirection: 'column',
  gap:           '10px',
  marginBottom:  '20px',
};

export const detailLabelStyle: React.CSSProperties = {
  fontSize:   '0.875rem',
  color:      colors.outline,
  flexShrink: 0,
};

export const detailValueStyle = (link = false): React.CSSProperties => ({
  fontSize:   '0.875rem',
  fontWeight: 500,
  textAlign:  'right',
  color:      link ? colors.primaryMid : colors.onSurface,
});

export const tonalDividerStyle: React.CSSProperties = {
  height:          '1px',
  backgroundColor: colors.surfaceContainerLow,
  marginBottom:    '16px',
};

export const pastGiftsLabelStyle: React.CSSProperties = {
  fontSize:      '0.7rem',
  color:         colors.outline,
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  fontWeight:    600,
  marginBottom:  '12px',
};

export const giftAmountStyle: React.CSSProperties = {
  fontFamily:  font.headline,
  fontWeight:  700,
  fontSize:    '1rem',
  color:       colors.onSurface,
  lineHeight:  1.2,
};

export const giftLabelStyle: React.CSSProperties = {
  fontSize: '0.875rem',
  color:    colors.outline,
};

export const giftDateStyle: React.CSSProperties = {
  fontSize:   '0.875rem',
  color:      colors.outline,
  marginTop:  '2px',
  flexShrink: 0,
};

/* ── Session timer ──────────────────────────────────────────────── */
export const timerCardStyle: React.CSSProperties = {
  backgroundColor: colors.surfaceContainerLowest,
  boxShadow:       '0 4px 24px rgba(0,30,49,0.08)',
  padding:         '16px 24px',
  marginBottom:    '24px',
};

export const timerLabelStyle: React.CSSProperties = {
  fontFamily:  font.headline,
  fontWeight:  600,
  fontSize:    '0.875rem',
  color:       colors.onSurface,
  lineHeight:  1.2,
};

export const timerSubLabelStyle: React.CSSProperties = {
  fontSize:      '0.7rem',
  color:         colors.outline,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
};

export const timerValueStyle: React.CSSProperties = {
  fontFamily:        font.headline,
  fontWeight:        700,
  fontSize:          '1.5rem',
  color:             colors.primary,
  fontVariantNumeric: 'tabular-nums',
};

/* ── End call modal ─────────────────────────────────────────────── */
export const modalOverlayStyle: React.CSSProperties = {
  position:        'fixed',
  inset:           0,
  backgroundColor: 'rgba(0,20,40,0.45)',
  backdropFilter:  'blur(4px)',
  display:         'flex',
  alignItems:      'center',
  justifyContent:  'center',
  zIndex:          50,
};

export const modalCardStyle: React.CSSProperties = {
  backgroundColor: colors.surfaceContainerLowest,
  borderRadius:    '20px',
  padding:         '36px 40px',
  width:           '360px',
  boxShadow:       '0 24px 64px rgba(0,30,49,0.18)',
  display:         'flex',
  flexDirection:   'column',
  alignItems:      'center',
  gap:             '8px',
  textAlign:       'center',
};

export const modalHeadingStyle: React.CSSProperties = {
  fontFamily:  'Manrope, sans-serif',
  fontWeight:  700,
  fontSize:    '1.25rem',
  color:       colors.onSurface,
  marginTop:   '8px',
};

export const modalSubStyle: React.CSSProperties = {
  fontSize:   '0.875rem',
  color:      colors.outline,
  lineHeight: 1.6,
  marginBottom: '8px',
};

export const modalIconWrapStyle: React.CSSProperties = {
  width:           '56px',
  height:          '56px',
  borderRadius:    '50%',
  backgroundColor: '#fee2e2',
  display:         'flex',
  alignItems:      'center',
  justifyContent:  'center',
};

export const modalActionsStyle: React.CSSProperties = {
  display: 'flex',
  gap:     '12px',
  width:   '100%',
  marginTop: '8px',
};

export const modalCancelBtnStyle: React.CSSProperties = {
  flex:            1,
  padding:         '12px',
  borderRadius:    '12px',
  backgroundColor: colors.surfaceContainerLow,
  color:           colors.onSurface,
  fontSize:        '0.875rem',
  fontWeight:      500,
  border:          'none',
  cursor:          'pointer',
  fontFamily:      'Inter, ui-sans-serif, sans-serif',
};

export const modalConfirmBtnStyle: React.CSSProperties = {
  flex:         1,
  padding:      '12px',
  borderRadius: '12px',
  background:   'linear-gradient(135deg, #dc2626, #b91c1c)',
  color:        '#ffffff',
  fontSize:     '0.875rem',
  fontWeight:   500,
  border:       'none',
  cursor:       'pointer',
  fontFamily:   'Inter, ui-sans-serif, sans-serif',
};

/* ── Call ended state ───────────────────────────────────────────── */
export const callEndedAvatarStyle: React.CSSProperties = {
  width:           '144px',
  height:          '144px',
  backgroundColor: colors.surfaceContainerLow,
  boxShadow:       '0 8px 32px rgba(0,30,49,0.08)',
  borderRadius:    '50%',
  display:         'flex',
  alignItems:      'center',
  justifyContent:  'center',
};

export const callEndedDurationStyle: React.CSSProperties = {
  fontFamily:  'Manrope, sans-serif',
  fontWeight:  700,
  fontSize:    '1rem',
  color:       colors.outline,
  marginTop:   '4px',
};

export const returnBtnStyle: React.CSSProperties = {
  display:      'inline-flex',
  alignItems:   'center',
  gap:          '10px',
  padding:      '12px 32px',
  borderRadius: '12px',
  background:   `linear-gradient(135deg, ${colors.primary}, ${colors.primaryMid})`,
  color:        '#ffffff',
  fontSize:     '0.875rem',
  fontWeight:   500,
  border:       'none',
  cursor:       'pointer',
  fontFamily:   'Inter, ui-sans-serif, sans-serif',
};

/* ── Sound bar fill ─────────────────────────────────────────────── */
export const soundBarStyle = (height: number, delay: number): React.CSSProperties => ({
  width:            6,
  height,
  backgroundColor:  colors.primary,
  animation:        'sound-bar 0.7s ease-in-out infinite',
  animationDelay:   `${delay}s`,
});
