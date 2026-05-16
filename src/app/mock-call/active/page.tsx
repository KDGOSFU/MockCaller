'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Settings, BarChart2, Mic, MicOff, PhoneOff, MapPin, User, Clock, CheckCircle2 } from 'lucide-react';
import {
  colors,
  pageStyle, headerStyle, logoStyle, sessionLabelStyle, settingsBtnStyle,
  bodyStyle, callCardStyle, aiPillStyle,
  avatarOuterStyle, avatarMidStyle, avatarInnerStyle,
  captionHeadingStyle, captionSubStyle,
  controlsBarStyle, startCallBtnStyle, muteBtnStyle, endCallBtnStyle,
  modalOverlayStyle, modalCardStyle, modalHeadingStyle, modalSubStyle,
  modalIconWrapStyle, modalActionsStyle, modalCancelBtnStyle, modalConfirmBtnStyle,
  callEndedAvatarStyle, callEndedDurationStyle, returnBtnStyle,
  infoPanelCardStyle, cardHeadingStyle, rowLabelStyle, rowValueStyle,
  contactHeaderStyle, avatarBadgeStyle, contactNameStyle, primaryContactBadgeStyle,
  addressStyle, detailsListStyle, detailLabelStyle, detailValueStyle,
  tonalDividerStyle, pastGiftsLabelStyle,
  giftAmountStyle, giftLabelStyle, giftDateStyle,
  timerCardStyle, timerLabelStyle, timerSubLabelStyle, timerValueStyle,
  soundBarStyle,
} from './styles';

/* ── Scenario type ───────────────────────────────────────────────── */
type Scenario = {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  focusSkills: string[];
};

type Prospect ={
  id: string;
  firstName: string;
  lastName : string;
  age : string;
  graduationYear: string;
  currentRole: string;
  email: string;
  address1: string;
  address2: string;
  postalcode: string;
  province: string;
  city: string;
  degree: string;
}
/* ── Static data ────────────────────────────────────────────────── */
const PAST_GIFTS = [
  { amount: '$5,000',  label: 'Annual Scholarship Fund', date: 'Oct 12, 2023' },
  { amount: '$2,500',  label: 'Library Modernization',   date: 'Jan 15, 2023'  },
  { amount: '$10,000', label: 'Endowment Fund',          date: 'Nov 20, 2022' },
];


const BAR_HEIGHTS = [10, 16, 12, 18, 10];
const BAR_DELAYS  = [0, 0.15, 0.3, 0.15, 0];

/* ── Sub-components ─────────────────────────────────────────────── */
function SoundBars() {
  return (
    <>
      <style>{`
        @keyframes sound-bar {
          0%, 100% { transform: scaleY(0.35); }
          50%       { transform: scaleY(1);    }
        }
        .sound-bar { transform-origin: bottom; }

        @keyframes ring-outer {
          0%, 100% { transform: scale(0.9);  opacity: 0.3; }
          50%       { transform: scale(1.08); opacity: 0.6; }
        }
        @keyframes ring-mid {
          0%, 100% { transform: scale(0.93); opacity: 0.2; }
          50%       { transform: scale(1.05); opacity: 0.5; }
        }
      `}</style>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 20 }}>
        {BAR_HEIGHTS.map((h, i) => (
          <div key={i} className="sound-bar rounded-full" style={soundBarStyle(h, BAR_DELAYS[i])} />
        ))}
      </div>
    </>
  );
}


