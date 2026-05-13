// ALIGN — Welcome screen (first launch)
// Subtle, professional cinematic hero: full-bleed posture/mobility video loop
// behind the logo, tagline, and feature pills.

// Locked-in clip: Spinal twist (Mixkit, royalty-free).
// Swap WELCOME_VIDEO_SRC for your own .mp4/.webm once you have a final clip.
const WELCOME_VIDEO_SRC = 'https://assets.mixkit.co/videos/52119/52119-720.mp4';

function WelcomeVideo() {
  const [videoOk, setVideoOk] = React.useState(true);
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {/* Base atmosphere (shows under/around the video) */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(120% 80% at 50% 28%, #2E4878 0%, #1B3460 50%, #142850 100%)',
      }}/>

      {/* Real footage — looping, muted, autoplay, plays inline on iOS */}
      {videoOk && (
        <video
          src={WELCOME_VIDEO_SRC}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onError={() => setVideoOk(false)}
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover',
            filter: 'brightness(1.05) saturate(0.9) contrast(1.02)',
          }}
        />
      )}

      {/* Subtle cool tone wash over the footage */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, rgba(20,40,80,0.18) 0%, rgba(20,40,80,0.05) 35%, rgba(20,40,80,0.30) 75%, rgba(20,40,80,0.70) 100%)',
      }}/>

      {/* Slow-drifting light wash (subtle motion) */}
      <div style={{
        position: 'absolute', inset: '-10%',
        background: 'radial-gradient(40% 28% at 50% 32%, rgba(180,205,255,0.10) 0%, transparent 65%)',
        filter: 'blur(20px)',
        animation: 'alignLightDrift 14s ease-in-out infinite alternate',
      }}/>
      <style>{`
        @keyframes alignLightDrift {
          0%   { transform: translate3d(-2%, -1%, 0) scale(1.00); opacity: 0.85; }
          100% { transform: translate3d( 3%,  2%, 0) scale(1.08); opacity: 1.00; }
        }
      `}</style>

      {/* Faint grid texture */}
      <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, opacity: 0.05 }}>
        <defs>
          <pattern id="welcomeGrid" width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M32 0H0V32" fill="none" stroke="#B4CDFF" strokeWidth="0.4"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#welcomeGrid)"/>
      </svg>

      {/* Readability scrim — heavier at bottom */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, rgba(20,40,80,0.04) 0%, rgba(20,40,80,0.20) 55%, rgba(20,40,80,0.75) 100%)',
      }}/>
    </div>
  );
}

function WelcomeScreen({ onStart, onSignIn, accountDeleted = false }) {
  return (
    <Screen padBottom={150}>
      <WelcomeVideo />

      <div style={{
        position: 'absolute', top: 0, bottom: 150, left: 0, right: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: '0 32px', gap: 26,
      }}>
        {/* Horizontal logo lockup */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#FFFFFF' }}>
          <svg width="40" height="40" viewBox="0 0 64 64" fill="none" style={{ display: 'block' }}>
            <g stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="16,24 32,12 48,24"/>
              <polyline points="16,38 32,26 48,38"/>
              <polyline points="16,52 32,40 48,52"/>
            </g>
          </svg>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2 }}>
            <div style={{
              fontFamily: "'Inter Tight', sans-serif",
              fontSize: 26, fontWeight: 600,
              letterSpacing: '0.18em', lineHeight: 1, color: '#FFFFFF',
            }}>ALIGN</div>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 9, letterSpacing: '0.26em',
              color: 'rgba(180,205,255,0.7)',
            }}>POSTURE</div>
          </div>
        </div>

        <p style={{
          margin: 0, fontFamily: "'Inter Tight', sans-serif",
          fontSize: 19, lineHeight: 1.5, color: 'rgba(255,255,255,0.92)',
          maxWidth: 300, fontWeight: 400, letterSpacing: '-0.005em',
        }}>
          Restore your balance.<br/>
          <span style={{ color: '#B4CDFF' }}>Correct your posture.</span>
        </p>

        <div style={{ display: 'flex', gap: 10, width: '100%', maxWidth: 320, justifyContent: 'center' }}>
          {[
            { big: '3 min', small: 'postural analysis' },
            { big: '500+',  small: 'exercises' },
            { big: '100%',  small: 'personalized' },
          ].map((b, i) => (
            <div key={i} style={{
              flex: 1, padding: '12px 8px', borderRadius: 14,
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
              backdropFilter: 'blur(8px)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
            }}>
              <div style={{
                fontFamily: "'Inter Tight', sans-serif",
                fontSize: 17, fontWeight: 600, color: '#FFFFFF',
                fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.01em',
              }}>{b.big}</div>
              <div style={{
                fontSize: 10.5, lineHeight: 1.3,
                color: 'rgba(180,205,255,0.85)',
                textAlign: 'center', letterSpacing: '0.02em',
              }}>{b.small}</div>
            </div>
          ))}
        </div>
      </div>

      <StickyBottom>
        {accountDeleted && (
          <div style={{
            margin: '0 0 14px', padding: '10px 14px', borderRadius: 12,
            background: 'rgba(180,205,255,0.10)',
            border: '1px solid rgba(180,205,255,0.22)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <div style={{
              width: 24, height: 24, borderRadius: 999,
              background: 'rgba(180,205,255,0.18)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#B4CDFF" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <div style={{
              fontFamily: "'Inter Tight', sans-serif",
              fontSize: 12.5, color: 'rgba(255,255,255,0.85)',
              letterSpacing: '-0.005em', lineHeight: 1.4,
            }}>
              <span style={{ color: '#FFFFFF', fontWeight: 600 }}>Account deleted.</span>{' '}
              <span style={{ color: 'rgba(255,255,255,0.62)' }}>You'll need to sign up again to use ALIGN.</span>
            </div>
          </div>
        )}
        <PrimaryButton onClick={onStart}>{accountDeleted ? 'Create a new account' : 'Get started'}</PrimaryButton>
        <div style={{ textAlign: 'center', marginTop: 12 }}>
          <LinkButton onClick={onSignIn}>I already have an account</LinkButton>
        </div>
      </StickyBottom>
    </Screen>
  );
}

window.WelcomeScreen = WelcomeScreen;
