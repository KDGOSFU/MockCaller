'use client';

import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { Bell, Settings, Sparkles, CheckCircle2, Lock, Bot, User, Phone } from 'lucide-react';
import { colors } from '@/lib/colors';
import { TraineeSidebar } from '@/components/TraineeSidebar';
import styles from './TraineeDashboard.module.css';

type Scenario = {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  focusSkills: string[];
};

const MODULES = [
  { name: 'Building Genuine Rapport',    status: 'done',        pct: 100 },
  { name: 'Active Listening & Echoing',  status: 'in-progress', pct: 55  },
  { name: 'The Art of the Closing Ask',  status: 'next',        pct: 0   },
  { name: 'Legacy Gifting Complexity',   status: 'locked',      pct: 0   },
];

function TopBar() {
  const { user } = useUser();
  const displayName = user ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || 'Trainee' : 'Trainee';
  return (
    <header className={styles.topBar}>
      <span className={styles.topBarTitle}>Trainee Overview</span>
      <div className={styles.topBarActions}>
        <button className={styles.iconBtn}><Bell size={20} /></button>
        <button className={styles.iconBtn}><Settings size={20} /></button>
        <div className={styles.userChip}>
          <div className={styles.userNameGroup}>
            <p className={styles.userName}>{displayName}</p>
            <p className={styles.userRole}>Trainee</p>
          </div>
          <div className={styles.userAvatar}>
            <User size={18} color={colors.outline} />
          </div>
        </div>
      </div>
    </header>
  );
}

function ProgressCard({ completed, total }: { completed: number; total: number }) {
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
  return (
    <div className={styles.progressCard}>
      <p className={styles.progressLabel}>Current Progress</p>
      <div className={styles.progressRow}>
        <p className={styles.progressValue}>{pct}%</p>
        <Sparkles size={22} color={colors.primaryMid} />
      </div>
      <div className={styles.progressBarTrack}>
        <div className={styles.progressBarFill} style={{ width: `${pct}%` }} />
      </div>
      <p className={styles.progressModules}>{completed} of {total} personas completed</p>
    </div>
  );
}

function ModuleItem({ mod }: { mod: typeof MODULES[0] }) {
  const isDone       = mod.status === 'done';
  const isInProgress = mod.status === 'in-progress';
  const isLocked     = mod.status === 'locked';

  return (
    <div className={styles.moduleItem}>
      <div className={styles.moduleRow}>
        <div className={styles.moduleIconRow}>
          {isDone       && <CheckCircle2 size={16} color={colors.secondary} />}
          {isInProgress && <div className={`${styles.moduleStatusDot} ${styles.moduleStatusDotActive}`} />}
          {isLocked     && <Lock size={15} color={colors.outlineVariant} />}
          {mod.status === 'next' && <div className={`${styles.moduleStatusDot} ${styles.moduleStatusDotNext}`} />}
          <p className={`${styles.moduleName} ${isLocked ? styles.moduleNameLocked : ''}`}>
            {mod.name}
          </p>
        </div>
        {isInProgress       && <span className={styles.inProgressBadge}>In Progress</span>}
        {mod.status === 'next' && <span className={styles.nextBadge}>Next</span>}
      </div>
      {mod.pct > 0 && (
        <div className={styles.moduleBarTrack}>
          <div
            className={`${styles.moduleBarFill} ${isDone ? styles.moduleBarFillDone : ''}`}
            style={{ width: `${mod.pct}%` }}
          />
        </div>
      )}
    </div>
  );
}

function difficultyClass(difficulty: string) {
  const d = difficulty?.toLowerCase();
  if (d === 'beginner')     return styles.badgeBeginner;
  if (d === 'intermediate') return styles.badgeIntermediate;
  if (d === 'advanced')     return styles.badgeAdvanced;
  return '';
}

