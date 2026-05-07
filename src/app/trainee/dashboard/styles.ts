import { colors } from '@/lib/colors';
export { colors };

const font = {
  headline: 'Manrope, sans-serif',
  body:     'Inter, ui-sans-serif, sans-serif',
} as const;

const shadow = {
  ambient: '0 20px 40px rgba(0, 30, 49, 0.06)',
  card:    '0 4px 24px rgba(0, 30, 49, 0.07)',
} as const;

/* ── Page shell ─────────────────────────────────────────────────── */
export const pageStyle: React.CSSProperties = {
  display:         'flex',
  minHeight:       '100vh',
  backgroundColor: colors.surface,
  fontFamily:      font.body,
};

/* ── Sidebar ─────────────────────────────────────────────────────── */
export const sidebarStyle: React.CSSProperties = {
  width:           '220px',
  flexShrink:      0,
  backgroundColor: colors.surfaceContainerLowest,
  display:         'flex',
  flexDirection:   'column',
  position:        'sticky',
  top:             0,
  height:          '100vh',
  boxShadow:       '1px 0 0 rgba(192,199,208,0.25)',
};

export const logoAreaStyle: React.CSSProperties = {
  padding:      '24px 20px 20px',
  marginBottom: '8px',
};

export const logoIconStyle: React.CSSProperties = {
  width:           '36px',
  height:          '36px',
  borderRadius:    '10px',
  backgroundColor: colors.primary,
  display:         'flex',
  alignItems:      'center',
  justifyContent:  'center',
  marginBottom:    '10px',
};

export const logoNameStyle: React.CSSProperties = {
  fontFamily:  font.headline,
  fontWeight:  700,
  fontSize:    '0.95rem',
  color:       colors.onSurface,
  lineHeight:  1.2,
};

export const logoSubStyle: React.CSSProperties = {
  fontSize:      '0.65rem',
  fontWeight:    600,
  color:         colors.secondary,
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  marginTop:     '2px',
};

export const navStyle: React.CSSProperties = {
  flex:    1,
  padding: '0 12px',
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
};

export const navItemStyle = (active: boolean): React.CSSProperties => ({
  display:       'flex',
  alignItems:    'center',
  gap:           '10px',
  padding:       '10px 12px',
  borderRadius:  '10px',
  cursor:        'pointer',
  fontSize:      '0.875rem',
  fontWeight:    active ? 600 : 400,
  color:         active ? colors.primary : colors.outline,
  backgroundColor: active ? colors.primaryContainer : 'transparent',
  transition:    'background-color 0.15s',
});

export const sidebarBottomStyle: React.CSSProperties = {
  padding: '16px 12px 24px',
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
};

export const startCallBtnStyle: React.CSSProperties = {
  display:        'flex',
  alignItems:     'center',
  justifyContent: 'center',
  padding:        '12px 16px',
  borderRadius:   '12px',
  background:     `linear-gradient(135deg, ${colors.primary}, ${colors.primaryMid})`,
  color:          '#ffffff',
  fontFamily:     font.body,
  fontSize:       '0.875rem',
  fontWeight:     600,
  border:         'none',
  cursor:         'pointer',
  width:          '100%',
  marginBottom:   '8px',
};

export const sidebarLinkStyle: React.CSSProperties = {
  display:       'flex',
  alignItems:    'center',
  gap:           '10px',
  padding:       '10px 12px',
  borderRadius:  '10px',
  cursor:        'pointer',
  fontSize:      '0.875rem',
  color:         colors.outline,
  background:    'none',
  border:        'none',
  width:         '100%',
  fontFamily:    font.body,
};

/* ── Top bar ─────────────────────────────────────────────────────── */
export const topBarStyle: React.CSSProperties = {
  height:               '60px',
  padding:              '0 40px',
  display:              'flex',
  alignItems:           'center',
  justifyContent:       'space-between',
  backgroundColor:      'rgba(255,255,255,0.72)',
  backdropFilter:       'blur(24px)',
  WebkitBackdropFilter: 'blur(24px)',
  position:             'sticky',
  top:                  0,
  zIndex:               10,
  boxShadow:            '0 1px 0 rgba(0,30,49,0.07)',
  flexShrink:           0,
};

export const topBarTitleStyle: React.CSSProperties = {
  fontFamily:  font.headline,
  fontWeight:  700,
  fontSize:    '1.1rem',
  color:       colors.onSurface,
};

export const topBarActionsStyle: React.CSSProperties = {
  display:    'flex',
  alignItems: 'center',
  gap:        '16px',
};

export const iconBtnStyle: React.CSSProperties = {
  background: 'none',
  border:     'none',
  cursor:     'pointer',
  color:      colors.outline,
  display:    'flex',
  alignItems: 'center',
  padding:    '4px',
  borderRadius: '8px',
};

