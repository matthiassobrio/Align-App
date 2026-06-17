// ALIGN — Guided photo capture screen
// Walks the user through 3 stances: front, side, back.
// Shows a camera viewfinder mock with body silhouette overlay, alignment grid,
// per-pose instructions, and a capture shutter. After 3 captures → assessment.

const POSES = [
  {
    id: 'front',
    label: 'Front view',
    n: 1,
    title: 'Stand facing the camera',
    sub: 'Arms relaxed at your sides, feet hip-width apart, look straight ahead.',
    checks: [
      'Shoulders square to camera',
      'Arms hang naturally',
      'Weight even on both feet',
    ],
    asset: 'assets/posture/front.svg',
  },
  {
    id: 'side',
    label: 'Side view',
    n: 2,
    title: 'Turn 90° to your left',
    sub: 'Stand sideways, profile to camera. Look forward, not at the phone.',
    checks: [
      'Heels and ankles in line',
      'Arms by your sides, not behind',
      'Eyes level, chin parallel to floor',
    ],
    asset: 'assets/posture/side.svg',
  },
  {
    id: 'back',
    label: 'Back view',
    n: 3,
    title: 'Turn so your back faces the camera',
    sub: 'Same stance — arms at sides, feet hip-width, weight even.',
    checks: [
      'Spine centered in frame',
      'Shoulder blades relaxed',
      'Heels touching the floor flat',
    ],
    asset: 'assets/posture/back.svg',
  },
];

