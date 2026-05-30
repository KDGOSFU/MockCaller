import { ActiveCall } from '@/views/ActiveCall';

import { Suspense, useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
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

//transcript entry type
type TranscriptEntry = {
  speaker: 'caller' | 'alumni',
  text: string;
  timestampMs: number;
};

/* ── Static data ────────────────────────────────────────────────── */
const PAST_GIFTS = [
  { amount: '$5,000',  label: 'Annual Scholarship Fund', date: 'Oct 12, 2023' },
  { amount: '$2,500',  label: 'Library Modernization',   date: 'Jan 15, 2023'  },
  { amount: '$10,000', label: 'Endowment Fund',          date: 'Nov 20, 2022' },
];


/* ── Sub-components ─────────────────────────────────────────────── */
function SoundBars({ heights }: { heights: number[] }) {
  return (
    <>
      <style>{`
        @keyframes ring-outer {
          0%, 100% { transform: scale(0.9);  opacity: 0.3; }
          50%       { transform: scale(1.08); opacity: 0.6; }
        }
        @keyframes ring-mid {
          0%, 100% { transform: scale(0.93); opacity: 0.2; }
          50%       { transform: scale(1.05); opacity: 0.5; }
        }
      `}</style>
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
    </>
  );
}


/* ── Page ───────────────────────────────────────────────────────── */
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
  const [callError, setCallError] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const callStartTimeRef = useRef<number>(0);

  /* ── Audio refs ── */
  const audioCtxRef  = useRef<AudioContext | null>(null);
  const analyserRef  = useRef<AnalyserNode | null>(null);
  const streamRef    = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const pcRef         = useRef<RTCPeerConnection | null>(null);
  const aiAudioRef    = useRef<HTMLAudioElement | null>(null);
  const dcRef         = useRef<RTCDataChannel | null>(null);


  async function startMicrophone(stream: MediaStream) {
      const ctx      = new AudioContext();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      const source   = ctx.createMediaStreamSource(stream);
      source.connect(analyser);

      audioCtxRef.current = ctx;
      analyserRef.current = analyser;

      const data = new Uint8Array(analyser.fftSize);

      // Small per-bar offsets so bars don't move in lockstep
      const offsets = [1.0, 0.75, 1.15, 0.85, 1.05];

      function tick() {
        analyser.getByteTimeDomainData(data); // waveform: 0–255, silence = 128

        // RMS volume
        let sum = 0;
        for (let i = 0; i < data.length; i++) {
          const v = (data[i] - 128) / 128;
          sum += v * v;
        }
        const rms    = Math.sqrt(sum / data.length);
        const volume = rms * 180; // scale to ~px height

        setBarHeights(offsets.map(o => volume * o));
        animFrameRef.current = requestAnimationFrame(tick);
      }
      tick();
  }

  // function stopMicrophone() {
  //   if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
  //   analyserRef.current?.disconnect();
  //   audioCtxRef.current?.close();
  //   streamRef.current?.getTracks().forEach(t => t.stop());
  //   setBarHeights([4, 4, 4, 4, 4]);
  // }

  function stopMicrophone() {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    analyserRef.current?.disconnect();
    if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close();
    }
    streamRef.current?.getTracks().forEach(t => t.stop());
    audioCtxRef.current = null;  // ← add this
    setBarHeights([4, 4, 4, 4, 4]);
}

  function stopWebRTC() {
    dcRef.current?.close();
    pcRef.current?.close();
    pcRef.current = null;
    dcRef.current = null;
    if (aiAudioRef.current) {
      aiAudioRef.current.srcObject = null;
      aiAudioRef.current = null;
    }
  }

  function handleRealtimeEvent(event: any) {
    switch (event.type) {
      // AI finished a turn — grab transcript
      case 'conversation.item.completed': {
        const item = event.item;
        if (item?.role === 'assistant' && item?.content?.[0]?.transcript) {
          setTranscript(prev => [...prev, {
            speaker: 'alumni',
            text: item.content[0].transcript,
            timestampMs: Date.now() - callStartTimeRef.current,
          }]);
        }
        break;
      }
      // User speech transcribed
      case 'conversation.item.created': {
        const item = event.item;
        if (item?.role === 'user' && item?.content?.[0]?.transcript) {
          setTranscript(prev => [...prev, {
            speaker: 'caller',
            text: item.content[0].transcript,
            timestampMs: Date.now() - callStartTimeRef.current,
          }]);
        }
        break;
      }
      default:
        // uncomment to debug all incoming events:
        // console.log('realtime event:', event.type, event)
        break;
    }
  }

  // Clean up on unmount
  useEffect(() => () => { stopMicrophone(); stopWebRTC(); }, []);

  // fetch scenario — back to original
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

