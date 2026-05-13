// ALIGN — Today (home) screen — main hub after onboarding
function ReminderToast({ onDismiss, onOpen }) {
  return (
    <div style={{
      position: 'absolute', top: 8, left: 8, right: 8, zIndex: 40,
      animation: 'alignToastIn 420ms cubic-bezier(0.22, 1, 0.36, 1) both',
    }}>
      <style>{`
        @keyframes alignToastIn {
          0%   { transform: translateY(-120%); opacity: 0; }
          70%  { opacity: 1; }
          100% { transform: translateY(0); opacity: 1; }
        }
      `}</style>
      <button
        onClick={onOpen}
        style={{
          width: '100%', textAlign: 'left', cursor: 'pointer',
          padding: '12px 14px',
          borderRadius: 22,
          background: 'rgba(20,40,80,0.78)',
          backdropFilter: 'blur(24px) saturate(140%)',
          WebkitBackdropFilter: 'blur(24px) saturate(140%)',
          border: '1px solid rgba(255,255,255,0.10)',
          boxShadow: '0 12px 32px -8px rgba(0,0,0,0.55)',
          display: 'flex', alignItems: 'center', gap: 12,
          color: '#FFFFFF', fontFamily: "'Inter Tight', sans-serif",
        }}
      >
        {/* App icon */}
        <div style={{
          width: 36, height: 36, borderRadius: 9,
          background: 'linear-gradient(135deg, #B4CDFF 0%, #6F95E0 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <svg width="22" height="22" viewBox="0 0 64 64" fill="none">
            <g stroke="#0D1F3C" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="16,24 32,12 48,24"/>
              <polyline points="16,38 32,26 48,38"/>
              <polyline points="16,52 32,40 48,52"/>
            </g>
          </svg>
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
            <div style={{
              fontSize: 12, fontWeight: 600, letterSpacing: '0.04em',
              color: 'rgba(255,255,255,0.95)',
            }}>ALIGN</div>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5,
              letterSpacing: '0.14em', color: 'rgba(180,205,255,0.75)',
            }}>NOW</div>
          </div>
          <div style={{ fontSize: 13.5, fontWeight: 600, marginTop: 2, letterSpacing: '-0.01em' }}>Time to align</div>
          <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.72)', lineHeight: 1.35, marginTop: 1 }}>
            Your 8 min Cervical mobility session is ready.
          </div>
        </div>

        {/* Dismiss button */}
        <span
          onClick={(e) => { e.stopPropagation(); onDismiss(); }}
          role="button"
          aria-label="Dismiss"
          style={{
            width: 24, height: 24, borderRadius: 999, flexShrink: 0,
            background: 'rgba(255,255,255,0.10)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            color: 'rgba(255,255,255,0.75)', cursor: 'pointer',
          }}
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M6 6l12 12M18 6l-12 12"></path>
          </svg>
        </span>
      </button>
    </div>
  );
}

