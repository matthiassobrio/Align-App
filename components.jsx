// ALIGN — shared UI primitives for the mobile UI kit.
// Loaded as a Babel script. Exports components to window for cross-file use.

// ─────────────── Brand pill button (primary white CTA) ───────────────
function PrimaryButton({ children, onClick, disabled, style = {} }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      width: '100%', height: 56, borderRadius: 999, border: 'none',
      background: disabled ? 'rgba(255,255,255,0.32)' : '#FFFFFF',
      color: '#0D1F3C',
      fontFamily: "'Inter Tight', sans-serif", fontSize: 16, fontWeight: 600,
      letterSpacing: '-0.01em',
      boxShadow: disabled ? 'none' : '0 8px 24px -8px rgba(180,205,255,0.25), 0 1px 0 0 rgba(255,255,255,0.6) inset',
      cursor: disabled ? 'not-allowed' : 'pointer',
      transition: 'transform 120ms cubic-bezier(0.22,1,0.36,1), opacity 150ms',
      ...style,
    }}
      onMouseDown={(e) => !disabled && (e.currentTarget.style.transform = 'scale(0.97)')}
      onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
    >{children}</button>
  );
}

function GhostButton({ children, onClick, style = {} }) {
  return (
    <button onClick={onClick} style={{
      width: '100%', height: 52, borderRadius: 999,
      background: 'rgba(255,255,255,0.08)',
      color: '#FFFFFF', border: '1px solid rgba(255,255,255,0.08)',
      fontFamily: "'Inter Tight', sans-serif", fontSize: 16, fontWeight: 500,
      cursor: 'pointer', transition: 'background 150ms',
      ...style,
    }}>{children}</button>
  );
}

function LinkButton({ children, onClick, style = {} }) {
  return (
    <button onClick={onClick} style={{
      background: 'none', border: 'none', color: 'rgba(255,255,255,0.72)',
      fontFamily: "'Inter Tight', sans-serif", fontSize: 14, fontWeight: 500,
      textDecoration: 'underline', textUnderlineOffset: 4, cursor: 'pointer',
      padding: 8, ...style,
    }}>{children}</button>
  );
}

// ─────────────── Card ───────────────
function Card({ children, style = {}, accent = false, pro = false, onClick }) {
  const base = {
    padding: '18px 20px', borderRadius: 20,
    background: pro ? 'rgba(245,230,200,0.10)' : 'rgba(255,255,255,0.04)',
    border: `1px solid ${pro ? 'rgba(245,230,200,0.30)' : 'rgba(255,255,255,0.08)'}`,
    boxShadow: '0 1px 0 0 rgba(255,255,255,0.04) inset, 0 12px 32px -16px rgba(0,0,0,0.5)',
    cursor: onClick ? 'pointer' : 'default',
    transition: 'transform 150ms cubic-bezier(0.22,1,0.36,1), background 150ms',
  };
  return <div onClick={onClick} style={{ ...base, ...style }}>{children}</div>;
}

// ─────────────── Eyebrow + screen title ───────────────
function Eyebrow({ children, color = '#B4CDFF', style = {} }) {
  return <div style={{
    fontSize: 12, fontWeight: 600, letterSpacing: '0.14em',
    textTransform: 'uppercase', color, ...style,
  }}>{children}</div>;
}

function ScreenTitle({ children, style = {} }) {
  // Harmonized with WelcomeScreen: Inter Tight, 600, tight tracking. No serif variant.
  return (
    <h1 style={{
      fontFamily: "'Inter Tight', sans-serif",
      fontSize: 32, fontWeight: 600,
      letterSpacing: '-0.02em', lineHeight: 1.1, margin: 0,
      color: '#FFFFFF', ...style,
    }}>{children}</h1>
  );
}

