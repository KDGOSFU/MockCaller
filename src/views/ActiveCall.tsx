'use client';

import { Suspense, useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { createClient } from '@/utils/supabase/client';
import { Settings, BarChart2, Mic, MicOff, PhoneOff, MapPin, User, Clock, CheckCircle2 } from 'lucide-react';
import { colors } from '@/lib/colors';
import styles from './ActiveCall.module.css';

type Scenario = {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  focusSkills: string[];
};

type Prospect = {
  id: string;
  firstName: string;
  lastName: string;
  age: string;
  graduationYear: string;
  currentRole: string;
  email: string;
  address1: string;
  address2: string;
  postalcode: string;
  province: string;
  city: string;
  degree: string;
};

const PAST_GIFTS = [
  { amount: '$5,000',  label: 'Annual Scholarship Fund', date: 'Oct 12, 2023' },
  { amount: '$2,500',  label: 'Library Modernization',   date: 'Jan 15, 2023'  },
  { amount: '$10,000', label: 'Endowment Fund',          date: 'Nov 20, 2022' },
];

function SoundBars({ heights }: { heights: number[] }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 32 }}>
      {heights.map((h, i) => (
        <div key={i} style={{
          width:           6,
          height:          Math.max(4, h),
          backgroundColor: colors.primary,
          borderRadius:    3,
          transition:      'height 0.08s ease',
        }} />
      ))}
    </div>
  );
}