// fetch prospect — back to original  
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
        const randomIndex = Math.floor(Math.random() * pool.length);
        const personaId = pool[randomIndex].personaId;
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
        const randomIndex = Math.floor(Math.random() * pool.length);
        const personaId = pool[randomIndex].personaId;
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

  useEffect(() => {
    if (!started || ended) return;
    const id = setInterval(() => setElapsed(s => s + 1), 1000);
    return () => clearInterval(id);
  }, [started, ended]);

  async function startCall() {
    if (!user || !scenarioId || !prospect) return;
    setCallError(null);

    try {
      // 1. get mic stream first (need it for both visualiser and WebRTC)
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      streamRef.current = stream;

      // 2. start visualiser
      await startMicrophone(stream);

      // 3. get ephemeral token + create DB session via your API route
      const res = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ personaId: prospect.id, scenarioId }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? 'Failed to create session');
      }

      const { dbSessionId, clientSecret, model } = await res.json();
      setSessionId(dbSessionId);
      callStartTimeRef.current = Date.now();

      // 4. create peer connection
      const pc = new RTCPeerConnection();
      pcRef.current = pc;

      // 5. wire up incoming AI audio
      const aiAudio = document.createElement('audio');
      aiAudio.autoplay = true;
      aiAudioRef.current = aiAudio;
      pc.ontrack = (e) => {
        aiAudio.srcObject = e.streams[0];
      };

      // 6. ICE state tracking
      pc.oniceconnectionstatechange = () => {
        console.log('ICE:', pc.iceConnectionState);
        if (pc.iceConnectionState === 'failed') {
          setCallError('Connection failed. Please try again.');
        }
      };

      // 7. data channel for transcript events
      const dc = pc.createDataChannel('oai-events');
      dcRef.current = dc;
      dc.onmessage = (e) => handleRealtimeEvent(JSON.parse(e.data));

      // 8. add mic track to peer connection
      stream.getTracks().forEach(t => pc.addTrack(t, stream));

      // 9. SDP offer → OpenAI → SDP answer
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      console.log("model from server:", model); // ← add this
      
      const sdpRes = await fetch(`https://api.openai.com/v1/realtime/calls?model=${model}`, {
          method: 'POST',
          headers: {
              'Authorization': `Bearer ${clientSecret}`,
              'Content-Type': 'application/sdp',
          },
          body: offer.sdp,
      });

      // const sdpRes = await fetch('https://api.openai.com/v1/realtime/calls', {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${clientSecret}`,
      //     'Content-Type': 'application/sdp',
      //   },
      //   body: offer.sdp,
      // });

      if (!sdpRes.ok) {
        const errText = await sdpRes.text();
        throw new Error(`OpenAI SDP exchange failed: ${sdpRes.status} — ${errText}`);
      }

      const answerSdp = await sdpRes.text();
      await pc.setRemoteDescription({ type: 'answer', sdp: answerSdp });

      // 10. connected — show active call UI
      setStarted(true);

    } catch (err: any) {
      console.error('startCall error:', err);
      setCallError(err.message ?? 'Something went wrong');
      stopMicrophone();
      stopWebRTC();
    }
  }


  async function confirmEnd() {
    setShowEndModal(false);
    setEnded(true);
    stopMicrophone();
    stopWebRTC();

    if (sessionId) {
      // save transcript + mark session complete
      await fetch(`/api/sessions/${sessionId}/end`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript, durationSec: elapsed }),
      }).catch(console.error);
    }
  }


  const fmt = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;


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
                {callError && (
                  <p style={{ color: '#dc2626', fontSize: '0.85rem', maxWidth: 320, textAlign: 'center' }}>
                    {callError}
                  </p>
                )}
                <button
                  onClick={startCall}
                  className="flex items-center"
                  style={startCallBtnStyle}
                  disabled={!prospect || !scenario}
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
                    <SoundBars heights={barHeights} />
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
              <button onClick={() => {
                streamRef.current?.getAudioTracks().forEach(t => { t.enabled = isMuted; });
                setIsMuted(m => !m);
              }} className="flex items-center" style={{ ...muteBtnStyle, ...(isMuted && { backgroundColor: '#dc2626', color: '#ffffff' }) }}>
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

export default function ActiveCallPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading…</div>}>
      <ActiveCallContent />
    </Suspense>
  );
export default function Page() {
  return <ActiveCall />;
}
