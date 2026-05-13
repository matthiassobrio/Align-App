// ALIGN — Session complete / celebration screen
// Shown after the user finishes every movement of a session.
// Surfaces all the things this session contributed to: streak, weekly target,
// posture-zone progress, total minutes.
function SessionCompleteScreen({ onContinue, onClose }) {
  const impacts = [
    { label: 'Sessions in a row',     value: '5',     delta: '+1',     unit: 'days',     accent: '#7FE0B5' },
    { label: 'This week',             value: '4/5',   delta: '+1',     unit: 'sessions', accent: '#B4CDFF' },
    { label: 'Total minutes',         value: '127',   delta: '+12',    unit: 'min',      accent: '#B4CDFF' },
    { label: 'Head & neck alignment', value: '58',    delta: '+2',     unit: '/100',     accent: '#F2C56B' },
  ];

  return (
    <Screen padBottom={40}>
      <ScreenHeader
        left={<button onClick={onClose} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 999, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#FFF' }}>{Icon.close(18)}</button>}
        right={<div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.16em', color: 'rgba(127,224,181,0.85)' }}>SESSION COMPLETE</div>}
      />

      <div style={{ padding: '8px 20px 0' }}>

        {/* Hero celebration */}
        <div style={{ textAlign: 'center', marginTop: 20, marginBottom: 28 }}>
          {/* Concentric rings + check */}
          <div style={{ position: 'relative', width: 140, height: 140, margin: '0 auto 24px' }}>
            <svg width="140" height="140" viewBox="0 0 140 140" style={{ position: 'absolute', inset: 0 }}>
              <circle cx="70" cy="70" r="64" fill="none" stroke="rgba(127,224,181,0.10)" strokeWidth="1"/>
              <circle cx="70" cy="70" r="54" fill="none" stroke="rgba(127,224,181,0.18)" strokeWidth="1"/>
              <circle cx="70" cy="70" r="44" fill="none" stroke="rgba(127,224,181,0.55)" strokeWidth="2" strokeDasharray="4 6"/>
            </svg>
            <div style={{
              position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <div style={{
                width: 76, height: 76, borderRadius: 999,
                background: 'linear-gradient(160deg, #7FE0B5 0%, #4FA98A 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 12px 32px rgba(127,224,181,0.30)',
              }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0D1F3C" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
            </div>
          </div>

          <Eyebrow>Session complete</Eyebrow>
          <h1 style={{
            fontFamily: "'Inter Tight', sans-serif",
            fontSize: 30, fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1.15,
            margin: '12px 0 8px', color: '#FFFFFF',
          }}>
            Great work, Cameron.
          </h1>
          <p style={{
            fontSize: 15, color: 'rgba(255,255,255,0.72)',
            margin: '0 auto', maxWidth: 280, lineHeight: 1.55,
          }}>
            4 movements done, 12 minutes earned. Your spine thanks you — keep this rhythm going.
          </p>
        </div>

        {/* Impact section */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: 10, padding: '0 2px',
        }}>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
            letterSpacing: '0.16em', color: 'rgba(255,255,255,0.52)',
          }}>WHAT THIS UNLOCKED</div>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
            letterSpacing: '0.10em', color: 'rgba(255,255,255,0.35)',
          }}>+4 UPDATES</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 22 }}>
          {impacts.map((row, i) => (
            <Card key={i} style={{ padding: '14px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: 14.5, fontWeight: 500, color: '#FFFFFF' }}>{row.label}</div>
                  <div style={{
                    fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
                    letterSpacing: '0.12em', color: row.accent, marginTop: 4,
                  }}>{row.delta} {row.unit.toUpperCase()}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{
                    fontFamily: "'Inter Tight', sans-serif", fontWeight: 500,
                    fontSize: 26, lineHeight: 1, color: '#FFFFFF',
                    fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em',
                  }}>{row.value}</div>
                  <div style={{
                    fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5,
                    color: 'rgba(255,255,255,0.40)', letterSpacing: '0.08em', marginTop: 3,
                  }}>{row.unit}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Encouraging quote-style card */}
        <Card style={{
          padding: 18, marginBottom: 22,
          background: 'rgba(127,224,181,0.06)',
          borderColor: 'rgba(127,224,181,0.22)',
        }}>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5,
            letterSpacing: '0.18em', color: '#7FE0B5', marginBottom: 8,
          }}>STREAK · 5 DAYS</div>
          <div style={{ fontSize: 14.5, color: '#FFFFFF', lineHeight: 1.5 }}>
            You're on a roll. One more session this week and you'll hit your weekly target.
          </div>
        </Card>

        <PrimaryButton onClick={onContinue}>Back to Today</PrimaryButton>
      </div>
    </Screen>
  );
}

window.SessionCompleteScreen = SessionCompleteScreen;