/* ── Page ───────────────────────────────────────────────────────── */
export default function ActiveCallPage() {
  const searchParams = useSearchParams();
  const scenarioId = searchParams.get('scenarioId');

  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [started, setStarted] = useState(false);
  const [showEndModal, setShowEndModal] = useState(false);
  const [ended, setEnded] = useState(false);
  const [prospect, setProspect] = useState<Prospect | null>(null);

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
      .limit(1)
      .then(({ data, error }) => {
        if (error || !data) return console.error(error);
  
        supabase
          .from('prospect_personas')
          .select('*')
          .eq('id', data[0].personaId)
          .single()
          .then(({ data: p, error: pErr }) => {
            if (pErr) return console.error(pErr);
            setProspect(p);
            console.log(p); // 👈 confirm it's loading
          });
      });
  }, [scenarioId]);

  const contactDetails = prospect ? [
    { label: 'Degree',       value: prospect.degree,          link: false },
    { label: 'Grad Year',    value: prospect.graduationYear,  link: false },
    { label: 'Email',        value: prospect.email,           link: true  },
    { label: 'Current Role', value: prospect.currentRole,     link: false },
  ] : [];

  const scenarioBrief = scenario ? [
    { label: 'Title',      value: scenario.title,                    color: colors.primary  },
    { label: 'Difficulty', value: scenario.difficulty,               color: colors.tertiary },
    { label: 'Description',      value: scenario.description,  color: colors.primary  },
  ] : [];

  useEffect(() => {
    if (!started || ended) return;
    const id = setInterval(() => setElapsed(s => s + 1), 1000);
    return () => clearInterval(id);
  }, [started, ended]);

  function confirmEnd() {
    setShowEndModal(false);
    setEnded(true);
  }

  const fmt = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  return (
    <div className="min-h-screen flex flex-col" style={pageStyle}>

      {/* Header */}
      <header className="flex items-center justify-between shrink-0" style={headerStyle}>
        <span style={logoStyle}>MockCaller</span>
        <span style={sessionLabelStyle}>Active Session: Major Donor Prospecting</span>
        <button style={settingsBtnStyle}><Settings size={20} /></button>
      </header>

      {/* Body */}
      <div className="flex flex-1 gap-4 min-h-0" style={bodyStyle}>

        {/* Left — call stage */}
        <div className="flex-[3] rounded-2xl flex flex-col overflow-hidden" style={callCardStyle}>

          <div className="flex-1 flex flex-col items-center justify-center" style={{ gap: '56px', padding: '40px 32px' }}>

            {!started ? (
              /* ── Pre-call: ready screen ── */
              <div className="text-center" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
                <div className="relative flex items-center justify-center">
                  <div className="relative flex flex-col items-center justify-center gap-2" style={avatarInnerStyle}>
                    <User size={56} color={colors.primary} />
                  </div>
                </div>
                <div>
                  <h2 style={captionHeadingStyle}>Ready to begin?</h2>
                  <p style={captionSubStyle}>Review the scenario brief on the right, then start when you&apos;re prepared.</p>
                </div>
                <button
                  onClick={() => setStarted(true)}
                  className="flex items-center"
                  style={startCallBtnStyle}
                >
                  <Mic size={18} />
                  Start Call
                </button>
              </div>
            ) : ended ? (
              /* ── Call ended ── */
              <div className="text-center" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                <div style={callEndedAvatarStyle}>
                  <User size={56} color={colors.outline} />
                </div>
                <div>
                  <h2 style={captionHeadingStyle}>Call Ended</h2>
                  <p style={callEndedDurationStyle}>Duration: {fmt(elapsed)}</p>
                  <p style={captionSubStyle}>Your session has been recorded and is ready for review.</p>
                </div>
                <button style={returnBtnStyle}>
                  <CheckCircle2 size={18} />
                  View Results
                </button>
              </div>
            ) : (
              /* ── Active call ── */
              <>
                {/* AI Speaking pill */}
                <div className="flex items-center rounded-full" style={{ ...aiPillStyle, marginBottom: '12px' }}>
                  <BarChart2 size={16} />
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    AI Speaking
                  </span>
                </div>

                {/* Avatar */}
                <div className="relative flex items-center justify-center">
                  <div className="absolute" style={{ ...avatarOuterStyle, animation: 'ring-outer 3s ease-in-out infinite' }} />
                  <div className="absolute" style={{ ...avatarMidStyle,  animation: 'ring-mid 3s ease-in-out infinite', animationDelay: '0.75s' }} />
                  <div className="relative flex flex-col items-center justify-center gap-2" style={avatarInnerStyle}>
                    <User size={56} color={colors.primary} />
                    <SoundBars />
                  </div>
                </div>

                {/* Caption */}
                <div className="text-center">
                  <h2 style={captionHeadingStyle}>Prospecting Simulation</h2>
                  <p style={captionSubStyle}>
                    The AI is currently responding to your last statement about the literacy initiative.
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Controls — only shown during active call */}
          {started && !ended && (
            <div className="flex items-center justify-center" style={controlsBarStyle}>
              <button onClick={() => setIsMuted(m => !m)} className="flex items-center" style={{ ...muteBtnStyle, ...(isMuted && { backgroundColor: '#dc2626', color: '#ffffff' }) }}>
                {isMuted ? <MicOff size={18} /> : <Mic size={18} />}
                {isMuted ? 'Unmute Microphone' : 'Mute Microphone'}
              </button>
              <button onClick={() => setShowEndModal(true)} className="flex items-center" style={endCallBtnStyle}>
                <PhoneOff size={18} />
                End Mock Call
              </button>
            </div>
          )}
        </div>

        {/* Right — info panel */}
        <div className="flex-[2] flex flex-col gap-3 min-w-0">

          {/* Scenario Brief */}
          <div className="rounded-2xl" style={infoPanelCardStyle}>
            <h3 style={cardHeadingStyle}>Scenario Brief</h3>
            <dl style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {scenarioBrief.map(({ label, value, color }) => (
                <div key={label} className="flex items-center justify-between">
                  <dt style={rowLabelStyle}>{label}:</dt>
                  <dd style={rowValueStyle(color)}>{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Contact card */}
          <div className="rounded-2xl flex-1 overflow-y-auto" style={infoPanelCardStyle}>

            <div className="flex items-center gap-3" style={contactHeaderStyle}>
              <div style={avatarBadgeStyle}>
                <User size={20} style={{ color: colors.primary }} />
              </div>
              <div>
                <p style={contactNameStyle}>
                  {prospect ? `${prospect.firstName} ${prospect.lastName}` : '—'}
                </p>
                <p style={primaryContactBadgeStyle}>Primary Contact</p>
              </div>
            </div>

            <div className="flex items-start gap-2" style={{ marginBottom: '20px' }}>
              <MapPin size={16} style={{ color: colors.outline, marginTop: '2px', flexShrink: 0 }} />
              <p style={addressStyle}>
                {prospect
                  ? `${prospect.address1}, ${prospect.city}, ${prospect.province} ${prospect.postalcode}`
                  : '—'}
              </p>
            </div>

            <dl style={detailsListStyle}>
              {contactDetails.map(({ label, value, link }) => (
                <div key={label} className="flex justify-between gap-3">
                  <dt style={detailLabelStyle}>{label}:</dt>
                  <dd style={detailValueStyle(link)}>{value}</dd>
                </div>
              ))}
            </dl>

            <div style={tonalDividerStyle} />

            <p style={pastGiftsLabelStyle}>Past Gifts</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {PAST_GIFTS.map(({ amount, label, date }) => (
                <div key={label} className="flex items-start justify-between gap-2">
                  <div>
                    <p style={giftAmountStyle}>{amount}</p>
                    <p style={giftLabelStyle}>{label}</p>
                  </div>
                  <span style={giftDateStyle}>{date}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Session Timer */}
          <div className="rounded-2xl flex items-center gap-3 shrink-0" style={timerCardStyle}>
            <Clock size={20} style={{ color: colors.primary }} />
            <div style={{ flex: 1 }}>
              <p style={timerLabelStyle}>Session Timer</p>
              <p style={timerSubLabelStyle}>Active Duration</p>
            </div>
            <span style={timerValueStyle}>{fmt(elapsed)}</span>
          </div>

        </div>
      </div>

      {/* End call confirmation modal */}
      {showEndModal && (
        <div style={modalOverlayStyle}>
          <div style={modalCardStyle}>
            <div style={modalIconWrapStyle}>
              <PhoneOff size={24} color="#dc2626" />
            </div>
            <h2 style={modalHeadingStyle}>End Mock Call?</h2>
            <p style={modalSubStyle}>Your session will be saved and available for review in your dashboard.</p>
            <div style={modalActionsStyle}>
              <button onClick={() => setShowEndModal(false)} style={modalCancelBtnStyle}>
                Keep Going
              </button>
              <button onClick={confirmEnd} style={modalConfirmBtnStyle}>
                End Call
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
