// ALIGN — Assessment results screen — detailed per-zone breakdown
function ZoneRow({ zone, detail, score, deviation, tone, label }) {
  const toneColor = tone === 'success' ? '#7FE0B5'
                  : tone === 'warning' ? '#F2C56B'
                  : tone === 'danger'  ? '#F18A8A'
                  : 'rgba(255,255,255,0.7)';
  return (
    <Card style={{ padding: '14px 16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 10 }}>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 500, color: '#FFFFFF' }}>{zone}</div>
          <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>{detail}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 18, fontWeight: 500,
            color: toneColor, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.01em', lineHeight: 1,
          }}>{score}</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em', marginTop: 3 }}>
            {deviation}
          </div>
        </div>
      </div>
      {/* mini bar */}
      <div style={{ position: 'relative', height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0, width: `${score}%`,
          background: toneColor, opacity: 0.85, borderRadius: 2,
        }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
        <div style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: 'rgba(255,255,255,0.4)',
          letterSpacing: '0.1em',
        }}>{label}</div>
        <div style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: 'rgba(255,255,255,0.35)',
          letterSpacing: '0.08em',
        }}>{tone === 'success' ? 'within range' : tone === 'warning' ? 'outside range' : 'far outside range'}</div>
      </div>
    </Card>
  );
}