export function TraineeDashboard() {
  const router = useRouter();
  const { user } = useUser();
  const firstName = user?.firstName ?? 'there';
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [loadingScenarios, setLoadingScenarios] = useState(true);
  const [scenarioError, setScenarioError] = useState<string | null>(null);
  const [completedPersonasByScenario, setCompletedPersonasByScenario] = useState<Map<string, Set<string>>>(new Map());
  const [totalPersonasByScenario, setTotalPersonasByScenario]         = useState<Map<string, number>>(new Map());
  const [callStats, setCallStats] = useState({ total: 0, today: 0, avgDuration: 0 });

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
          const order: Record<string, number> = { BEGINNER: 0, beginner: 0, INTERMEDIATE: 1, intermediate: 1, ADVANCED: 2, advanced: 2 };
          setScenarios((data ?? []).sort((a, b) => (order[a.difficulty] ?? 99) - (order[b.difficulty] ?? 99)));
        }
        setLoadingScenarios(false);
      });
  }, []);

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

  useEffect(() => {
    if (!user?.id) return;
    const supabase = createClient();
    supabase
      .from('call_sessions')
      .select('scenarioId, personaId, startedAt, durationSec')
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

        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const todayCount = data.filter(r => new Date(r.startedAt) >= todayStart).length;

        const withDuration = data.filter(r => r.durationSec != null && r.durationSec > 0);
        const avgDuration  = withDuration.length > 0
          ? Math.round(withDuration.reduce((sum, r) => sum + r.durationSec, 0) / withDuration.length)
          : 0;

        setCallStats({ total: data.length, today: todayCount, avgDuration });
      });
  }, [user?.id]);

  const DIFFICULTY_ORDER: Record<string, number> = {
    beginner: 0, BEGINNER: 0,
    intermediate: 1, INTERMEDIATE: 1,
    advanced: 2, ADVANCED: 2,
  };

  const nextScenario = scenarios
    .filter(s => {
      const total = totalPersonasByScenario.get(s.id) ?? 0;
      const done  = completedPersonasByScenario.get(s.id)?.size ?? 0;
      return done < total;
    })
    .sort((a, b) => (DIFFICULTY_ORDER[a.difficulty] ?? 99) - (DIFFICULTY_ORDER[b.difficulty] ?? 99))[0] ?? null;

  function goToNextCall() {
    if (!nextScenario) return;
    const doneIds = [...(completedPersonasByScenario.get(nextScenario.id) ?? [])];
    const params  = new URLSearchParams({ scenarioId: nextScenario.id });
    if (doneIds.length > 0) params.set('excludePersonaIds', doneIds.join(','));
    router.push(`/call?${params.toString()}`);
  }

  const avgDurColor = callStats.avgDuration >= 600 && callStats.avgDuration <= 900
    ? colors.secondary
    : colors.tertiary;

  return (
    <div className={styles.page}>
      <TraineeSidebar />

      <div className={styles.contentWrapper}>
        <TopBar />

        <main className={styles.main}>

          <div className={styles.heroGrid}>
            <div>
              <h1 className={styles.heroHeading}>Welcome back, {firstName}.</h1>
              <p className={styles.heroSub}>Your next milestone is near.</p>
              <p className={styles.heroBody}>
                You&apos;ve completed 75% of the &ldquo;High-Net-Worth Engagement&rdquo; track.
                Focusing on the &lsquo;Closing Ask&rsquo; module will boost your conversion
                performance by an estimated 12%.
              </p>
              <button
                className={`${styles.heroCTA} ${!nextScenario ? styles.heroCTADisabled : ''}`}
                onClick={goToNextCall}
                disabled={!nextScenario}
              >
                {nextScenario ? `Start Next Call: ${nextScenario.title}` : 'All Scenarios Completed!'}
              </button>
            </div>
            <ProgressCard
              completed={[...completedPersonasByScenario.values()].reduce((sum, s) => sum + s.size, 0)}
              total={[...totalPersonasByScenario.values()].reduce((sum, n) => sum + n, 0)}
            />
          </div>

          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <p className={styles.statLabel}>Average Duration</p>
              <div className={styles.statValue}>
                {callStats.avgDuration > 0
                  ? `${String(Math.floor(callStats.avgDuration / 60)).padStart(2, '0')}:${String(callStats.avgDuration % 60).padStart(2, '0')}`
                  : '—'}
                {callStats.avgDuration > 0 && (
                  <span className={styles.statBadge} style={{ color: avgDurColor }}>
                    {callStats.avgDuration < 600 ? '— Too short' : callStats.avgDuration <= 900 ? '— On target' : '— Too long'}
                  </span>
                )}
              </div>
              <p className={styles.statSub}>Optimal range: 10–15m</p>
            </div>
            <div className={styles.statCard}>
              <p className={styles.statLabel}>Mock Calls</p>
              <div className={styles.statValue}>
                {callStats.total}
                <span className={styles.statBadge} style={{ color: colors.secondary }}>
                  {callStats.today > 0 ? `+${callStats.today} today` : 'none today'}
                </span>
              </div>
              <p className={styles.statSub}>
                Goal: {[...totalPersonasByScenario.values()].reduce((sum, n) => sum + n, 0)} calls to complete all
              </p>
            </div>
          </div>

          <div className={styles.bottomGrid}>

            <div>
              <div className={styles.sectionHeading}>Call Scenarios</div>
              {loadingScenarios && <p className={styles.sessionMeta}>Loading scenarios...</p>}
              {scenarioError   && <p className={styles.sessionMeta} style={{ color: 'red' }}>Error: {scenarioError}</p>}
              {!loadingScenarios && !scenarioError && scenarios.length === 0 && (
                <p className={styles.sessionMeta}>No scenarios found. Check Supabase RLS permissions.</p>
              )}
              {scenarios.slice(0, 3).map((scenario, i) => {
                const donePersonas  = completedPersonasByScenario.get(scenario.id)?.size ?? 0;
                const totalPersonas = totalPersonasByScenario.get(scenario.id) ?? 0;
                const isCompleted   = donePersonas > 0;
                const allDone       = totalPersonas > 0 && donePersonas >= totalPersonas;
                const countColor    = allDone ? '#065f46' : isCompleted ? colors.primary : colors.outline;

                return (
                  <div
                    key={scenario.id}
                    className={`${i % 2 !== 0 ? styles.sessionCardAlt : styles.sessionCard} ${allDone ? styles.sessionCardDone : ''}`}
                    onClick={() => {
                      if (allDone) return;
                      const doneIds = [...(completedPersonasByScenario.get(scenario.id) ?? [])];
                      const params = new URLSearchParams({ scenarioId: scenario.id });
                      if (doneIds.length > 0) params.set('excludePersonaIds', doneIds.join(','));
                      router.push(`/call?${params.toString()}`);
                    }}
                  >
                    <div className={`${styles.sessionIcon} ${isCompleted ? styles.sessionIconDone : ''}`}>
                      {isCompleted ? <CheckCircle2 size={18} /> : <Phone size={18} />}
                    </div>
                    <div className={styles.sessionCardBody}>
                      <p className={styles.sessionTitle}>{scenario.title}</p>
                      <p className={styles.sessionMeta}>{scenario.description}</p>
                    </div>
                    <div className={styles.sessionCardActions}>
                      <span className={`${styles.difficultyBadge} ${difficultyClass(scenario.difficulty)}`}>
                        {scenario.difficulty}
                      </span>
                      <span className={styles.completionCount} style={{ color: countColor }}>
                        {allDone ? 'COMPLETED' : `${donePersonas}/${totalPersonas}`}
                      </span>
                    </div>
                  </div>
                );
              })}
              {scenarios.length > 3 && (
                <button className={styles.seeMoreBtn} onClick={() => router.push('/trainee/call-scenarios')}>
                  See All Scenarios
                </button>
              )}
            </div>

            <div>
              <p className={styles.sectionHeadingBlock}>Assigned Modules</p>
              <div className={styles.modulesContainer}>
                {MODULES.map(mod => (
                  <ModuleItem key={mod.name} mod={mod} />
                ))}

                <div className={styles.coachTip}>
                  <div className={styles.coachTipLabel}>
                    <Bot size={14} />
                    AI Coach Tip
                  </div>
                  <p className={styles.coachTipText}>
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