export const userChipStyle: React.CSSProperties = {
  display:    'flex',
  alignItems: 'center',
  gap:        '10px',
};

export const userAvatarStyle: React.CSSProperties = {
  width:           '34px',
  height:          '34px',
  borderRadius:    '8px',
  backgroundColor: colors.surfaceContainerHigh,
  display:         'flex',
  alignItems:      'center',
  justifyContent:  'center',
};

/* ── Main content ────────────────────────────────────────────────── */
export const mainStyle: React.CSSProperties = {
  flex:       1,
  padding:    '36px 40px',
  overflowY:  'auto',
};

/* ── Hero section ────────────────────────────────────────────────── */
export const heroGridStyle: React.CSSProperties = {
  display:             'grid',
  gridTemplateColumns: '1fr 300px',
  gap:                 '32px',
  marginBottom:        '28px',
  alignItems:          'start',
};

export const heroHeadingStyle: React.CSSProperties = {
  fontFamily:   font.headline,
  fontWeight:   800,
  fontSize:     '2rem',
  color:        colors.primary,
  lineHeight:   1.15,
  marginBottom: '4px',
};

export const heroSubStyle: React.CSSProperties = {
  fontFamily:   font.headline,
  fontWeight:   500,
  fontSize:     '1.15rem',
  color:        colors.outline,
  marginBottom: '16px',
};

export const heroBodyStyle: React.CSSProperties = {
  fontSize:     '0.9rem',
  color:        colors.outline,
  lineHeight:   1.6,
  marginBottom: '28px',
  maxWidth:     '480px',
};

export const heroCTAStyle: React.CSSProperties = {
  display:      'inline-flex',
  alignItems:   'center',
  gap:          '8px',
  padding:      '14px 28px',
  borderRadius: '12px',
  background:   `linear-gradient(135deg, ${colors.primary}, ${colors.primaryMid})`,
  color:        '#ffffff',
  fontFamily:   font.body,
  fontSize:     '0.9rem',
  fontWeight:   600,
  border:       'none',
  cursor:       'pointer',
};

/* ── Progress card ───────────────────────────────────────────────── */
export const progressCardStyle: React.CSSProperties = {
  backgroundColor: colors.surfaceContainerLowest,
  borderRadius:    '16px',
  padding:         '24px',
  boxShadow:       shadow.card,
};

export const progressLabelStyle: React.CSSProperties = {
  fontSize:      '0.7rem',
  fontWeight:    600,
  color:         colors.outline,
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  marginBottom:  '8px',
};

export const progressValueStyle: React.CSSProperties = {
  fontFamily:   font.headline,
  fontWeight:   800,
  fontSize:     '2.5rem',
  color:        colors.onSurface,
  lineHeight:   1,
  marginBottom: '12px',
};

export const progressBarTrackStyle: React.CSSProperties = {
  width:           '100%',
  height:          '6px',
  backgroundColor: colors.surfaceContainerLow,
  borderRadius:    '3px',
  overflow:        'hidden',
  marginBottom:    '8px',
};

export const progressBarFillStyle = (pct: number): React.CSSProperties => ({
  width:        `${pct}%`,
  height:       '100%',
  background:   `linear-gradient(90deg, ${colors.primary}, ${colors.primaryMid})`,
  borderRadius: '3px',
});

export const progressModulesStyle: React.CSSProperties = {
  fontSize: '0.8rem',
  color:    colors.outline,
};

/* ── Stat cards ──────────────────────────────────────────────────── */
export const statsGridStyle: React.CSSProperties = {
  display:             'grid',
  gridTemplateColumns: '1fr 1fr',
  gap:                 '20px',
  marginBottom:        '32px',
};

export const statCardStyle: React.CSSProperties = {
  backgroundColor: colors.surfaceContainerLowest,
  borderRadius:    '16px',
  padding:         '24px 28px',
  boxShadow:       shadow.card,
};

export const statLabelStyle: React.CSSProperties = {
  fontSize:      '0.7rem',
  fontWeight:    600,
  color:         colors.outline,
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  marginBottom:  '10px',
};

export const statValueStyle: React.CSSProperties = {
  fontFamily:  font.headline,
  fontWeight:  800,
  fontSize:    '2rem',
  color:       colors.onSurface,
  lineHeight:  1,
  display:     'flex',
  alignItems:  'baseline',
  gap:         '8px',
};

export const statSubStyle: React.CSSProperties = {
  fontSize:   '0.8rem',
  color:      colors.outline,
  marginTop:  '6px',
};

/* ── Bottom grid ─────────────────────────────────────────────────── */
export const bottomGridStyle: React.CSSProperties = {
  display:             'grid',
  gridTemplateColumns: '1fr 340px',
  gap:                 '28px',
  alignItems:          'start',
};

