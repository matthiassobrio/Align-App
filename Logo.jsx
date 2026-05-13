// ALIGN — Reusable full-logo lockup (symbol + ALIGN wordmark + mono caption)
// Sizes: 'sm' | 'md' | 'lg' | 'xl'
function LogoLockup({ size = 'md', color = '#FFFFFF', accent = 'rgba(180,205,255,0.7)', showCaption = true }) {
  const sizes = {
    sm: { svg: 22, word: 14, gap: 8,  trk: '0.18em', cap: 6.5 },
    md: { svg: 28, word: 18, gap: 10, trk: '0.18em', cap: 7.5 },
    lg: { svg: 38, word: 24, gap: 12, trk: '0.18em', cap: 9   },
    xl: { svg: 56, word: 36, gap: 16, trk: '0.18em', cap: 12  },
  };
  const s = sizes[size] || sizes.md;
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: s.gap, color }}>
      <svg width={s.svg} height={s.svg} viewBox="0 0 64 64" fill="none">
        <g stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="16,24 32,12 48,24"/>
          <polyline points="16,38 32,26 48,38"/>
          <polyline points="16,52 32,40 48,52"/>
        </g>
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <div style={{ fontFamily: "'Inter Tight', sans-serif", fontSize: s.word, fontWeight: 600, letterSpacing: s.trk, lineHeight: 1, color }}>ALIGN</div>
        {showCaption && (
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: s.cap, letterSpacing: '0.22em', color: accent }}>POSTURE</div>
        )}
      </div>
    </div>
  );
}
window.LogoLockup = LogoLockup;
