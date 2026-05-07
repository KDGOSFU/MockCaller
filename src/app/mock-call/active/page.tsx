'use client';

import { useState, useEffect } from 'react';
import { Settings, BarChart2, Mic, MicOff, PhoneOff, MapPin, User, Clock } from 'lucide-react';
import {
  colors,
  pageStyle, headerStyle, logoStyle, sessionLabelStyle, settingsBtnStyle,
  bodyStyle, callCardStyle, aiPillStyle,
  avatarOuterStyle, avatarMidStyle, avatarInnerStyle,
  captionHeadingStyle, captionSubStyle,
  controlsBarStyle, muteBtnStyle, endCallBtnStyle,
  infoPanelCardStyle, cardHeadingStyle, rowLabelStyle, rowValueStyle,
  contactHeaderStyle, avatarBadgeStyle, contactNameStyle, primaryContactBadgeStyle,
  addressStyle, detailsListStyle, detailLabelStyle, detailValueStyle,
  tonalDividerStyle, pastGiftsLabelStyle,
  giftAmountStyle, giftLabelStyle, giftDateStyle,
  timerCardStyle, timerLabelStyle, timerSubLabelStyle, timerValueStyle,
  soundBarStyle,
} from './styles';

/* ── Static data ────────────────────────────────────────────────── */
const PAST_GIFTS = [
  { amount: '$5,000',  label: 'Annual Scholarship Fund', date: 'Oct 12, 2023' },
  { amount: '$2,500',  label: 'Library Modernization',   date: 'Jan 15, 2023'  },
  { amount: '$10,000', label: 'Endowment Fund',          date: 'Nov 20, 2022' },
];

const CONTACT_DETAILS = [
  { label: 'Major',           value: 'Political Science',                        link: false },
  { label: 'Graduation Year', value: 'Class of 1992',                            link: false },
  { label: 'Email',           value: 'a.henderson@email.com',                    link: true  },
  { label: 'Current Job',     value: 'Senior Partner at Henderson & Associates', link: false },
] as const;

const SCENARIO = [
  { label: 'Persona',    value: 'Skeptical Philanthropist', color: colors.primary  },
  { label: 'Difficulty', value: 'Advanced',                 color: colors.tertiary },
  { label: 'Objective',  value: 'Address Objections',       color: colors.primary  },
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

function BotIcon() {
  return (
    <svg width="56" height="56" viewBox="0 0 48 48" fill="none" stroke={colors.primary}>
      <line x1="24" y1="4"  x2="24" y2="10" strokeWidth="2" strokeLinecap="round" />
      <circle cx="24" cy="3"  r="2" fill={colors.primary} stroke="none" />
      <rect   x="8"  y="10" width="32" height="26" rx="6" strokeWidth="2" />
      <circle cx="17" cy="22" r="3" fill={colors.primary} stroke="none" />
      <circle cx="31" cy="22" r="3" fill={colors.primary} stroke="none" />
      <path   d="M18 31 Q24 35 30 31" strokeWidth="2" strokeLinecap="round" fill="none" />
      <rect   x="4"  y="18" width="4" height="8" rx="2" strokeWidth="2" />
      <rect   x="40" y="18" width="4" height="8" rx="2" strokeWidth="2" />
    </svg>
  );
}

/* ── Page ───────────────────────────────────────────────────────── */
export default function ActiveCallPage() {
  const [elapsed, setElapsed] = useState(252);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setElapsed(s => s + 1), 1000);
    return () => clearInterval(id);
  }, []);

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
                <BotIcon />
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
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center" style={controlsBarStyle}>
            <button onClick={() => setIsMuted(m => !m)} className="flex items-center" style={{ ...muteBtnStyle, ...(isMuted && { backgroundColor: '#dc2626', color: '#ffffff' }) }}>
              {isMuted ? <MicOff size={18} /> : <Mic size={18} />}
              {isMuted ? 'Unmute Microphone' : 'Mute Microphone'}
            </button>
            <button className="flex items-center" style={endCallBtnStyle}>
              <PhoneOff size={18} />
              End Mock Call
            </button>
          </div>
        </div>

        {/* Right — info panel */}
        <div className="flex-[2] flex flex-col gap-3 min-w-0">

          {/* Scenario Brief */}
          <div className="rounded-2xl" style={infoPanelCardStyle}>
            <h3 style={cardHeadingStyle}>Scenario Brief</h3>
            <dl style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {SCENARIO.map(({ label, value, color }) => (
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
                <p style={contactNameStyle}>Mr. Arthur Henderson</p>
                <p style={primaryContactBadgeStyle}>Primary Contact</p>
              </div>
            </div>

            <div className="flex items-start gap-2" style={{ marginBottom: '20px' }}>
              <MapPin size={16} style={{ color: colors.outline, marginTop: '2px', flexShrink: 0 }} />
              <p style={addressStyle}>452 Oak Ridge Parkway,<br />Greenwich, CT 06830</p>
            </div>

            <dl style={detailsListStyle}>
              {CONTACT_DETAILS.map(({ label, value, link }) => (
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
    </div>
  );
}
