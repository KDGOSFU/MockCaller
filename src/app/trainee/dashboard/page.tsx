'use client';

import {
  LayoutDashboard, Phone, BarChart2, BookOpen,
  Bell, Settings, HelpCircle, LogOut, Sparkles,
  Star, CheckCircle2, Lock, Bot, ChevronRight,
  CircleDot, User,
} from 'lucide-react';
import {
  colors,
  pageStyle, sidebarStyle, logoAreaStyle, logoIconStyle, logoNameStyle, logoSubStyle,
  navStyle, navItemStyle, sidebarBottomStyle, startCallBtnStyle, sidebarLinkStyle,
  topBarStyle, topBarTitleStyle, topBarActionsStyle, iconBtnStyle, userChipStyle, userAvatarStyle,
  mainStyle, heroGridStyle, heroHeadingStyle, heroSubStyle, heroBodyStyle, heroCTAStyle,
  progressCardStyle, progressLabelStyle, progressValueStyle,
  progressBarTrackStyle, progressBarFillStyle, progressModulesStyle,
  statsGridStyle, statCardStyle, statLabelStyle, statValueStyle, statSubStyle,
  bottomGridStyle, sectionHeadingStyle, viewAllStyle,
  sessionCardStyle, sessionIconStyle, sessionTitleStyle, sessionMetaStyle,
  sessionStatsStyle, badgeStyle,
  moduleItemStyle, moduleRowStyle, moduleNameStyle,
  moduleBarTrackStyle, moduleBarFillStyle,
  inProgressBadgeStyle, nextBadgeStyle,
  coachTipStyle, coachTipLabelStyle, coachTipTextStyle,
} from './styles';

/* ── Static data ────────────────────────────────────────────────── */
const NAV_ITEMS = [
  { label: 'Dashboard',        icon: LayoutDashboard, active: true  },
  { label: 'Call Scenarios',   icon: Phone,           active: false },
  { label: 'Analytics',        icon: BarChart2,       active: false },
  { label: 'Training Library', icon: BookOpen,        active: false },
];

const SESSIONS = [
  {
    title:      'The Hesitant Philanthropist',
    meta:       'Completed 2 hours ago • Duration: 14:22',
    grade:      'A',
    conversion: true,
    badge:      'gold' as const,
  },
  {
    title:      'Budget-Conscious Corporate Lead',
    meta:       'Completed Yesterday • Duration: 08:40',
    grade:      'B+',
    conversion: false,
    badge:      'review' as const,
  },
];

const MODULES = [
  { name: 'Building Genuine Rapport',    status: 'done',        pct: 100 },
  { name: 'Active Listening & Echoing',  status: 'in-progress', pct: 55  },
  { name: 'The Art of the Closing Ask',  status: 'next',        pct: 0   },
  { name: 'Legacy Gifting Complexity',   status: 'locked',      pct: 0   },
];

/* ── Sidebar ─────────────────────────────────────────────────────── */
function Sidebar() {
  return (
    <aside style={sidebarStyle}>
      {/* Logo */}
      <div style={logoAreaStyle}>
        <div style={logoIconStyle}>
          <Phone size={18} color="#ffffff" />
        </div>
        <p style={logoNameStyle}>Fundraiser Pro</p>
        <p style={logoSubStyle}>Lumina Academy</p>
      </div>

      {/* Nav */}
      <nav style={navStyle}>
        {NAV_ITEMS.map(({ label, icon: Icon, active }) => (
          <div key={label} style={navItemStyle(active)}>
            <Icon size={17} />
            {label}
          </div>
        ))}
      </nav>

      {/* Bottom */}
      <div style={sidebarBottomStyle}>
        <button style={startCallBtnStyle}>Start New Mock Call</button>
        <button style={sidebarLinkStyle}>
          <HelpCircle size={17} /> Help Center
        </button>
        <button style={sidebarLinkStyle}>
          <LogOut size={17} /> Sign Out
        </button>
      </div>
    </aside>
  );
}

/* ── Top bar ─────────────────────────────────────────────────────── */
function TopBar() {
  return (
    <header style={topBarStyle}>
      <span style={topBarTitleStyle}>Trainee Overview</span>
      <div style={topBarActionsStyle}>
        <button style={iconBtnStyle}><Bell size={20} /></button>
        <button style={iconBtnStyle}><Settings size={20} /></button>
        <div style={userChipStyle}>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '0.85rem', fontWeight: 600, color: colors.onSurface, lineHeight: 1.2 }}>
              Alex Thompson
            </p>
            <p style={{ fontSize: '0.65rem', fontWeight: 600, color: colors.outline, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
              Level 2 Trainee
            </p>
          </div>
          <div style={userAvatarStyle}>
            <User size={18} color={colors.outline} />
          </div>
        </div>
      </div>
    </header>
  );
}

/* ── Progress card ───────────────────────────────────────────────── */
function ProgressCard() {
  return (
    <div style={progressCardStyle}>
      <p style={progressLabelStyle}>Current Progress</p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <p style={progressValueStyle}>75%</p>
        <Sparkles size={22} color={colors.primaryMid} />
      </div>
      <div style={progressBarTrackStyle}>
        <div style={progressBarFillStyle(75)} />
      </div>
      <p style={progressModulesStyle}>12 of 16 modules completed</p>
    </div>
  );
}