function BilanScreen({ precise = true, locked = false, onContinue, onPhotoAnalysis, onUnlock }) {
  // When `locked` is true, the user hasn't subscribed (or has the Free tier).
  // We reveal the overall score and the 2 worst zones, then blur the rest behind a paywall CTA.
  // Rationale: the user must see enough to trust the assessment ("you nailed it"),
  // but not so much that the program itself feels unnecessary.
  const zones = [
    { zone: 'Head & neck',     detail: 'Forward head, chin-poke',         score: 48, deviation: 'FWD 4.2 cm', tone: 'danger',  label: 'SIGNIFICANT' },
    { zone: 'Shoulders',       detail: 'Right shoulder elevated',         score: 64, deviation: 'R +1.1 cm',  tone: 'warning', label: 'MILD' },
    { zone: 'Thoracic spine',  detail: 'Increased kyphosis',              score: 58, deviation: '47°',        tone: 'warning', label: 'MILD' },
    { zone: 'Lumbar spine',    detail: 'Slight hyperlordosis',            score: 70, deviation: '38°',        tone: 'warning', label: 'MILD' },
    { zone: 'Pelvis',          detail: 'Neutral, level',                  score: 88, deviation: '0.3° tilt',  tone: 'success', label: 'ALIGNED' },
    { zone: 'Knees',           detail: 'Slight valgus, left',             score: 76, deviation: 'L 2.4°',     tone: 'warning', label: 'MINOR' },
    { zone: 'Ankles & feet',   detail: 'Balanced, weight evenly spread',  score: 92, deviation: '< 1°',       tone: 'success', label: 'ALIGNED' },
  ];
  // Free preview: first 2 zones (the worst ones, surfacing real value); rest are locked.
  const previewCount = locked ? 2 : zones.length;

  return (
    <Screen padBottom={96}>
      <ScreenHeader
        left={<div style={{ color: '#FFFFFF' }}>
          <svg width="28" height="28" viewBox="0 0 64 64" fill="none">
            <g stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="16,24 32,12 48,24"/>
              <polyline points="16,38 32,26 48,38"/>
              <polyline points="16,52 32,40 48,52"/>
            </g>
          </svg>
        </div>}
        right={<div style={{ fontSize: 12, color: 'rgba(255,255,255,0.52)', fontWeight: 500 }}>May 3, 2026</div>}
      />

      <div style={{ padding: '8px 20px 0' }}>
        <Eyebrow>Your assessment</Eyebrow>
        <h1 style={{
          fontFamily: "'Inter Tight', sans-serif",
          fontSize: 28, fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1.2,
          margin: '12px 0 8px', color: '#FFFFFF',
        }}>
          {precise ? 'Posture analyzed' : 'Initial estimate'}
        </h1>
        <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.62)', marginBottom: 22 }}>
          {precise
            ? 'Based on your 3 guided photos. 7 alignment zones evaluated.'
            : 'Based on your answers. Take 3 photos for a precise reading.'}
        </div>

        {!precise && (
          <Card style={{
            padding: 16, marginBottom: 18,
            background: 'rgba(242,197,107,0.08)',
            borderColor: 'rgba(242,197,107,0.30)',
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <div style={{ fontSize: 22, lineHeight: 1, flexShrink: 0 }}>⚠️</div>
              <div>
                <div style={{
                  fontFamily: "'Inter Tight', sans-serif",
                  fontSize: 14.5, fontWeight: 600, color: '#F2C56B', marginBottom: 6,
                }}>Report based on your answers</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.78)', lineHeight: 1.5 }}>
                  Without a photo analysis, this score is an estimate based on your pain areas, activity and sitting hours. Photo analysis would improve accuracy by <strong style={{ color: '#F2C56B', fontWeight: 600 }}>80%</strong>.
                </div>
                <div style={{
                  fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5,
                  letterSpacing: '0.16em', color: 'rgba(242,197,107,0.85)',
                  marginTop: 10, paddingTop: 10, borderTop: '1px dashed rgba(242,197,107,0.25)',
                }}>NUMBERS BELOW ARE ESTIMATES</div>
              </div>
            </div>
          </Card>
        )}

        {/* Hero score + silhouette */}
        <Card style={{ padding: 22, marginBottom: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.52)', marginBottom: 6 }}>
                Overall alignment
              </div>
              <div style={{
                fontFamily: "'Inter Tight', sans-serif", fontWeight: 500,
                fontSize: 64, lineHeight: 1, color: '#B4CDFF',
                fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.04em',
              }}>
                {precise ? '72' : '~68'}
                <span style={{ fontSize: 22, color: 'rgba(255,255,255,0.45)' }}>/100</span>
              </div>
              <div style={{ marginTop: 10 }}>
                <StatusPill tone="warning">NEEDS WORK</StatusPill>
              </div>
            </div>
            <div style={{ color: '#B4CDFF', height: 140, opacity: 0.85 }}>
              <object data="assets/posture/side.svg" type="image/svg+xml" style={{ height: '100%', pointerEvents: 'none' }} />
            </div>
          </div>
        </Card>

        {/* Section heading for zones */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: 10, padding: '0 2px',
        }}>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
            letterSpacing: '0.16em', color: 'rgba(255,255,255,0.52)',
          }}>BREAKDOWN BY ZONE</div>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
            letterSpacing: '0.10em', color: 'rgba(255,255,255,0.35)',
          }}>{zones.length} ZONES</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: locked ? 12 : 20 }}>
          {zones.slice(0, previewCount).map((z) => <ZoneRow key={z.zone} {...z} />)}

          {locked && (
            <div style={{ position: 'relative', marginTop: 4 }}>
              {/* Blurred stack of remaining zones (decorative) */}
              <div style={{
                display: 'flex', flexDirection: 'column', gap: 8,
                filter: 'blur(7px) saturate(0.7)',
                opacity: 0.55, pointerEvents: 'none',
                userSelect: 'none',
              }}>
                {zones.slice(previewCount).map((z) => <ZoneRow key={z.zone} {...z} />)}
              </div>

              {/* Overlay CTA */}
              <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                gap: 10, padding: 20,
                background: 'linear-gradient(180deg, rgba(8,17,31,0.30) 0%, rgba(8,17,31,0.78) 60%, rgba(8,17,31,0.92) 100%)',
                borderRadius: 18,
                textAlign: 'center',
              }}>
                <div style={{
                  width: 42, height: 42, borderRadius: 999,
                  background: 'rgba(245,230,200,0.12)',
                  border: '1px solid rgba(245,230,200,0.35)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>{Icon.lock(18, '#F5E6C8')}</div>
                <div style={{
                  fontFamily: "'Inter Tight', sans-serif",
                  fontSize: 15, fontWeight: 600, color: '#FFFFFF',
                  letterSpacing: '-0.01em',
                }}>{zones.length - previewCount} more zones</div>
                <div style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 10, letterSpacing: '0.14em',
                  color: 'rgba(245,230,200,0.85)',
                }}>UNLOCK WITH ALIGN PRO</div>
              </div>
            </div>
          )}
        </div>

        {/* Priority focus — teased if locked, fully revealed if Pro */}
        <Card style={{
          padding: 16, marginBottom: 20,
          background: locked ? 'rgba(245,230,200,0.06)' : 'rgba(241,138,138,0.06)',
          borderColor: locked ? 'rgba(245,230,200,0.22)' : 'rgba(241,138,138,0.22)',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5,
            letterSpacing: '0.16em',
            color: locked ? '#F5E6C8' : '#F18A8A',
            marginBottom: 6,
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            {locked && Icon.lock(11, '#F5E6C8')}
            PRIORITY FOCUS{locked ? ' · PRO' : ''}
          </div>
          {!locked ? (
            <div style={{ fontSize: 14.5, color: '#FFFFFF', lineHeight: 1.45 }}>
              Your <strong style={{ fontWeight: 600 }}>head & neck</strong> show significant forward translation.
              Your program will start there — 4 weeks to bring it back into range.
            </div>
          ) : (
            <div style={{ fontSize: 14.5, color: '#FFFFFF', lineHeight: 1.45 }}>
              Your <strong style={{ fontWeight: 600 }}>head & neck</strong> show significant forward translation.
              {' '}
              <span style={{
                filter: 'blur(5px)', opacity: 0.7, userSelect: 'none',
              }}>Your program will start there — 4 weeks to bring it back into range.</span>
            </div>
          )}
        </Card>

        {!precise && (
          <button onClick={onPhotoAnalysis} style={{
            width: '100%', textAlign: 'left', cursor: 'pointer',
            padding: 16, marginBottom: 14,
            borderRadius: 14, border: '1px solid rgba(180,205,255,0.30)',
            background: 'rgba(180,205,255,0.08)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ fontSize: 22, lineHeight: 1 }}>📸</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#FFFFFF', marginBottom: 2 }}>Improve with photo analysis</div>
                <div style={{
                  fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5,
                  letterSpacing: '0.10em', color: 'rgba(180,205,255,0.85)',
                }}>4 PHOTOS · 30 SEC · 80% MORE ACCURATE</div>
              </div>
            </div>
            <span style={{ color: '#B4CDFF', fontSize: 18 }}>›</span>
          </button>
        )}

        {locked ? (
          <PrimaryButton onClick={onUnlock || onContinue} style={{ background: '#F5E6C8' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              {Icon.pro(16, '#0D1F3C')} Unlock my full program
            </span>
          </PrimaryButton>
        ) : (
          <PrimaryButton onClick={onContinue}>See my program</PrimaryButton>
        )}

        {locked && (
          <div style={{
            textAlign: 'center', marginTop: 10,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 10, letterSpacing: '0.14em',
            color: 'rgba(245,230,200,0.75)',
          }}>7-DAY FREE TRIAL · CANCEL ANYTIME</div>
        )}

        {!precise && (
          <button onClick={onPhotoAnalysis} style={{
            width: '100%', marginTop: 14, padding: '14px 18px',
            borderRadius: 999, cursor: 'pointer',
            background: 'transparent', border: '1px solid rgba(180,205,255,0.45)',
            color: '#B4CDFF',
            fontFamily: "'Inter Tight', sans-serif", fontSize: 14.5, fontWeight: 600,
            letterSpacing: '0.01em',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}>
            {Icon.camera(16, '#B4CDFF')} Do the photo analysis now
          </button>
        )}
      </div>
    </Screen>
  );
}

window.BilanScreen = BilanScreen;