// ─────────────── Progress bar ───────────────
function ProgressBar({ value = 0, style = {} }) {
  return (
    <div style={{ height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 999, overflow: 'hidden', ...style }}>
      <div style={{
        width: `${Math.max(0, Math.min(100, value))}%`, height: '100%',
        background: 'rgba(180,205,255,0.9)', borderRadius: 999,
        boxShadow: '0 0 12px rgba(180,205,255,0.4)',
        transition: 'width 360ms cubic-bezier(0.22,1,0.36,1)',
      }} />
    </div>
  );
}

// ─────────────── Chip ───────────────
function Chip({ children, selected, onClick, style = {}, compact = false }) {
  return (
    <button onClick={onClick} style={{
      padding: compact ? '6px 11px' : '10px 16px', borderRadius: 999,
      background: selected ? 'rgba(180,205,255,0.18)' : 'rgba(255,255,255,0.06)',
      border: `1px solid ${selected ? 'rgba(180,205,255,0.45)' : 'rgba(255,255,255,0.10)'}`,
      color: selected ? '#B4CDFF' : '#FFFFFF',
      fontFamily: "'Inter Tight', sans-serif", fontSize: compact ? 12.5 : 14,
      fontWeight: selected ? 600 : 400,
      cursor: 'pointer', transition: 'all 150ms',
      ...style,
    }}>{children}</button>
  );
}

// ─────────────── Status pill (semantic) ───────────────
function StatusPill({ tone = 'success', children }) {
  const tones = {
    success: { bg: 'rgba(143,227,181,0.16)', fg: '#8FE3B5' },
    warning: { bg: 'rgba(255,213,138,0.16)', fg: '#FFD58A' },
    danger:  { bg: 'rgba(255,156,156,0.16)', fg: '#FF9C9C' },
    pro:     { bg: 'rgba(245,230,200,0.16)', fg: '#F5E6C8' },
  }[tone];
  return <span style={{
    padding: '4px 10px', borderRadius: 6, background: tones.bg, color: tones.fg,
    fontSize: 11, fontWeight: 600, letterSpacing: '0.04em',
  }}>{children}</span>;
}

// ─────────────── Lucide-style inline icons (1.6 stroke) ───────────────
const Icon = {
  clock: (s = 22, c = 'currentColor') => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>
  ),
  calendar: (s = 22, c = 'currentColor') => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round"><rect x="4" y="5" width="16" height="14" rx="2"/><path d="M4 10h16M9 5v14"/></svg>
  ),
  body: (s = 22, c = 'currentColor') => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round"><circle cx="12" cy="6" r="2.5"/><path d="M12 9v8M8 13h8M9 17l-1.5 4M15 17l1.5 4"/></svg>
  ),
  pro: (s = 22, c = 'currentColor') => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round"><path d="M5 8l3 9h8l3-9-5 4-2-6-2 6z"/></svg>
  ),
  user: (s = 22, c = 'currentColor') => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round"><circle cx="12" cy="9" r="3.5"/><path d="M5 20c1.5-3.5 4-5 7-5s5.5 1.5 7 5"/></svg>
  ),
  arrowRight: (s = 18, c = 'currentColor') => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
  ),
  arrowLeft: (s = 18, c = 'currentColor') => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>
  ),
  close: (s = 22, c = 'currentColor') => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round"><path d="M6 6l12 12M18 6l-12 12"/></svg>
  ),
  camera: (s = 22, c = 'currentColor') => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round"><path d="M3 8h4l2-3h6l2 3h4v11H3z"/><circle cx="12" cy="13" r="3.5"/></svg>
  ),
  check: (s = 18, c = 'currentColor') => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><path d="M5 12l4 4 10-10"/></svg>
  ),
  lock: (s = 18, c = 'currentColor') => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 018 0v3"/></svg>
  ),
  play: (s = 18, c = 'currentColor') => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill={c} stroke="none"><path d="M7 5l13 7-13 7z"/></svg>
  ),
  flame: (s = 18, c = 'currentColor') => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3c1 4 5 5 5 10a5 5 0 01-10 0c0-2 1-3 2-4-1 3 1 4 2 4-1-3 0-7 1-10z"/></svg>
  ),
  bell: (s = 22, c = 'currentColor') => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M6 10a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6"/><path d="M10 20a2 2 0 0 0 4 0"/></svg>
  ),
  shield: (s = 22, c = 'currentColor') => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/></svg>
  ),
  download: (s = 22, c = 'currentColor') => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 4v12M7 11l5 5 5-5M5 20h14"/></svg>
  ),
  trash: (s = 22, c = 'currentColor') => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6"/></svg>
  ),
  eye: (s = 22, c = 'currentColor') => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>
  ),
  help: (s = 22, c = 'currentColor') => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 0 1 5 0c0 1.7-2.5 2.3-2.5 4"/><circle cx="12" cy="17" r="0.9" fill={c} stroke="none"/></svg>
  ),
  chat: (s = 22, c = 'currentColor') => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M4 5h16v11H8l-4 4z"/></svg>
  ),
  search: (s = 22, c = 'currentColor') => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4-4"/></svg>
  ),
  mail: (s = 22, c = 'currentColor') => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>
  ),
  doc: (s = 22, c = 'currentColor') => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3h9l4 4v14H6z"/><path d="M14 3v5h5M8 13h8M8 17h5"/></svg>
  ),
};