function TodayScreen({ tab, onTabChange, isPro, retakeCount = 0, goalDays, onOpenSession, onOpenPro, onOpenTracking, onOpenGoal }) {
  const [showToast, setShowToast] = React.useState(false);
  React.useEffect(() => {
    const t = setTimeout(() => setShowToast(true), 1100);
    return () => clearTimeout(t);
  }, []);

  // Today is Thursday in the demo (index 4 if week starts Mon, or index 4 with Sun=0).
  // For consistency with the rest of the app (Sun..Sat array), we treat today as index 4 = Thu.
  const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  // Convert Sun..Sat goalDays into Mon..Sun display order.
  const monSatGoalDays = goalDays
    ? [goalDays[1], goalDays[2], goalDays[3], goalDays[4], goalDays[5], goalDays[6], goalDays[0]]
    : [true, true, true, true, true, false, false];
  const todayIdx = 3; // Thursday in Mon..Sun layout
  // Cadence: how many training days/week the user picked. Default 5.
  const goal = monSatGoalDays.filter(Boolean).length;

  // Focus areas — sourced from the user's assessment. Ordered by severity (worst → best),
  // so the user's most important work lands on their first training day of the week.
  const FOCUS = [
    { id: 'neck',     label: 'Head & neck',    short: 'Cervical mobility',  min: 8, tone: 'danger'  },
    { id: 'thoracic', label: 'Thoracic spine', short: 'Thoracic opener',    min: 9, tone: 'warning' },
    { id: 'shoulder', label: 'Shoulders',      short: 'Shoulder mobility',  min: 7, tone: 'warning' },
    { id: 'lumbar',   label: 'Lumbar spine',   short: 'Lumbar release',     min: 7, tone: 'warning' },
    { id: 'knees',    label: 'Knees',          short: 'Knee tracking',      min: 6, tone: 'warning' },
    { id: 'pelvis',   label: 'Pelvis',         short: 'Pelvis stability',   min: 5, tone: 'success' },
    { id: 'ankles',   label: 'Ankles & feet',  short: 'Ankle mobility',     min: 5, tone: 'success' },
  ];

  // Build week cells with priority-aware scheduling:
  // - Training days get assigned FOCUS items in priority order (worst first).
  // - Rest days are kept as rest but tagged with the lowest-priority "optional bonus" zone.
  let trainingIdx = 0; // how many training days we've assigned so far
  let restIdx = 0;     // how many rest days we've assigned so far
  const week = monSatGoalDays.map((isTraining, i) => {
    if (isTraining) {
      const focus = FOCUS[trainingIdx % FOCUS.length];
      const cell = { d: DAY_LABELS[i], focus, today: i === todayIdx };
      if (i < todayIdx)      cell.done = true;
      else                   cell.scheduled = true;
      trainingIdx += 1;
      return cell;
    }
    // Rest day — assign the lowest-priority "maintenance" zone from the back of FOCUS
    const bonus = FOCUS[FOCUS.length - 1 - (restIdx % FOCUS.length)];
    restIdx += 1;
    return { d: DAY_LABELS[i], rest: true, bonus, today: i === todayIdx };
  });
  const completedThisWeek = week.filter(d => d.done).length;
  const todayCell = week[todayIdx];
  const todayFocus = todayCell.focus || todayCell.bonus;
  const todayDurMin = todayCell.rest ? 4 : (goal >= 6 ? Math.max(5, todayFocus.min - 2) : todayFocus.min);
  const todayExerciseCount = todayCell.rest ? 3 : (goal >= 6 ? 4 : 6);

  // The adaptation message changes tone based on cadence the user picked.
  // - 3-4 sessions: nudge them gently ("would help to add 1-2 more")
  // - 5 sessions:   sweet spot ("adapted to your rhythm")
  // - 6-7 sessions: reassure ("adapted to your committed schedule")
  const cadence =
    goal <= 2 ? { tone: 'light',     headline: 'Light cadence',     body: 'Bumping to 3+ days would unlock visible progress in 4 weeks. Your program adapts either way.', cta: 'Bump goal' } :
    goal <= 4 ? { tone: 'gentle',    headline: 'Gentle pace',       body: 'You\'re on track. Adding 1 more day each week would speed visible changes.',                  cta: 'Adjust goal' } :
    goal === 5 ? { tone: 'sweet',    headline: 'Sweet spot',        body: 'This is the cadence we tune programs for. Sessions adapt to your selected days.',          cta: 'Edit days' } :
    /* 6-7 */    { tone: 'committed', headline: 'Committed schedule', body: 'Your program is set to a higher tempo and shorter sessions to keep you fresh.',          cta: 'Edit days' };
  const toneColor = cadence.tone === 'light' ? '#F2C56B' : cadence.tone === 'gentle' ? '#FFD58A' : '#B4CDFF';
  const toneBg    = cadence.tone === 'light' || cadence.tone === 'gentle' ? 'rgba(242,197,107,0.06)' : 'rgba(180,205,255,0.06)';
  const toneBorder = cadence.tone === 'light' || cadence.tone === 'gentle' ? 'rgba(242,197,107,0.22)' : 'rgba(180,205,255,0.22)';
  // Severity color for the focus chip.
  const focusToneColor = (t) => t === 'danger' ? '#F18A8A' : t === 'warning' ? '#FFD58A' : '#8FE3B5';
  return (
    <Screen padBottom={30}>
      {showToast && (
        <ReminderToast
          onDismiss={() => setShowToast(false)}
          onOpen={() => { setShowToast(false); onOpenSession && onOpenSession(); }}
        />
      )}
      <div style={{ padding: '14px 20px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Full logo lockup */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, color: '#FFFFFF' }}>
          <svg width="24" height="24" viewBox="0 0 64 64" fill="none">
            <g stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="16,24 32,12 48,24"/>
              <polyline points="16,38 32,26 48,38"/>
              <polyline points="16,52 32,40 48,52"/>
            </g>
          </svg>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <div style={{ fontFamily: "'Inter Tight', sans-serif", fontSize: 18, fontWeight: 600, letterSpacing: '0.18em', lineHeight: 1, color: '#FFFFFF' }}>ALIGN</div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 7, letterSpacing: '0.22em', color: 'rgba(180,205,255,0.7)' }}>POSTURE</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Tracking button — opens full tracking screen */}
          <button onClick={onOpenTracking} aria-label="Open tracking" style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            height: 32, padding: '0 12px', borderRadius: 999,
            background: 'rgba(180,205,255,0.14)',
            border: '1px solid rgba(180,205,255,0.35)',
            color: '#B4CDFF', cursor: 'pointer',
            fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
            letterSpacing: '0.16em', fontWeight: 600,
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="20" x2="21" y2="20"/>
              <rect x="5"  y="11" width="3.2" height="9" rx="1"/>
              <rect x="10.4" y="7"  width="3.2" height="13" rx="1"/>
              <rect x="15.8" y="3"  width="3.2" height="17" rx="1"/>
            </svg>
            TRACK
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 999, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
            {Icon.flame(14, '#FFD58A')}
            <span style={{ fontSize: 13, fontWeight: 600, color: '#FFFFFF', fontVariantNumeric: 'tabular-nums' }}>7</span>
          </div>
        </div>
      </div>

      <div style={{ padding: '20px 20px 0' }}>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.62)', marginBottom: 2 }}>Hi,</div>
        <div style={{ fontSize: 17, fontWeight: 600, color: '#FFFFFF', marginBottom: 18 }}>Cameron</div>
        <Eyebrow>Today · day 8</Eyebrow>
        <h1 style={{
          fontFamily: "'Inter Tight', sans-serif",
          fontSize: 34, fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1.1,
          margin: '12px 0 24px', color: '#FFFFFF',
        }}>
          {todayCell.rest
            ? <React.Fragment>A light bonus<br/><span style={{ color: 'rgba(180,205,255,0.85)' }}>or full rest.</span></React.Fragment>
            : <React.Fragment>A short session<br/><span style={{ color: '#B4CDFF' }}>for your {todayFocus.label.toLowerCase()}.</span></React.Fragment>}
        </h1>

        {/* Today's session card */}
        <Card style={{ padding: 20, marginBottom: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 12, color: 'rgba(180,205,255,0.7)', fontWeight: 600, letterSpacing: '0.10em', textTransform: 'uppercase', marginBottom: 6 }}>
                {todayCell.rest ? 'Recovery day' : 'Today\'s session'}
              </div>
              <div style={{ fontSize: 20, fontWeight: 600, color: '#FFFFFF', letterSpacing: '-0.01em', marginBottom: 6 }}>
                {todayCell.rest ? 'Rest & breathe' : todayFocus.short}
              </div>
              {!todayCell.rest && (
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  padding: '3px 8px', borderRadius: 4,
                  background: `${focusToneColor(todayFocus.tone)}1F`,
                  fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5,
                  letterSpacing: '0.12em', color: focusToneColor(todayFocus.tone),
                  fontWeight: 600,
                }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: focusToneColor(todayFocus.tone) }}/>
                  {todayFocus.tone === 'danger' ? 'PRIORITY · WORST ZONE' : todayFocus.tone === 'warning' ? 'PRIORITY FOCUS' : 'MAINTENANCE'}
                </div>
              )}
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', fontVariantNumeric: 'tabular-nums', textAlign: 'right' }}>
              {todayCell.rest
                ? <React.Fragment><div>{todayDurMin} min</div><div>· optional</div></React.Fragment>
                : <React.Fragment><div>{todayDurMin} min</div><div>· {todayExerciseCount} exercises</div></React.Fragment>}
            </div>
          </div>
          {!todayCell.rest && (
            <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
              {Array.from({ length: todayExerciseCount }).map((_, i) => (
                <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.10)' }} />
              ))}
            </div>
          )}
          <PrimaryButton onClick={onOpenSession}>
            {todayCell.rest ? 'Optional: 4 min bonus' : 'Start the session'}
          </PrimaryButton>
        </Card>

        {!isPro && (
          <button onClick={onOpenPro} style={{
            width: '100%', textAlign: 'left',
            padding: 16, marginBottom: 22,
            borderRadius: 14, border: '1px solid rgba(245,230,200,0.20)',
            background: 'rgba(245,230,200,0.06)',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
          }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#F5E6C8', marginBottom: 4 }}>ALIGN Pro</div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.85)', lineHeight: 1.4 }}>Adaptive programs, video coaching, weekly insights.</div>
            </div>
            <span style={{ color: '#F5E6C8' }}>{Icon.arrowRight(18)}</span>
          </button>
        )}

        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: 4,
        }}>
          <Eyebrow>This week</Eyebrow>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
            letterSpacing: '0.12em', color: 'rgba(255,255,255,0.55)',
            fontVariantNumeric: 'tabular-nums',
          }}>{completedThisWeek}/{goal} done</div>
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          {week.map((day, i) => (
            <div key={i} style={{
              flex: 1, aspectRatio: '0.75 / 1',
              borderRadius: 12,
              background: day.done ? 'rgba(180,205,255,0.18)'
                : day.today ? 'rgba(255,255,255,0.08)'
                : day.rest ? 'transparent'
                : 'rgba(255,255,255,0.04)',
              border: `1px solid ${day.today ? 'rgba(180,205,255,0.5)' : day.rest ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.08)'}`,
              borderStyle: day.rest && !day.today ? 'dashed' : 'solid',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between',
              padding: '6px 2px 5px',
            }}>
              <div style={{
                fontSize: 11, fontWeight: 600,
                color: day.today ? '#B4CDFF' : day.rest ? 'rgba(255,255,255,0.30)' : 'rgba(255,255,255,0.62)',
              }}>{day.d}</div>
              <div style={{
                width: 6, height: 6, borderRadius: '50%',
                background: day.done ? '#B4CDFF'
                  : day.today ? '#B4CDFF'
                  : day.rest ? 'rgba(255,255,255,0.18)'
                  : focusToneColor(day.focus.tone),
                opacity: day.rest ? 0.6 : 1,
              }}/>
              <div style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: 7.5,
                color: day.today ? '#B4CDFF' : day.rest ? 'rgba(255,255,255,0.30)' : 'rgba(255,255,255,0.55)',
                letterSpacing: '0.04em', textAlign: 'center', lineHeight: 1.1,
                textTransform: 'uppercase', maxWidth: '100%',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>
                {day.rest ? 'rest' : day.focus.id.slice(0, 4)}
              </div>
            </div>
          ))}
        </div>

        {/* Week's plan — priority-sorted training days, rest days as optional bonus */}
        <div style={{
          marginTop: 14,
          padding: '12px 14px',
          borderRadius: 14,
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.06)',
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: 10,
          }}>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5,
              letterSpacing: '0.16em', color: 'rgba(180,205,255,0.7)',
            }}>THIS WEEK'S PLAN</div>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: 9,
              letterSpacing: '0.12em', color: 'rgba(255,255,255,0.45)',
            }}>SORTED BY PRIORITY</div>
          </div>

          {week.map((day, i) => {
            if (day.rest) {
              return (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '8px 0',
                  borderTop: i === 0 ? 'none' : '1px solid rgba(255,255,255,0.04)',
                  opacity: 0.55,
                }}>
                  <div style={{
                    width: 22, fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
                    letterSpacing: '0.10em', color: 'rgba(255,255,255,0.40)',
                    fontWeight: 600,
                  }}>{day.d}</div>
                  <div style={{
                    width: 5, height: 5, borderRadius: '50%',
                    background: 'rgba(255,255,255,0.18)',
                  }}/>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', fontStyle: 'italic' }}>Rest day · optional {day.bonus.short.toLowerCase()}</div>
                  </div>
                  <div style={{
                    fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5,
                    color: 'rgba(255,255,255,0.35)', letterSpacing: '0.06em',
                  }}>BONUS</div>
                </div>
              );
            }
            const isToday = day.today;
            const tColor = focusToneColor(day.focus.tone);
            return (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '9px 0',
                borderTop: i === 0 ? 'none' : '1px solid rgba(255,255,255,0.04)',
              }}>
                <div style={{
                  width: 22, fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
                  letterSpacing: '0.10em',
                  color: isToday ? '#B4CDFF' : day.done ? 'rgba(255,255,255,0.50)' : 'rgba(255,255,255,0.78)',
                  fontWeight: 600,
                }}>{day.d}{isToday ? ' ·' : ''}</div>
                <div style={{
                  width: 7, height: 7, borderRadius: '50%',
                  background: day.done ? 'rgba(180,205,255,0.5)' : tColor,
                  boxShadow: isToday ? `0 0 8px ${tColor}` : 'none',
                }}/>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: 13.5, color: '#FFFFFF', fontWeight: isToday ? 600 : 500,
                    letterSpacing: '-0.005em',
                  }}>{day.focus.label}</div>
                  <div style={{
                    fontSize: 11.5, color: 'rgba(255,255,255,0.55)', marginTop: 1,
                  }}>{day.focus.short} · {day.focus.min} min</div>
                </div>
                <div style={{
                  fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5,
                  padding: '3px 7px', borderRadius: 4,
                  background: day.done ? 'rgba(180,205,255,0.10)' : `${tColor}1F`,
                  color: day.done ? 'rgba(180,205,255,0.7)' : tColor,
                  letterSpacing: '0.12em', fontWeight: 600,
                }}>{day.done ? 'DONE' : isToday ? 'NOW' : day.focus.tone === 'danger' ? 'P1' : day.focus.tone === 'warning' ? 'P2' : 'MAINT'}</div>
              </div>
            );
          })}

          <div style={{
            marginTop: 10, paddingTop: 10,
            borderTop: '1px solid rgba(255,255,255,0.06)',
            fontSize: 11.5, color: 'rgba(255,255,255,0.55)',
            lineHeight: 1.45,
          }}>
            Highest-priority zones from your assessment land on your training days first. Rest days keep an optional light session for the least-worked zones.
          </div>
        </div>

        {/* Program adaptation notice */}
        <button onClick={onOpenGoal} style={{
          width: '100%', textAlign: 'left', cursor: 'pointer',
          padding: '14px 16px', marginTop: 14,
          borderRadius: 14,
          background: toneBg,
          border: `1px solid ${toneBorder}`,
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: 10,
            background: `${toneColor}22`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={toneColor} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 12h4l3-8 4 16 3-8h2"/>
            </svg>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2,
            }}>
              <div style={{
                fontSize: 13.5, fontWeight: 600, color: '#FFFFFF',
                letterSpacing: '-0.005em',
              }}>{cadence.headline}</div>
              <div style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5,
                padding: '2px 6px', borderRadius: 4,
                background: `${toneColor}22`, color: toneColor,
                letterSpacing: '0.10em',
              }}>{goal}/WEEK</div>
            </div>
            <div style={{
              fontSize: 12, color: 'rgba(255,255,255,0.65)',
              lineHeight: 1.4,
            }}>{cadence.body}</div>
          </div>
          <span style={{ color: toneColor, flexShrink: 0 }}>{Icon.arrowRight(16)}</span>
        </button>

        <div style={{ marginTop: 28, marginBottom: 8 }}><Eyebrow>Tracking</Eyebrow></div>
        <button onClick={onOpenTracking} style={{
          width: '100%', textAlign: 'left', cursor: 'pointer',
          padding: 20, borderRadius: 16,
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 14,
        }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5,
              letterSpacing: '0.16em', color: 'rgba(180,205,255,0.7)', marginBottom: 6,
            }}>POSTURE SCORE · W{4 + retakeCount}</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 4 }}>
              <span style={{ fontFamily: "'Inter Tight', sans-serif", fontSize: 36, fontWeight: 600, color: '#FFFFFF', fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em', lineHeight: 1 }}>{Math.min(95, 72 + retakeCount * 6)}<span style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', fontWeight: 500 }}>/100</span></span>
              <span style={{ fontSize: 12, color: '#8FE3B5', fontWeight: 500 }}>↑ +6</span>
            </div>
            {/* mini sparkline */}
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 18, marginTop: 8 }}>
              {[58, 63, 68, 72].concat(
                Array.from({ length: retakeCount }, (_, k) => Math.min(95, 72 + (k + 1) * 6))
              ).map((v, i, arr) => (
                <div key={i} style={{
                  width: 14, height: `${(v / 100) * 100}%`, borderRadius: 2,
                  background: i === arr.length - 1 ? '#B4CDFF' : 'rgba(180,205,255,0.25)',
                }}/>
              ))}
              <div style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: 9,
                color: 'rgba(255,255,255,0.45)', letterSpacing: '0.10em', marginLeft: 6, alignSelf: 'center',
              }}>{4 + retakeCount} WEEKS</div>
            </div>
          </div>
          <div style={{ color: '#B4CDFF' }}>{Icon.arrowRight(20)}</div>
        </button>
      </div>

      <TabBar active={tab} onChange={onTabChange} isPro={isPro} />
    </Screen>
  );
}

window.TodayScreen = TodayScreen;
