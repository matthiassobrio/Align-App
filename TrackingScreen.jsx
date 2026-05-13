// ALIGN — Tracking screen — comprehensive progress dashboard
function TrackingScreen({ retakeCount = 0, onClose, onRetake }) {
  // Posture score history: extends as the user does check-ins
  const baseWeeks = [
    { label: 'W1', score: 58 },
    { label: 'W2', score: 63 },
    { label: 'W3', score: 68 },
    { label: 'W4', score: 72 },
  ];
  const retakeWeeks = Array.from({ length: retakeCount }, (_, k) => ({
    label: 'W' + (5 + k),
    score: Math.min(95, 72 + (k + 1) * 6),
  }));
  const all = baseWeeks.concat(retakeWeeks);
  const weeks = all.map((w, i) => Object.assign({}, w, { current: i === all.length - 1 }));
  const currentScore = weeks[weeks.length - 1].score;
  const prevScore = weeks.length >= 2 ? weeks[weeks.length - 2].score : currentScore;
  const delta = currentScore - prevScore;
  const goal = 80;
  const maxBar = 110;

  return (
    <Screen padBottom={0}>
      <ScreenHeader
        left={<button onClick={onClose} style={{
          background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 999, width: 36, height: 36,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', color: '#FFF',
        }}>{Icon.close(18)}</button>}
        right={<div style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
          letterSpacing: '0.18em', color: 'rgba(180,205,255,0.7)',
        }}>TRACKING · MAY 10</div>}
      />

      <div style={{ padding: '0 20px 28px' }}>
        <Eyebrow>Your progress</Eyebrow>
        <h1 style={{
          fontFamily: "'Inter Tight', sans-serif",
          fontSize: 28, fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1.2,
          margin: '12px 0 22px', color: '#FFFFFF',
        }}>
          Tracking overview
        </h1>

        {/* Posture score (hero) */}
        <Card style={{ padding: 20, marginBottom: 12 }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
          }}>
            <div>
              <div style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5,
                letterSpacing: '0.16em', color: 'rgba(180,205,255,0.7)', marginBottom: 6,
              }}>POSTURE SCORE</div>
              <div style={{
                fontFamily: "'Inter Tight', sans-serif", fontWeight: 500,
                fontSize: 56, lineHeight: 1, color: '#FFFFFF',
                fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.04em',
              }}>{currentScore}<span style={{ fontSize: 18, color: 'rgba(255,255,255,0.45)' }}>/100</span></div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 12.5, color: '#8FE3B5', fontWeight: 500, marginBottom: 4 }}>↑ +{delta} vs last week</div>
              <StatusPill tone="success">IMPROVING</StatusPill>
            </div>
          </div>
        </Card>

        {/* Sessions + streak grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
          <Card style={{ padding: 16 }}>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: 9,
              letterSpacing: '0.16em', color: 'rgba(180,205,255,0.7)', marginBottom: 10,
            }}>SESSIONS · WEEK</div>
            <div style={{
              fontFamily: "'Inter Tight', sans-serif", fontSize: 30, fontWeight: 600,
              color: '#FFFFFF', fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em',
              lineHeight: 1, marginBottom: 8,
            }}>5<span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 16 }}>/7</span></div>
            <div style={{
              display: 'flex', gap: 4,
            }}>
              {[1,1,1,1,1,0,0].map((d, i) => (
                <div key={i} style={{
                  flex: 1, height: 4, borderRadius: 2,
                  background: d ? '#B4CDFF' : 'rgba(255,255,255,0.12)',
                }}/>
              ))}
            </div>
          </Card>

          <Card style={{ padding: 16 }}>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: 9,
              letterSpacing: '0.16em', color: 'rgba(180,205,255,0.7)', marginBottom: 10,
            }}>CURRENT STREAK</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 8 }}>
              <span style={{ display: 'inline-flex', transform: 'translateY(2px)' }}>{Icon.flame(20, '#FFD58A')}</span>
              <div style={{
                fontFamily: "'Inter Tight', sans-serif", fontSize: 30, fontWeight: 600,
                color: '#FFFFFF', fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em',
                lineHeight: 1,
              }}>7</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)' }}>days</div>
            </div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)' }}>Best: 12 days</div>
          </Card>
        </div>

        {/* Symptom-level scores */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          margin: '20px 2px 10px',
        }}>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
            letterSpacing: '0.16em', color: 'rgba(255,255,255,0.55)',
          }}>SYMPTOM TRACKING</div>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5,
            letterSpacing: '0.10em', color: 'rgba(255,255,255,0.35)',
          }}>LOWER = BETTER</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 18 }}>
          {[
            { name: 'Lower back pain',   score: Math.max(1, 4 - retakeCount), prev: Math.max(1, 4 - retakeCount + 2), trend: 'down', tone: 'success' },
            { name: 'Neck stiffness',    score: Math.max(1, 5 - retakeCount), prev: Math.max(1, 5 - retakeCount + 2), trend: 'down', tone: 'success' },
            { name: 'Shoulder tension',  score: Math.max(1, 3 - retakeCount), prev: Math.max(1, 3 - retakeCount + 2), trend: 'down', tone: 'success' },
            { name: 'Headaches / week',  score: Math.max(0, 2 - retakeCount), prev: 2, trend: retakeCount > 0 ? 'down' : 'flat', tone: retakeCount > 0 ? 'success' : 'neutral' },
          ].map((s) => {
            const trendColor = s.trend === 'down' ? '#8FE3B5' : s.trend === 'up' ? '#F18A8A' : 'rgba(255,255,255,0.5)';
            const arrow = s.trend === 'down' ? '↓' : s.trend === 'up' ? '↑' : '→';
            return (
              <Card key={s.name} style={{ padding: '12px 14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div style={{ fontSize: 14, color: '#FFFFFF', fontWeight: 500 }}>{s.name}</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                    <span style={{
                      fontFamily: "'JetBrains Mono', monospace", fontSize: 16, fontWeight: 500,
                      color: '#FFFFFF', fontVariantNumeric: 'tabular-nums',
                    }}>{s.score}<span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>/10</span></span>
                    <span style={{
                      fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5,
                      color: trendColor, fontWeight: 500,
                    }}>{arrow} {Math.abs(s.score - s.prev)}</span>
                  </div>
                </div>
                {/* mini scale */}
                <div style={{ display: 'flex', gap: 2 }}>
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div key={i} style={{
                      flex: 1, height: 4, borderRadius: 1,
                      background: i < s.score
                        ? (s.tone === 'success' ? '#8FE3B5' : '#F2C56B')
                        : 'rgba(255,255,255,0.10)',
                      opacity: i < s.score ? 0.85 : 1,
                    }}/>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>

        {/* 4-week graph */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          margin: '0 2px 10px',
        }}>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
            letterSpacing: '0.16em', color: 'rgba(255,255,255,0.55)',
          }}>4-WEEK PROGRESS</div>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5,
            letterSpacing: '0.10em', color: 'rgba(255,255,255,0.35)',
          }}>SCORE / 100</div>
        </div>

        <Card style={{ padding: '20px 18px 16px', marginBottom: 12 }}>
          {/* graph area */}
          <div style={{ position: 'relative', height: 140, marginBottom: 16 }}>
            {/* y-grid lines */}
            {[0, 25, 50, 75, 100].map((v, i) => (
              <div key={v} style={{
                position: 'absolute', left: 0, right: 0,
                bottom: `${(v / maxBar) * 100}%`,
                height: 1, background: 'rgba(255,255,255,0.06)',
              }}/>
            ))}
            {/* goal line */}
            <div style={{
              position: 'absolute', left: 0, right: 0,
              bottom: `${(goal / maxBar) * 100}%`,
              height: 1,
              backgroundImage: 'linear-gradient(to right, rgba(245,230,200,0.7) 50%, transparent 50%)',
              backgroundSize: '6px 1px',
            }}/>
            <div style={{
              position: 'absolute', right: 0,
              bottom: `${(goal / maxBar) * 100}%`,
              transform: 'translateY(-50%)',
              padding: '2px 6px', borderRadius: 4,
              fontFamily: "'JetBrains Mono', monospace", fontSize: 8.5,
              letterSpacing: '0.12em', color: '#F5E6C8',
              background: 'rgba(245,230,200,0.10)', border: '1px solid rgba(245,230,200,0.25)',
            }}>GOAL · 80</div>

            {/* bars */}
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'flex-end', gap: 14,
              padding: '0 4px',
            }}>
              {weeks.map((w) => (
                <div key={w.label} style={{
                  flex: 1, display: 'flex', flexDirection: 'column',
                  alignItems: 'center', gap: 6, height: '100%',
                  justifyContent: 'flex-end',
                }}>
                  {/* score above bar */}
                  <div style={{
                    fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
                    color: w.current ? '#B4CDFF' : 'rgba(255,255,255,0.55)',
                    fontVariantNumeric: 'tabular-nums', fontWeight: 600,
                  }}>{w.score}</div>
                  <div style={{
                    width: '100%',
                    height: `${(w.score / maxBar) * 100}%`,
                    borderRadius: 6,
                    background: w.current
                      ? 'linear-gradient(180deg, #B4CDFF 0%, #6F95E0 100%)'
                      : 'rgba(180,205,255,0.18)',
                    border: w.current ? '1px solid rgba(180,205,255,0.6)' : '1px solid rgba(180,205,255,0.10)',
                  }}/>
                </div>
              ))}
            </div>
          </div>
          {/* x-labels */}
          <div style={{ display: 'flex', gap: 14, padding: '0 4px' }}>
            {weeks.map(w => (
              <div key={w.label} style={{
                flex: 1, textAlign: 'center',
                fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5,
                letterSpacing: '0.14em',
                color: w.current ? '#B4CDFF' : 'rgba(255,255,255,0.45)',
                fontWeight: w.current ? 600 : 500,
              }}>{w.label}</div>
            ))}
          </div>
        </Card>

        <div style={{
          textAlign: 'center', fontSize: 12.5,
          color: 'rgba(255,255,255,0.62)',
          fontStyle: 'normal', marginBottom: 22,
        }}>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
            color: '#B4CDFF', letterSpacing: '0.10em',
          }}>W4</span>
          <span style={{ margin: '0 8px', opacity: 0.5 }}>=</span>
          goal in progress
        </div>

        {/* Reminder card */}
        <button onClick={onRetake} style={{
          width: '100%', textAlign: 'left', cursor: 'pointer',
          padding: '14px 16px', borderRadius: 14,
          background: 'rgba(245,230,200,0.06)',
          border: '1px solid rgba(245,230,200,0.22)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 10,
              background: 'rgba(245,230,200,0.12)',
              border: '1px solid rgba(245,230,200,0.22)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#F5E6C8',
            }}>{Icon.camera(16, '#F5E6C8')}</div>
            <div>
              <div style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5,
                letterSpacing: '0.16em', color: '#F5E6C8', marginBottom: 2,
              }}>IN 3 DAYS</div>
              <div style={{ fontSize: 13.5, color: '#FFFFFF', fontWeight: 500 }}>Time for new photos</div>
            </div>
          </div>
          <span style={{ color: '#F5E6C8' }}>{Icon.arrowRight(18)}</span>
        </button>
      </div>
    </Screen>
  );
}

window.TrackingScreen = TrackingScreen;
