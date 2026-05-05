import type { Metadata } from 'next'
import { Bell, Bot, Clock, MapPin, MicOff, PhoneOff, Settings, User } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Active Mock Call | CallDrill',
  description: 'Live practice call session',
}

export default function ActiveMockCallPage() {
  return (
    <div className="active-mock-page">
      <div className="active-mock-page__deco-tr" aria-hidden />
      <div className="active-mock-page__deco-bl" aria-hidden />

      <nav className="active-mock-nav">
        <div className="active-mock-nav__left">
          <span className="active-mock-nav__brand">MockCaller</span>
          <div className="active-mock-nav__divider" aria-hidden />
          <span className="active-mock-nav__session">Current Scenario: Major Donor Prospecting</span>
        </div>
        <div className="active-mock-nav__right">
          <div className="active-mock-nav__timer-pill">
            <Clock className="active-mock-icon--timer" strokeWidth={2} aria-hidden />
            <span className="active-mock-nav__timer-text">04:12</span>
          </div>
          <div className="active-mock-nav__icon-row">
            <button type="button" className="active-mock-nav__icon-btn" aria-label="Notifications">
              <Bell className="active-mock-icon--nav" strokeWidth={2} />
            </button>
            <button type="button" className="active-mock-nav__icon-btn" aria-label="Settings">
              <Settings className="active-mock-icon--nav" strokeWidth={2} />
            </button>
          </div>
        </div>
      </nav>

      <main className="active-mock-main">
        <section className="active-mock-feed">
          <div className="active-mock-feed__head">
            <div>
              <h1 className="active-mock-feed__title">Live Transcription</h1>
              <p className="active-mock-feed__subtitle">Real-time analysis of the ongoing conversation.</p>
            </div>
            <div className="active-mock-feed__status">
              <div className="audio-wave h-4" aria-hidden>
                <div className="wave-bar h-2" />
                <div className="wave-bar h-4" />
                <div className="wave-bar h-3" />
                <div className="wave-bar h-5" />
              </div>
              <span className="active-mock-feed__status-label">AI Speaking</span>
            </div>
          </div>

          <div className="active-mock-transcript">
            <div className="active-mock-transcript__inner">
              <div className="active-mock-line">
                <div className="active-mock-avatar" aria-hidden>
                  <User className="active-mock-icon--bubble" strokeWidth={2} />
                </div>
                <div className="active-mock-line__body">
                  <span className="active-mock-label">You</span>
                  <p className="active-mock-quote">
                    Good afternoon, Mr. Henderson. Thank you so much for taking the time to speak with me today
                    about the new literacy initiative.
                  </p>
                </div>
              </div>

              <div className="active-mock-line--ai">
                <div className="active-mock-avatar--ai" aria-hidden>
                  <Bot className="active-mock-icon--bubble" strokeWidth={2} />
                </div>
                <div className="active-mock-line__body">
                  <span className="active-mock-label--ai">Prospect (AI)</span>
                  <div className="active-mock-bubble">
                    <p className="active-mock-quote--ai">
                      &ldquo;I&apos;ve read the brief you sent over. It looks ambitious, but I&apos;m curious
                      about the long-term sustainability of the library funding model.&rdquo;
                    </p>
                  </div>
                </div>
              </div>

              <div className="active-mock-line--ghost">
                <div className="active-mock-avatar--pulse">
                  <User className="active-mock-icon--ghost-user" strokeWidth={2} />
                </div>
                <div className="active-mock-line__body">
                  <span className="active-mock-label--ghost">You (Listening...)</span>
                  <div className="active-mock-skel" />
                </div>
              </div>
            </div>
          </div>

          <div className="active-mock-controls">
            <button type="button" className="active-mock-btn-muted">
              <MicOff className="active-mock-btn-muted__icon" strokeWidth={2} />
              <span>Mute Microphone</span>
            </button>
            <div className="active-mock-controls__divider" aria-hidden />
            <button type="button" className="active-mock-btn-danger">
              <PhoneOff className="active-mock-btn-danger__icon" strokeWidth={2} />
              <span>End Mock Call</span>
            </button>
          </div>
        </section>

        <aside className="active-mock-aside">
          <div className="active-mock-profile">
            <div className="active-mock-profile__scenario">
              <h3 className="active-mock-profile__scenario-title">Scenario Brief</h3>
              <div className="active-mock-brief">
                <div className="active-mock-brief__row">
                  <span className="active-mock-brief__label">Persona:</span>
                  <span className="active-mock-brief__value">Skeptical Philanthropist</span>
                </div>
                <div className="active-mock-brief__row">
                  <span className="active-mock-brief__label">Difficulty:</span>
                  <span className="active-mock-brief__value--tertiary">Advanced</span>
                </div>
                <div className="active-mock-brief__row">
                  <span className="active-mock-brief__label">Objective:</span>
                  <span className="active-mock-brief__value--secondary">Address Objections</span>
                </div>
              </div>
            </div>

            <div className="active-mock-profile__header">
              <div className="active-mock-profile__identity">
                <div className="active-mock-profile__avatar-ring">
                  <User className="active-mock-profile__avatar-icon" strokeWidth={2} aria-hidden />
                </div>
                <div className="active-mock-profile__name-block">
                  <h3 className="active-mock-profile__name">Mr. Arthur Henderson</h3>
                  <p className="active-mock-profile__role">Primary Contact</p>
                </div>
              </div>
              <div className="active-mock-profile__address">
                <MapPin className="active-mock-profile__address-icon" strokeWidth={2} aria-hidden />
                <span>
                  452 Oak Ridge Parkway,
                  <br />
                  Greenwich, CT 06830
                </span>
              </div>
            </div>

            <div className="active-mock-profile__body">
              <div>
                <h4 className="active-mock-profile__section-title">Major Interests</h4>
                <div className="active-mock-profile__tags">
                  <span className="active-mock-profile__tag">Literacy Initiatives</span>
                  <span className="active-mock-profile__tag">Historical Preservation</span>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </main>
    </div>
  )
}
