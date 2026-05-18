'use client';

/* ── Backend integration ────────────────────────────────────────────────── */

import { useUser, useClerk } from '@clerk/nextjs';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

/*───────────Router to start mock call───────────*/

import { useRouter } from 'next/navigation';

/* ── Scenarios from DB ────────────────────────────────────────────────── */

type Scenario = {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  focusSkills: string[];
};

/* ── Icons from React ────────────────────────────────────────────────── */
import {
  LayoutDashboard, Phone, BarChart2, BookOpen,
  Bell, Settings, HelpCircle, LogOut, Sparkles,
  CheckCircle2, Lock, Bot, ChevronRight, User,
} from 'lucide-react';

/* ── Styles ────────────────────────────────────────────────── */
import {
  colors,
  pageStyle, sidebarStyle, logoAreaStyle, logoIconStyle, logoNameStyle, logoSubStyle,
  navStyle, navItemStyle, sidebarBottomStyle, startCallBtnStyle, sidebarLinkStyle,
  topBarStyle, topBarTitleStyle, topBarActionsStyle, iconBtnStyle, userChipStyle, userAvatarStyle,
  mainStyle, heroGridStyle, heroHeadingStyle, heroSubStyle, heroBodyStyle, heroCTAStyle,
  progressCardStyle, progressLabelStyle, progressValueStyle,
  progressBarTrackStyle, progressBarFillStyle, progressModulesStyle,
  statsGridStyle, statCardStyle, statLabelStyle, statValueStyle, statSubStyle,
  bottomGridStyle, sectionHeadingStyle,
  sessionCardStyle, sessionIconStyle, sessionTitleStyle, sessionMetaStyle,
  difficultyBadgeStyle,
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


const MODULES = [
  { name: 'Building Genuine Rapport',    status: 'done',        pct: 100 },
  { name: 'Active Listening & Echoing',  status: 'in-progress', pct: 55  },
  { name: 'The Art of the Closing Ask',  status: 'next',        pct: 0   },
  { name: 'Legacy Gifting Complexity',   status: 'locked',      pct: 0   },
];

/* ── Sidebar ─────────────────────────────────────────────────────── */
function Sidebar() {
  const { signOut } = useClerk();
  return (
    <aside style={sidebarStyle}>
      {/* Logo */}
      <div style={logoAreaStyle}>
        <div style={logoIconStyle}>
          <Phone size={18} color="#ffffff" />
        </div>
        <p style={logoNameStyle}>MockCaller</p>
        <p style={logoSubStyle}>Fundraising Academy</p>
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
        <button style={sidebarLinkStyle} onClick={() => signOut({ redirectUrl: '/login' })}>
          <LogOut size={17} /> Sign Out
        </button>
      </div>
    </aside>
  );
}

/* ── Top bar ─────────────────────────────────────────────────────── */
function TopBar() {
  const { user } = useUser();
  const displayName = user ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || 'Trainee' : 'Trainee';
  return (
    <header style={topBarStyle}>
      <span style={topBarTitleStyle}>Trainee Overview</span>
      <div style={topBarActionsStyle}>
        <button style={iconBtnStyle}><Bell size={20} /></button>
        <button style={iconBtnStyle}><Settings size={20} /></button>
        <div style={userChipStyle}>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '0.85rem', fontWeight: 600, color: colors.onSurface, lineHeight: 1.2 }}>
              {displayName}
            </p>
            <p style={{ fontSize: '0.65rem', fontWeight: 600, color: colors.outline, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
              Trainee
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
  const router = useRouter();
  const { user } = useUser();
  const firstName = user?.firstName ?? 'there';
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [loadingScenarios, setLoadingScenarios] = useState(true);
  const [scenarioError, setScenarioError] = useState<string | null>(null);
  const [completedPersonasByScenario, setCompletedPersonasByScenario] = useState<Map<string, Set<string>>>(new Map());
  const [totalPersonasByScenario, setTotalPersonasByScenario]         = useState<Map<string, number>>(new Map());

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from('scenarios')
      .select('*')
      .then(({ data, error }) => {
        if (error) {
          console.error('Supabase error:', error);
          setScenarioError(error.message);
        } else {
          setScenarios(data ?? []);
        }
        setLoadingScenarios(false);
      });
  }, []);

  // Fetch total personas per scenario
  useEffect(() => {
    const supabase = createClient();
    supabase
      .from('scenario_personas')
      .select('scenarioId, personaId')
      .then(({ data }) => {
        if (!data) return;
        const totals = new Map<string, number>();
        data.forEach(r => totals.set(r.scenarioId, (totals.get(r.scenarioId) ?? 0) + 1));
        setTotalPersonasByScenario(totals);
      });
  }, []);

  // Fetch completed sessions for this user
  useEffect(() => {
    if (!user?.id) return;
    const supabase = createClient();
    supabase
      .from('call_sessions')
      .select('scenarioId, personaId')
      .eq('userId', user.id)
      .eq('status', 'COMPLETED')
      .then(({ data }) => {
        if (!data) return;
        const byScenario = new Map<string, Set<string>>();
        data.forEach(r => {
          if (!byScenario.has(r.scenarioId)) byScenario.set(r.scenarioId, new Set());
          byScenario.get(r.scenarioId)!.add(r.personaId);
        });
        setCompletedPersonasByScenario(byScenario);
      });
  }, [user?.id]);

  return (
    <div style={pageStyle}>
      <Sidebar />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <TopBar />

        <main style={mainStyle}>

          {/* Hero + Progress */}
          <div style={heroGridStyle}>
            <div>
              <h1 style={heroHeadingStyle}>Welcome back, {firstName}.</h1>
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

            {/* Mock Scenarios sessions */}
            <div>
              <div style={sectionHeadingStyle}>
                Call Scenarios
              </div>
              {loadingScenarios && (
                <p style={sessionMetaStyle}>Loading scenarios...</p>
              )}
              {scenarioError && (
                <p style={{ ...sessionMetaStyle, color: 'red' }}>Error: {scenarioError}</p>
              )}
              {!loadingScenarios && !scenarioError && scenarios.length === 0 && (
                <p style={sessionMetaStyle}>No scenarios found. Check Supabase RLS permissions.</p>
              )}
              {scenarios.map((scenario, i) => {
                const donePersonas  = completedPersonasByScenario.get(scenario.id)?.size ?? 0;
                const totalPersonas = totalPersonasByScenario.get(scenario.id) ?? 0;
                const isCompleted   = donePersonas > 0;
                const allDone       = totalPersonas > 0 && donePersonas >= totalPersonas;

                return (
                  <div key={scenario.id}
                       style={{
                         ...sessionCardStyle(i % 2 !== 0),
                         ...(allDone && { opacity: 0.6, cursor: 'default' }),
                       }}
                       onClick={() => {
                         if (allDone) return;
                         const doneIds = [...(completedPersonasByScenario.get(scenario.id) ?? [])];
                         const params = new URLSearchParams({ scenarioId: scenario.id });
                         if (doneIds.length > 0) params.set('excludePersonaIds', doneIds.join(','));
                         router.push(`/call?${params.toString()}`);
                       }}>
                    <div style={{ ...sessionIconStyle, ...(isCompleted && { backgroundColor: '#d1fae5', color: '#065f46' }) }}>
                      {isCompleted ? <CheckCircle2 size={18} /> : <Phone size={18} />}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={sessionTitleStyle}>{scenario.title}</p>
                      <p style={sessionMetaStyle}>{scenario.description}</p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px', flexShrink: 0 }}>
                      <span style={difficultyBadgeStyle(scenario.difficulty)}>
                        {scenario.difficulty}
                      </span>
                      <span style={{
                        fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.05em',
                        color: allDone ? '#065f46' : isCompleted ? colors.primary : colors.outline,
                      }}>
                        {allDone ? 'COMPLETED' : `${donePersonas}/${totalPersonas}`}
                      </span>
                    </div>
                  </div>
                );
              })}
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