/* ── Session cards ───────────────────────────────────────────────── */
export const sectionHeadingStyle: React.CSSProperties = {
  fontFamily:   font.headline,
  fontWeight:   700,
  fontSize:     '1.1rem',
  color:        colors.primary,
  marginBottom: '16px',
  display:      'flex',
  alignItems:   'center',
  justifyContent: 'space-between',
};

export const viewAllStyle: React.CSSProperties = {
  fontSize:   '0.8rem',
  color:      colors.primaryMid,
  background: 'none',
  border:     'none',
  cursor:     'pointer',
  fontFamily: font.body,
};

export const sessionCardStyle = (alt: boolean): React.CSSProperties => ({
  backgroundColor: alt ? colors.surfaceContainerLow : colors.surfaceContainerLowest,
  borderRadius:    '14px',
  padding:         '18px 20px',
  display:         'flex',
  alignItems:      'center',
  gap:             '16px',
  marginBottom:    '10px',
  boxShadow:       alt ? 'none' : shadow.card,
  cursor:          'pointer',
});

export const sessionIconStyle: React.CSSProperties = {
  width:           '40px',
  height:          '40px',
  borderRadius:    '12px',
  backgroundColor: colors.primaryContainer,
  display:         'flex',
  alignItems:      'center',
  justifyContent:  'center',
  flexShrink:      0,
  color:           colors.primary,
};

export const sessionTitleStyle: React.CSSProperties = {
  fontFamily:  font.headline,
  fontWeight:  600,
  fontSize:    '0.9rem',
  color:       colors.onSurface,
  marginBottom: '3px',
};

export const sessionMetaStyle: React.CSSProperties = {
  fontSize: '0.78rem',
  color:    colors.outline,
  marginBottom: '6px',
};

export const sessionStatsStyle: React.CSSProperties = {
  display:    'flex',
  alignItems: 'center',
  gap:        '14px',
  fontSize:   '0.78rem',
  color:      colors.outline,
};

export const badgeStyle = (variant: 'gold' | 'review'): React.CSSProperties => ({
  fontSize:        '0.65rem',
  fontWeight:      700,
  padding:         '3px 8px',
  borderRadius:    '6px',
  textTransform:   'uppercase',
  letterSpacing:   '0.06em',
  backgroundColor: variant === 'gold' ? '#d1fae5' : colors.tertiaryContainer,
  color:           variant === 'gold' ? colors.secondary : colors.tertiary,
  flexShrink:      0,
});

/* ── Assigned modules ────────────────────────────────────────────── */
export const moduleItemStyle: React.CSSProperties = {
  marginBottom: '18px',
};

export const moduleRowStyle: React.CSSProperties = {
  display:        'flex',
  alignItems:     'center',
  justifyContent: 'space-between',
  marginBottom:   '6px',
};

export const moduleNameStyle: React.CSSProperties = {
  fontSize:   '0.875rem',
  fontWeight: 500,
  color:      colors.onSurface,
};

export const moduleBarTrackStyle: React.CSSProperties = {
  width:           '100%',
  height:          '4px',
  backgroundColor: colors.surfaceContainerHigh,
  borderRadius:    '2px',
  overflow:        'hidden',
};

export const moduleBarFillStyle = (pct: number, color = colors.primary): React.CSSProperties => ({
  width:        `${pct}%`,
  height:       '100%',
  backgroundColor: color,
  borderRadius: '2px',
  transition:   'width 0.3s ease',
});

export const inProgressBadgeStyle: React.CSSProperties = {
  fontSize:        '0.65rem',
  fontWeight:      700,
  padding:         '2px 7px',
  borderRadius:    '5px',
  textTransform:   'uppercase',
  letterSpacing:   '0.06em',
  backgroundColor: colors.primaryContainer,
  color:           colors.primary,
};

export const nextBadgeStyle: React.CSSProperties = {
  fontSize:  '0.75rem',
  fontWeight: 500,
  color:     colors.outline,
};

/* ── AI Coach tip ────────────────────────────────────────────────── */
export const coachTipStyle: React.CSSProperties = {
  backgroundColor: '#e6f6f6',
  borderRadius:    '14px',
  padding:         '16px 18px',
  marginTop:       '8px',
};

export const coachTipLabelStyle: React.CSSProperties = {
  fontSize:      '0.65rem',
  fontWeight:    700,
  color:         colors.secondary,
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  display:       'flex',
  alignItems:    'center',
  gap:           '6px',
  marginBottom:  '8px',
};

export const coachTipTextStyle: React.CSSProperties = {
  fontSize:    '0.82rem',
  color:       colors.onSurface,
  lineHeight:  1.6,
  fontStyle:   'italic',
};
