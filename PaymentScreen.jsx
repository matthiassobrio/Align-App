// ALIGN — Payment / card capture
// Sits between PaywallScreen and AccountSetupScreen for ALL paid paths
// (trial / annual / monthly). Trial captures the card so the first auto-charge
// goes through at the end of the 7 days.

function PaymentScreen({ plan = 'annual', trial = false, onBack, onConfirm }) {
  const [number, setNumber] = React.useState('');
  const [name, setName]     = React.useState('');
  const [exp, setExp]       = React.useState('');
  const [cvc, setCvc]       = React.useState('');
  const [loading, setLoading] = React.useState(false);

  // Real-time card type detection (visa / mastercard / amex / generic)
  const digits = number.replace(/\D/g, '');
  const cardType =
    /^4/.test(digits)              ? 'visa'   :
    /^(5[1-5]|2[2-7])/.test(digits)? 'mc'     :
    /^3[47]/.test(digits)          ? 'amex'   :
    null;

  const formatNumber = (raw) => {
    const d = raw.replace(/\D/g, '').slice(0, 16);
    return d.replace(/(.{4})/g, '$1 ').trim();
  };
  const formatExp = (raw) => {
    const d = raw.replace(/\D/g, '').slice(0, 4);
    return d.length <= 2 ? d : d.slice(0, 2) + '/' + d.slice(2);
  };

  const numOk  = digits.length >= 14;
  const nameOk = name.trim().length >= 2;
  const expOk  = /^\d{2}\/\d{2}$/.test(exp);
  const cvcOk  = /^\d{3,4}$/.test(cvc);
  const canSubmit = numOk && nameOk && expOk && cvcOk && !loading;

  const submit = () => {
    if (!canSubmit) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onConfirm && onConfirm({ last4: digits.slice(-4), cardType, plan, trial });
    }, 900);
  };

  // Pricing summary
  const planLabel = plan === 'annual' ? '12 months' : '1 month';
  const planPrice = plan === 'annual' ? '$58.80' : '$9.90';
  const planMonthly = plan === 'annual' ? '$4.90/mo' : '$9.90/mo';

  // First charge date — May 19, 2026 (trial) or today (May 12, 2026)
  const firstChargeDate = trial ? 'May 19, 2026' : 'May 12, 2026';
  const todayAmount = trial ? '$0.00' : planPrice;

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
  const fieldLabel = (txt, right) => (
    <div style={{
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: 10, letterSpacing: '0.18em',
      color: 'rgba(180,205,255,0.7)',
      textTransform: 'uppercase',
      marginBottom: 6, paddingLeft: 4,
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    }}>
      <span>{txt}</span>
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
            fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
            letterSpacing: '0.16em', color: '#F5E6C8',
          }}>STEP 4 · PAYMENT</div>
        }
      />

      <div style={{ padding: '4px 20px 0' }}>
        <div style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 10.5, letterSpacing: '0.18em',
          color: 'rgba(255,255,255,0.5)', marginBottom: 10,
        }}>{trial ? '7-DAY FREE TRIAL' : 'ALIGN PRO'}</div>

        <h1 style={{
          fontFamily: "'Inter Tight', sans-serif",
          fontSize: 30, fontWeight: 600, letterSpacing: '-0.02em',
          lineHeight: 1.12, margin: '0 0 10px', color: '#FFFFFF',
        }}>{trial ? 'Add a card to start' : 'Confirm payment'}</h1>

        <p style={{
          fontSize: 14.5, color: 'rgba(255,255,255,0.65)',
          margin: '0 0 20px', lineHeight: 1.5,
        }}>
          {trial
            ? "You won't be charged today. We'll save your card so Pro continues seamlessly after your trial ends."
            : "Your Pro subscription will be activated immediately after payment."}
        </p>

        {/* Order summary card */}
        <div style={{
          padding: '14px 16px', marginBottom: 22,
          borderRadius: 16,
          background: 'linear-gradient(180deg, rgba(245,230,200,0.10), rgba(245,230,200,0.03))',
          border: '1px solid rgba(245,230,200,0.25)',
        }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
            marginBottom: 12,
          }}>
            <div>
              <div style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 9.5, letterSpacing: '0.16em',
                color: '#F5E6C8', marginBottom: 4,
              }}>ALIGN PRO · {planLabel.toUpperCase()}</div>
              <div style={{
                fontFamily: "'Inter Tight', sans-serif",
                fontSize: 15, fontWeight: 600, color: '#FFFFFF',
              }}>{planMonthly}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5,
                letterSpacing: '0.16em', color: 'rgba(255,255,255,0.5)', marginBottom: 4,
              }}>DUE TODAY</div>
              <div style={{
                fontFamily: "'Inter Tight', sans-serif",
                fontSize: 22, fontWeight: 600, color: trial ? '#7FE0B5' : '#F5E6C8',
                letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums',
              }}>{todayAmount}</div>
            </div>
          </div>

          <div style={{
            paddingTop: 12, borderTop: '1px dashed rgba(245,230,200,0.20)',
            display: 'flex', alignItems: 'flex-start', gap: 10,
            fontSize: 12, color: 'rgba(255,255,255,0.72)', lineHeight: 1.5,
          }}>
            <div style={{
              width: 18, height: 18, borderRadius: 999,
              background: 'rgba(245,230,200,0.15)', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>{Icon.calendar(11, '#F5E6C8')}</div>
            <div>
              {trial
                ? <>First charge of <strong style={{ color: '#FFFFFF', fontWeight: 600 }}>{planPrice}</strong> on <strong style={{ color: '#FFFFFF', fontWeight: 600 }}>{firstChargeDate}</strong>. We'll remind you 2 days before.</>
                : <>Renews at <strong style={{ color: '#FFFFFF', fontWeight: 600 }}>{planPrice}</strong> on {plan === 'annual' ? 'May 12, 2027' : 'June 12, 2026'}. Cancel anytime.</>
              }
            </div>
          </div>
        </div>

        {/* Apple Pay / Google Pay shortcut */}
        <button
          onClick={submit}
          disabled={loading}
          style={{
            width: '100%', height: 52, borderRadius: 14, marginBottom: 18,
            background: '#000000', color: '#FFFFFF',
            border: '1px solid rgba(255,255,255,0.12)',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            fontFamily: "-apple-system, 'SF Pro Display', system-ui, sans-serif",
            fontSize: 16, fontWeight: 600, letterSpacing: '-0.01em',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#FFFFFF">
            <path d="M17.05 12.04c-.03-2.9 2.37-4.3 2.48-4.37-1.35-1.98-3.45-2.25-4.2-2.28-1.78-.18-3.48 1.05-4.38 1.05-.92 0-2.3-1.03-3.79-1-1.95.03-3.75 1.13-4.75 2.88-2.03 3.51-.52 8.7 1.45 11.55.96 1.4 2.1 2.97 3.6 2.91 1.45-.06 2-.94 3.74-.94 1.73 0 2.24.94 3.77.91 1.56-.03 2.55-1.42 3.5-2.83 1.1-1.62 1.55-3.19 1.58-3.27-.04-.02-3.03-1.16-3.06-4.61zM14.18 4.06c.78-.95 1.31-2.27 1.17-3.59-1.12.05-2.49.75-3.3 1.7-.72.84-1.36 2.19-1.19 3.49 1.26.1 2.55-.64 3.32-1.6z"/>
          </svg>
          Pay with Apple Pay
        </button>

        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          margin: '0 0 18px',
        }}>
          <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }}/>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 10, letterSpacing: '0.18em',
            color: 'rgba(255,255,255,0.4)',
          }}>OR PAY WITH CARD</div>
          <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }}/>
        </div>

        {/* Card number */}
        {fieldLabel('Card number',
          cardType && (
            <span style={{
              padding: '2px 8px', borderRadius: 4,
              background: 'rgba(180,205,255,0.12)',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10, letterSpacing: '0.14em',
              color: 'rgba(180,205,255,0.85)', fontWeight: 600,
              textTransform: 'uppercase',
            }}>{cardType}</span>
          )
        )}
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            inputMode="numeric"
            autoComplete="cc-number"
            placeholder="1234 5678 9012 3456"
            value={number}
            onChange={(e) => setNumber(formatNumber(e.target.value))}
            style={Object.assign({}, inputBase, { paddingLeft: 46 })}
          />
          <span style={{
            position: 'absolute', left: 14, top: '50%',
            transform: 'translateY(-50%)', display: 'flex',
            color: 'rgba(180,205,255,0.7)',
          }}>
            {Icon.lock ? Icon.lock(18, 'rgba(180,205,255,0.7)') : null}
          </span>
        </div>

        {/* Cardholder name */}
        <div style={{ height: 14 }}/>
        {fieldLabel('Cardholder name')}
        <input
          type="text"
          autoComplete="cc-name"
          placeholder="Name on card"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={inputBase}
        />

        {/* Exp + CVC */}
        <div style={{ height: 14 }}/>
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ flex: 1 }}>
            {fieldLabel('Expiry')}
            <input
              type="text"
              inputMode="numeric"
              autoComplete="cc-exp"
              placeholder="MM/YY"
              value={exp}
              onChange={(e) => setExp(formatExp(e.target.value))}
              style={inputBase}
            />
          </div>
          <div style={{ flex: 1 }}>
            {fieldLabel('CVC')}
            <input
              type="text"
              inputMode="numeric"
              autoComplete="cc-csc"
              placeholder="123"
              value={cvc}
              onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
              maxLength={4}
              style={inputBase}
            />
          </div>
        </div>

        {/* Trust strip */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: 14, flexWrap: 'wrap',
          marginTop: 18,
          fontSize: 11, color: 'rgba(255,255,255,0.45)',
          letterSpacing: '0.02em',
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {Icon.lock ? Icon.lock(12, 'rgba(255,255,255,0.45)') : null} 256-bit encrypted
          </span>
          <span>·</span>
          <span>Processed by Stripe</span>
          <span>·</span>
          <span>Cancel anytime</span>
        </div>

        {/* Submit */}
        <div style={{ marginTop: 22 }}>
          <PrimaryButton
            onClick={submit}
            disabled={!canSubmit}
            style={{ background: canSubmit ? '#F5E6C8' : 'rgba(245,230,200,0.35)' }}
          >
            {loading
              ? 'Securing your card…'
              : trial
                ? 'Start free trial'
                : `Pay ${planPrice} & start Pro`}
          </PrimaryButton>

          <div style={{
            textAlign: 'center', marginTop: 10,
            fontSize: 11.5, color: 'rgba(255,255,255,0.5)',
            letterSpacing: '0.01em', lineHeight: 1.5,
          }}>
            {trial
              ? `No charge today. ${planPrice} on ${firstChargeDate} unless you cancel.`
              : `${planPrice} charged today. Renews at the end of the period.`}
          </div>
        </div>
      </div>
    </Screen>
  );
}

window.PaymentScreen = PaymentScreen;