// ─────────────── Tab bar — dynamic, drops Pro after subscribe ───────────────
function TabBar({ active = 'today', onChange, isPro = false }) {
  const items = [
    { id: 'today',   label: 'Today',     icon: Icon.clock },
    { id: 'program', label: 'Program',   icon: Icon.calendar },
    { id: 'bilan',   label: 'Assessment', icon: Icon.body },
    !isPro && { id: 'pro', label: 'Pro',  icon: Icon.pro, accent: '#F5E6C8' },
    { id: 'profile', label: 'Profile',   icon: Icon.user },
  ].filter(Boolean);

  return (
    <div style={{
      position: 'static', marginTop: 0,
      marginLeft: 0, marginRight: 0, height: 76,
      borderRadius: '24px 24px 0 0', background: 'rgba(11,31,58,0.92)',
      backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid rgba(255,255,255,0.08)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-around',
      padding: '0 8px', zIndex: 5,
      boxShadow: '0 24px 48px -16px rgba(0,0,0,0.55)',
    }}>
      {items.map((it) => {
        const isActive = it.id === active;
        const color = isActive
          ? (it.accent || '#B4CDFF')
          : (it.accent ? '#F5E6C8' : 'rgba(255,255,255,0.52)');
        return (
          <button key={it.id} onClick={() => onChange?.(it.id)} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
            background: 'none', border: 'none', cursor: 'pointer', padding: 6,
            position: 'relative', minWidth: 56,
          }}>
            {isActive && <div style={{
              position: 'absolute', top: -2, width: 4, height: 4, borderRadius: 999,
              background: color, boxShadow: `0 0 8px ${color}`,
            }} />}
            {it.icon(22, color)}
            <div style={{
              fontFamily: "'Inter Tight', sans-serif",
              fontSize: 10, fontWeight: isActive ? 600 : 500, color,
            }}>{it.label}</div>
          </button>
        );
      })}
    </div>
  );
}

