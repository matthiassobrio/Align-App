// ALIGN — AI Postural Analysis intro screen
// Shown when the user taps "Improve with photo analysis" on the estimated assessment,
// or as a standalone gate before the guided photos flow.
function PhotoAnalysisIntroScreen({ onStart, onSkip }) {
  const benefits = [
    { icon: '🎯', text: 'Tailored program based on your real postural imbalances' },
    { icon: '📈', text: 'Visual before/after progress tracking each week' },
    { icon: '⚡', text: '30 seconds — step-by-step guidance' },
  ];

  return (
    <Screen padBottom={40}>
      <ScreenHeader
        left={
          <button onClick={onSkip} aria-label="Close" style={{
            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 999, width: 36, height: 36,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: '#FFF',
          }}>{Icon.close(18)}</button>
        }
        right={<div style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
          letterSpacing: '0.18em', color: 'rgba(180,205,255,0.7)',
        }}>OPTIONAL</div>}
      />

      <div style={{ padding: '0 20px' }}>
        <Eyebrow>Precision upgrade</Eyebrow>
        <h1 style={{
          fontFamily: "'Inter Tight', sans-serif",
          fontSize: 30, fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1.15,
          margin: '12px 0 12px', color: '#FFFFFF',
        }}>
          AI Postural Analysis
        </h1>
        <p style={{
          fontSize: 15, color: 'rgba(255,255,255,0.72)',
          margin: '0 0 26px', lineHeight: 1.55,
        }}>
          4 guided photos for a 100% personalized program and visual progress tracking.
        </p>

        {/* Benefits */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 22 }}>
          {benefits.map((b, i) => (
            <Card key={i} style={{ padding: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                  background: 'rgba(180,205,255,0.10)',
                  border: '1px solid rgba(180,205,255,0.20)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 22, lineHeight: 1,
                }}>{b.icon}</div>
                <div style={{ fontSize: 14, color: '#FFFFFF', lineHeight: 1.45, fontWeight: 500 }}>
                  {b.text}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Primary CTA */}
        <PrimaryButton onClick={onStart}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            Start photo analysis →
          </span>
        </PrimaryButton>

        {/* Secondary CTA */}
        <button onClick={onSkip} style={{
          width: '100%', marginTop: 12, padding: '14px 18px',
          borderRadius: 999, cursor: 'pointer',
          background: 'transparent', border: '1px solid rgba(255,255,255,0.18)',
          color: 'rgba(255,255,255,0.85)',
          fontFamily: "'Inter Tight', sans-serif", fontSize: 14.5, fontWeight: 500,
          letterSpacing: '0.01em',
        }}>
          Skip this step
        </button>

        {/* Caption */}
        <div style={{
          textAlign: 'center', marginTop: 18,
          fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
          letterSpacing: '0.14em', color: 'rgba(255,255,255,0.42)',
        }}>
          NO PHOTO → ESTIMATED REPORT · ANALYSIS AVAILABLE ANYTIME
        </div>
      </div>
    </Screen>
  );
}

window.PhotoAnalysisIntroScreen = PhotoAnalysisIntroScreen;