function ActiveCallContent() {
  const searchParams      = useSearchParams();
  const scenarioId        = searchParams.get('scenarioId');
  const excludePersonaIds = new Set((searchParams.get('excludePersonaIds') ?? '').split(',').filter(Boolean));
  const { user } = useUser();

  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [started, setStarted] = useState(false);
  const [showEndModal, setShowEndModal] = useState(false);
  const [ended, setEnded] = useState(false);
  const [prospect, setProspect] = useState<Prospect | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [barHeights, setBarHeights] = useState<number[]>([4, 4, 4, 4, 4]);

  const audioCtxRef  = useRef<AudioContext | null>(null);
  const analyserRef  = useRef<AnalyserNode | null>(null);
  const streamRef    = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number | null>(null);

  async function startMicrophone() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      streamRef.current = stream;

      const ctx      = new AudioContext();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      const source   = ctx.createMediaStreamSource(stream);
      source.connect(analyser);

      audioCtxRef.current = ctx;
      analyserRef.current = analyser;

      const data    = new Uint8Array(analyser.fftSize);
      const offsets = [1.0, 0.75, 1.15, 0.85, 1.05];

      function tick() {
        analyser.getByteTimeDomainData(data);

        let sum = 0;
        for (let i = 0; i < data.length; i++) {
          const v = (data[i] - 128) / 128;
          sum += v * v;
        }
        const rms    = Math.sqrt(sum / data.length);
        const volume = rms * 180;

        setBarHeights(offsets.map(o => volume * o));
        animFrameRef.current = requestAnimationFrame(tick);
      }
      tick();
    } catch (err) {
      console.error('Microphone access denied:', err);
    }
  }

  function stopMicrophone() {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    analyserRef.current?.disconnect();
    audioCtxRef.current?.close();
    streamRef.current?.getTracks().forEach(t => t.stop());
    setBarHeights([4, 4, 4, 4, 4]);
  }

  useEffect(() => () => stopMicrophone(), []);

  useEffect(() => {
    if (!scenarioId) return;
    const supabase = createClient();
    supabase
      .from('scenarios')
      .select('*')
      .eq('id', scenarioId)
      .single()
      .then(({ data, error }) => {
        if (error) console.error(error);
        else setScenario(data);
      });
  }, [scenarioId]);

  useEffect(() => {
    if (!scenarioId) return;
    const supabase = createClient();

    supabase
      .from('scenario_personas')
      .select('personaId')
      .eq('scenarioId', scenarioId)
      .then(({ data, error }) => {
        if (error || !data || data.length === 0) return console.error(error);

        const available = data.filter(r => !excludePersonaIds.has(r.personaId));
        const pool = available.length > 0 ? available : data;

        const personaId = pool[Math.floor(Math.random() * pool.length)].personaId;

        supabase
          .from('prospect_personas')
          .select('*')
          .eq('id', personaId)
          .single()
          .then(({ data: p, error: pErr }) => {
            if (pErr) return console.error(pErr);
            setProspect(p);
          });
      });
  }, [scenarioId]);

  const contactDetails = prospect ? [
    { label: 'Degree',       value: prospect.degree,         link: false },
    { label: 'Grad Year',    value: prospect.graduationYear, link: false },
    { label: 'Email',        value: prospect.email,          link: true  },
    { label: 'Current Role', value: prospect.currentRole,    link: false },
  ] : [];

  const scenarioBrief = scenario ? [
    { label: 'Title',       value: scenario.title,       color: colors.primary  },
    { label: 'Difficulty',  value: scenario.difficulty,  color: colors.tertiary },
    { label: 'Description', value: scenario.description, color: colors.primary  },
  ] : [];

  useEffect(() => {
    if (!started || ended) return;
    const id = setInterval(() => setElapsed(s => s + 1), 1000);
    return () => clearInterval(id);
  }, [started, ended]);

  async function startCall() {
    setStarted(true);
    startMicrophone();
    if (!user || !scenarioId || !prospect) return;

    const supabase = createClient();

    await supabase.from('users').upsert({
      id:        user.id,
      email:     user.emailAddresses[0]?.emailAddress ?? '',
      name:      `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || null,
      updatedAt: new Date().toISOString(),
    }, { onConflict: 'id' });

    const newId = crypto.randomUUID();
    const { error } = await supabase.from('call_sessions').insert({
      id:         newId,
      userId:     user.id,
      scenarioId,
      personaId:  prospect.id,
      status:     'IN_PROGRESS',
      startedAt:  new Date().toISOString(),
    });

    if (error) console.error('Failed to create call session:', error);
    else setSessionId(newId);
  }

  async function confirmEnd() {
    setShowEndModal(false);
    setEnded(true);
    stopMicrophone();

    if (sessionId) {
      const supabase = createClient();
      const { error } = await supabase
        .from('call_sessions')
        .update({ status: 'COMPLETED', endedAt: new Date().toISOString(), durationSec: elapsed })
        .eq('id', sessionId);

      if (error) console.error('Failed to complete call session:', error);
    }
  }

  const fmt = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  return (
    <div className={`min-h-screen flex flex-col ${styles.page}`}>

      <header className={`flex items-center justify-between shrink-0 ${styles.header}`}>
        <span className={styles.logo}>MockCaller</span>
        <span className={styles.sessionLabel}>Active Session: Major Donor Prospecting</span>
        <button className={styles.settingsBtn}><Settings size={20} /></button>
      </header>

      <div className={`flex flex-1 gap-4 min-h-0 ${styles.body}`}>

        <div className={`flex-[3] rounded-2xl flex flex-col overflow-hidden ${styles.callCard}`}>

          <div className="flex-1 flex flex-col items-center justify-center" style={{ gap: '56px', padding: '40px 32px' }}>

            {!started ? (
              <div className="text-center" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
                <div className={styles.avatarInner}>
                  <User size={56} color={colors.primary} />
                </div>
                <div>
                  <h2 className={styles.captionHeading}>Ready to begin?</h2>
                  <p className={styles.captionSub}>Review the scenario brief on the right, then start when you&apos;re prepared.</p>
                </div>
                <button onClick={startCall} className={`flex items-center ${styles.startCallBtn}`}>
                  <Mic size={18} />
                  Start Call
                </button>
              </div>
            ) : ended ? (
              <div className="text-center" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                <div className={styles.callEndedAvatar}>
                  <User size={56} color={colors.outline} />
                </div>
                <div>
                  <h2 className={styles.captionHeading}>Call Ended</h2>
                  <p className={styles.callEndedDuration}>Duration: {fmt(elapsed)}</p>
                  <p className={styles.captionSub}>Your session has been recorded and is ready for review.</p>
                </div>
                <button className={`flex items-center ${styles.returnBtn}`}>
                  <CheckCircle2 size={18} />
                  View Results
                </button>
              </div>
            ) : (
              <>
                <div className={styles.aiPill} style={{ marginBottom: '12px' }}>
                  <BarChart2 size={16} />
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    AI Speaking
                  </span>
                </div>

                <div className="relative flex items-center justify-center">
                  <div className={`absolute ${styles.avatarOuter}`} />
                  <div className={`absolute ${styles.avatarMid}`} />
                  <div className={`relative ${styles.avatarInner}`}>
                    <User size={56} color={colors.primary} />
                    <SoundBars heights={barHeights} />
                  </div>
                </div>

                <div className="text-center">
                  <h2 className={styles.captionHeading}>Prospecting Simulation</h2>
                  <p className={styles.captionSub}>
                    The AI is currently responding to your last statement about the literacy initiative.
                  </p>
                </div>
              </>
            )}
          </div>

          {started && !ended && (
            <div className={styles.controlsBar}>
              <button
                onClick={() => {
                  streamRef.current?.getAudioTracks().forEach(t => { t.enabled = isMuted; });
                  setIsMuted(m => !m);
                }}
                className={`flex items-center ${styles.muteBtn} ${isMuted ? styles.muteBtnActive : ''}`}
              >
                {isMuted ? <MicOff size={18} /> : <Mic size={18} />}
                {isMuted ? 'Unmute Microphone' : 'Mute Microphone'}
              </button>
              <button onClick={() => setShowEndModal(true)} className={`flex items-center ${styles.endCallBtn}`}>
                <PhoneOff size={18} />
                End Mock Call
              </button>
            </div>
          )}
        </div>

        <div className="flex-[2] flex flex-col gap-3 min-w-0">

          <div className={`rounded-2xl ${styles.infoPanelCard}`}>
            <h3 className={styles.cardHeading}>Scenario Brief</h3>
            <dl style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {scenarioBrief.map(({ label, value, color }) => (
                <div key={label} className="flex items-center justify-between">
                  <dt className={styles.rowLabel}>{label}:</dt>
                  <dd className={styles.rowValue} style={{ color }}>{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className={`rounded-2xl flex-1 overflow-y-auto ${styles.infoPanelCard}`}>

            <div className={styles.contactHeader}>
              <div className={styles.avatarBadge}>
                <User size={20} style={{ color: colors.primary }} />
              </div>
              <div>
                <p className={styles.contactName}>
                  {prospect ? `${prospect.firstName} ${prospect.lastName}` : '—'}
                </p>
                <p className={styles.primaryContactBadge}>Primary Contact</p>
              </div>
            </div>

            <div className="flex items-start gap-2" style={{ marginBottom: '20px' }}>
              <MapPin size={16} style={{ color: colors.outline, marginTop: '2px', flexShrink: 0 }} />
              <p className={styles.address}>
                {prospect
                  ? `${prospect.address1}, ${prospect.city}, ${prospect.province} ${prospect.postalcode}`
                  : '—'}
              </p>
            </div>

            <dl className={styles.detailsList}>
              {contactDetails.map(({ label, value, link }) => (
                <div key={label} className="flex justify-between gap-3">
                  <dt className={styles.detailLabel}>{label}:</dt>
                  <dd className={`${styles.detailValue} ${link ? styles.detailValueLink : ''}`}>{value}</dd>
                </div>
              ))}
            </dl>

            <div className={styles.tonalDivider} />

            <p className={styles.pastGiftsLabel}>Past Gifts</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {PAST_GIFTS.map(({ amount, label, date }) => (
                <div key={label} className="flex items-start justify-between gap-2">
                  <div>
                    <p className={styles.giftAmount}>{amount}</p>
                    <p className={styles.giftLabel}>{label}</p>
                  </div>
                  <span className={styles.giftDate}>{date}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.timerCard}>
            <Clock size={20} style={{ color: colors.primary }} />
            <div style={{ flex: 1 }}>
              <p className={styles.timerLabel}>Session Timer</p>
              <p className={styles.timerSubLabel}>Active Duration</p>
            </div>
            <span className={styles.timerValue}>{fmt(elapsed)}</span>
          </div>

        </div>
      </div>

      {showEndModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalCard}>
            <div className={styles.modalIconWrap}>
              <PhoneOff size={24} color="#dc2626" />
            </div>
            <h2 className={styles.modalHeading}>End Mock Call?</h2>
            <p className={styles.modalSub}>Your session will be saved and available for review in your dashboard.</p>
            <div className={styles.modalActions}>
              <button onClick={() => setShowEndModal(false)} className={styles.modalCancelBtn}>
                Keep Going
              </button>
              <button onClick={confirmEnd} className={styles.modalConfirmBtn}>
                End Call
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function ActiveCall() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading…</div>}>
      <ActiveCallContent />
    </Suspense>
  );
}
