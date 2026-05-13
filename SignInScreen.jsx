// ALIGN — Sign In screen
// Reached from Welcome → "I already have an account".
// Mirrors WelcomeScreen's cinematic backdrop, then a credentials form.

function SignInScreen({ onBack, onSignIn, onCreateAccount }) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPwd, setShowPwd] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  const canSubmit = email.includes('@') && password.length >= 1 && !loading;

  const submit = () => {
    if (!canSubmit) return;
    setError(null);
    setLoading(true);
    // Simulated auth — any well-formed credentials succeed.
    setTimeout(() => {
      setLoading(false);
      onSignIn && onSignIn({ email });
    }, 700);
  };

  const inputBase = {
    width: '100%', height: 56,
    padding: '0 18px',
    borderRadius: 14,
    background: 'rgba(255,255,255,0.14)',
    border: '1.5px solid rgba(255,255,255,0.28)',
    color: '#FFFFFF',
    fontFamily: "'Inter Tight', sans-serif",
    fontSize: 16, fontWeight: 500,
    letterSpacing: '-0.005em',
    outline: 'none',
    boxSizing: 'border-box',
    WebkitAppearance: 'none',
    boxShadow: '0 4px 16px -4px rgba(0,0,0,0.20)',
  };

  return (
    <Screen padBottom={150}>
      {/* Same cinematic backdrop as Welcome, dimmed a touch more */}
      <WelcomeVideo />
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, rgba(8,16,32,0.40) 0%, rgba(8,16,32,0.65) 50%, rgba(8,16,32,0.90) 100%)',
        pointerEvents: 'none',
      }}/>

      {/* Back button — sits below the iOS status bar (which covers the top 62px and intercepts taps) */}
      <div style={{
        position: 'absolute', top: 70, left: 16, zIndex: 20,
      }}>
        <button onClick={onBack} aria-label="Back" style={{
          width: 40, height: 40, borderRadius: 999,
          background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.10)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', padding: 0,
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
      </div>

      <div style={{
        position: 'absolute', top: 110, left: 0, right: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'flex-start',
        textAlign: 'center', padding: '0 32px', gap: 14,
      }}>
        {/* Logo lockup, matched to Welcome */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#FFFFFF' }}>
          <svg width="32" height="32" viewBox="0 0 64 64" fill="none" style={{ display: 'block' }}>
            <g stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="16,24 32,12 48,24"/>
              <polyline points="16,38 32,26 48,38"/>
              <polyline points="16,52 32,40 48,52"/>
            </g>
          </svg>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2 }}>
            <div style={{
              fontFamily: "'Inter Tight', sans-serif",
              fontSize: 22, fontWeight: 600,
              letterSpacing: '0.18em', lineHeight: 1,
            }}>ALIGN</div>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 8.5, letterSpacing: '0.26em',
              color: 'rgba(180,205,255,0.7)',
            }}>POSTURE</div>
          </div>
        </div>

        <div style={{
          fontFamily: "'Inter Tight', sans-serif",
          fontSize: 24, fontWeight: 600, letterSpacing: '-0.02em',
          color: '#FFFFFF',
        }}>Welcome back</div>
        <div style={{
          fontFamily: "'Inter Tight', sans-serif",
          fontSize: 14, color: 'rgba(255,255,255,0.65)',
          letterSpacing: '-0.005em', maxWidth: 280, lineHeight: 1.45,
        }}>Sign in to pick up where you left off.</div>
      </div>

      <StickyBottom>
        {/* Email */}
        <div style={{
          fontFamily: "'Inter Tight', sans-serif",
          fontSize: 12, fontWeight: 600, letterSpacing: '0.06em',
          color: '#FFFFFF',
          textTransform: 'uppercase',
          marginBottom: 8, paddingLeft: 4,
        }}>Email</div>
        <input
          type="email"
          autoComplete="email"
          inputMode="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setError(null); }}
          onKeyDown={(e) => { if (e.key === 'Enter') submit(); }}
          style={inputBase}
        />

        {/* Password */}
        <div style={{
          fontFamily: "'Inter Tight', sans-serif",
          fontSize: 12, fontWeight: 600, letterSpacing: '0.06em',
          color: '#FFFFFF',
          textTransform: 'uppercase',
          margin: '16px 0 8px', paddingLeft: 4,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span>Password</span>
          <button
            type="button"
            onClick={() => setShowPwd((s) => !s)}
            style={{
              background: 'none', border: 0, padding: 0, cursor: 'pointer',
              color: '#B4CDFF',
              fontFamily: "'Inter Tight', sans-serif",
              fontSize: 12, fontWeight: 600, letterSpacing: '0.02em', textTransform: 'none',
            }}>{showPwd ? 'Hide' : 'Show'}</button>
        </div>
        <input
          type={showPwd ? 'text' : 'password'}
          autoComplete="current-password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => { setPassword(e.target.value); setError(null); }}
          onKeyDown={(e) => { if (e.key === 'Enter') submit(); }}
          style={inputBase}
        />

        {/* Forgot password */}
        <div style={{ textAlign: 'right', marginTop: 10 }}>
          <button
            onClick={() => setError('Password reset link sent to your email.')}
            style={{
              background: 'none', border: 0, padding: 6, cursor: 'pointer',
              color: '#B4CDFF',
              fontFamily: "'Inter Tight', sans-serif",
              fontSize: 13, fontWeight: 500,
              letterSpacing: '-0.005em',
            }}
          >Forgot password?</button>
        </div>

        {/* Inline message */}
        {error && (
          <div style={{
            margin: '6px 0 12px', padding: '10px 12px', borderRadius: 12,
            background: 'rgba(180,205,255,0.10)',
            border: '1px solid rgba(180,205,255,0.22)',
            fontFamily: "'Inter Tight', sans-serif",
            fontSize: 12.5, color: 'rgba(255,255,255,0.85)',
            letterSpacing: '-0.005em', lineHeight: 1.4,
          }}>{error}</div>
        )}

        <div style={{ height: error ? 4 : 18 }}/>

        <PrimaryButton onClick={submit} disabled={!canSubmit}>
          {loading ? 'Signing in…' : 'Sign in'}
        </PrimaryButton>

        <div style={{
          textAlign: 'center', marginTop: 14,
          fontFamily: "'Inter Tight', sans-serif",
          fontSize: 14, color: 'rgba(255,255,255,0.75)',
        }}>
          New to ALIGN?{' '}
          <button
            onClick={onCreateAccount}
            style={{
              background: 'none', border: 0, padding: 0, cursor: 'pointer',
              color: '#FFFFFF', fontFamily: "'Inter Tight', sans-serif",
              fontSize: 14, fontWeight: 600, textDecoration: 'underline', textUnderlineOffset: 3,
            }}>Create an account</button>
        </div>
      </StickyBottom>
    </Screen>
  );
}

window.SignInScreen = SignInScreen;
