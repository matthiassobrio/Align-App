// ALIGN — Post-assessment paywall.
// Reached from BilanScreen "Unlock my program" CTA.
// Personalized to the user's own result: their weak zone, their score,
// what's actually locked. The free tier is 20% of program + 20% of zones,
// Pro unlocks everything. Includes a 7-day free trial nudge.

function PaywallScreen({ onSubscribe, onContinueFree, onClose, priorityZone = 'Head & neck', score = 72 }) {
  const [plan, setPlan] = React.useState('annual');
  const [trial, setTrial] = React.useState(false);

  const plans = [
    {
      id: 'annual',
      label: '12 months',
      price: trial ? '$4.90' : '$4.90',
      priceSub: '/month',
      sub: trial ? 'Free for 7 days, then $58.80/year' : 'Billed $58.80 per year',
      badge: 'SAVE 50%',
    },
    {
      id: 'monthly',
      label: '1 month',
      price: '$9.90',
      priceSub: '/month',
      sub: trial ? 'Free for 7 days, then $9.90/month' : 'No commitment',
    },
  ];

  return (
    <Screen padBottom={40}>
      <ScreenHeader
        left={
          <button onClick={onClose} aria-label="Close" style={{
            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 999, width: 36, height: 36, display: 'flex',
            alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#FFF',
          }}>{Icon.close(18)}</button>
        }
        right={
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 10, letterSpacing: '0.16em',
            color: 'rgba(245,230,200,0.85)',
          }}>STEP 4/4</div>
        }
      />

      <div style={{ padding: '4px 20px 0' }}>
        {/* Tiny pro tag */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '6px 12px', borderRadius: 999,
          background: 'rgba(245,230,200,0.10)',
          border: '1px solid rgba(245,230,200,0.30)',
          marginBottom: 18,
        }}>
          {Icon.pro(14, '#F5E6C8')}
          <span style={{
            fontSize: 11, fontWeight: 600, letterSpacing: '0.14em',
            textTransform: 'uppercase', color: '#F5E6C8',
          }}>ALIGN PRO</span>
        </div>

        {/* Personalized hook */}
        <h1 style={{
          fontFamily: "'Inter Tight', sans-serif",
          fontSize: 30, fontWeight: 600, letterSpacing: '-0.02em',
          lineHeight: 1.12, margin: '0 0 14px', color: '#FFFFFF',
        }}>
          Your <span style={{ color: '#F5E6C8' }}>{priorityZone.toLowerCase()}</span> needs<br/>
          a full program.
        </h1>

        <p style={{
          fontSize: 14.5, color: 'rgba(255,255,255,0.68)',
          margin: '0 0 22px', lineHeight: 1.55,
        }}>
          You scored <strong style={{ color: '#FFFFFF', fontWeight: 600 }}>{score}/100</strong>. Free shows you the first week.
          Pro unlocks the 12-week protocol built for your assessment.
        </p>

        {/* Free vs Pro comparison ── the smart bit */}
        <div style={{
          borderRadius: 18,
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          overflow: 'hidden',
          marginBottom: 22,
        }}>
          {/* Header row */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr',
            padding: '12px 16px 10px',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            alignItems: 'center',
          }}>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 9.5, letterSpacing: '0.16em',
              color: 'rgba(255,255,255,0.40)',
            }}>WHAT YOU GET</div>
            <div style={{
              fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.55)',
              textAlign: 'center', letterSpacing: '0.04em',
            }}>Free</div>
            <div style={{
              fontSize: 11, fontWeight: 700, color: '#F5E6C8',
              textAlign: 'center', letterSpacing: '0.04em',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
            }}>{Icon.pro(11, '#F5E6C8')} PRO</div>
          </div>

          {[
            { label: 'Alignment zones',     free: '2 of 7',      pro: 'All 7' },
            { label: 'Program length',      free: '1 week',      pro: '12 weeks' },
            { label: 'Guided sessions',     free: '3 sessions',  pro: 'Unlimited' },
            { label: 'Photo re-assessments',free: '1 / month',   pro: 'Unlimited' },
            { label: 'Progress tracking',   free: 'Basic',       pro: 'Full timeline' },
            { label: 'Priority focus plan', free: 'Locked',      pro: 'Personalized', highlight: true },
          ].map((row, i, arr) => (
            <div key={row.label} style={{
              display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr',
              padding: '11px 16px',
              alignItems: 'center',
              borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
              background: row.highlight ? 'rgba(245,230,200,0.04)' : 'transparent',
            }}>
              <div style={{
                fontSize: 13, color: '#FFFFFF',
                fontWeight: row.highlight ? 600 : 400,
              }}>{row.label}</div>
              <div style={{
                fontSize: 12, color: row.free === 'Locked' ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.6)',
                textAlign: 'center',
                fontFamily: "'JetBrains Mono', monospace",
                letterSpacing: '0.02em',
              }}>
                {row.free === 'Locked'
                  ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>{Icon.lock(11, 'rgba(255,255,255,0.35)')} —</span>
                  : row.free}
              </div>
              <div style={{
                fontSize: 12, color: '#F5E6C8',
                textAlign: 'center', fontWeight: 600,
                fontFamily: "'JetBrains Mono', monospace",
                letterSpacing: '0.02em',
              }}>{row.pro}</div>
            </div>
          ))}
        </div>

        {/* Trial toggle */}
        <button
          onClick={() => setTrial(t => !t)}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 12,
            padding: '14px 16px', marginBottom: 14, cursor: 'pointer',
            borderRadius: 14,
            background: trial ? 'rgba(245,230,200,0.08)' : 'rgba(255,255,255,0.04)',
            border: `1px solid ${trial ? 'rgba(245,230,200,0.35)' : 'rgba(255,255,255,0.10)'}`,
            textAlign: 'left',
          }}
        >
          <div style={{
            width: 22, height: 22, borderRadius: 6,
            background: trial ? '#F5E6C8' : 'transparent',
            border: `1.5px solid ${trial ? '#F5E6C8' : 'rgba(255,255,255,0.28)'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, transition: 'all 150ms',
          }}>
            {trial && Icon.check(14, '#0D1F3C')}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: 14, fontWeight: 600, color: '#FFFFFF',
              letterSpacing: '-0.005em',
            }}>Start with a 7-day free trial</div>
            <div style={{
              fontSize: 12, color: 'rgba(255,255,255,0.55)', marginTop: 2,
            }}>We'll remind you 2 days before it ends.</div>
          </div>
        </button>

        {/* Plan selector */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 18 }}>
          {plans.map(p => {
            const sel = plan === p.id;
            return (
              <button key={p.id} onClick={() => setPlan(p.id)} style={{
                background: sel ? 'rgba(245,230,200,0.10)' : 'rgba(255,255,255,0.04)',
                border: `1.5px solid ${sel ? 'rgba(245,230,200,0.5)' : 'rgba(255,255,255,0.08)'}`,
                borderRadius: 18, padding: '14px 16px', textAlign: 'left',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
                cursor: 'pointer', color: '#FFFFFF',
                fontFamily: "'Inter Tight', sans-serif",
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                  <div style={{
                    width: 20, height: 20, borderRadius: 999,
                    border: `2px solid ${sel ? '#F5E6C8' : 'rgba(255,255,255,0.28)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    {sel && <div style={{ width: 10, height: 10, borderRadius: 999, background: '#F5E6C8' }}/>}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 15, fontWeight: 600 }}>{p.label}</span>
                      {p.badge && <span style={{
                        fontSize: 9.5, fontWeight: 700, padding: '3px 7px', borderRadius: 5,
                        background: '#F5E6C8', color: '#0D1F3C', letterSpacing: '0.06em',
                      }}>{p.badge}</span>}
                    </div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', marginTop: 3 }}>{p.sub}</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <span style={{
                    fontSize: 17, fontWeight: 600,
                    color: sel ? '#F5E6C8' : '#FFFFFF',
                    fontVariantNumeric: 'tabular-nums',
                  }}>{p.price}</span>
                  <span style={{
                    fontSize: 11, color: 'rgba(255,255,255,0.45)', marginLeft: 2,
                  }}>{p.priceSub}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Bottom CTA stack — all in scroll flow so it sits naturally at the end of the page */}
        <div style={{ marginTop: 22 }}>
          <PrimaryButton onClick={() => onSubscribe && onSubscribe({ plan, trial })} style={{ background: '#F5E6C8' }}>
            {trial ? 'Start free trial' : 'Subscribe to ALIGN Pro'}
          </PrimaryButton>

          <div style={{
            textAlign: 'center', marginTop: 10,
            fontSize: 11.5, color: 'rgba(255,255,255,0.55)',
            letterSpacing: '0.01em', lineHeight: 1.5,
          }}>
            {trial
              ? `No charge today. Auto-renews at ${plan === 'annual' ? '$58.80/year' : '$9.90/month'} after the trial.`
              : `Auto-renews. Cancel anytime in Settings.`}
          </div>

          {/* Reassurance row */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 18, flexWrap: 'wrap',
            marginTop: 16,
          }}>
            {[
              { icon: Icon.shield(13, 'rgba(255,255,255,0.55)'), label: 'Cancel anytime' },
              { icon: Icon.bell(13, 'rgba(255,255,255,0.55)'),   label: 'Trial reminder' },
              { icon: Icon.lock(13, 'rgba(255,255,255,0.55)'),   label: 'Secure billing' },
            ].map((r, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 6,
                fontSize: 11, color: 'rgba(255,255,255,0.55)',
                letterSpacing: '0.02em',
              }}>{r.icon}{r.label}</div>
            ))}
          </div>

          {/* Continue with Free — at the very bottom */}
          <div style={{ marginTop: 18, textAlign: 'center' }}>
            <button onClick={onContinueFree} style={{
              background: 'none', border: 0, padding: 10, cursor: 'pointer',
              color: 'rgba(255,255,255,0.55)',
              fontFamily: "'Inter Tight', sans-serif",
              fontSize: 13, fontWeight: 500,
              textDecoration: 'underline', textUnderlineOffset: 3,
            }}>Continue with Free (20% of program)</button>
          </div>
        </div>
      </div>
    </Screen>
  );
}

window.PaywallScreen = PaywallScreen;
