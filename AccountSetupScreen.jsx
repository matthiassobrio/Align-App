// ALIGN — Account setup (email + password + name).
// Reached AFTER the user picks a plan on the paywall (or skips to Free).
// This is the "save your assessment" moment — framed as keeping their result,
// not as a sign-up wall. Banner adapts to whether they're entering as Pro / Trial / Free.

function AccountSetupScreen({ mode = 'pro-trial', onCreate, onBack, onSignIn }) {
  // mode: 'pro-trial' | 'pro-paid' | 'free'
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirm, setConfirm] = React.useState('');
  const [showPwd, setShowPwd] = React.useState(false);
  const [agreed, setAgreed] = React.useState(true);
  const [loading, setLoading] = React.useState(false);

  const pwdLen = password.length;
  const pwdStrength = pwdLen < 6 ? 0 : pwdLen < 10 ? 1 : 2;
  const pwdLabel = pwdLen === 0 ? '' : pwdStrength === 0 ? 'Too short' : pwdStrength === 1 ? 'OK' : 'Strong';
  const pwdColor = pwdStrength === 0 ? '#F18A8A' : pwdStrength === 1 ? '#F2C56B' : '#7FE0B5';
  const pwdMatch = confirm.length > 0 && confirm === password;
  const pwdMismatch = confirm.length > 0 && confirm !== password;

  const canSubmit = name.trim().length >= 1
    && email.includes('@') && email.includes('.')
    && pwdLen >= 8
    && pwdMatch
    && agreed && !loading;

  const submit = () => {
    if (!canSubmit) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onCreate && onCreate({ name: name.trim(), email: email.trim().toLowerCase(), mode });
    }, 700);
  };

  const banner = {
    'pro-trial': {
      eyebrow: 'FINAL STEP · SAVE YOUR RESULT',
      title: 'Save your result',
      sub: "Your trial and 12-week program need a home — link them to an email so you can come back to them.",
      accent: '#F5E6C8',
      tag: 'TRIAL ACTIVATED',
      cta: 'Save my result & start trial',
    },
    'pro-paid': {
      eyebrow: 'FINAL STEP · SAVE YOUR RESULT',
      title: 'Save your result',
      sub: 'Your Pro program is ready. Link it to an email so you can pick it up on any device.',
      accent: '#F5E6C8',
      tag: 'PRO ACTIVATED',
      cta: 'Save my result & start Pro',
    },
    'free': {
      eyebrow: 'FINAL STEP · SAVE YOUR RESULT',
      title: 'Save your result',
      sub: "Don't lose your assessment — link it to an email so you can come back to your free week of program.",
      accent: '#B4CDFF',
      tag: 'FREE ACCOUNT',
      cta: 'Save my result',
    },
  }[mode];

  const inputBase = {
    width: '100%', height: 52, padding: '0 16px',
    borderRadius: 14,
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.10)',
    color: '#FFFFFF',
    fontFamily: "'Inter Tight', sans-serif",
    fontSize: 15, fontWeight: 400, letterSpacing: '-0.005em',
    outline: 'none', boxSizing: 'border-box', WebkitAppearance: 'none',
  };

  const fieldLabel = (children, right) => (
    <div style={{
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: 10, letterSpacing: '0.18em',
      color: 'rgba(180,205,255,0.7)',
      textTransform: 'uppercase',
      marginBottom: 6, paddingLeft: 4,
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    }}>
      <span>{children}</span>
      {right}
    </div>
  );

  return (
    <Screen padBottom={40}>
      <ScreenHeader
        left={
          <button onClick={onBack} aria-label="Back" style={{
            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 999, width: 36, height: 36,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: '#FFF',
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>
        }
        right={
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '5px 10px', borderRadius: 999,
            background: 'rgba(255,255,255,0.04)',
            border: `1px solid ${banner.accent}55`,
            fontSize: 10, fontWeight: 600, letterSpacing: '0.12em',
            color: banner.accent,
          }}>
            {mode !== 'free' && Icon.pro(11, banner.accent)}
            {banner.tag}
          </div>
        }
      />

      <div style={{ padding: '4px 20px 0' }}>
        <div style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 10.5, letterSpacing: '0.18em',
          color: 'rgba(255,255,255,0.5)',
          marginBottom: 10,
        }}>{banner.eyebrow}</div>

        <h1 style={{
          fontFamily: "'Inter Tight', sans-serif",
          fontSize: 30, fontWeight: 600, letterSpacing: '-0.02em',
          lineHeight: 1.12, margin: '0 0 10px', color: '#FFFFFF',
        }}>{banner.title}</h1>

        <p style={{
          fontSize: 14.5, color: 'rgba(255,255,255,0.65)',
          margin: '0 0 22px', lineHeight: 1.5,
        }}>{banner.sub}</p>

        {/* What's preserved — visual reassurance */}
        <div style={{
          padding: '12px 14px', marginBottom: 22,
          borderRadius: 14,
          background: 'rgba(180,205,255,0.06)',
          border: '1px solid rgba(180,205,255,0.18)',
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'rgba(180,205,255,0.14)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            {Icon.shield(18, '#B4CDFF')}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{
              fontSize: 13.5, fontWeight: 600, color: '#FFFFFF',
              letterSpacing: '-0.005em',
            }}>Your assessment will be linked to this account</div>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10, letterSpacing: '0.10em',
              color: 'rgba(180,205,255,0.85)', marginTop: 3,
            }}>
              SCORE · 3 PHOTOS · {mode === 'free' ? '1-WEEK' : '12-WEEK'} PROGRAM
            </div>
          </div>
        </div>

        {/* Name */}
        {fieldLabel('First name')}
        <input
          type="text"
          autoComplete="given-name"
          placeholder="Alex"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') submit(); }}
          style={inputBase}
        />

        {/* Email */}
        <div style={{ height: 14 }}/>
        {fieldLabel('Email')}
        <input
          type="email"
          autoComplete="email"
          inputMode="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') submit(); }}
          style={inputBase}
        />

        {/* Password */}
        <div style={{ height: 14 }}/>
        {fieldLabel('Password',
          <button
            type="button"
            onClick={() => setShowPwd(s => !s)}
            style={{
              background: 'none', border: 0, padding: 0, cursor: 'pointer',
              color: 'rgba(180,205,255,0.85)',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase',
            }}>{showPwd ? 'Hide' : 'Show'}</button>
        )}
        <input
          type={showPwd ? 'text' : 'password'}
          autoComplete="new-password"
          placeholder="At least 8 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') submit(); }}
          style={inputBase}
        />

        {/* Password strength */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          marginTop: 8, paddingLeft: 4, height: 14,
        }}>
          <div style={{
            flex: 1, display: 'flex', gap: 4,
          }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{
                flex: 1, height: 3, borderRadius: 999,
                background: pwdLen === 0
                  ? 'rgba(255,255,255,0.08)'
                  : i <= pwdStrength ? pwdColor : 'rgba(255,255,255,0.08)',
                transition: 'background 150ms',
              }}/>
            ))}
          </div>
          {pwdLen > 0 && (
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10, letterSpacing: '0.12em',
              color: pwdColor,
            }}>{pwdLabel}</div>
          )}
        </div>

        {/* Confirm password */}
        <div style={{ height: 16 }}/>
        {fieldLabel('Confirm password',
          pwdMatch ? (
            <span style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10, letterSpacing: '0.18em',
              color: '#7FE0B5',
              display: 'inline-flex', alignItems: 'center', gap: 4,
            }}>{Icon.check(11, '#7FE0B5')} MATCH</span>
          ) : null
        )}
        <input
          type={showPwd ? 'text' : 'password'}
          autoComplete="new-password"
          placeholder="Re-enter your password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') submit(); }}
          style={Object.assign({}, inputBase, pwdMismatch ? {
            borderColor: 'rgba(241,138,138,0.55)',
          } : pwdMatch ? {
            borderColor: 'rgba(127,224,181,0.40)',
          } : null)}
        />
        {pwdMismatch && (
          <div style={{
            marginTop: 6, paddingLeft: 4,
            fontSize: 12, color: '#F18A8A',
            letterSpacing: '-0.003em',
          }}>Passwords don't match yet.</div>
        )}

        {/* Terms checkbox */}
        <button
          onClick={() => setAgreed(a => !a)}
          style={{
            width: '100%', display: 'flex', alignItems: 'flex-start', gap: 10,
            padding: '14px 0 4px', cursor: 'pointer',
            background: 'none', border: 0, textAlign: 'left',
            marginTop: 16,
          }}
        >
          <div style={{
            width: 18, height: 18, borderRadius: 5,
            background: agreed ? '#B4CDFF' : 'transparent',
            border: `1.5px solid ${agreed ? '#B4CDFF' : 'rgba(255,255,255,0.28)'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, marginTop: 1, transition: 'all 150ms',
          }}>
            {agreed && Icon.check(12, '#0D1F3C')}
          </div>
          <div style={{
            fontSize: 12, color: 'rgba(255,255,255,0.6)',
            lineHeight: 1.45, letterSpacing: '-0.003em',
          }}>
            I agree to ALIGN's{' '}
            <span style={{ color: '#B4CDFF', textDecoration: 'underline', textUnderlineOffset: 2 }}>Terms</span>
            {' '}and{' '}
            <span style={{ color: '#B4CDFF', textDecoration: 'underline', textUnderlineOffset: 2 }}>Privacy Policy</span>.
            {mode === 'pro-trial' && ' I understand my trial converts to a paid plan after 7 days unless I cancel.'}
          </div>
        </button>

        {/* Save CTA — in scroll flow so it sits naturally below the terms */}
        <div style={{ marginTop: 32 }}>
          <PrimaryButton onClick={submit} disabled={!canSubmit}
            style={mode !== 'free' ? { background: '#F5E6C8' } : {}}
          >
            {loading
              ? 'Saving your result…'
              : banner.cta}
          </PrimaryButton>

          <div style={{
            textAlign: 'center', marginTop: 14,
            fontFamily: "'Inter Tight', sans-serif",
            fontSize: 13, color: 'rgba(255,255,255,0.55)',
          }}>
            Coming back?{' '}
            <button onClick={onSignIn} style={{
              background: 'none', border: 0, padding: 0, cursor: 'pointer',
              color: '#B4CDFF', fontFamily: "'Inter Tight', sans-serif",
              fontSize: 13, fontWeight: 500,
              textDecoration: 'underline', textUnderlineOffset: 3,
            }}>Sign in instead</button>
          </div>
        </div>
      </div>
    </Screen>
  );
}

window.AccountSetupScreen = AccountSetupScreen;