function PhotoCaptureScreen({ poseIndex = 0, onCapture, onBack }) {
  const pose = POSES[poseIndex] || POSES[0];
  const total = POSES.length;

  return (
    <Screen padBottom={0}>
      {/* Top bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 18px 12px',
      }}>
        <button onClick={onBack} style={{
          background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 999, width: 36, height: 36, display: 'flex',
          alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#FFF',
        }}>{Icon.close(18)}</button>

        <div style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5,
          letterSpacing: '0.2em', color: 'rgba(180,205,255,0.7)',
        }}>{String(pose.n).padStart(2, '0')} / {String(total).padStart(2, '0')} · {pose.label.toUpperCase()}</div>

        <div style={{ width: 36 }} />
      </div>

      {/* Progress dots */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 14 }}>
        {POSES.map((_, i) => (
          <div key={i} style={{
            width: i === poseIndex ? 24 : 8, height: 4, borderRadius: 2,
            background: i <= poseIndex ? '#B4CDFF' : 'rgba(255,255,255,0.16)',
            transition: 'all 200ms',
          }}/>
        ))}
      </div>

      {/* Viewfinder */}
      <div style={{ padding: '0 16px' }}>
        <div style={{
          position: 'relative',
          aspectRatio: '3 / 4',
          borderRadius: 22,
          overflow: 'hidden',
          background: 'linear-gradient(180deg, #0E1B30 0%, #08111F 100%)',
          border: '1px solid rgba(255,255,255,0.10)',
          boxShadow: '0 24px 48px -16px rgba(0,0,0,0.55)',
        }}>
          {/* Crosshair corners */}
          {[
            { top: 12, left: 12,  rot: 0   },
            { top: 12, right: 12, rot: 90  },
            { bottom: 12, right: 12, rot: 180 },
            { bottom: 12, left: 12, rot: 270 },
          ].map((c, i) => (
            <svg key={i} width="22" height="22" viewBox="0 0 22 22" style={{
              position: 'absolute', ...c, transform: `rotate(${c.rot}deg)`,
            }}>
              <path d="M 0 1 L 0 0 L 1 0" stroke="#B4CDFF" strokeWidth="1.5" fill="none" transform="scale(20)"/>
            </svg>
          ))}

          {/* Vertical plumb axis */}
          <div style={{
            position: 'absolute', top: '6%', bottom: '6%', left: '50%',
            width: 1, background: 'rgba(180,205,255,0.28)',
            backgroundImage: 'linear-gradient(to bottom, rgba(180,205,255,0.4) 50%, transparent 50%)',
            backgroundSize: '1px 6px', transform: 'translateX(-50%)',
          }}/>

          {/* Horizontal reference lines (shoulder, hip) */}
          {[28, 56].map((p) => (
            <div key={p} style={{
              position: 'absolute', left: '8%', right: '8%', top: `${p}%`,
              height: 1,
              backgroundImage: 'linear-gradient(to right, rgba(180,205,255,0.22) 50%, transparent 50%)',
              backgroundSize: '6px 1px',
            }}/>
          ))}

          {/* Body silhouette overlay */}
          <div style={{
            position: 'absolute', inset: '6% 0', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            color: '#B4CDFF', opacity: 0.7,
          }}>
            <object data={pose.asset} type="image/svg+xml" style={{ height: '100%', pointerEvents: 'none' }} />
          </div>

          {/* Top status chip */}
          <div style={{
            position: 'absolute', top: 16, left: '50%', transform: 'translateX(-50%)',
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '5px 10px', borderRadius: 999,
            background: 'rgba(11,31,58,0.7)', backdropFilter: 'blur(12px)',
            border: '1px solid rgba(180,205,255,0.25)',
            fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5,
            letterSpacing: '0.16em', color: '#B4CDFF',
          }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#7FE0B5', boxShadow: '0 0 6px #7FE0B5' }}/>
            ALIGNING
          </div>

          {/* Bottom hint */}
          <div style={{
            position: 'absolute', bottom: 14, left: 14, right: 14,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            fontFamily: "'JetBrains Mono', monospace", fontSize: 9,
            letterSpacing: '0.14em', color: 'rgba(255,255,255,0.5)',
          }}>
            <span>FRAME · 3:4</span>
            <span>HOLD STEADY</span>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div style={{ padding: '18px 22px 14px' }}>
        <div style={{
          fontFamily: "'Inter Tight', sans-serif", fontSize: 19, fontWeight: 600,
          color: '#FFFFFF', letterSpacing: '-0.01em', lineHeight: 1.25, marginBottom: 6,
        }}>{pose.title}</div>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.62)', lineHeight: 1.5, marginBottom: 12 }}>
          {pose.sub}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {pose.checks.map((c, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
              <span style={{
                width: 14, height: 14, borderRadius: '50%',
                background: 'rgba(180,205,255,0.16)',
                border: '1px solid rgba(180,205,255,0.4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#B4CDFF', fontSize: 9, lineHeight: 1, paddingBottom: 1,
              }}>✓</span>
              <span style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.78)' }}>{c}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Shutter row */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '4px 28px 28px',
      }}>
        {/* Timer */}
        <div style={{
          width: 44, height: 44, borderRadius: 999,
          background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
          color: 'rgba(255,255,255,0.7)', letterSpacing: '0.05em',
        }}>3s</div>

        {/* Shutter */}
        <button onClick={onCapture} style={{
          width: 72, height: 72, borderRadius: 999, padding: 0,
          background: 'transparent', cursor: 'pointer',
          border: '2px solid rgba(255,255,255,0.6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{
            width: 56, height: 56, borderRadius: 999,
            background: '#FFFFFF',
            boxShadow: '0 0 0 4px #08111F inset',
          }}/>
        </button>

        {/* Flip camera */}
        <div style={{
          width: 44, height: 44, borderRadius: 999,
          background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF',
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 7h13a4 4 0 0 1 4 4v0"/>
            <polyline points="6 4 3 7 6 10"/>
            <path d="M21 17H8a4 4 0 0 1-4-4v0"/>
            <polyline points="18 20 21 17 18 14"/>
          </svg>
        </div>
      </div>
    </Screen>
  );
}

window.PhotoCaptureScreen = PhotoCaptureScreen;
window.PHOTO_POSES = POSES;