/* ── Session card ────────────────────────────────────────────────── */
function SessionCard({ session, alt }: { session: typeof SESSIONS[0]; alt: boolean }) {
  return (
    <div style={sessionCardStyle(alt)}>
      <div style={sessionIconStyle}>
        <Phone size={18} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={sessionTitleStyle}>{session.title}</p>
        <p style={sessionMetaStyle}>{session.meta}</p>
        <div style={sessionStatsStyle}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Star size={12} color={colors.tertiary} />
            Grade: {session.grade}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <CircleDot size={12} color={colors.outline} />
            Conversion: {session.conversion ? 'Yes' : 'No'}
          </span>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px', flexShrink: 0 }}>
        <span style={badgeStyle(session.badge)}>
          {session.badge === 'gold' ? 'Gold Standard' : 'Needs Review'}
        </span>
        <ChevronRight size={18} color={colors.outline} />
      </div>
    </div>
  );
}

/* ── Module item ─────────────────────────────────────────────────── */
function ModuleItem({ mod }: { mod: typeof MODULES[0] }) {
  const isDone       = mod.status === 'done';
  const isInProgress = mod.status === 'in-progress';
  const isLocked     = mod.status === 'locked';

  return (
    <div style={moduleItemStyle}>
      <div style={moduleRowStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {isDone && <CheckCircle2 size={16} color={colors.secondary} />}
          {isInProgress && <div style={{ width: 16, height: 16, borderRadius: '50%', border: `2px solid ${colors.primary}`, flexShrink: 0 }} />}
          {isLocked && <Lock size={15} color={colors.outlineVariant} />}
          {mod.status === 'next' && <div style={{ width: 16, height: 16, borderRadius: '50%', border: `2px solid ${colors.outlineVariant}`, flexShrink: 0 }} />}
          <p style={{ ...moduleNameStyle, color: isLocked ? colors.outlineVariant : colors.onSurface }}>
            {mod.name}
          </p>
        </div>
        {isInProgress && <span style={inProgressBadgeStyle}>In Progress</span>}
        {mod.status === 'next' && <span style={nextBadgeStyle}>Next</span>}
      </div>
      {mod.pct > 0 && (
        <div style={moduleBarTrackStyle}>
          <div style={moduleBarFillStyle(mod.pct, isDone ? colors.secondary : colors.primary)} />
        </div>
      )}
    </div>
  );
}

/* ── Page ───────────────────────────────────────────────────────── */
export default function TraineeDashboardPage() {
  return (
    <div style={pageStyle}>
      <Sidebar />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <TopBar />

        <main style={mainStyle}>

          {/* Hero + Progress */}
          <div style={heroGridStyle}>
            <div>
              <h1 style={heroHeadingStyle}>Welcome back, Alex.</h1>
              <p style={heroSubStyle}>Your next milestone is near.</p>
              <p style={heroBodyStyle}>
                You&apos;ve completed 75% of the &ldquo;High-Net-Worth Engagement&rdquo; track.
                Focusing on the &lsquo;Closing Ask&rsquo; module will boost your conversion
                performance by an estimated 12%.
              </p>
              <button style={heroCTAStyle}>
                Start Next Lesson: The Art of the Ask
              </button>
            </div>
            <ProgressCard />
          </div>

          {/* Stats row */}
          <div style={statsGridStyle}>
            <div style={statCardStyle}>
              <p style={statLabelStyle}>Average Duration</p>
              <div style={statValueStyle}>
                12:45
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: colors.tertiary }}>
                  — Steady
                </span>
              </div>
              <p style={statSubStyle}>Optimal range: 10–15m</p>
            </div>
            <div style={statCardStyle}>
              <p style={statLabelStyle}>Mock Calls</p>
              <div style={statValueStyle}>
                24
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: colors.secondary }}>
                  +3 today
                </span>
              </div>
              <p style={statSubStyle}>Goal: 50 for certification</p>
            </div>
          </div>

          {/* Recent sessions + Assigned modules */}
          <div style={bottomGridStyle}>

            {/* Recent sessions */}
            <div>
              <div style={sectionHeadingStyle}>
                Recent Training Sessions
                <button style={viewAllStyle}>View All History</button>
              </div>
              {SESSIONS.map((s, i) => (
                <SessionCard key={s.title} session={s} alt={i % 2 !== 0} />
              ))}
            </div>

            {/* Assigned modules */}
            <div>
              <p style={{ ...sectionHeadingStyle, display: 'block' }}>Assigned Modules</p>
              <div style={{ backgroundColor: colors.surfaceContainerLowest, borderRadius: '16px', padding: '20px 22px', boxShadow: '0 4px 24px rgba(0,30,49,0.07)' }}>
                {MODULES.map(mod => (
                  <ModuleItem key={mod.name} mod={mod} />
                ))}

                {/* AI Coach Tip */}
                <div style={coachTipStyle}>
                  <div style={coachTipLabelStyle}>
                    <Bot size={14} />
                    AI Coach Tip
                  </div>
                  <p style={coachTipTextStyle}>
                    &ldquo;In your last session, you spoke 15% faster when discussing gift amounts.
                    Try taking a deep breath before making the ask to slow your pace.&rdquo;
                  </p>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
