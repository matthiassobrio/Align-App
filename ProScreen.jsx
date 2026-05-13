// ALIGN — Pro upsell screen
function ProScreen({ onSubscribe, onClose }) {
  const [plan, setPlan] = React.useState('annual');
  return (
    <Screen padBottom={170}>
      <ScreenHeader
        left={<button onClick={onClose} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 999, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#FFF' }}>{Icon.close(18)}</button>}
      />

      <div style={{ padding: '8px 20px 0' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 999, background: 'rgba(245,230,200,0.10)', border: '1px solid rgba(245,230,200,0.30)', marginBottom: 18 }}>
          {Icon.pro(14, '#F5E6C8')}
          <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#F5E6C8' }}>ALIGN PRO</span>
        </div>

        <h1 style={{
          fontFamily: "'Inter Tight', sans-serif",
          fontSize: 36, fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1.05,
          margin: '0 0 14px', color: '#FFFFFF',
        }}>
          The full<br/>
          <span style={{ color: '#F5E6C8' }}>program.</span>
        </h1>

        <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.72)', margin: '0 0 28px', lineHeight: 1.55 }}>
          Long-form programs, unlimited assessments, photo progress tracking, and personalized guidance.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 28 }}>
          {[
            'Full programs from 4 to 12 weeks',
            'Unlimited assessments with photo comparison',
            'Audio-guided sessions',
            'Early access to new modules',
          ].map((f, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 22, height: 22, borderRadius: 999, background: 'rgba(245,230,200,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {Icon.check(14, '#F5E6C8')}
              </div>
              <div style={{ fontSize: 15, color: '#FFFFFF' }}>{f}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { id: 'annual',  label: 'Annual',  price: '$4.90/mo', sub: 'Billed $58.80 per year', badge: '-50%' },
            { id: 'monthly', label: 'Monthly', price: '$9.90/mo', sub: 'No commitment' },
          ].map(p => {
            const sel = plan === p.id;
            return (
              <button key={p.id} onClick={() => setPlan(p.id)} style={{
                background: sel ? 'rgba(245,230,200,0.10)' : 'rgba(255,255,255,0.04)',
                border: `1.5px solid ${sel ? 'rgba(245,230,200,0.5)' : 'rgba(255,255,255,0.08)'}`,
                borderRadius: 18, padding: '16px 18px', textAlign: 'left',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                cursor: 'pointer', color: '#FFFFFF',
                fontFamily: "'Inter Tight', sans-serif",
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 15, fontWeight: 600 }}>{p.label}</span>
                    {p.badge && <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 6, background: '#F5E6C8', color: '#0D1F3C', letterSpacing: '0.04em' }}>{p.badge}</span>}
                  </div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.62)', marginTop: 4 }}>{p.sub}</div>
                </div>
                <div style={{ fontSize: 16, fontWeight: 600, color: sel ? '#F5E6C8' : '#FFFFFF', fontVariantNumeric: 'tabular-nums' }}>
                  {p.price}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <StickyBottom>
        <PrimaryButton onClick={onSubscribe} style={{ background: '#F5E6C8' }}>Subscribe to ALIGN Pro</PrimaryButton>
        <div style={{ textAlign: 'center', marginTop: 10, fontSize: 12, color: 'rgba(255,255,255,0.52)' }}>
          Auto-renews. Cancel anytime.
        </div>
      </StickyBottom>
    </Screen>
  );
}

window.ProScreen = ProScreen;