// ─────────────── Screen wrapper (gradient bg, padding, scroll) ───────────────
// Background mirrors WelcomeScreen: radial navy + drifting light wash + faint grid.
// If a <TabBar> appears in children, it's pulled out of the scrolling content and
// pinned to the bottom of the screen so it never moves with scroll.
function Screen({ children, padBottom = 110, style = {} }) {
  // Separate TabBar (if any) from the scrolling content
  let tabBar = null;
  const scrollKids = [];
  React.Children.toArray(children).forEach((child) => {
    if (child && child.type === TabBar) {
      tabBar = child;
    } else {
      scrollKids.push(child);
    }
  });
  // If a TabBar is present, reserve room for it inside the scroll padding.
  const tabBarHeight = tabBar ? 88 : 0;
  return (
    <div style={{
      width: '100%', height: '100%',
      background: 'radial-gradient(120% 80% at 50% 28%, #2E4878 0%, #1B3460 50%, #142850 100%)',
      overflow: 'hidden', position: 'relative',
      fontFamily: "'Inter Tight', sans-serif", color: '#FFFFFF',
      ...style,
    }}>
      <style>{`
        @keyframes alignLightDrift {
          0%   { transform: translate3d(-2%, -1%, 0) scale(1.00); opacity: 0.85; }
          100% { transform: translate3d( 3%,  2%, 0) scale(1.08); opacity: 1.00; }
        }
      `}</style>

      {/* slow drifting light wash — same as welcome */}
      <div style={{
        position: 'absolute', inset: '-10%',
        background: 'radial-gradient(40% 28% at 50% 22%, rgba(180,205,255,0.18) 0%, transparent 65%)',
        filter: 'blur(20px)',
        animation: 'alignLightDrift 14s ease-in-out infinite alternate',
        pointerEvents: 'none',
      }} />

      {/* faint grid texture — same as welcome */}
      <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, opacity: 0.05, pointerEvents: 'none' }}>
        <defs>
          <pattern id="alignScreenGrid" width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M32 0H0V32" fill="none" stroke="#B4CDFF" strokeWidth="0.4"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#alignScreenGrid)"/>
      </svg>

      {/* corner accent glow — kept, slightly cooler */}
      <div style={{
        position: 'absolute', top: -120, right: -80, width: 320, height: 320,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(180,205,255,0.22) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        position: 'absolute', inset: 0, overflowY: 'auto',
        display: 'flex', flexDirection: 'column',
        paddingTop: 60, paddingBottom: padBottom + tabBarHeight,
        zIndex: 1,
      }}>
        {scrollKids}
      </div>

      {/* TabBar pinned to the bottom of the screen, outside the scrolling area */}
      {tabBar && (
        <div style={{
          position: 'absolute', left: 0, right: 0, bottom: 0,
          zIndex: 6,
        }}>{tabBar}</div>
      )}
    </div>
  );
}

// ─────────────── Header inside a Screen ───────────────
function ScreenHeader({ left, right, title, subtitle }) {
  return (
    <div style={{ padding: '0 20px', marginBottom: 20 }}>
      {(left || right) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 32, marginBottom: 14 }}>
          <div>{left}</div>
          <div>{right}</div>
        </div>
      )}
      {title && <ScreenTitle>{title}</ScreenTitle>}
      {subtitle && <div style={{ marginTop: 6, fontSize: 15, color: 'rgba(255,255,255,0.62)' }}>{subtitle}</div>}
    </div>
  );
}

// ─────────────── Sticky bottom bar (CTA above tab bar or alone) ───────────────
function StickyBottom({ children, withTabbar = false }) {
  const bottomOffset = withTabbar ? 110 : 24;
  return (
    <React.Fragment>
      {/* fade so scrolling content doesn't read through the CTA */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        height: bottomOffset + 80, pointerEvents: 'none', zIndex: 3,
        background: 'linear-gradient(180deg, rgba(11,31,58,0) 0%, rgba(11,31,58,0.85) 45%, rgba(11,31,58,0.98) 100%)',
      }} />
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: bottomOffset,
        padding: '0 20px', zIndex: 4,
      }}>
        {children}
      </div>
    </React.Fragment>
  );
}

// Export to window so other Babel scripts can use them
Object.assign(window, {
  PrimaryButton, GhostButton, LinkButton, Card, Eyebrow, ScreenTitle,
  ProgressBar, Chip, StatusPill, Icon, TabBar, Screen, ScreenHeader, StickyBottom,
});
