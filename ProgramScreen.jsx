// ALIGN — Program screen — weekly plan + exercise library
// Mirrors the priority-aware scheduling on TodayScreen so the two views stay in sync:
// - The same FOCUS list (worst → best from the assessment)
// - Training days from goalDays are filled with worst-zone-first
// - Rest days carry the lowest-priority "optional bonus" zone
function ProgramScreen({ tab, onTabChange, isPro, goalDays, onOpenSession, onClose, onOpenGoal }) {
  // Shared with TodayScreen — keep these two arrays identical
  const DAY_LABELS_FULL = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const monSatGoalDays = goalDays
    ? [goalDays[1], goalDays[2], goalDays[3], goalDays[4], goalDays[5], goalDays[6], goalDays[0]]
    : [true, true, true, true, true, false, false];
  const todayIdx = 3; // Thursday (matches TodayScreen demo state)
  const goal = monSatGoalDays.filter(Boolean).length;

  const FOCUS = [
    { id: 'neck',     label: 'Head & neck',    short: 'Cervical mobility',  min: 8, tone: 'danger',  count: 12 },
    { id: 'thoracic', label: 'Thoracic spine', short: 'Thoracic opener',    min: 9, tone: 'warning', count: 9  },
    { id: 'shoulder', label: 'Shoulders',      short: 'Shoulder mobility',  min: 7, tone: 'warning', count: 8  },
    { id: 'lumbar',   label: 'Lumbar spine',   short: 'Lumbar release',     min: 7, tone: 'warning', count: 14 },
    { id: 'knees',    label: 'Knees',          short: 'Knee tracking',      min: 6, tone: 'warning', count: 6  },
    { id: 'pelvis',   label: 'Pelvis',         short: 'Pelvis stability',   min: 5, tone: 'success', count: 5  },
    { id: 'ankles',   label: 'Ankles & feet',  short: 'Ankle mobility',     min: 5, tone: 'success', count: 4  },
  ];

  let trainingIdx = 0;
  let restIdx = 0;
  const week = monSatGoalDays.map((isTraining, i) => {
    const dLabel = DAY_LABELS_FULL[i];
    if (isTraining) {
      const focus = FOCUS[trainingIdx % FOCUS.length];
      const cell = { d: dLabel, focus, today: i === todayIdx, training: true };
      if (i < todayIdx)       cell.done = true;
      else                    cell.scheduled = true;
      trainingIdx += 1;
      return cell;
    }
    const bonus = FOCUS[FOCUS.length - 1 - (restIdx % FOCUS.length)];
    restIdx += 1;
    return { d: dLabel, rest: true, bonus, today: i === todayIdx };
  });
  const completedThisWeek = week.filter(d => d.done).length;

  // Distinct focuses present this week (for the Focus areas card list)
  const focusesShown = [];
  const seen = new Set();
  week.forEach(d => {
    const f = d.focus || d.bonus;
    if (!seen.has(f.id)) { seen.add(f.id); focusesShown.push(f); }
  });

  const focusToneColor = (t) => t === 'danger' ? '#F18A8A' : t === 'warning' ? '#FFD58A' : '#8FE3B5';

  // Hero copy adapts to the user's worst zone — same source of truth as Today
  const worstZone = FOCUS[0]; // sorted worst-first
  const planLength = goal >= 6 ? '6 weeks' : goal >= 4 ? '8 weeks' : '12 weeks';

  return (
    <Screen padBottom={40}>
      <div style={{ padding: '14px 20px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={onClose} aria-label="Back to Today" style={{
          background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 999, width: 36, height: 36,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', color: '#FFF',
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
        <div style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
          letterSpacing: '0.18em', color: 'rgba(180,205,255,0.7)',
        }}>WEEK 4 · MAY 10 — MAY 16</div>
        <StatusPill tone="success">ON TRACK</StatusPill>
      </div>

      <div style={{ padding: '14px 20px 0' }}>
        <Eyebrow>Your program</Eyebrow>
        <h1 style={{
          fontFamily: "'Inter Tight', sans-serif",
          fontSize: 30, fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1.15,
          margin: '10px 0 14px', color: '#FFFFFF',
        }}>
          {planLength} to better<br/>
          <span style={{ color: '#B4CDFF' }}>{worstZone.label.toLowerCase()}.</span>
        </h1>

        {/* Schedule sync chip */}
        <button onClick={onOpenGoal} style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '8px 12px', borderRadius: 999,
          background: 'rgba(180,205,255,0.08)',
          border: '1px solid rgba(180,205,255,0.22)',
          color: 'rgba(255,255,255,0.85)', cursor: 'pointer',
          fontFamily: "'Inter Tight', sans-serif", fontSize: 12, fontWeight: 500,
          marginBottom: 22,
        }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#B4CDFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 12h4l3-8 4 16 3-8h2"/>
          </svg>
          <span><span style={{ color: '#B4CDFF', fontWeight: 600 }}>{goal}/week</span> · synced with your weekly goal</span>
          <span style={{ color: 'rgba(255,255,255,0.4)' }}>{Icon.arrowRight(12)}</span>
        </button>

        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          margin: '0 2px 10px',
        }}>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
            letterSpacing: '0.16em', color: 'rgba(255,255,255,0.55)',
          }}>THIS WEEK</div>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
            letterSpacing: '0.10em', color: 'rgba(255,255,255,0.45)',
            fontVariantNumeric: 'tabular-nums',
          }}>{completedThisWeek}/{goal} DONE</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 22 }}>
          {week.map((d, i) => {
            const f = d.focus || d.bonus;
            const tColor = focusToneColor(f.tone);
            const accent = d.today;
            const dim = d.rest;
            return (
              <Card key={i} style={{
                padding: '12px 14px',
                background: accent ? 'rgba(180,205,255,0.10)' : dim ? 'rgba(255,255,255,0.025)' : 'rgba(255,255,255,0.04)',
                borderColor: accent ? 'rgba(180,205,255,0.40)' : dim ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.08)',
                borderStyle: dim ? 'dashed' : 'solid',
                opacity: dim && !d.today ? 0.78 : 1,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 42, gap: 4 }}>
                    <div style={{
                      fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
                      letterSpacing: '0.14em',
                      color: accent ? '#B4CDFF' : d.done ? 'rgba(255,255,255,0.7)' : dim ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.55)',
                      fontWeight: 600,
                    }}>{d.d.toUpperCase()}</div>
                    <div style={{
                      width: 6, height: 6, borderRadius: 999,
                      background: d.done ? 'rgba(143,227,181,0.7)'
                        : accent ? '#B4CDFF'
                        : dim ? 'rgba(255,255,255,0.18)'
                        : tColor,
                    }}/>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <div style={{
                        fontSize: 14.5, color: '#FFFFFF',
                        fontWeight: accent ? 600 : 500,
                        letterSpacing: '-0.005em',
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                      }}>{dim ? 'Rest day' : f.short}</div>
                      <div style={{
                        fontFamily: "'JetBrains Mono', monospace", fontSize: 9,
                        padding: '2px 6px', borderRadius: 4,
                        background: dim ? 'rgba(255,255,255,0.08)' : `${tColor}1F`,
                        color: dim ? 'rgba(255,255,255,0.55)' : tColor,
                        letterSpacing: '0.10em', fontWeight: 600,
                        flexShrink: 0,
                      }}>
                        {d.done ? 'DONE' :
                         accent && !dim ? 'NOW' :
                         dim ? 'BONUS' :
                         f.tone === 'danger' ? 'P1' :
                         f.tone === 'warning' ? 'P2' : 'MAINT'}
                      </div>
                    </div>
                    <div style={{
                      fontSize: 11.5, color: 'rgba(255,255,255,0.55)',
                    }}>
                      {dim
                        ? <>Optional · {f.label.toLowerCase()}</>
                        : <>{f.label} · {goal >= 6 ? Math.max(5, f.min - 2) : f.min} min</>}
                    </div>
                  </div>
                  {d.done ? (
                    <div style={{
                      width: 22, height: 22, borderRadius: '50%',
                      background: 'rgba(143,227,181,0.18)', border: '1px solid rgba(143,227,181,0.4)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8FE3B5',
                    }}>{Icon.check(12, '#8FE3B5')}</div>
                  ) : accent ? (
                    <button onClick={onOpenSession} style={{
                      padding: '6px 12px', borderRadius: 999, cursor: 'pointer',
                      background: '#B4CDFF', color: '#0D1F3C', border: 'none',
                      fontFamily: "'Inter Tight', sans-serif", fontSize: 11.5, fontWeight: 600,
                      letterSpacing: '0.02em',
                    }}>{dim ? 'Try bonus' : 'Start'}</button>
                  ) : (
                    <span style={{ color: dim ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.4)' }}>{Icon.arrowRight(16)}</span>
                  )}
                </div>
              </Card>
            );
          })}
        </div>

        <div style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
          letterSpacing: '0.16em', color: 'rgba(255,255,255,0.55)',
          margin: '0 2px 10px',
        }}>FOCUS AREAS · THIS WEEK</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
          {focusesShown.map((f) => {
            const c = focusToneColor(f.tone);
            return (
              <Card key={f.id} style={{ padding: 14 }}>
                <div style={{
                  fontFamily: "'JetBrains Mono', monospace", fontSize: 8.5,
                  letterSpacing: '0.16em', color: c, marginBottom: 6,
                }}>{f.tone === 'danger' ? 'PRIORITY' : f.tone === 'warning' ? 'ACTIVE' : 'MAINTAIN'}</div>
                <div style={{ fontSize: 13.5, color: '#FFFFFF', fontWeight: 500, marginBottom: 6 }}>{f.label}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)' }}>{f.count} exercises</div>
              </Card>
            );
          })}
        </div>

        <div style={{
          padding: '12px 14px', borderRadius: 12,
          background: 'rgba(180,205,255,0.06)', border: '1px solid rgba(180,205,255,0.18)',
          fontSize: 12, color: 'rgba(255,255,255,0.65)', lineHeight: 1.45,
        }}>
          Sessions are sorted so your worst-scoring zones land on the days you train. Rest days carry a light optional bonus from your least-priority zones.
        </div>
      </div>

    </Screen>
  );
}

window.ProgramScreen = ProgramScreen;
