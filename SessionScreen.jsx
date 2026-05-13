// ALIGN — Active session screen (during exercise)
// Multi-step: walks through a sequence of exercises. Each exercise is type-locked
// to either reps OR hold — UI swaps accordingly. "Next movement" advances the
// step; final step finishes the session.

const SESSION_EXERCISES = [
  { name: 'Chin tucks',             cue: 'Slow & controlled',         mode: 'reps', target: 10 },
  { name: 'Lateral neck stretch',   cue: 'Hold each side',            mode: 'hold', target: 30 },
  { name: 'Wall slides',            cue: 'Keep arms flat to wall',    mode: 'reps', target: 12 },
  { name: 'Doorway chest stretch',  cue: 'Breathe & open the chest',  mode: 'hold', target: 45 },
];

function SessionScreen({ onClose, onComplete, exercises = SESSION_EXERCISES }) {
  const [step, setStep] = React.useState(0);
  const total = exercises.length;
  const ex = exercises[step];
  const isReps = ex.mode === 'reps';
  const totalSeconds = isReps ? 0 : ex.target;

  const [seconds, setSeconds] = React.useState(totalSeconds);
  const [playing, setPlaying] = React.useState(true);

  // Reset timer + playing state on each step change
  React.useEffect(() => {
    setSeconds(isReps ? 0 : ex.target);
    setPlaying(true);
  }, [step]);

  // Tick for hold mode
  React.useEffect(() => {
    if (isReps || !playing) return;
    if (seconds <= 0) return;
    const id = setTimeout(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => clearTimeout(id);
  }, [isReps, playing, seconds]);

  const pct = isReps ? 0 : ((ex.target - seconds) / ex.target) * 100;
  const isLast = step === total - 1;

  const handleNext = () => {
    if (isLast) onComplete();
    else setStep((s) => s + 1);
  };

  const handlePrev = () => {
    if (step > 0) setStep((s) => s - 1);
  };

  // Overall session progress (completed movements / total)
  const sessionPct = ((step + 1) / total) * 100;

  return (
    <Screen padBottom={40}>
      <ScreenHeader
        left={<button onClick={onClose} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 999, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#FFF' }}>{Icon.close(18)}</button>}
        right={<div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'rgba(255,255,255,0.72)', fontVariantNumeric: 'tabular-nums', letterSpacing: '0.12em' }}>MOV {step + 1}/{total}</div>}
      />

      <div style={{ padding: '0 20px 12px' }}>
        <ProgressBar value={sessionPct} />
      </div>

      <div style={{ padding: '8px 20px 0' }}>
        <div style={{ textAlign: 'center', marginBottom: 14 }}>
          <Eyebrow>Movement {step + 1} of {total}</Eyebrow>
          <h1 style={{
            fontFamily: "'Inter Tight', sans-serif",
            fontSize: 24, fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1.2,
            margin: '10px 0 6px', color: '#FFFFFF',
          }}>
            {ex.name}
          </h1>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.62)' }}>
            {ex.cue} · {isReps ? `${ex.target} reps` : `Hold ${ex.target}s`}
          </div>
        </div>

        {/* Video player */}
        <div style={{
          aspectRatio: '3/4', width: '100%', borderRadius: 20, overflow: 'hidden',
          position: 'relative', marginBottom: 14,
          background: 'linear-gradient(160deg, #1A2740 0%, #0D1429 70%)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}>
          {/* Instructor placeholder */}
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#B4CDFF', opacity: 0.92 }}>
            <object data="../../assets/posture/side.svg" type="image/svg+xml" style={{ height: '78%', pointerEvents: 'none' }} />
          </div>

          {/* Tracking dots overlay (suggesting pose detection) */}
          <svg width="100%" height="100%" viewBox="0 0 300 400" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
            <g fill="#B4CDFF" opacity="0.85">
              <circle cx="150" cy="78"  r="3.5"/>
              <circle cx="150" cy="118" r="2.5"/>
              <circle cx="118" cy="142" r="2.5"/>
              <circle cx="182" cy="142" r="2.5"/>
              <circle cx="150" cy="200" r="2.5"/>
              <circle cx="150" cy="258" r="2.5"/>
            </g>
            <g stroke="#B4CDFF" strokeWidth="1.2" opacity="0.4" fill="none">
              <line x1="150" y1="78"  x2="150" y2="118"/>
              <line x1="118" y1="142" x2="182" y2="142"/>
              <line x1="150" y1="118" x2="150" y2="258"/>
            </g>
          </svg>

          {/* Top overlays: live + instructor tag */}
          <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', alignItems: 'center', gap: 6,
            padding: '4px 10px', borderRadius: 999, background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(8px)',
            fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: '0.16em', color: '#FFF', fontWeight: 600 }}>
            <span style={{ width: 6, height: 6, borderRadius: 999, background: '#F18A8A', boxShadow: '0 0 6px #F18A8A' }}/>
            DEMO
          </div>
          <div style={{ position: 'absolute', top: 12, right: 12,
            padding: '4px 10px', borderRadius: 999, background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(8px)',
            fontSize: 11, color: '#FFF', fontWeight: 500 }}>
            Coach Maya
          </div>

          {/* Video controls bar */}
          <div style={{ position: 'absolute', left: 12, right: 12, bottom: 12,
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '8px 12px', borderRadius: 14,
            background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(10px)' }}>
            <button onClick={() => setPlaying(p => !p)} style={{
              width: 32, height: 32, borderRadius: 999, padding: 0, cursor: 'pointer',
              background: '#B4CDFF', border: 'none', color: '#0D1F3C',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {playing
                ? <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>
                : <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="6,4 20,12 6,20"/></svg>}
            </button>
            <div style={{ flex: 1, height: 3, borderRadius: 2, background: 'rgba(255,255,255,0.18)', overflow: 'hidden' }}>
              <div style={{ width: '38%', height: '100%', background: '#FFFFFF' }}/>
            </div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, color: '#FFF', fontVariantNumeric: 'tabular-nums', letterSpacing: '0.04em' }}>
              0:14 / 0:36
            </div>
          </div>
        </div>

        {/* Counter / Timer — exclusive based on exercise type */}
        <Card style={{ padding: 18, marginBottom: 14, textAlign: 'center' }}>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
            letterSpacing: '0.18em', color: 'rgba(180,205,255,0.75)', marginBottom: 6,
          }}>{isReps ? 'REPS' : 'TIME REMAINING'}</div>

          <div style={{
            fontFamily: "'Inter Tight', sans-serif", fontWeight: 500,
            fontSize: 56, lineHeight: 1, color: '#FFFFFF',
            fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.04em',
          }}>
            {isReps
              ? <span>{ex.target}<span style={{ fontSize: 22, color: 'rgba(255,255,255,0.42)' }}> reps</span></span>
              : <span>{Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2,'0')}</span>}
          </div>

          {!isReps && (
            <React.Fragment>
              <div style={{ height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.08)', margin: '14px 0 14px', overflow: 'hidden' }}>
                <div style={{ width: pct + '%', height: '100%', background: '#B4CDFF', transition: 'width 220ms' }}/>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                <button onClick={() => setSeconds(ex.target)} style={{
                  width: 44, height: 44, borderRadius: 999, padding: 0, cursor: 'pointer',
                  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)',
                  color: '#FFF', fontSize: 13,
                }}>↻</button>
                <button onClick={() => setPlaying(p => !p)} style={{
                  flex: 1, height: 44, borderRadius: 999, padding: '0 22px', cursor: 'pointer',
                  background: '#B4CDFF', border: 'none', color: '#0D1F3C',
                  fontFamily: "'Inter Tight', sans-serif", fontSize: 14, fontWeight: 600, letterSpacing: '0.02em',
                }}>{playing ? 'Pause' : 'Resume'}</button>
              </div>
            </React.Fragment>
          )}
        </Card>

        <div style={{ display: 'flex', alignItems: 'stretch', gap: 10 }}>
          <button
            onClick={handlePrev}
            disabled={step === 0}
            style={{
              width: 56, height: 52, borderRadius: 999, padding: 0, cursor: step === 0 ? 'not-allowed' : 'pointer',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.10)',
              color: '#FFFFFF',
              opacity: step === 0 ? 0.32 : 1,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: "'Inter Tight', sans-serif", fontSize: 18, fontWeight: 500,
              flexShrink: 0,
            }}
            aria-label="Previous movement"
          >←</button>
          <div style={{ flex: 1 }}>
            <PrimaryButton onClick={handleNext}>
              {isLast ? 'Finish session ✓' : 'Next movement →'}
            </PrimaryButton>
          </div>
        </div>
      </div>
    </Screen>
  );
}

window.SessionScreen = SessionScreen;
