// ALIGN — Retake results screen
// Shown after the user completes a photo retake. Side-by-side before/after,
// improved metrics, and CTAs to view full progress or return home.

function RetakeResultsScreen({ retakeCount = 1, onViewProgress, onDone }) {
  // Score progression: starts at 72 (initial), +6 per retake, soft-capped at 95
  const before = Math.min(95, 72 + (retakeCount - 1) * 6);
  const after  = Math.min(95, 72 + retakeCount * 6);
  const delta  = after - before;

  // Symptom improvements (lower = better) — drop by 1 each retake, floored at 1
  const drop = (v) => Math.max(1, v - 1);
  const symptoms = [
    { name: 'Lower back pain',  before: Math.max(1, 4 - (retakeCount - 1)), after: Math.max(1, 4 - retakeCount) },
    { name: 'Neck stiffness',   before: Math.max(1, 5 - (retakeCount - 1)), after: Math.max(1, 5 - retakeCount) },
    { name: 'Shoulder tension', before: Math.max(1, 3 - (retakeCount - 1)), after: Math.max(1, 3 - retakeCount) },
  ];

  // Zone improvements
  const zones = [
    { name: 'Head & neck',    before: 48 + (retakeCount - 1) * 7,  after: 48 + retakeCount * 7  },
    { name: 'Shoulders',      before: 64 + (retakeCount - 1) * 5,  after: 64 + retakeCount * 5  },
    { name: 'Thoracic spine', before: 58 + (retakeCount - 1) * 6,  after: 58 + retakeCount * 6  },
  ];

  return (
    <Screen padBottom={0}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 20px 8px',
      }}>
        <button onClick={onDone} aria-label="Close" style={{
          background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 999, width: 36, height: 36,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', color: '#FFF',
        }}>{Icon.close(18)}</button>
        <div style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
          letterSpacing: '0.18em', color: 'rgba(180,205,255,0.7)',
        }}>CHECK-IN · #{String(retakeCount + 1).padStart(2, '0')}</div>
        <div style={{ width: 36 }}></div>
      </div>

      <div style={{ padding: '4px 20px 28px' }}>
        {/* Hero — celebratory */}
        <div style={{
          padding: '22px 20px 20px',
          borderRadius: 20,
          background: 'linear-gradient(135deg, rgba(143,227,181,0.18) 0%, rgba(143,227,181,0.04) 60%, rgba(180,205,255,0.06) 100%)',
          border: '1px solid rgba(143,227,181,0.32)',
          marginBottom: 16,
          textAlign: 'center',
        }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '4px 10px', borderRadius: 999,
            background: 'rgba(143,227,181,0.16)',
            border: '1px solid rgba(143,227,181,0.32)',
            fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5,
            letterSpacing: '0.18em', color: '#8FE3B5', marginBottom: 12,
          }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#8FE3B5' }}/>
            PROGRESS CONFIRMED
          </div>
          <div style={{
            fontFamily: "'Inter Tight', sans-serif",
            fontSize: 24, fontWeight: 600, letterSpacing: '-0.02em',
            color: '#FFFFFF', lineHeight: 1.2, marginBottom: 4,
          }}>You're {delta} points better</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', lineHeight: 1.45 }}>
            Your new photos confirm visible improvement since your last check-in.
          </div>
        </div>

        {/* Before / After photo comparison */}
        <SectionLabel>BEFORE · AFTER</SectionLabel>
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8,
          marginBottom: 18,
        }}>
          {['Before', 'After'].map((kind, k) => (
            <div key={kind} style={{
              borderRadius: 16, overflow: 'hidden',
              border: '1px solid ' + (k === 1 ? 'rgba(143,227,181,0.40)' : 'rgba(255,255,255,0.10)'),
              background: 'linear-gradient(180deg, #0E1B30 0%, #08111F 100%)',
            }}>
              <div style={{
                position: 'relative', aspectRatio: '3 / 4',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {/* Plumb line */}
                <div style={{
                  position: 'absolute', top: '8%', bottom: '8%', left: '50%',
                  width: 1,
                  backgroundImage: 'linear-gradient(to bottom, ' + (k === 1 ? 'rgba(143,227,181,0.45)' : 'rgba(180,205,255,0.28)') + ' 50%, transparent 50%)',
                  backgroundSize: '1px 5px', transform: 'translateX(-50%)',
                }}/>
                {/* Silhouette — for "after" it's straighter (less tilt) */}
                <div style={{
                  color: k === 1 ? '#8FE3B5' : '#B4CDFF',
                  opacity: k === 1 ? 0.85 : 0.55,
                  height: '78%',
                  transform: k === 0 ? 'rotate(-1.5deg) translateX(2px)' : 'rotate(0deg)',
                  transition: 'transform 240ms',
                }}>
                  <object data="assets/posture/side.svg" type="image/svg+xml" style={{ height: '100%', pointerEvents: 'none' }} />
                </div>
                {/* Date chip */}
                <div style={{
                  position: 'absolute', top: 10, left: 10,
                  padding: '4px 8px', borderRadius: 6,
                  fontFamily: "'JetBrains Mono', monospace", fontSize: 8.5,
                  letterSpacing: '0.14em',
                  background: 'rgba(11,31,58,0.7)', backdropFilter: 'blur(8px)',
                  border: '1px solid ' + (k === 1 ? 'rgba(143,227,181,0.40)' : 'rgba(180,205,255,0.30)'),
                  color: k === 1 ? '#8FE3B5' : '#B4CDFF',
                }}>{kind.toUpperCase()}</div>
                {/* Score chip */}
                <div style={{
                  position: 'absolute', bottom: 10, right: 10,
                  padding: '4px 8px', borderRadius: 6,
                  fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600,
                  letterSpacing: '0.08em',
                  background: 'rgba(11,31,58,0.78)', backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255,255,255,0.10)',
                  color: '#FFFFFF',
                  fontVariantNumeric: 'tabular-nums',
                }}>{k === 0 ? before : after}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Score change card */}
        <div style={{
          padding: 18, borderRadius: 16,
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.06)',
          marginBottom: 18,
        }}>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5,
            letterSpacing: '0.16em', color: 'rgba(180,205,255,0.7)', marginBottom: 10,
          }}>POSTURE SCORE</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
            <span style={{
              fontFamily: "'Inter Tight', sans-serif", fontSize: 18, fontWeight: 500,
              color: 'rgba(255,255,255,0.45)', fontVariantNumeric: 'tabular-nums',
              textDecoration: 'line-through', textDecorationColor: 'rgba(255,255,255,0.30)',
            }}>{before}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.40)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"/>
              <polyline points="12 5 19 12 12 19"/>
            </svg>
            <span style={{
              fontFamily: "'Inter Tight', sans-serif", fontSize: 48, fontWeight: 600,
              color: '#FFFFFF', fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.04em',
              lineHeight: 1,
            }}>{after}<span style={{ fontSize: 16, color: 'rgba(255,255,255,0.45)' }}>/100</span></span>
            <span style={{
              marginLeft: 'auto',
              padding: '4px 10px', borderRadius: 999,
              background: 'rgba(143,227,181,0.14)',
              border: '1px solid rgba(143,227,181,0.32)',
              color: '#8FE3B5',
              fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600,
              letterSpacing: '0.08em',
              fontVariantNumeric: 'tabular-nums',
            }}>↑ +{delta}</span>
          </div>
        </div>

        {/* Zone improvements */}
        <SectionLabel>BIGGEST GAINS</SectionLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 18 }}>
          {zones.map((z) => {
            const change = z.after - z.before;
            return (
              <div key={z.name} style={{
                padding: '12px 14px', borderRadius: 12,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div style={{ fontSize: 13.5, color: '#FFFFFF', fontWeight: 500 }}>{z.name}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{
                      fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
                      color: 'rgba(255,255,255,0.45)', fontVariantNumeric: 'tabular-nums',
                    }}>{z.before}</span>
                    <span style={{
                      fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 600,
                      color: '#FFFFFF', fontVariantNumeric: 'tabular-nums',
                    }}>→ {z.after}</span>
                    <span style={{
                      fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, fontWeight: 600,
                      color: '#8FE3B5',
                    }}>+{change}</span>
                  </div>
                </div>
                {/* Stacked bars: before (faint) over after (bright) */}
                <div style={{ position: 'relative', height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', inset: 0, width: z.before + '%', background: 'rgba(180,205,255,0.35)', borderRadius: 2 }}/>
                  <div style={{ position: 'absolute', inset: 0, width: z.after + '%', background: 'linear-gradient(90deg, #8FE3B5 0%, #B4CDFF 100%)', borderRadius: 2, boxShadow: '0 0 8px rgba(143,227,181,0.45)' }}/>
                </div>
              </div>
            );
          })}
        </div>

        {/* Symptoms */}
        <SectionLabel>SYMPTOMS · LOWER IS BETTER</SectionLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 22 }}>
          {symptoms.map((s) => (
            <div key={s.name} style={{
              padding: '10px 14px', borderRadius: 12,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.06)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div style={{ fontSize: 13.5, color: '#FFFFFF', fontWeight: 500 }}>{s.name}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
                  color: 'rgba(255,255,255,0.45)', fontVariantNumeric: 'tabular-nums',
                }}>{s.before}/10</span>
                <span style={{ color: 'rgba(255,255,255,0.30)' }}>→</span>
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 600,
                  color: '#FFFFFF', fontVariantNumeric: 'tabular-nums',
                }}>{s.after}/10</span>
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, fontWeight: 600,
                  color: '#8FE3B5', marginLeft: 4,
                }}>↓{s.before - s.after}</span>
              </div>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <button onClick={onViewProgress} style={{
          width: '100%', padding: '14px 16px', borderRadius: 14,
          background: '#B4CDFF', color: '#0D1F3C',
          border: 'none', cursor: 'pointer',
          fontFamily: "'Inter Tight', sans-serif",
          fontSize: 15, fontWeight: 600, letterSpacing: '-0.01em',
          marginBottom: 8,
        }}>View full progress</button>
        <button onClick={onDone} style={{
          width: '100%', padding: '12px 16px', borderRadius: 14,
          background: 'transparent', color: 'rgba(255,255,255,0.75)',
          border: '1px solid rgba(255,255,255,0.10)', cursor: 'pointer',
          fontFamily: "'Inter Tight', sans-serif",
          fontSize: 14, fontWeight: 500,
        }}>Back to home</button>
      </div>
    </Screen>
  );
}

function SectionLabel({ children }) {
  return (
    <div style={{
      fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
      letterSpacing: '0.16em', color: 'rgba(255,255,255,0.55)',
      margin: '0 2px 10px',
    }}>{children}</div>
  );
}

window.RetakeResultsScreen = RetakeResultsScreen;
