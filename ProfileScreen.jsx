// ALIGN — Profile screen — user info, settings, account
// Daily reminders row opens a bottom sheet with day-frequency + time controls.

const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const DAY_FULL = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function fmtTime(t) {
  return t.h + ':' + String(t.m).padStart(2, '0') + ' ' + t.p;
}

function ProfileScreen({ tab, onTabChange, isPro, retakeCount = 0, onOpenPro, onClose, onStartRetake, onDeleteAccount, onSignOut, proCancellation, onCancelPro, goalDays: goalDaysProp, onGoalChange, openGoalTrigger }) {
  const [account, setAccount] = React.useState({
    name: 'Cameron',
    email: 'cameron@align.app',
  });
  const [accountSheetOpen, setAccountSheetOpen] = React.useState(false);
  const [subSheetOpen, setSubSheetOpen] = React.useState(false);
  const [subInitialCancel, setSubInitialCancel] = React.useState(false);
  const [privacySheetOpen, setPrivacySheetOpen] = React.useState(false);
  const [helpSheetOpen, setHelpSheetOpen] = React.useState(false);
  const [feedbackSheetOpen, setFeedbackSheetOpen] = React.useState(false);
  const [signOutOpen, setSignOutOpen] = React.useState(false);
  const [profileToast, setProfileToast] = React.useState(null);
  const showProfileToast = (msg) => {
    setProfileToast(msg);
    setTimeout(() => setProfileToast(null), 2400);
  };
  const [reminder, setReminder] = React.useState({
    enabled: true,
    days: 'weekdays',
    customDays: [false, true, true, true, true, true, false],
    times: [{ h: 8, m: 30, p: 'AM' }],
  });
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [goalSheetOpen, setGoalSheetOpen] = React.useState(false);
  // External trigger — when Today/Program tap "Edit days" we want to open the
  // goal sheet immediately rather than landing on the Profile root.
  React.useEffect(() => {
    if (openGoalTrigger) setGoalSheetOpen(true);
  }, [openGoalTrigger]);
  const [photoSheetOpen, setPhotoSheetOpen] = React.useState(false);
  // Weekly goal: which days of the week (Sun..Sat) are training days.
  // If the host passes goalDays + onGoalChange, we use lifted state (Today ↔ Profile sync);
  // otherwise we fall back to local state for standalone preview.
  const [localGoalDays, setLocalGoalDays] = React.useState([false, true, true, true, true, true, false]);
  const goalDays = goalDaysProp || localGoalDays;
  const setGoalDays = onGoalChange || setLocalGoalDays;
  const goal = goalDays.filter(Boolean).length;

  // Photo retake settings — lastTakenDaysAgo resets when the user completes a retake
  const [photo, setPhoto] = React.useState({
    enabled: true,
    intervalWeeks: 4,
    notifyDaysBefore: 2,
    lastTakenDaysAgo: 25,
  });
  // Sync "days ago" to retakeCount: each retake resets it to 1.
  const prevRetakeRef = React.useRef(retakeCount);
  React.useEffect(() => {
    if (retakeCount !== prevRetakeRef.current) {
      prevRetakeRef.current = retakeCount;
      setPhoto((p) => Object.assign({}, p, { lastTakenDaysAgo: 1 }));
    }
  }, [retakeCount]);
  const daysUntilNext = Math.max(0, photo.intervalWeeks * 7 - photo.lastTakenDaysAgo);
  const photoValue = !photo.enabled
    ? 'Off'
    : daysUntilNext === 0
      ? 'Due today'
      : daysUntilNext === 1
        ? 'In 1 day'
        : 'In ' + daysUntilNext + ' days';

  const reminderValue = !reminder.enabled
    ? 'Off'
    : reminder.times.length === 1
      ? fmtTime(reminder.times[0])
      : reminder.times.length + ' times';

  if (sheetOpen) {
    return (
      <ReminderSheet
        value={reminder}
        onChange={setReminder}
        goalDays={goalDays}
        onClose={() => setSheetOpen(false)}
      />
    );
  }

  if (goalSheetOpen) {
    return (
      <GoalSheet
        days={goalDays}
        onChange={setGoalDays}
        onClose={() => setGoalSheetOpen(false)}
      />
    );
  }

  if (photoSheetOpen) {
    return (
      <PhotoRetakeSheet
        value={photo}
        onChange={setPhoto}
        onClose={() => setPhotoSheetOpen(false)}
        onStartRetake={() => { setPhotoSheetOpen(false); onStartRetake && onStartRetake(); }}
      />
    );
  }

  if (accountSheetOpen) {
    return (
      <AccountSheet
        value={account}
        onChange={setAccount}
        onClose={() => setAccountSheetOpen(false)}
      />
    );
  }

  if (subSheetOpen) {
    return (
      <SubscriptionSheet
        isPro={isPro}
        proCancellation={proCancellation}
        onCancelPro={onCancelPro}
        onOpenPro={onOpenPro}
        initialCancel={subInitialCancel}
        onClose={() => { setSubSheetOpen(false); setSubInitialCancel(false); }}
      />
    );
  }

  if (helpSheetOpen) {
    return (
      <HelpCenterSheet
        onClose={() => setHelpSheetOpen(false)}
        onContact={() => { setHelpSheetOpen(false); setFeedbackSheetOpen(true); }}
      />
    );
  }

  if (feedbackSheetOpen) {
    return (
      <FeedbackSheet
        email={account.email}
        onClose={() => setFeedbackSheetOpen(false)}
        onSubmitted={(msg) => { setFeedbackSheetOpen(false); showProfileToast(msg || 'Thanks — we read every note.'); }}
      />
    );
  }

  if (privacySheetOpen) {
    return (
      <PrivacySheet
        isPro={isPro}
        onOpenPro={onOpenPro}
        onDeleteAccount={onDeleteAccount}
        onClose={() => setPrivacySheetOpen(false)}
        onRouteToCancel={() => {
          setPrivacySheetOpen(false);
          setSubInitialCancel(true);
          setSubSheetOpen(true);
        }}
      />
    );
  }

  const items = [
    { group: 'PRACTICE', rows: [
      { label: 'Daily reminders', value: reminderValue, icon: Icon.bell, onClick: () => setSheetOpen(true) },
      { label: 'Weekly goal',     value: goal + ' / week', icon: Icon.calendar, onClick: () => setGoalSheetOpen(true) },
      { label: 'Photo retake',    value: photoValue, icon: Icon.camera, onClick: () => setPhotoSheetOpen(true), accent: photo.enabled && daysUntilNext <= photo.notifyDaysBefore ? '#F5E6C8' : null },
    ]},
    { group: 'ACCOUNT', rows: [
      { label: 'Email',           value: account.email, icon: Icon.user, onClick: () => setAccountSheetOpen(true) },
      { label: 'Subscription',    value: isPro ? 'Pro · monthly' : 'Free', icon: Icon.pro, accent: isPro ? '#F5E6C8' : null, onClick: () => setSubSheetOpen(true) },
      { label: 'Data & privacy',  value: 'Manage',   icon: Icon.shield || Icon.body, onClick: () => setPrivacySheetOpen(true) },
    ]},
    { group: 'SUPPORT', rows: [
      { label: 'Help center',     value: '',         icon: Icon.help || Icon.body, onClick: () => setHelpSheetOpen(true) },
      { label: 'Send feedback',   value: '',         icon: Icon.chat || Icon.body, onClick: () => setFeedbackSheetOpen(true) },
      { label: 'Sign out',        value: '',         icon: Icon.body, danger: true, onClick: () => setSignOutOpen(true) },
    ]},
  ];

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
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <div style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
          letterSpacing: '0.18em', color: 'rgba(180,205,255,0.7)',
        }}>PROFILE</div>
        <div style={{ width: 36 }}></div>
      </div>

      <div style={{ padding: '14px 20px 0' }}>
        {/* User card */}
        <Card style={{ padding: 20, marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 56, height: 56, borderRadius: 999,
              background: 'linear-gradient(135deg, #B4CDFF 0%, #6F95E0 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: "'Inter Tight', sans-serif", fontSize: 22, fontWeight: 600,
              color: '#0D1F3C',
            }}>C</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 18, fontWeight: 600, color: '#FFFFFF' }}>Cameron</div>
              <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.55)', marginTop: 2 }}>{account.email}</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginTop: 16 }}>
            {[
              { k: 'STREAK',   v: '7d'  },
              { k: 'SESSIONS', v: '23'  },
              { k: 'SCORE',    v: '72'  },
            ].map((s) => (
              <div key={s.k} style={{
                padding: '10px 12px', borderRadius: 12,
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)',
              }}>
                <div style={{
                  fontFamily: "'JetBrains Mono', monospace", fontSize: 8.5,
                  letterSpacing: '0.16em', color: 'rgba(180,205,255,0.7)', marginBottom: 4,
                }}>{s.k}</div>
                <div style={{
                  fontFamily: "'Inter Tight', sans-serif", fontSize: 18, fontWeight: 600,
                  color: '#FFFFFF', fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em', lineHeight: 1,
                }}>{s.v}</div>
              </div>
            ))}
          </div>
        </Card>

        {!isPro && (
          <button onClick={onOpenPro} style={{
            width: '100%', textAlign: 'left', cursor: 'pointer',
            padding: 16, marginBottom: 18,
            borderRadius: 14, border: '1px solid rgba(245,230,200,0.20)',
            background: 'rgba(245,230,200,0.06)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
          }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#F5E6C8', marginBottom: 4 }}>ALIGN Pro</div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.85)', lineHeight: 1.4 }}>Unlock adaptive programs and weekly insights.</div>
            </div>
            <span style={{ color: '#F5E6C8' }}>{Icon.arrowRight(18)}</span>
          </button>
        )}

        {items.map((g) => (
          <div key={g.group} style={{ marginBottom: 18 }}>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
              letterSpacing: '0.16em', color: 'rgba(255,255,255,0.55)',
              margin: '0 2px 8px',
            }}>{g.group}</div>
            <Card style={{ padding: 0, overflow: 'hidden' }}>
              {g.rows.map((r, i) => (
                <div
                  key={r.label}
                  onClick={r.onClick}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '14px 16px',
                    borderTop: i === 0 ? 'none' : '1px solid rgba(255,255,255,0.06)',
                    cursor: r.onClick ? 'pointer' : 'default',
                  }}
                >
                  <div style={{
                    width: 28, height: 28, borderRadius: 8,
                    background: 'rgba(255,255,255,0.05)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: r.danger ? '#F18A8A' : r.accent || 'rgba(180,205,255,0.85)',
                  }}>{(r.icon || Icon.body)(14, r.danger ? '#F18A8A' : r.accent || 'rgba(180,205,255,0.85)')}</div>
                  <div style={{ flex: 1, fontSize: 14, color: r.danger ? '#F18A8A' : '#FFFFFF', fontWeight: 500 }}>{r.label}</div>
                  {r.value && <div style={{ fontSize: 12.5, color: r.accent || 'rgba(255,255,255,0.55)', fontVariantNumeric: 'tabular-nums' }}>{r.value}</div>}
                  <span style={{ color: 'rgba(255,255,255,0.3)' }}>{Icon.arrowRight(14)}</span>
                </div>
              ))}
            </Card>
          </div>
        ))}

        <div style={{
          textAlign: 'center', fontSize: 11, color: 'rgba(255,255,255,0.35)',
          fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.14em', marginTop: 8,
        }}>ALIGN · v1.0.0</div>
      </div>

      {signOutOpen && (
        <SignOutDialog
          onCancel={() => setSignOutOpen(false)}
          onConfirm={() => { setSignOutOpen(false); if (onSignOut) { onSignOut(); } else { showProfileToast('Signed out.'); onClose && onClose(); } }}
        />
      )}

      {profileToast && (
        <div style={{
          position: 'absolute', left: 20, right: 20, bottom: 28,
          padding: '12px 14px', borderRadius: 12,
          background: 'rgba(255,255,255,0.10)',
          border: '1px solid rgba(255,255,255,0.14)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          color: '#FFFFFF',
          fontFamily: "'Inter Tight', sans-serif",
          fontSize: 13.5, fontWeight: 500, letterSpacing: '-0.005em',
          textAlign: 'center',
          boxShadow: '0 12px 40px rgba(0,0,0,0.45)',
          zIndex: 50,
        }}>{profileToast}</div>
      )}

    </Screen>
  );
}

// ─────────────── Reminder bottom sheet ───────────────
function ReminderSheet({ value, onChange, goalDays, onClose }) {
  const [editingIdx, setEditingIdx] = React.useState(0);

  const time = value.times[editingIdx] || value.times[0];

  // Resolve which days the reminder actually fires on, based on frequency mode.
  const activeDays = (() => {
    if (value.days === 'daily')    return [true, true, true, true, true, true, true];
    if (value.days === 'weekdays') return [false, true, true, true, true, true, false];
    if (value.days === 'training' && goalDays) return goalDays;
    return value.customDays;
  })();

  const patchTime = (patch) => {
    const next = value.times.map((t, i) => i === editingIdx ? Object.assign({}, t, patch) : t);
    onChange(Object.assign({}, value, { times: next }));
  };

  const addTime = () => {
    if (value.times.length >= 4) return;
    const next = value.times.concat([{ h: 9, m: 0, p: 'PM' }]);
    onChange(Object.assign({}, value, { times: next }));
    setEditingIdx(next.length - 1);
  };

  const removeTime = (i) => {
    if (value.times.length <= 1) return;
    const next = value.times.filter((_, j) => j !== i);
    onChange(Object.assign({}, value, { times: next }));
    if (editingIdx >= next.length) setEditingIdx(next.length - 1);
  };

  const setDays = (mode) => onChange(Object.assign({}, value, { days: mode }));

  const toggleCustomDay = (i) => {
    // Tapping a day always lands the user in 'custom' mode, forking from whatever
    // the current resolved day set is (training-days, weekdays, daily, etc).
    const cd = activeDays.slice();
    cd[i] = !cd[i];
    onChange(Object.assign({}, value, { days: 'custom', customDays: cd }));
  };

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 30,
      background: 'radial-gradient(120% 80% at 50% 28%, #2E4878 0%, #1B3460 50%, #142850 100%)',
      display: 'flex', flexDirection: 'column',
      fontFamily: "'Inter Tight', sans-serif", color: '#FFFFFF',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '60px 20px 12px',
      }}>
        <button
          onClick={onClose}
          aria-label="Back"
          style={{
            width: 36, height: 36, borderRadius: 999,
            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: '#FFF', padding: 0,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <div style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
          letterSpacing: '0.18em', color: 'rgba(180,205,255,0.7)',
        }}>REMINDERS</div>
        <div style={{ width: 36 }}></div>
      </div>

      <div style={{ padding: '4px 20px 0' }}>
        <div style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-0.02em', marginBottom: 4 }}>Daily reminders</div>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', marginBottom: 18 }}>Set how often and when ALIGN reminds you to practice.</div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 24px' }}>
        <div>
          {/* Master toggle */}
          {/* Master toggle */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 16px', borderRadius: 14,
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.06)',
            marginBottom: 18,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 28, height: 28, borderRadius: 8,
                background: 'rgba(180,205,255,0.10)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#B4CDFF',
              }}>{Icon.bell ? Icon.bell(14, '#B4CDFF') : null}</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 500 }}>Reminders</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', marginTop: 1 }}>
                  {value.enabled ? value.times.map(fmtTime).join(' · ') : 'Off'}
                </div>
              </div>
            </div>
            <Toggle on={value.enabled} onChange={(v) => onChange(Object.assign({}, value, { enabled: v }))}/>
          </div>

          <div style={{ opacity: value.enabled ? 1 : 0.4, pointerEvents: value.enabled ? 'auto' : 'none', transition: 'opacity 200ms' }}>
            <SheetLabel>FREQUENCY</SheetLabel>
            <div style={{
              display: 'flex', gap: 6, padding: 4,
              borderRadius: 12, background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.06)',
              marginBottom: 12,
            }}>
              {[
                { id: 'training', label: 'Training' },
                { id: 'daily',    label: 'Every day' },
                { id: 'weekdays', label: 'Weekdays'  },
                { id: 'custom',   label: 'Custom'    },
              ].map((opt) => {
                const active = value.days === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setDays(opt.id)}
                    style={{
                      flex: 1, padding: '9px 6px',
                      borderRadius: 9, border: 'none', cursor: 'pointer',
                      background: active ? '#B4CDFF' : 'transparent',
                      color: active ? '#0D1F3C' : 'rgba(255,255,255,0.75)',
                      fontFamily: "'Inter Tight', sans-serif",
                      fontSize: 12.5, fontWeight: active ? 600 : 500,
                      letterSpacing: '-0.01em',
                      transition: 'background 160ms, color 160ms',
                      whiteSpace: 'nowrap',
                    }}
                  >{opt.label}</button>
                );
              })}
            </div>

            {/* Helper line when locked to training days */}
            {value.days === 'training' ? (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '10px 12px', borderRadius: 10,
                background: 'rgba(180,205,255,0.08)',
                border: '1px solid rgba(180,205,255,0.18)',
                marginBottom: 10,
                fontSize: 12, color: 'rgba(255,255,255,0.78)',
                lineHeight: 1.4,
              }}>
                <div style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: '#B4CDFF', flexShrink: 0,
                }}></div>
                <div>Synced with your weekly goal. Edit your training days in <span style={{ color: '#FFFFFF', fontWeight: 500 }}>Weekly goal</span>.</div>
              </div>
            ) : null}

            {/* Day-of-week pills */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6, marginBottom: 22 }}>
              {DAY_LABELS.map((d, i) => {
                const on = activeDays[i];
                return (
                  <button
                    key={i}
                    onClick={() => toggleCustomDay(i)}
                    style={{
                      height: 36, borderRadius: 10,
                      border: '1px solid ' + (on ? '#B4CDFF' : 'rgba(255,255,255,0.10)'),
                      background: on ? 'rgba(180,205,255,0.16)' : 'rgba(255,255,255,0.03)',
                      color: on ? '#FFFFFF' : 'rgba(255,255,255,0.50)',
                      fontFamily: "'Inter Tight', sans-serif",
                      fontSize: 13, fontWeight: 600, letterSpacing: '0.02em',
                      cursor: 'pointer', padding: 0,
                      transition: 'background 160ms, border-color 160ms, color 160ms',
                    }}
                  >{d}</button>
                );
              })}
            </div>

            {/* Time controls (steppers) */}
            <SheetLabel>TIME</SheetLabel>
            <div style={{
              borderRadius: 16,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.06)',
              padding: '16px 14px',
              marginBottom: 14,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            }}>
              <Stepper
                value={time.h}
                onChange={(h) => patchTime({ h })}
                onUp={() => patchTime({ h: time.h === 12 ? 1 : time.h + 1 })}
                onDown={() => patchTime({ h: time.h === 1 ? 12 : time.h - 1 })}
                display={String(time.h)}
                label="hr"
              />
              <div style={{ fontSize: 30, fontWeight: 600, color: 'rgba(255,255,255,0.55)', fontVariantNumeric: 'tabular-nums', paddingBottom: 14 }}>:</div>
              <Stepper
                onUp={() => patchTime({ m: (time.m + 5) % 60 })}
                onDown={() => patchTime({ m: (time.m + 55) % 60 })}
                display={String(time.m).padStart(2, '0')}
                label="min"
              />
              <div style={{ width: 8 }}></div>
              <Stepper
                onUp={() => patchTime({ p: time.p === 'AM' ? 'PM' : 'AM' })}
                onDown={() => patchTime({ p: time.p === 'AM' ? 'PM' : 'AM' })}
                display={time.p}
                label="am/pm"
                wide
              />
            </div>

            {/* Scheduled times */}
            <SheetLabel>SCHEDULED</SheetLabel>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
              {value.times.map((t, i) => {
                const active = i === editingIdx;
                return (
                  <div
                    key={i}
                    onClick={() => setEditingIdx(i)}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 8,
                      padding: '8px 6px 8px 12px', borderRadius: 999,
                      background: active ? 'rgba(180,205,255,0.18)' : 'rgba(255,255,255,0.05)',
                      border: '1px solid ' + (active ? '#B4CDFF' : 'rgba(255,255,255,0.08)'),
                      cursor: 'pointer',
                      fontSize: 13, fontWeight: 500,
                      color: active ? '#FFFFFF' : 'rgba(255,255,255,0.75)',
                      fontVariantNumeric: 'tabular-nums',
                      transition: 'background 160ms, border-color 160ms',
                    }}
                  >
                    <span>{fmtTime(t)}</span>
                    {value.times.length > 1 && (
                      <button
                        onClick={(e) => { e.stopPropagation(); removeTime(i); }}
                        aria-label="Remove time"
                        style={{
                          width: 20, height: 20, borderRadius: 999, padding: 0,
                          background: 'rgba(255,255,255,0.08)', border: 'none',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          cursor: 'pointer', color: 'rgba(255,255,255,0.85)',
                        }}
                      >
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                          <path d="M6 6l12 12M18 6l-12 12"></path>
                        </svg>
                      </button>
                    )}
                  </div>
                );
              })}
              {value.times.length < 4 && (
                <button
                  onClick={addTime}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    padding: '8px 14px', borderRadius: 999,
                    background: 'transparent',
                    border: '1px dashed rgba(180,205,255,0.40)',
                    cursor: 'pointer',
                    fontFamily: "'Inter Tight', sans-serif",
                    fontSize: 13, fontWeight: 500,
                    color: '#B4CDFF',
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                    <path d="M12 5v14M5 12h14"></path>
                  </svg>
                  Add time
                </button>
              )}
            </div>
          </div>
        </div>

        <div style={{ padding: '8px 20px 0' }}>
          <button
            onClick={onClose}
            style={{
              width: '100%', padding: '14px 16px', borderRadius: 14,
              background: '#B4CDFF', color: '#0D1F3C',
              border: 'none', cursor: 'pointer',
              fontFamily: "'Inter Tight', sans-serif",
              fontSize: 15, fontWeight: 600, letterSpacing: '-0.01em',
            }}
          >Done</button>
        </div>
      </div>
    </div>
  );
}

const inputCss = {
  width: '100%', padding: '12px 14px', borderRadius: 12,
  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)',
  color: '#FFFFFF', fontFamily: "'Inter Tight', sans-serif", fontSize: 15, outline: 'none',
  boxSizing: 'border-box',
};

function SheetLabel({ children }) {
  return (
    <div style={{
      fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
      letterSpacing: '0.16em', color: 'rgba(255,255,255,0.55)',
      margin: '0 2px 8px',
    }}>{children}</div>
  );
}

function Toggle({ on, onChange }) {
  return (
    <button
      role="switch"
      aria-checked={on}
      onClick={() => onChange(!on)}
      style={{
        width: 46, height: 28, borderRadius: 999, padding: 2,
        border: 'none', cursor: 'pointer',
        background: on ? '#B4CDFF' : 'rgba(255,255,255,0.14)',
        display: 'flex', alignItems: 'center',
        transition: 'background 200ms',
      }}
    >
      <div style={{
        width: 24, height: 24, borderRadius: 999,
        background: '#FFFFFF',
        transform: on ? 'translateX(18px)' : 'translateX(0)',
        transition: 'transform 200ms cubic-bezier(0.22, 1, 0.36, 1)',
        boxShadow: '0 2px 4px rgba(0,0,0,0.25)',
      }}></div>
    </button>
  );
}

function Stepper({ onUp, onDown, display, label, wide }) {
  const btnStyle = {
    width: 36, height: 30, borderRadius: 8, padding: 0,
    background: 'rgba(180,205,255,0.10)',
    border: '1px solid rgba(180,205,255,0.18)',
    color: '#B4CDFF', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <button onClick={onUp} aria-label={'increase ' + label} style={btnStyle}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 15 12 9 18 15"></polyline>
        </svg>
      </button>
      <div style={{
        minWidth: wide ? 64 : 56, height: 48,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        borderRadius: 10,
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.10)',
        fontFamily: "'Inter Tight', sans-serif",
        fontSize: wide ? 18 : 26, fontWeight: 600,
        letterSpacing: '-0.02em',
        fontVariantNumeric: 'tabular-nums',
        color: '#FFFFFF',
      }}>{display}</div>
      <button onClick={onDown} aria-label={'decrease ' + label} style={btnStyle}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>
    </div>
  );
}

// ─────────────── Weekly goal sheet ───────────────
function GoalSheet({ days, onChange, onClose }) {
  const options = [3, 4, 5, 6, 7];
  const value = days.filter(Boolean).length;
  const labels = {
    0: 'Rest week', 1: 'One day', 2: 'Light',
    3: 'Gentle', 4: 'Steady', 5: 'Consistent',
    6: 'Committed', 7: 'Every day',
  };
  const blurbs = {
    0: 'Pick at least one day to start building a habit.',
    1: 'One day a week — a starting point.',
    2: 'Two days a week — gentle entry.',
    3: 'A light cadence — perfect for easing in or a recovery week.',
    4: 'A balanced rhythm with room for rest days.',
    5: 'The sweet spot for steady, measurable progress.',
    6: 'A serious habit — visible change in 4 weeks.',
    7: 'Daily practice. Best for fast results and chronic pain.',
  };

  // Quick preset: fill N weekday-first slots (Mon..Fri, then Sat, then Sun)
  const setCount = (n) => {
    const order = [1, 2, 3, 4, 5, 6, 0];
    const next = [false, false, false, false, false, false, false];
    order.slice(0, n).forEach((idx) => { next[idx] = true; });
    onChange(next);
  };

  const toggleDay = (i) => {
    const next = days.slice();
    next[i] = !next[i];
    onChange(next);
  };

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 30,
      background: 'radial-gradient(120% 80% at 50% 28%, #2E4878 0%, #1B3460 50%, #142850 100%)',
      display: 'flex', flexDirection: 'column',
      fontFamily: "'Inter Tight', sans-serif", color: '#FFFFFF',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '60px 20px 12px',
      }}>
        <button
          onClick={onClose}
          aria-label="Back"
          style={{
            width: 36, height: 36, borderRadius: 999,
            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: '#FFF', padding: 0,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <div style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
          letterSpacing: '0.18em', color: 'rgba(180,205,255,0.7)',
        }}>WEEKLY GOAL</div>
        <div style={{ width: 36 }}></div>
      </div>

      <div style={{ padding: '4px 20px 0' }}>
        <div style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-0.02em', marginBottom: 4 }}>Weekly goal</div>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', marginBottom: 22 }}>How many practice sessions a week are you aiming for?</div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 24px' }}>
        {/* Selector */}
        <div style={{
          padding: 20, borderRadius: 16,
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)',
          marginBottom: 18,
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14,
        }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span style={{
              fontFamily: "'Inter Tight', sans-serif",
              fontSize: 64, fontWeight: 600,
              letterSpacing: '-0.04em', lineHeight: 1,
              color: '#FFFFFF',
              fontVariantNumeric: 'tabular-nums',
            }}>{value}</span>
            <span style={{
              fontSize: 14, color: 'rgba(255,255,255,0.55)', fontWeight: 500,
            }}>/ week</span>
          </div>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
            letterSpacing: '0.18em', color: '#B4CDFF',
          }}>{labels[value]}</div>

          {/* Quick preset pills */}
          <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
            {options.map((n) => {
              const active = n === value;
              return (
                <button
                  key={n}
                  onClick={() => setCount(n)}
                  style={{
                    width: 40, height: 40, borderRadius: 999, padding: 0,
                    border: '1px solid ' + (active ? '#B4CDFF' : 'rgba(255,255,255,0.10)'),
                    background: active ? '#B4CDFF' : 'rgba(255,255,255,0.04)',
                    color: active ? '#0D1F3C' : 'rgba(255,255,255,0.75)',
                    fontFamily: "'Inter Tight', sans-serif",
                    fontSize: 15, fontWeight: 600,
                    cursor: 'pointer',
                    fontVariantNumeric: 'tabular-nums',
                    transition: 'background 160ms, color 160ms, border-color 160ms',
                  }}
                >{n}</button>
              );
            })}
          </div>
        </div>

        {/* Description */}
        <div style={{
          padding: 16, borderRadius: 14,
          background: 'rgba(180,205,255,0.06)', border: '1px solid rgba(180,205,255,0.14)',
          marginBottom: 18,
          fontSize: 13.5, lineHeight: 1.45,
          color: 'rgba(255,255,255,0.82)',
        }}>{blurbs[value]}</div>

        {/* Training days — tappable to customize */}
        <SheetLabel>TRAINING DAYS · TAP TO CUSTOMIZE</SheetLabel>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6, marginBottom: 24 }}>
          {DAY_LABELS.map((d, i) => {
            const on = days[i];
            return (
              <button
                key={i}
                onClick={() => toggleDay(i)}
                style={{
                  aspectRatio: '1 / 1', borderRadius: 10, padding: 0,
                  border: '1px solid ' + (on ? '#B4CDFF' : 'rgba(255,255,255,0.10)'),
                  background: on ? 'rgba(180,205,255,0.18)' : 'rgba(255,255,255,0.03)',
                  color: on ? '#FFFFFF' : 'rgba(255,255,255,0.50)',
                  fontFamily: "'Inter Tight', sans-serif",
                  fontSize: 13, fontWeight: 600,
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center', gap: 3,
                  cursor: 'pointer',
                  transition: 'background 160ms, border-color 160ms, color 160ms',
                }}>
                <span>{d}</span>
                <span style={{
                  width: 4, height: 4, borderRadius: '50%',
                  background: on ? '#B4CDFF' : 'rgba(255,255,255,0.18)',
                }}></span>
              </button>
            );
          })}
        </div>

        <button
          onClick={onClose}
          style={{
            width: '100%', padding: '14px 16px', borderRadius: 14,
            background: '#B4CDFF', color: '#0D1F3C',
            border: 'none', cursor: 'pointer',
            fontFamily: "'Inter Tight', sans-serif",
            fontSize: 15, fontWeight: 600, letterSpacing: '-0.01em',
          }}
        >Save goal</button>
      </div>
    </div>
  );
}

// ─────────────── Photo retake sheet ───────────────
function PhotoRetakeSheet({ value, onChange, onClose, onStartRetake }) {
  const intervalOptions = [2, 4, 6, 8, 12];
  const intervalLabels = {
    2: 'Bi-weekly', 4: 'Monthly', 6: '6 weeks', 8: '2 months', 12: 'Quarterly',
  };
  const notifyOptions = [0, 1, 2, 3, 7];

  const totalDays = value.intervalWeeks * 7;
  const daysSince = value.lastTakenDaysAgo;
  const daysUntil = Math.max(0, totalDays - daysSince);
  const progress = Math.min(1, daysSince / totalDays);
  const willNotify = value.enabled && daysUntil <= value.notifyDaysBefore;

  const patch = (p) => onChange(Object.assign({}, value, p));

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 30,
      background: 'radial-gradient(120% 80% at 50% 28%, #2E4878 0%, #1B3460 50%, #142850 100%)',
      display: 'flex', flexDirection: 'column',
      fontFamily: "'Inter Tight', sans-serif", color: '#FFFFFF',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '60px 20px 12px',
      }}>
        <button
          onClick={onClose}
          aria-label="Back"
          style={{
            width: 36, height: 36, borderRadius: 999,
            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: '#FFF', padding: 0,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <div style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
          letterSpacing: '0.18em', color: 'rgba(180,205,255,0.7)',
        }}>PHOTO RETAKE</div>
        <div style={{ width: 36 }}></div>
      </div>

      <div style={{ padding: '4px 20px 0' }}>
        <div style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-0.02em', marginBottom: 4 }}>Photo retake</div>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', marginBottom: 22 }}>Track your posture progress with periodic photo check-ins.</div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 24px' }}>
        {/* Master toggle */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 16px', borderRadius: 14,
          background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.06)',
          marginBottom: 18,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 28, height: 28, borderRadius: 8,
              background: 'rgba(180,205,255,0.10)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#B4CDFF',
            }}>{Icon.camera(14, '#B4CDFF')}</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 500 }}>Photo check-ins</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', marginTop: 1 }}>
                {value.enabled ? 'Every ' + value.intervalWeeks + ' weeks' : 'Off'}
              </div>
            </div>
          </div>
          <Toggle on={value.enabled} onChange={(v) => patch({ enabled: v })}/>
        </div>

        <div style={{ opacity: value.enabled ? 1 : 0.4, pointerEvents: value.enabled ? 'auto' : 'none', transition: 'opacity 200ms' }}>

          {/* Next check-in card */}
          <div style={{
            padding: 18, borderRadius: 16,
            background: willNotify
              ? 'linear-gradient(135deg, rgba(245,230,200,0.14) 0%, rgba(245,230,200,0.04) 100%)'
              : 'rgba(255,255,255,0.04)',
            border: '1px solid ' + (willNotify ? 'rgba(245,230,200,0.30)' : 'rgba(255,255,255,0.06)'),
            marginBottom: 18,
          }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 14 }}>
              <div>
                <div style={{
                  fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
                  letterSpacing: '0.18em', color: willNotify ? '#F5E6C8' : 'rgba(180,205,255,0.7)',
                  marginBottom: 6,
                }}>NEXT CHECK-IN</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                  <span style={{
                    fontSize: 38, fontWeight: 600, letterSpacing: '-0.03em', lineHeight: 1,
                    color: '#FFFFFF', fontVariantNumeric: 'tabular-nums',
                  }}>{daysUntil}</span>
                  <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', fontWeight: 500 }}>
                    {daysUntil === 1 ? 'day' : 'days'}
                  </span>
                </div>
              </div>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: willNotify ? 'rgba(245,230,200,0.16)' : 'rgba(180,205,255,0.10)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: willNotify ? '#F5E6C8' : '#B4CDFF',
              }}>{Icon.camera(20, willNotify ? '#F5E6C8' : '#B4CDFF')}</div>
            </div>

            {/* Progress bar */}
            <div style={{
              height: 6, borderRadius: 999,
              background: 'rgba(255,255,255,0.06)',
              overflow: 'hidden', marginBottom: 10,
            }}>
              <div style={{
                width: (progress * 100) + '%', height: '100%',
                borderRadius: 999,
                background: willNotify ? '#F5E6C8' : '#B4CDFF',
                transition: 'width 240ms',
              }}></div>
            </div>
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              fontSize: 11.5, color: 'rgba(255,255,255,0.55)',
              fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.08em',
            }}>
              <span>{daysSince}D AGO</span>
              <span>EVERY {totalDays}D</span>
            </div>

            {willNotify && (
              <div style={{
                marginTop: 14, padding: '10px 12px',
                borderRadius: 10,
                background: 'rgba(245,230,200,0.10)',
                border: '1px solid rgba(245,230,200,0.18)',
                display: 'flex', alignItems: 'center', gap: 10,
                fontSize: 12.5, color: '#F5E6C8', lineHeight: 1.35,
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
                <span>You'll get a reminder {daysUntil === 0 ? 'today' : daysUntil === 1 ? 'tomorrow' : 'in ' + (daysUntil - value.notifyDaysBefore < 0 ? 0 : daysUntil - value.notifyDaysBefore) + ' days'} to take your check-in photo.</span>
              </div>
            )}
          </div>

          {/* Interval selector */}
          <SheetLabel>FREQUENCY</SheetLabel>
          <div style={{
            display: 'flex', gap: 6, padding: 4,
            borderRadius: 12, background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.06)',
            marginBottom: 22,
          }}>
            {intervalOptions.map((n) => {
              const active = n === value.intervalWeeks;
              return (
                <button
                  key={n}
                  onClick={() => patch({ intervalWeeks: n })}
                  style={{
                    flex: 1, padding: '10px 4px',
                    borderRadius: 9, border: 'none', cursor: 'pointer',
                    background: active ? '#B4CDFF' : 'transparent',
                    color: active ? '#0D1F3C' : 'rgba(255,255,255,0.75)',
                    fontFamily: "'Inter Tight', sans-serif",
                    fontSize: 12, fontWeight: active ? 600 : 500,
                    letterSpacing: '-0.01em',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
                    transition: 'background 160ms, color 160ms',
                  }}
                >
                  <span style={{ fontSize: 14, fontWeight: 600 }}>{n}w</span>
                  <span style={{ fontSize: 9.5, opacity: 0.75 }}>{intervalLabels[n]}</span>
                </button>
              );
            })}
          </div>

          {/* Notify before */}
          <SheetLabel>NOTIFY ME BEFORE</SheetLabel>
          <div style={{
            display: 'flex', gap: 6,
            marginBottom: 12,
          }}>
            {notifyOptions.map((n) => {
              const active = n === value.notifyDaysBefore;
              const label = n === 0 ? 'Day of' : n === 1 ? '1 day' : n + ' days';
              return (
                <button
                  key={n}
                  onClick={() => patch({ notifyDaysBefore: n })}
                  style={{
                    flex: 1, padding: '10px 4px',
                    borderRadius: 10, cursor: 'pointer',
                    background: active ? 'rgba(180,205,255,0.18)' : 'rgba(255,255,255,0.04)',
                    border: '1px solid ' + (active ? '#B4CDFF' : 'rgba(255,255,255,0.08)'),
                    color: active ? '#FFFFFF' : 'rgba(255,255,255,0.65)',
                    fontFamily: "'Inter Tight', sans-serif",
                    fontSize: 12.5, fontWeight: 600, letterSpacing: '-0.01em',
                    transition: 'background 160ms, border-color 160ms, color 160ms',
                  }}
                >{label}</button>
              );
            })}
          </div>
          <div style={{
            fontSize: 12, color: 'rgba(255,255,255,0.50)',
            margin: '0 2px 22px', lineHeight: 1.4,
          }}>
            {value.notifyDaysBefore === 0
              ? "We'll notify you the day your photo is due."
              : "We'll send a heads-up " + (value.notifyDaysBefore === 1 ? '1 day' : value.notifyDaysBefore + ' days') + ' before so you have time to plan it.'}
          </div>

          {/* Last photo */}
          <SheetLabel>LAST PHOTO</SheetLabel>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '14px 16px', borderRadius: 14,
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)',
            marginBottom: 18,
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: 10,
              background: 'linear-gradient(135deg, rgba(180,205,255,0.18) 0%, rgba(180,205,255,0.04) 100%)',
              border: '1px solid rgba(180,205,255,0.20)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#B4CDFF',
            }}>{Icon.camera(18, '#B4CDFF')}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 500 }}>Apr {Math.max(1, 17 - daysSince % 30)}, 2026</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', marginTop: 1 }}>{daysSince} days ago</div>
            </div>
            <button
              onClick={onStartRetake}
              style={{
                padding: '8px 12px', borderRadius: 10,
                background: '#B4CDFF', color: '#0D1F3C',
                border: 'none', cursor: 'pointer',
                fontFamily: "'Inter Tight', sans-serif",
                fontSize: 12.5, fontWeight: 600,
              }}
            >Retake now</button>
          </div>
        </div>

        <button
          onClick={onClose}
          style={{
            width: '100%', padding: '14px 16px', borderRadius: 14,
            background: '#B4CDFF', color: '#0D1F3C',
            border: 'none', cursor: 'pointer',
            fontFamily: "'Inter Tight', sans-serif",
            fontSize: 15, fontWeight: 600, letterSpacing: '-0.01em',
          }}
        >Done</button>
      </div>
    </div>
  );
}

// ─────────────── Subscription sheet ───────────────
const IconReceipt = (s = 22, c = 'currentColor') => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 3h16v18l-3-2-2 2-2-2-2 2-2-2-3 2z"/>
    <line x1="8" y1="8" x2="16" y2="8"/>
    <line x1="8" y1="12" x2="16" y2="12"/>
    <line x1="8" y1="16" x2="12" y2="16"/>
  </svg>
);
const IconCard = (s = 22, c = 'currentColor') => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2.5" y="5.5" width="19" height="14" rx="2"/>
    <line x1="2.5" y1="10" x2="21.5" y2="10"/>
    <line x1="6" y1="15" x2="10" y2="15"/>
  </svg>
);

function SubscriptionSheet({ isPro, onOpenPro, onClose, initialCancel, proCancellation, onCancelPro }) {
  const [cancelOpen, setCancelOpen] = React.useState(!!initialCancel);
  const [cancelStep, setCancelStep] = React.useState(1);
  const [cancelReason, setCancelReason] = React.useState(null);
  const [offerAccepted, setOfferAccepted] = React.useState(false);
  const [planSwitchOpen, setPlanSwitchOpen] = React.useState(false);
  const [billingOpen, setBillingOpen] = React.useState(false);
  const [payOpen, setPayOpen] = React.useState(false);
  const [methods, setMethods] = React.useState([
    { id: 'apple', kind: 'Apple Pay', detail: '•••• 4242', primary: true },
    { id: 'visa',  kind: 'Visa',      detail: '•••• 0117', primary: false },
  ]);
  const [addCardOpen, setAddCardOpen] = React.useState(false);
  const [newCard, setNewCard] = React.useState({ number: '', name: '', exp: '', cvc: '' });
  const primaryMethod = methods.find(m => m.primary) || methods[0];
  const [plan, setPlan] = React.useState('monthly'); // 'monthly' | 'annual'
  const [restoring, setRestoring] = React.useState(false);
  const [toast, setToast] = React.useState(null);

  const planLabel = plan === 'annual' ? 'Annual' : 'Monthly';
  const planPrice = plan === 'annual' ? '$59.99 / year' : '$6.99 / month';
  const renewDate = plan === 'annual' ? 'May 11, 2027' : 'June 11, 2026';

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  };
  const setPrimary = (id) => {
    setMethods(methods.map(m => Object.assign({}, m, { primary: m.id === id })));
    showToast('Default payment updated.');
  };
  const removeMethod = (id) => {
    const next = methods.filter(m => m.id !== id);
    if (next.length && !next.some(m => m.primary)) next[0].primary = true;
    setMethods(next);
    showToast('Payment method removed.');
  };
  const addCard = () => {
    const last4 = (newCard.number.replace(/\s/g,'').slice(-4) || '0000');
    const id = 'card-' + Date.now();
    setMethods([...methods.map(m => Object.assign({}, m, { primary: false })), { id, kind: 'Card', detail: '•••• ' + last4, primary: true }]);
    setNewCard({ number: '', name: '', exp: '', cvc: '' });
    setAddCardOpen(false);
    showToast('Card added and set as default.');
  };

  const confirmCancel = () => {
    setCancelOpen(false);
    setCancelStep(1);
    setCancelReason(null);
    setOfferAccepted(false);
    // Lift cancellation up to the host — isPro flips to false immediately, but we record
    // the cancel date + the date Pro access actually runs out, so the free-view banner can show both.
    if (onCancelPro) onCancelPro({ cancelledAt: 'May 12, 2026', accessUntil: renewDate });
    showToast('Subscription ended. Pro access continues until ' + renewDate + '.');
  };

  const startCancelFlow = () => {
    setCancelStep(1);
    setCancelReason(null);
    setOfferAccepted(false);
    setCancelOpen(true);
  };

  const acceptOffer = (msg) => {
    setOfferAccepted(true);
    setCancelOpen(false);
    setCancelStep(1);
    setCancelReason(null);
    showToast(msg);
  };

  const restore = () => {
    setRestoring(true);
    setTimeout(() => {
      setRestoring(false);
      showToast('No purchases to restore.');
    }, 1000);
  };

  // Header
  const Header = ({ title }) => (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '60px 20px 12px',
    }}>
      <button
        onClick={cancelOpen ? () => { if (cancelStep > 1) { setCancelStep(cancelStep - 1); } else { setCancelOpen(false); setCancelReason(null); setCancelStep(1); } } : planSwitchOpen ? () => setPlanSwitchOpen(false) : billingOpen ? () => setBillingOpen(false) : addCardOpen ? () => setAddCardOpen(false) : payOpen ? () => setPayOpen(false) : onClose}
        aria-label="Back"
        style={{
          width: 36, height: 36, borderRadius: 999,
          background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', color: '#FFF', padding: 0,
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>
      <div style={{
        fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
        letterSpacing: '0.18em', color: 'rgba(180,205,255,0.7)',
      }}>{title}</div>
      <div style={{ width: 36 }}></div>
    </div>
  );

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 30,
      background: 'radial-gradient(120% 80% at 50% 28%, #2E4878 0%, #1B3460 50%, #142850 100%)',
      display: 'flex', flexDirection: 'column',
      fontFamily: "'Inter Tight', sans-serif", color: '#FFFFFF',
    }}>
      <Header title={cancelOpen ? ('CANCEL · STEP ' + cancelStep + ' OF 3') : planSwitchOpen ? 'CHANGE PLAN' : billingOpen ? 'BILLING HISTORY' : addCardOpen ? 'ADD CARD' : payOpen ? 'PAYMENT METHODS' : 'SUBSCRIPTION'} />

      {payOpen && !addCardOpen && (
        <div style={{ flex: 1, overflowY: 'auto', padding: '4px 20px 24px' }}>
          <div style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-0.02em', marginBottom: 6 }}>Payment methods</div>
          <div style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.65)', marginBottom: 18, lineHeight: 1.5 }}>
            Choose how your subscription is billed. Tap a method to make it default.
          </div>
          <Card style={{ padding: 0, overflow: 'hidden', marginBottom: 16 }}>
            {methods.map((m, i) => (
              <div key={m.id} style={{
                padding: '14px 16px',
                borderTop: i === 0 ? 'none' : '1px solid rgba(255,255,255,0.06)',
                display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer',
              }} onClick={() => !m.primary && setPrimary(m.id)}>
                <div style={{ color: '#B4CDFF' }}>{IconCard(22, '#B4CDFF')}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14.5, fontWeight: 500 }}>{m.kind}</div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11.5, color: 'rgba(255,255,255,0.55)', letterSpacing: '0.04em', marginTop: 2 }}>{m.detail}</div>
                </div>
                {m.primary ? (
                  <span style={{
                    fontFamily: "'JetBrains Mono', monospace", fontSize: 9,
                    padding: '3px 7px', borderRadius: 4,
                    background: 'rgba(159,221,168,0.16)', color: '#9FDDA8',
                    letterSpacing: '0.14em',
                  }}>DEFAULT</span>
                ) : (
                  <button onClick={(e) => { e.stopPropagation(); removeMethod(m.id); }} style={{
                    background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.5)',
                    fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.14em',
                    cursor: 'pointer', padding: '4px 6px',
                  }}>REMOVE</button>
                )}
              </div>
            ))}
          </Card>
          <button onClick={() => setAddCardOpen(true)} style={{
            width: '100%', padding: '14px 16px', borderRadius: 14,
            background: 'rgba(180,205,255,0.10)', border: '1px dashed rgba(180,205,255,0.32)',
            color: '#FFFFFF', fontFamily: "'Inter Tight', sans-serif", fontSize: 14.5, fontWeight: 500,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}>+ Add a new card</button>
          <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.45)', lineHeight: 1.5, margin: '14px 4px 0' }}>
            Cards are tokenised and never stored on device. Apple Pay subscriptions are managed by Apple.
          </div>
        </div>
      )}

      {addCardOpen && (
        <div style={{ flex: 1, overflowY: 'auto', padding: '4px 20px 24px' }}>
          <div style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-0.02em', marginBottom: 6 }}>Add a card</div>
          <div style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.65)', marginBottom: 18, lineHeight: 1.5 }}>
            New card becomes your default payment method.
          </div>
          <Card style={{ padding: 16, marginBottom: 16 }}>
            <SheetLabel>Card number</SheetLabel>
            <input value={newCard.number} onChange={(e) => setNewCard({ ...newCard, number: e.target.value })} placeholder="1234 5678 9012 3456" inputMode="numeric" style={inputCss} />
            <div style={{ height: 12 }}></div>
            <SheetLabel>Cardholder name</SheetLabel>
            <input value={newCard.name} onChange={(e) => setNewCard({ ...newCard, name: e.target.value })} placeholder="Cameron Lee" style={inputCss} />
            <div style={{ height: 12 }}></div>
            <div style={{ display: 'flex', gap: 12 }}>
              <div style={{ flex: 1 }}>
                <SheetLabel>Expiry</SheetLabel>
                <input value={newCard.exp} onChange={(e) => setNewCard({ ...newCard, exp: e.target.value })} placeholder="MM / YY" inputMode="numeric" style={inputCss} />
              </div>
              <div style={{ flex: 1 }}>
                <SheetLabel>CVC</SheetLabel>
                <input value={newCard.cvc} onChange={(e) => setNewCard({ ...newCard, cvc: e.target.value })} placeholder="123" inputMode="numeric" style={inputCss} />
              </div>
            </div>
          </Card>
          <button onClick={addCard} disabled={!newCard.number || !newCard.name || !newCard.exp || !newCard.cvc} style={{
            width: '100%', height: 52, borderRadius: 999, border: 'none',
            background: (!newCard.number || !newCard.name || !newCard.exp || !newCard.cvc) ? 'rgba(255,255,255,0.32)' : '#FFFFFF',
            color: '#0D1F3C', fontFamily: "'Inter Tight', sans-serif", fontSize: 15.5, fontWeight: 600, letterSpacing: '-0.01em',
            cursor: 'pointer',
          }}>Save card</button>
        </div>
      )}

      {billingOpen && (
        <div style={{ flex: 1, overflowY: 'auto', padding: '4px 20px 24px' }}>
          <div style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-0.02em', marginBottom: 6 }}>Billing history</div>
          <div style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.65)', marginBottom: 18, lineHeight: 1.5 }}>
            All payments and refunds on your ALIGN account.
          </div>

          <Card style={{ padding: 0, overflow: 'hidden', marginBottom: 16 }}>
            {[
              { date: 'May 11, 2026', desc: 'ALIGN Pro · Monthly', amount: '$6.99', status: 'PAID', method: 'Apple Pay · •••• 4242' },
              { date: 'Apr 11, 2026', desc: 'ALIGN Pro · Monthly', amount: '$6.99', status: 'PAID', method: 'Apple Pay · •••• 4242' },
              { date: 'Mar 11, 2026', desc: 'ALIGN Pro · Monthly', amount: '$6.99', status: 'PAID', method: 'Apple Pay · •••• 4242' },
              { date: 'Feb 11, 2026', desc: 'ALIGN Pro · Monthly', amount: '$6.99', status: 'PAID', method: 'Apple Pay · •••• 4242' },
              { date: 'Jan 11, 2026', desc: 'ALIGN Pro · Monthly', amount: '$6.99', status: 'PAID', method: 'Apple Pay · •••• 4242' },
            ].map((tx, i) => (
              <div key={i} onClick={() => showToast('Receipt sent to your email.')} style={{
                padding: '14px 16px',
                borderTop: i === 0 ? 'none' : '1px solid rgba(255,255,255,0.06)',
                cursor: 'pointer',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                  <div style={{ fontSize: 14.5, fontWeight: 500, color: '#FFFFFF' }}>{tx.desc}</div>
                  <div style={{ fontSize: 14.5, fontWeight: 600, color: '#FFFFFF', fontVariantNumeric: 'tabular-nums' }}>{tx.amount}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.04em' }}>{tx.date}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>{tx.method}</span>
                    <span style={{
                      fontFamily: "'JetBrains Mono', monospace", fontSize: 9,
                      padding: '2px 6px', borderRadius: 4,
                      background: 'rgba(159,221,168,0.16)', color: '#9FDDA8',
                      letterSpacing: '0.12em',
                    }}>{tx.status}</span>
                  </div>
                </div>
              </div>
            ))}
          </Card>

          <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.45)', lineHeight: 1.5, margin: '0 4px' }}>
            Tap a row to email yourself a receipt. Payments are handled by Apple — full invoices live in Settings → Apple ID → Subscriptions.
          </div>
        </div>
      )}

      {!cancelOpen && !planSwitchOpen && !billingOpen && !payOpen && !addCardOpen && (
        <div style={{ flex: 1, overflowY: 'auto', padding: '4px 20px 24px' }}>
          <div style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-0.02em', marginBottom: 4 }}>Subscription</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', marginBottom: 22 }}>
            {isPro ? 'Manage your ALIGN Pro plan.' : (proCancellation ? 'Your Pro plan is winding down.' : 'Upgrade to unlock everything.')}
          </div>

          {/* Cancellation banner — only when Pro was just cancelled and access still has runway */}
          {!isPro && proCancellation && (
            <div style={{
              padding: 16, borderRadius: 16,
              background: 'linear-gradient(135deg, rgba(245,230,200,0.10), rgba(245,230,200,0.03))',
              border: '1px solid rgba(245,230,200,0.22)',
              marginBottom: 14,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{
                  fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5,
                  letterSpacing: '0.18em', color: '#F5E6C8',
                }}>PRO ACCESS WINDING DOWN</div>
                <div style={{
                  fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5,
                  padding: '3px 8px', borderRadius: 6,
                  background: 'rgba(245,200,150,0.16)', color: '#F5C896',
                  letterSpacing: '0.12em',
                }}>ENDING</div>
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <div style={{ flex: 1, padding: '11px 12px', borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{
                    fontFamily: "'JetBrains Mono', monospace", fontSize: 9,
                    letterSpacing: '0.16em', color: 'rgba(255,255,255,0.5)', marginBottom: 4,
                  }}>CANCELLED ON</div>
                  <div style={{ fontSize: 13.5, fontWeight: 600, letterSpacing: '-0.005em', color: '#FFFFFF' }}>{proCancellation.cancelledAt}</div>
                </div>
                <div style={{ flex: 1, padding: '11px 12px', borderRadius: 10, background: 'rgba(245,230,200,0.08)', border: '1px solid rgba(245,230,200,0.22)' }}>
                  <div style={{
                    fontFamily: "'JetBrains Mono', monospace", fontSize: 9,
                    letterSpacing: '0.16em', color: '#F5E6C8', marginBottom: 4,
                  }}>PRO UNTIL</div>
                  <div style={{ fontSize: 13.5, fontWeight: 600, letterSpacing: '-0.005em', color: '#FFFFFF' }}>{proCancellation.accessUntil}</div>
                </div>
              </div>

              <div style={{
                fontSize: 12, color: 'rgba(255,255,255,0.6)',
                lineHeight: 1.5, marginTop: 12,
              }}>
                You'll keep every Pro feature through <span style={{ color: '#FFFFFF', fontWeight: 500 }}>{proCancellation.accessUntil}</span>. After that you'll move to the Free plan automatically — no further charges.
              </div>

              <button
                onClick={() => { onClose(); onOpenPro && onOpenPro(); }}
                style={{
                  width: '100%', padding: '11px 16px', borderRadius: 12,
                  background: 'rgba(245,230,200,0.14)',
                  border: '1px solid rgba(245,230,200,0.35)',
                  color: '#F5E6C8', cursor: 'pointer',
                  fontFamily: "'Inter Tight', sans-serif",
                  fontSize: 13.5, fontWeight: 600, letterSpacing: '-0.005em',
                  marginTop: 14,
                }}
              >Resume Pro</button>
            </div>
          )}

          {/* Plan card */}
          <div style={{
            padding: 18, borderRadius: 16,
            background: isPro ? 'linear-gradient(135deg, rgba(245,230,200,0.10), rgba(245,230,200,0.04))' : 'rgba(255,255,255,0.04)',
            border: '1px solid ' + (isPro ? 'rgba(245,230,200,0.22)' : 'rgba(255,255,255,0.08)'),
            marginBottom: 16,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <div style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5,
                letterSpacing: '0.18em', color: isPro ? '#F5E6C8' : 'rgba(180,205,255,0.7)',
              }}>{isPro ? 'CURRENT PLAN' : 'CURRENT PLAN'}</div>
              {isPro && (
                <div style={{
                  fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5,
                  padding: '3px 8px', borderRadius: 6,
                  background: 'rgba(159,221,168,0.16)', color: '#9FDDA8',
                  letterSpacing: '0.12em',
                }}>ACTIVE</div>
              )}
            </div>
            <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em', marginBottom: 4 }}>
              {isPro ? 'ALIGN Pro · ' + planLabel : 'Free'}
            </div>
            <div style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.65)' }}>
              {isPro ? planPrice + ' · Renews ' + renewDate : (proCancellation ? 'Starts ' + proCancellation.accessUntil + ' · basic sessions only.' : 'Basic sessions and weekly summary.')}
            </div>
          </div>

          {isPro ? (
            <React.Fragment>
              {/* Manage actions */}
              <Card style={{ padding: 0, overflow: 'hidden', marginBottom: 16 }}>
                <SubRow icon={Icon.calendar} label="Change plan" value={plan === 'annual' ? 'Annual' : 'Monthly'} onClick={() => setPlanSwitchOpen(true)} />
                <SubRow icon={IconCard} label="Payment method" value={primaryMethod.kind + ' · ' + primaryMethod.detail} onClick={() => setPayOpen(true)} />
                <SubRow icon={IconReceipt} label="Billing history" value="5 payments" onClick={() => setBillingOpen(true)} />
                <SubRow icon={Icon.body} label="Restore purchases" value={restoring ? 'Checking…' : 'Restore'} onClick={restore} />
              </Card>

              <button
                onClick={startCancelFlow}
                style={{
                  width: '100%', padding: '14px 16px', borderRadius: 14,
                  background: 'rgba(241,138,138,0.08)',
                  border: '1px solid rgba(241,138,138,0.22)',
                  color: '#F18A8A', cursor: 'pointer',
                  fontFamily: "'Inter Tight', sans-serif",
                  fontSize: 14.5, fontWeight: 500,
                }}
              >Cancel subscription</button>

              <div style={{
                fontSize: 11.5, color: 'rgba(255,255,255,0.45)',
                lineHeight: 1.5, margin: '16px 4px 0',
              }}>
                Subscription auto-renews unless canceled at least 24 hours before the end of the current period. Manage through Settings → Apple ID.
              </div>
            </React.Fragment>
          ) : (
            <React.Fragment>
              {/* Pro benefits */}
              <div style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
                letterSpacing: '0.16em', color: 'rgba(255,255,255,0.55)',
                margin: '4px 2px 10px',
              }}>WHAT YOU GET</div>
              <Card style={{ padding: 16, marginBottom: 16 }}>
                {[
                  'Adaptive program that evolves with you',
                  'Unlimited photo retakes & history',
                  'Weekly recap & personalized insights',
                  'Full exercise library (500+)',
                ].map((b, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'flex-start', gap: 10,
                    padding: '8px 0', borderTop: i === 0 ? 'none' : '1px solid rgba(255,255,255,0.05)',
                  }}>
                    <span style={{ color: '#F5E6C8', marginTop: 2, flexShrink: 0 }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    </span>
                    <span style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.85)', lineHeight: 1.45 }}>{b}</span>
                  </div>
                ))}
              </Card>

              <button
                onClick={() => { onClose(); onOpenPro && onOpenPro(); }}
                style={{
                  width: '100%', padding: '14px 16px', borderRadius: 14,
                  background: '#F5E6C8', color: '#3A2A0A',
                  border: 'none', cursor: 'pointer',
                  fontFamily: "'Inter Tight', sans-serif",
                  fontSize: 15, fontWeight: 600, letterSpacing: '-0.01em',
                  marginBottom: 10,
                }}
              >Upgrade to Pro</button>

              <button
                onClick={restore}
                style={{
                  width: '100%', padding: '12px 16px', borderRadius: 12,
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.10)',
                  color: 'rgba(255,255,255,0.85)', cursor: 'pointer',
                  fontFamily: "'Inter Tight', sans-serif",
                  fontSize: 14, fontWeight: 500,
                }}
              >{restoring ? 'Checking…' : 'Restore purchases'}</button>
            </React.Fragment>
          )}
        </div>
      )}

      {planSwitchOpen && (
        <div style={{ flex: 1, overflowY: 'auto', padding: '4px 20px 24px' }}>
          <div style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-0.02em', marginBottom: 6 }}>Change plan</div>
          <div style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.65)', marginBottom: 22, lineHeight: 1.5 }}>
            Switch billing cycle. Annual saves about 29%.
          </div>

          {[
            { id: 'monthly', name: 'Monthly', price: '$6.99', sub: 'Billed every month', save: null },
            { id: 'annual',  name: 'Annual',  price: '$59.99', sub: 'Billed once a year · $4.99/mo equivalent', save: 'SAVE 29%' },
          ].map((p) => {
            const active = plan === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setPlan(p.id)}
                style={{
                  width: '100%', padding: 16, borderRadius: 14,
                  background: active ? 'rgba(245,230,200,0.08)' : 'rgba(255,255,255,0.03)',
                  border: '1px solid ' + (active ? 'rgba(245,230,200,0.35)' : 'rgba(255,255,255,0.08)'),
                  marginBottom: 10, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
                  textAlign: 'left',
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                    <span style={{ fontSize: 16, fontWeight: 600, color: '#FFFFFF' }}>{p.name}</span>
                    {p.save && (
                      <span style={{
                        fontFamily: "'JetBrains Mono', monospace", fontSize: 9,
                        padding: '2px 6px', borderRadius: 4,
                        background: 'rgba(159,221,168,0.16)', color: '#9FDDA8',
                        letterSpacing: '0.12em',
                      }}>{p.save}</span>
                    )}
                  </div>
                  <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.55)' }}>{p.sub}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                  <div style={{ fontSize: 16, fontWeight: 600, color: '#FFFFFF', fontVariantNumeric: 'tabular-nums' }}>{p.price}</div>
                  <div style={{
                    width: 18, height: 18, borderRadius: 999,
                    border: '2px solid ' + (active ? '#F5E6C8' : 'rgba(255,255,255,0.25)'),
                    background: active ? '#F5E6C8' : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {active && (
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#3A2A0A" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    )}
                  </div>
                </div>
              </button>
            );
          })}

          <button
            onClick={() => { setPlanSwitchOpen(false); showToast('Plan updated to ' + (plan === 'annual' ? 'Annual' : 'Monthly') + '.'); }}
            style={{
              width: '100%', padding: '14px 16px', borderRadius: 14,
              background: '#B4CDFF', color: '#0D1F3C',
              border: 'none', cursor: 'pointer',
              fontFamily: "'Inter Tight', sans-serif",
              fontSize: 15, fontWeight: 600, letterSpacing: '-0.01em',
              marginTop: 18,
            }}
          >Confirm change</button>
        </div>
      )}

      {cancelOpen && (
        <CancelFlow
          step={cancelStep}
          setStep={setCancelStep}
          reason={cancelReason}
          setReason={setCancelReason}
          renewDate={renewDate}
          onAcceptOffer={acceptOffer}
          onConfirmCancel={confirmCancel}
          onKeep={() => { setCancelOpen(false); setCancelStep(0); setCancelReason(null); showToast('Glad you stayed. Your Pro plan continues.'); }}
        />
      )}

      {toast && (
        <div style={{
          position: 'absolute', left: 16, right: 16, bottom: 28,
          padding: '12px 14px', borderRadius: 12,
          background: 'rgba(15,30,55,0.95)',
          border: '1px solid rgba(255,255,255,0.10)',
          color: '#FFFFFF', fontSize: 13.5, lineHeight: 1.4,
          boxShadow: '0 14px 40px rgba(0,0,0,0.45)',
        }}>{toast}</div>
      )}
    </div>
  );
}

function CancelFlow({ step, setStep, reason, setReason, renewDate, onAcceptOffer, onConfirmCancel, onKeep }) {
  const reasons = [
    { id: 'expensive', label: 'Too expensive',           sub: 'The price doesn\'t fit my budget right now' },
    { id: 'results',   label: 'Not seeing enough results', sub: 'My posture isn\'t improving fast enough' },
    { id: 'time',      label: 'Not using it enough',     sub: 'I can\'t find time for daily sessions' },
    { id: 'alt',       label: 'Found an alternative',    sub: 'Using another app or working with a therapist' },
    { id: 'break',     label: 'Taking a break',          sub: 'I\'ll come back later' },
    { id: 'other',     label: 'Something else',          sub: 'Another reason not listed here' },
  ];

  // Step 0 — Reason picker
  if (step === 0) {
    return (
      <div style={{ flex: 1, overflowY: 'auto', padding: '4px 20px 24px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-0.02em', marginBottom: 6 }}>Before you go…</div>
        <div style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.65)', marginBottom: 18, lineHeight: 1.5 }}>
          Help us understand what's not working. We may have a fix that doesn't involve canceling.
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
          {reasons.map(r => {
            const selected = reason === r.id;
            return (
              <button
                key={r.id}
                onClick={() => setReason(r.id)}
                style={{
                  textAlign: 'left', padding: '14px 16px', borderRadius: 14,
                  background: selected ? 'rgba(180,205,255,0.12)' : 'rgba(255,255,255,0.04)',
                  border: '1px solid ' + (selected ? 'rgba(180,205,255,0.55)' : 'rgba(255,255,255,0.08)'),
                  color: '#FFFFFF', cursor: 'pointer',
                  fontFamily: "'Inter Tight', sans-serif",
                  display: 'flex', alignItems: 'flex-start', gap: 12,
                }}
              >
                <div style={{
                  marginTop: 3, flexShrink: 0, width: 18, height: 18, borderRadius: 999,
                  border: '1.5px solid ' + (selected ? '#B4CDFF' : 'rgba(255,255,255,0.30)'),
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: selected ? '#B4CDFF' : 'transparent',
                }}>
                  {selected && (
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5L4 7L8 3" stroke="#0D1F3C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14.5, fontWeight: 500, marginBottom: 2 }}>{r.label}</div>
                  <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.55)', lineHeight: 1.35 }}>{r.sub}</div>
                </div>
              </button>
            );
          })}
        </div>

        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button
            onClick={() => setStep(1)}
            disabled={!reason}
            style={{
              width: '100%', padding: '14px 16px', borderRadius: 14,
              background: reason ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.14)',
              color: reason ? '#FFFFFF' : 'rgba(255,255,255,0.35)',
              cursor: reason ? 'pointer' : 'not-allowed',
              fontFamily: "'Inter Tight', sans-serif",
              fontSize: 14.5, fontWeight: 500,
            }}
          >Continue</button>
          <button
            onClick={onKeep}
            style={{
              width: '100%', padding: '14px 16px', borderRadius: 14,
              background: '#B4CDFF', color: '#0D1F3C', border: 'none', cursor: 'pointer',
              fontFamily: "'Inter Tight', sans-serif",
              fontSize: 15, fontWeight: 600, letterSpacing: '-0.01em',
            }}
          >Keep my Pro plan</button>
        </div>
      </div>
    );
  }

  // Step 1 — Tailored offer
  if (step === 1) {
    const offer = getOffer(reason);
    return (
      <div style={{ flex: 1, overflowY: 'auto', padding: '4px 20px 24px', display: 'flex', flexDirection: 'column' }}>
        <div style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
          letterSpacing: '0.20em', color: 'rgba(180,205,255,0.75)', marginBottom: 10,
        }}>{offer.eyebrow}</div>
        <div style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-0.02em', marginBottom: 8, lineHeight: 1.15 }}>{offer.title}</div>
        <div style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.65)', marginBottom: 18, lineHeight: 1.5 }}>{offer.body}</div>

        <Card accent={true} style={{ padding: 18, marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 6 }}>
            <div style={{ fontSize: 32, fontWeight: 600, letterSpacing: '-0.03em', color: '#B4CDFF' }}>{offer.headline}</div>
            {offer.sub && (
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)' }}>{offer.sub}</div>
            )}
          </div>
          <div style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.75)', lineHeight: 1.45, marginBottom: 14 }}>{offer.detail}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {offer.bullets.map((b, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <span style={{ marginTop: 6, flexShrink: 0, width: 4, height: 4, borderRadius: 999, background: '#B4CDFF' }}></span>
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.80)', lineHeight: 1.45 }}>{b}</span>
              </div>
            ))}
          </div>
        </Card>

        <div style={{
          padding: 14, borderRadius: 12,
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.06)',
          marginBottom: 18,
        }}>
          <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.65)', lineHeight: 1.5, fontStyle: 'italic' }}>
            "{offer.testimonial}"
          </div>
          <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.40)', marginTop: 6, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.08em' }}>
            — {offer.testimonialAuthor}
          </div>
        </div>

        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button
            onClick={() => onAcceptOffer(offer.successMsg)}
            style={{
              width: '100%', padding: '14px 16px', borderRadius: 14,
              background: '#B4CDFF', color: '#0D1F3C', border: 'none', cursor: 'pointer',
              fontFamily: "'Inter Tight', sans-serif",
              fontSize: 15, fontWeight: 600, letterSpacing: '-0.01em',
            }}
          >{offer.cta}</button>
          <button
            onClick={() => setStep(2)}
            style={{
              width: '100%', padding: '14px 16px', borderRadius: 14,
              background: 'transparent', border: '1px solid rgba(255,255,255,0.14)',
              color: 'rgba(255,255,255,0.65)', cursor: 'pointer',
              fontFamily: "'Inter Tight', sans-serif",
              fontSize: 13.5, fontWeight: 500,
            }}
          >No thanks, continue canceling</button>
        </div>
      </div>
    );
  }

  // Step 2 — Why are you leaving us (deeper feedback)
  if (step === 2) {
    return <FeedbackStep reason={reason} renewDate={renewDate} onContinue={() => setStep(3)} onKeep={onKeep} />;
  }

  // Step 3 — Final confirmation
  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '4px 20px 24px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-0.02em', marginBottom: 6 }}>Last step.</div>
      <div style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.65)', marginBottom: 14, lineHeight: 1.5 }}>
        You'll keep Pro access until <span style={{ color: '#FFFFFF', fontWeight: 500 }}>{renewDate}</span>. On that day your account moves to Free — your program reverts to generic exercises and your photo history becomes read-only.
      </div>

      <div style={{
        padding: '12px 14px', borderRadius: 12,
        background: 'rgba(180,205,255,0.08)',
        border: '1px solid rgba(180,205,255,0.22)',
        marginBottom: 18,
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: 'rgba(180,205,255,0.18)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <rect x="2.5" y="3.5" width="13" height="12" rx="2" stroke="#B4CDFF" strokeWidth="1.4" />
            <path d="M2.5 7H15.5" stroke="#B4CDFF" strokeWidth="1.4" />
            <path d="M6 2V5M12 2V5" stroke="#B4CDFF" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5,
            letterSpacing: '0.18em', color: 'rgba(180,205,255,0.85)', marginBottom: 2,
          }}>DOWNGRADES TO FREE ON</div>
          <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: '-0.01em', color: '#FFFFFF' }}>{renewDate}</div>
        </div>
      </div>

      <Card style={{ padding: 16, marginBottom: 14 }}>
        <div style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
          letterSpacing: '0.16em', color: 'rgba(180,205,255,0.7)', marginBottom: 10,
        }}>YOUR PROGRESS SO FAR</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {[
            { v: '24', l: 'Sessions completed' },
            { v: '12d', l: 'Current streak' },
            { v: '+18%', l: 'Posture score gain' },
            { v: '6.4h', l: 'Total mobility' },
          ].map((s, i) => (
            <div key={i} style={{
              padding: 12, borderRadius: 10,
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}>
              <div style={{ fontSize: 20, fontWeight: 600, letterSpacing: '-0.02em', color: '#B4CDFF' }}>{s.v}</div>
              <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.55)', marginTop: 2 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </Card>

      <Card style={{ padding: 16, marginBottom: 18 }}>
        <div style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
          letterSpacing: '0.16em', color: 'rgba(241,138,138,0.85)', marginBottom: 10,
        }}>WHAT YOU'LL LOSE</div>
        {[
          'Your adaptive program — back to generic exercises',
          'New AI postural photo analyses after ' + renewDate,
          'Weekly insights, recaps, and trend reports',
          'Priority focus zones and pain tracking',
          '500+ exercise library access',
        ].map((b, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '5px 0' }}>
            <span style={{ marginTop: 6, flexShrink: 0, width: 4, height: 4, borderRadius: 999, background: '#F18A8A' }}></span>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.80)', lineHeight: 1.45 }}>{b}</span>
          </div>
        ))}
      </Card>

      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button
          onClick={onKeep}
          style={{
            width: '100%', padding: '14px 16px', borderRadius: 14,
            background: '#B4CDFF', color: '#0D1F3C', border: 'none', cursor: 'pointer',
            fontFamily: "'Inter Tight', sans-serif",
            fontSize: 15, fontWeight: 600, letterSpacing: '-0.01em',
          }}
        >Keep my Pro plan</button>
        <button
          onClick={onConfirmCancel}
          style={{
            width: '100%', padding: '14px 16px', borderRadius: 14,
            background: 'transparent',
            border: '1px solid rgba(241,138,138,0.30)',
            color: 'rgba(241,138,138,0.85)', cursor: 'pointer',
            fontFamily: "'Inter Tight', sans-serif",
            fontSize: 13.5, fontWeight: 500,
          }}
        >End my Pro subscription</button>
      </div>
    </div>
  );
}

function FeedbackStep({ reason, renewDate, onContinue, onKeep }) {
  const [frustrations, setFrustrations] = React.useState([]);
  const [note, setNote] = React.useState('');

  const toggle = (id) => {
    setFrustrations(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const items = [
    { id: 'pace',     label: 'Sessions felt too slow or repetitive' },
    { id: 'scan',     label: 'Photo analysis felt inaccurate' },
    { id: 'plan',     label: 'My program didn\'t adapt to me' },
    { id: 'ui',       label: 'The app was hard to navigate' },
    { id: 'notif',    label: 'Too many notifications' },
    { id: 'support',  label: 'Slow or unhelpful support' },
    { id: 'value',    label: 'I didn\'t see the value for the price' },
    { id: 'bugs',     label: 'Bugs or crashes' },
  ];

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '4px 20px 24px', display: 'flex', flexDirection: 'column' }}>
      <div style={{
        fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
        letterSpacing: '0.20em', color: 'rgba(180,205,255,0.75)', marginBottom: 10,
      }}>ONE LAST QUESTION</div>
      <div style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-0.02em', marginBottom: 6, lineHeight: 1.15 }}>Why are you leaving us?</div>
      <div style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.65)', marginBottom: 18, lineHeight: 1.5 }}>
        We read every response. Your feedback shapes what we build next — and it helps us understand where ALIGN didn\'t hold up its end.
      </div>

      <div style={{
        fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
        letterSpacing: '0.16em', color: 'rgba(255,255,255,0.45)', marginBottom: 10,
      }}>WHAT FRUSTRATED YOU MOST — SELECT ANY</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 18 }}>
        {items.map(it => {
          const on = frustrations.includes(it.id);
          return (
            <button
              key={it.id}
              onClick={() => toggle(it.id)}
              style={{
                textAlign: 'left', padding: '12px 14px', borderRadius: 12,
                background: on ? 'rgba(180,205,255,0.12)' : 'rgba(255,255,255,0.04)',
                border: '1px solid ' + (on ? 'rgba(180,205,255,0.55)' : 'rgba(255,255,255,0.08)'),
                color: '#FFFFFF', cursor: 'pointer',
                fontFamily: "'Inter Tight', sans-serif",
                display: 'flex', alignItems: 'center', gap: 12,
              }}
            >
              <div style={{
                flexShrink: 0, width: 18, height: 18, borderRadius: 5,
                border: '1.5px solid ' + (on ? '#B4CDFF' : 'rgba(255,255,255,0.30)'),
                background: on ? '#B4CDFF' : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {on && (
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M2 5L4 7L8 3" stroke="#0D1F3C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <span style={{ fontSize: 13.5, fontWeight: 500 }}>{it.label}</span>
            </button>
          );
        })}
      </div>

      <div style={{
        fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
        letterSpacing: '0.16em', color: 'rgba(255,255,255,0.45)', marginBottom: 10,
      }}>ANYTHING ELSE — OPTIONAL</div>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Tell us what we should have done differently…"
        rows={4}
        style={{
          width: '100%', padding: '12px 14px', borderRadius: 12,
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.10)',
          color: '#FFFFFF',
          fontFamily: "'Inter Tight', sans-serif",
          fontSize: 13.5, lineHeight: 1.5, resize: 'none',
          outline: 'none', marginBottom: 18,
          boxSizing: 'border-box',
        }}
      />

      <div style={{
        padding: 12, borderRadius: 12,
        background: 'rgba(180,205,255,0.06)',
        border: '1px solid rgba(180,205,255,0.15)',
        marginBottom: 16,
        display: 'flex', alignItems: 'flex-start', gap: 10,
      }}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
          <circle cx="8" cy="8" r="7" stroke="#B4CDFF" strokeWidth="1.3" />
          <path d="M8 5V8.5" stroke="#B4CDFF" strokeWidth="1.3" strokeLinecap="round" />
          <circle cx="8" cy="11" r="0.7" fill="#B4CDFF" />
        </svg>
        <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.75)', lineHeight: 1.5 }}>
          You\'ll keep Pro access until <span style={{ color: '#FFFFFF', fontWeight: 500 }}>{renewDate}</span>. We won\'t charge you again.
        </div>
      </div>

      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button
          onClick={onContinue}
          style={{
            width: '100%', padding: '14px 16px', borderRadius: 14,
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.14)',
            color: '#FFFFFF', cursor: 'pointer',
            fontFamily: "'Inter Tight', sans-serif",
            fontSize: 14.5, fontWeight: 500,
          }}
        >Continue</button>
        <button
          onClick={onKeep}
          style={{
            width: '100%', padding: '14px 16px', borderRadius: 14,
            background: '#B4CDFF', color: '#0D1F3C', border: 'none', cursor: 'pointer',
            fontFamily: "'Inter Tight', sans-serif",
            fontSize: 15, fontWeight: 600, letterSpacing: '-0.01em',
          }}
        >Keep my Pro plan</button>
      </div>
    </div>
  );
}

function getOffer(reason) {
  switch (reason) {
    case 'expensive':
      return {
        eyebrow: 'PERSONAL OFFER',
        title: 'Switch to yearly. Save 33%.',
        body: 'We get it — monthly adds up. Lock in yearly Pro and pay the equivalent of $8.30/mo instead of $12.99.',
        headline: '$99/yr',
        sub: 'vs $156/yr monthly',
        detail: 'Same Pro features. Same adaptive program. One payment, no thinking about it for a year.',
        bullets: [
          'Cancel anytime — prorated refund if you change your mind',
          'Locks in current pricing even if we raise it later',
          'Activates today, runs alongside your current month',
        ],
        cta: 'Switch to yearly · save $57',
        successMsg: 'Switched to yearly. You saved $57 today.',
        testimonial: 'I was about to cancel — switched to yearly instead and forgot about it. Six months later my posture score is up 24%.',
        testimonialAuthor: 'MARC L., PRO SINCE FEB 2024',
      };
    case 'results':
      return {
        eyebrow: 'COACH REVIEW',
        title: 'Let a coach look at your program.',
        body: 'No improvement after 6+ weeks usually means the program needs tuning. A real posture coach will review your last photos and rebuild your plan — free, for Pro members.',
        headline: 'Free review',
        sub: '24h turnaround',
        detail: 'A licensed physio reviews your photos, your pain map, and your exercise log, then sends a revised program tailored to what\'s actually stuck.',
        bullets: [
          'Real human review — not the algorithm',
          'New 4-week plan based on your specific blockers',
          'Plus: +1 month of Pro on us while you try it',
        ],
        cta: 'Request my free coach review',
        successMsg: 'Coach review requested. We\'ll email you within 24h. +1 month added.',
        testimonial: 'The coach spotted that I was compensating with my left shoulder. Fixed it in two weeks after months of stalling.',
        testimonialAuthor: 'SOFIA R., PRO SINCE OCT 2024',
      };
    case 'time':
      return {
        eyebrow: 'PAUSE INSTEAD',
        title: 'Pause your subscription.',
        body: 'You don\'t have to cancel to stop paying. Pause for up to 3 months — your progress, photos, and program stay exactly as they are.',
        headline: 'Up to 3 mo',
        sub: 'pause, not cancel',
        detail: 'No charges while paused. Resume with one tap when life calms down. Plus we\'ll switch you to a 5-min daily mini-session to make it easier to come back.',
        bullets: [
          'Zero charges during the pause',
          'Streak, photos, and program preserved',
          'Optional 5-min daily nudge while paused',
        ],
        cta: 'Pause for 1 month',
        successMsg: 'Subscription paused for 1 month. We\'ll see you back on the mat.',
        testimonial: 'I paused during a busy work month. Came back, picked up where I left off, didn\'t lose my streak.',
        testimonialAuthor: 'TARA W., PRO SINCE MAY 2024',
      };
    case 'alt':
      return {
        eyebrow: 'WHAT MAKES US DIFFERENT',
        title: 'Most posture apps don\'t do this.',
        body: 'Generic exercise apps don\'t track *your* posture. Therapists don\'t adapt your plan between visits. ALIGN sits between them.',
        headline: 'AI + human',
        sub: 'analysis + coach review',
        detail: 'Your photos are analyzed against thousands of postural patterns. A licensed physio reviews flagged sessions. The program rebuilds itself weekly based on what your body is actually doing.',
        bullets: [
          'AI postural analysis — not just guided videos',
          'Adaptive plan that responds to your pain map',
          'Coach review available every 30 days at no cost',
        ],
        cta: 'Stay and keep my plan',
        successMsg: 'Glad you stayed. Your Pro plan continues.',
        testimonial: 'Tried three other apps. None of them looked at my actual photos. ALIGN built a plan I\'d never have done on my own.',
        testimonialAuthor: 'JONAS P., PRO SINCE JAN 2024',
      };
    case 'break':
      return {
        eyebrow: 'PAUSE INSTEAD',
        title: 'Take a break without losing everything.',
        body: 'Pause your subscription instead of canceling. Your data, your streak, and your program stay frozen — ready when you come back.',
        headline: 'Up to 3 mo',
        sub: 'pause, not cancel',
        detail: 'Zero charges while paused. Photo history and exercise log stay. Resume with one tap.',
        bullets: [
          'No charges for up to 3 months',
          'Full program restored on return',
          'Optional check-in nudges while paused',
        ],
        cta: 'Pause for 1 month',
        successMsg: 'Subscription paused for 1 month.',
        testimonial: 'Took 6 weeks off to travel. Resumed and everything was exactly where I left it.',
        testimonialAuthor: 'LIN H., PRO SINCE NOV 2023',
      };
    default:
      return {
        eyebrow: 'WAIT — ONE LAST THING',
        title: 'Have one month on us.',
        body: 'Whatever the reason — try one more month free. No charge today, no lock-in, cancel anytime during the extension.',
        headline: '1 month free',
        sub: 'no charge today',
        detail: 'Your subscription pauses billing for 30 days. If it\'s still not working for you, cancel during that window and you won\'t pay another cent.',
        bullets: [
          'Zero charge today',
          'Full Pro access for 30 days',
          'Cancel anytime during the extension',
        ],
        cta: 'Claim my free month',
        successMsg: '1 month free applied. Next charge: in 30 days.',
        testimonial: 'Took the free month, ended up sticking around. That extra time made it click.',
        testimonialAuthor: 'NOAH K., PRO SINCE JUL 2024',
      };
  }
}

function SubRow({ icon, label, value, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '14px 16px',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        cursor: onClick ? 'pointer' : 'default',
      }}
    >
      <div style={{
        width: 28, height: 28, borderRadius: 8,
        background: 'rgba(255,255,255,0.05)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'rgba(180,205,255,0.85)',
      }}>{icon && icon(15)}</div>
      <div style={{ flex: 1, minWidth: 0, fontSize: 14.5, color: '#FFFFFF', fontWeight: 500 }}>{label}</div>
      <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)' }}>{value}</div>
      {onClick && (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 4 }}>
          <polyline points="9 18 15 12 9 6"/>
        </svg>
      )}
    </div>
  );
}

// ─────────────── Account / email sheet ───────────────
function PwdCheck({ ok, text }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      fontSize: 12.5, color: ok ? 'rgba(159,221,168,0.95)' : 'rgba(255,255,255,0.45)',
      fontFamily: "'Inter Tight', sans-serif",
    }}>
      <span style={{
        width: 14, height: 14, borderRadius: 999,
        background: ok ? 'rgba(159,221,168,0.18)' : 'rgba(255,255,255,0.06)',
        border: '1px solid ' + (ok ? 'rgba(159,221,168,0.5)' : 'rgba(255,255,255,0.12)'),
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        {ok && (
          <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#9FDDA8" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        )}
      </span>
      {text}
    </div>
  );
}

// ─────────────── Data & privacy sheet ───────────────
function PrivacyToggleRow({ icon, label, desc, value, onChange }) {
  return (
    <button onClick={() => onChange(!value)} style={{
      width: '100%', textAlign: 'left', cursor: 'pointer',
      padding: '14px 14px', borderRadius: 12,
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.08)',
      display: 'flex', alignItems: 'flex-start', gap: 12,
      fontFamily: "'Inter Tight', sans-serif", color: '#FFFFFF',
      marginBottom: 8,
    }}>
      <div style={{
        width: 28, height: 28, borderRadius: 8,
        background: 'rgba(180,205,255,0.10)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'rgba(180,205,255,0.85)', flexShrink: 0, marginTop: 1,
      }}>{icon(14, 'rgba(180,205,255,0.85)')}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 500 }}>{label}</div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', marginTop: 2, lineHeight: 1.4 }}>{desc}</div>
      </div>
      <div style={{
        width: 36, height: 22, borderRadius: 999, flexShrink: 0, marginTop: 4,
        background: value ? '#9FDDA8' : 'rgba(255,255,255,0.14)',
        border: '1px solid ' + (value ? 'rgba(159,221,168,0.6)' : 'rgba(255,255,255,0.10)'),
        position: 'relative', transition: 'background 0.18s ease',
      }}>
        <div style={{
          position: 'absolute', top: 1, left: value ? 15 : 1,
          width: 18, height: 18, borderRadius: 999,
          background: value ? '#0D1F3C' : '#FFFFFF',
          transition: 'left 0.18s ease',
        }}/>
      </div>
    </button>
  );
}

function PrivacyLinkRow({ icon, label, value, onClick, danger }) {
  return (
    <button onClick={onClick} style={{
      width: '100%', textAlign: 'left', cursor: 'pointer',
      padding: '14px 14px', borderRadius: 12,
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid ' + (danger ? 'rgba(241,138,138,0.20)' : 'rgba(255,255,255,0.08)'),
      display: 'flex', alignItems: 'center', gap: 12,
      fontFamily: "'Inter Tight', sans-serif",
      color: danger ? '#F18A8A' : '#FFFFFF',
      marginBottom: 8,
    }}>
      <div style={{
        width: 28, height: 28, borderRadius: 8,
        background: danger ? 'rgba(241,138,138,0.10)' : 'rgba(180,205,255,0.10)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>{icon(14, danger ? '#F18A8A' : 'rgba(180,205,255,0.85)')}</div>
      <div style={{ flex: 1, fontSize: 14, fontWeight: 500 }}>{label}</div>
      {value && <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.55)' }}>{value}</div>}
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={danger ? 'rgba(241,138,138,0.5)' : 'rgba(255,255,255,0.35)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 18 15 12 9 6"/>
      </svg>
    </button>
  );
}

function PrivacySheet({ onClose, isPro, onOpenPro, onRouteToCancel, onDeleteAccount }) {
  const [perms, setPerms] = React.useState({
    camera: true,
    notifications: true,
    health: false,
  });
  const [prefs, setPrefs] = React.useState({
    analytics: true,
    personalization: true,
    marketing: false,
  });
  const [view, setView] = React.useState('main'); // main | export | delete | gate
  const [deleteStep, setDeleteStep] = React.useState(0); // 0 confirm, 1 reason, 2 offer, 2.5 card, 3 typed
  const [deleteReason, setDeleteReason] = React.useState(null);
  const [deleteTyped, setDeleteTyped] = React.useState('');
  const [trialCard, setTrialCard] = React.useState({ number: '', name: '', exp: '', cvc: '' });
  const [exportReady, setExportReady] = React.useState(false);
  const [privacyToast, setPrivacyToast] = React.useState(null);
  const showPrivacyToast = (msg) => {
    setPrivacyToast(msg);
    setTimeout(() => setPrivacyToast(null), 2400);
  };
  const [exporting, setExporting] = React.useState(false);

  const startExport = () => {
    setExporting(true);
    setExportReady(false);
    setTimeout(() => { setExporting(false); setExportReady(true); }, 1400);
  };

  const title = view === 'export' ? 'EXPORT DATA' : view === 'delete' ? 'DELETE ACCOUNT' : view === 'gate' ? 'ACCOUNT REVIEW' : 'DATA & PRIVACY';

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 30,
      background: 'radial-gradient(120% 80% at 50% 28%, #2E4878 0%, #1B3460 50%, #142850 100%)',
      display: 'flex', flexDirection: 'column',
      fontFamily: "'Inter Tight', sans-serif", color: '#FFFFFF',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '60px 20px 12px',
        opacity: (view === 'delete' && deleteStep === 4) ? 0 : 1,
        pointerEvents: (view === 'delete' && deleteStep === 4) ? 'none' : 'auto',
        transition: 'opacity 240ms ease',
      }}>
        <button
          onClick={
            view === 'main'
              ? onClose
              : view === 'delete' && deleteStep > 0
                ? () => setDeleteStep(deleteStep === 2.5 ? 2 : deleteStep === 3 ? 2 : deleteStep - 1)
                : () => { setView('main'); setDeleteStep(0); setDeleteTyped(''); setDeleteReason(null); }
          }
          aria-label="Back"
          style={{
            width: 36, height: 36, borderRadius: 999,
            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: '#FFF', padding: 0,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <div style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
          letterSpacing: '0.18em', color: 'rgba(180,205,255,0.7)',
        }}>{title}</div>
        <div style={{ width: 36 }}></div>
      </div>

      {view === 'main' && (
        <div style={{ flex: 1, overflowY: 'auto', padding: '4px 20px 24px' }}>
          <div style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-0.02em', marginBottom: 4 }}>Data & privacy</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', marginBottom: 22, lineHeight: 1.5 }}>
            Control what ALIGN can access, how your data is used, and what you share.
          </div>

          <SheetLabel>PERMISSIONS</SheetLabel>
          <PrivacyToggleRow
            icon={Icon.camera} label="Camera"
            desc="Used for posture photos and body alignment scans."
            value={perms.camera}
            onChange={(v) => setPerms((p) => Object.assign({}, p, { camera: v }))}
          />
          <PrivacyToggleRow
            icon={Icon.bell} label="Notifications"
            desc="Daily reminders, weekly recaps, and photo retake nudges."
            value={perms.notifications}
            onChange={(v) => setPerms((p) => Object.assign({}, p, { notifications: v }))}
          />
          <PrivacyToggleRow
            icon={Icon.body} label="Apple Health"
            desc="Read step count and active minutes to tune your program."
            value={perms.health}
            onChange={(v) => setPerms((p) => Object.assign({}, p, { health: v }))}
          />

          <div style={{ height: 18 }}/>
          <SheetLabel>HOW WE USE YOUR DATA</SheetLabel>
          <PrivacyToggleRow
            icon={Icon.eye} label="Usage analytics"
            desc="Anonymous app usage to fix bugs and improve sessions."
            value={prefs.analytics}
            onChange={(v) => setPrefs((p) => Object.assign({}, p, { analytics: v }))}
          />
          <PrivacyToggleRow
            icon={Icon.pro} label="Personalized program"
            desc="Use your assessment and progress to tailor exercises."
            value={prefs.personalization}
            onChange={(v) => setPrefs((p) => Object.assign({}, p, { personalization: v }))}
          />
          <PrivacyToggleRow
            icon={Icon.user} label="Marketing emails"
            desc="Occasional product updates, tips, and offers."
            value={prefs.marketing}
            onChange={(v) => setPrefs((p) => Object.assign({}, p, { marketing: v }))}
          />

          <div style={{ height: 18 }}/>
          <SheetLabel>YOUR DATA</SheetLabel>
          <PrivacyLinkRow icon={Icon.download} label="Export my data" onClick={() => setView('export')} />
          <PrivacyLinkRow icon={Icon.doc} label="Privacy policy" onClick={() => { /* link out */ }} />
          <PrivacyLinkRow icon={Icon.doc} label="Terms of service" onClick={() => { /* link out */ }} />

          <div style={{ height: 18 }}/>
          <SheetLabel>DANGER ZONE</SheetLabel>
          <PrivacyLinkRow icon={Icon.trash} label="Delete my account" danger onClick={() => { if (isPro) { setView('gate'); } else { setView('delete'); setDeleteStep(0); } }} />

          <div style={{
            marginTop: 18, padding: '12px 14px', borderRadius: 12,
            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
            fontSize: 11.5, color: 'rgba(255,255,255,0.55)', lineHeight: 1.5,
          }}>
            ALIGN stores photos and assessments encrypted on your device. We never sell your data. Region: EU (GDPR).
          </div>
        </div>
      )}

      {view === 'export' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '4px 20px 24px' }}>
          <div style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-0.02em', marginBottom: 6 }}>Export your data</div>
          <div style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.65)', marginBottom: 22, lineHeight: 1.5 }}>
            We'll bundle everything tied to your account into a ZIP and email a download link to you.
          </div>

          <div style={{
            padding: 16, borderRadius: 14,
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            marginBottom: 16,
          }}>
            <div style={{ fontSize: 12, color: 'rgba(180,205,255,0.75)', letterSpacing: '0.14em', fontFamily: "'JetBrains Mono', monospace", marginBottom: 12 }}>INCLUDED</div>
            {[
              'Account profile (name, email)',
              'Assessment results & posture scores',
              'Photo retake history',
              'Session logs & program history',
              'Subscription & billing receipts',
            ].map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: i === 4 ? 0 : 8, fontSize: 13.5 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9FDDA8" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="5 12 10 17 19 7"/></svg>
                <span>{s}</span>
              </div>
            ))}
          </div>

          {exportReady && (
            <div style={{
              padding: '12px 14px', borderRadius: 12, marginBottom: 16,
              background: 'rgba(159,221,168,0.10)', border: '1px solid rgba(159,221,168,0.30)',
              fontSize: 13, color: '#D7F0DB', lineHeight: 1.5,
            }}>
              We've emailed a download link to <strong>cameron@align.app</strong>. It expires in 24 hours.
            </div>
          )}

          <div style={{ marginTop: 'auto' }}>
            <button
              onClick={startExport}
              disabled={exporting}
              style={{
                width: '100%', padding: '14px 16px', borderRadius: 14,
                background: exporting ? 'rgba(180,205,255,0.25)' : '#B4CDFF',
                color: exporting ? 'rgba(255,255,255,0.55)' : '#0D1F3C',
                border: 'none', cursor: exporting ? 'wait' : 'pointer',
                fontFamily: "'Inter Tight', sans-serif",
                fontSize: 15, fontWeight: 600, letterSpacing: '-0.01em',
              }}
            >{exporting ? 'Preparing your archive…' : exportReady ? 'Resend download link' : 'Request export'}</button>
          </div>
        </div>
      )}

      {view === 'gate' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '4px 20px 24px', overflowY: 'auto' }}>
          <div style={{
            alignSelf: 'flex-start',
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 10px', borderRadius: 999,
            background: 'rgba(245,230,200,0.10)',
            border: '1px solid rgba(245,230,200,0.28)',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 9.5, letterSpacing: '0.18em', color: '#F5E6C8',
            marginBottom: 14,
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: 999,
              background: '#F5E6C8',
              boxShadow: '0 0 8px rgba(245,230,200,0.7)',
            }}/>
            ACTION REQUIRED
          </div>

          <div style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-0.02em', marginBottom: 8 }}>
            A few things to wrap up first
          </div>
          <div style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.70)', marginBottom: 18, lineHeight: 1.55 }}>
            Before we can process a deletion request, your account needs to be reviewed for any active arrangements and outstanding entitlements. This is required to keep your records consistent with our billing partners.
          </div>

          <div style={{
            padding: '14px 16px', borderRadius: 14, marginBottom: 14,
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.10)',
          }}>
            {[
              ['Account status',     'Pro · active'],
              ['Billing relationship', 'Recurring · open'],
              ['Pending review',     'Required'],
            ].map((r, i, arr) => (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                padding: '10px 0',
                borderTop: i === 0 ? 'none' : '1px solid rgba(255,255,255,0.06)',
                fontSize: 13.5,
              }}>
                <span style={{ color: 'rgba(255,255,255,0.65)' }}>{r[0]}</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", color: i === arr.length - 1 ? '#F5E6C8' : 'rgba(255,255,255,0.92)', fontSize: 12.5, letterSpacing: '0.04em' }}>{r[1]}</span>
              </div>
            ))}
          </div>

          <div style={{
            padding: '12px 14px', borderRadius: 12, marginBottom: 'auto',
            background: 'rgba(180,205,255,0.06)',
            border: '1px solid rgba(180,205,255,0.18)',
            fontSize: 12, color: 'rgba(255,255,255,0.62)', lineHeight: 1.55,
          }}>
            Your assessments, photos, and progress will remain accessible during the review window. We'll guide you through the next step — most accounts complete this in a few minutes.
          </div>

          <button
            onClick={onRouteToCancel}
            style={{
              marginTop: 18,
              width: '100%', padding: '14px 16px', borderRadius: 14,
              background: '#B4CDFF', color: '#0D1F3C',
              border: 'none', cursor: 'pointer',
              fontFamily: "'Inter Tight', sans-serif",
              fontSize: 15, fontWeight: 600, letterSpacing: '-0.01em',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}
          >
            Continue to account review
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 6 15 12 9 18"/></svg>
          </button>

          <button
            onClick={() => setView('main')}
            style={{
              marginTop: 10,
              width: '100%', padding: '12px 16px', borderRadius: 14,
              background: 'transparent', color: 'rgba(255,255,255,0.65)',
              border: '1px solid rgba(255,255,255,0.10)', cursor: 'pointer',
              fontFamily: "'Inter Tight', sans-serif",
              fontSize: 14, fontWeight: 500,
            }}
          >Not right now</button>
        </div>
      )}

      {view === 'delete' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '4px 20px 24px', overflowY: 'auto' }}>
          {deleteStep === 0 && (
            <React.Fragment>
              <div style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-0.02em', marginBottom: 6, color: '#FFD3D3' }}>Delete your account?</div>
              <div style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.70)', marginBottom: 22, lineHeight: 1.55 }}>
                This permanently removes your profile, assessments, photos, and program history. It cannot be undone.
              </div>

              <div style={{
                padding: 16, borderRadius: 14, marginBottom: 16,
                background: 'rgba(241,138,138,0.06)',
                border: '1px solid rgba(241,138,138,0.22)',
              }}>
                {[
                  ['23', 'sessions completed'],
                  ['7-day', 'current streak'],
                  ['4', 'posture photos'],
                ].map((r, i) => (
                  <div key={i} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                    padding: '8px 0', borderTop: i === 0 ? 'none' : '1px solid rgba(241,138,138,0.15)',
                    fontSize: 13.5,
                  }}>
                    <span style={{ color: 'rgba(255,255,255,0.85)' }}>{r[1]}</span>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", color: '#FFD3D3' }}>{r[0]}</span>
                  </div>
                ))}
              </div>

              <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.55)', marginBottom: 'auto', lineHeight: 1.5 }}>
                If you just want to step away, you can pause your subscription instead — your progress stays safe.
              </div>

              <button
                onClick={() => setDeleteStep(1)}
                style={{
                  width: '100%', padding: '14px 16px', borderRadius: 14,
                  background: 'rgba(241,138,138,0.12)',
                  color: '#F18A8A',
                  border: '1px solid rgba(241,138,138,0.35)',
                  cursor: 'pointer',
                  fontFamily: "'Inter Tight', sans-serif",
                  fontSize: 15, fontWeight: 600, letterSpacing: '-0.01em',
                  marginTop: 20,
                }}
              >Continue with deletion</button>
              <button
                onClick={() => { setView('main'); }}
                style={{
                  width: '100%', padding: '12px 16px',
                  background: 'transparent', border: 'none',
                  color: '#B4CDFF', cursor: 'pointer',
                  fontFamily: "'Inter Tight', sans-serif",
                  fontSize: 14, fontWeight: 500, marginTop: 6,
                }}
              >Keep my account</button>
            </React.Fragment>
          )}

          {deleteStep === 1 && (
            <React.Fragment>
              <div style={{ fontSize: 24, fontWeight: 600, letterSpacing: '-0.02em', marginBottom: 6 }}>Help us understand why</div>
              <div style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.65)', marginBottom: 18, lineHeight: 1.5 }}>
                Optional — your feedback helps us improve ALIGN for others.
              </div>

              {[
                'I no longer need the app',
                'Too expensive',
                'Not seeing results',
                'Privacy concerns',
                'I have another app',
                'Other reason',
              ].map((r) => (
                <button key={r} onClick={() => setDeleteReason(r)} style={{
                  width: '100%', textAlign: 'left', cursor: 'pointer',
                  padding: '13px 14px', borderRadius: 12,
                  background: deleteReason === r ? 'rgba(180,205,255,0.10)' : 'rgba(255,255,255,0.04)',
                  border: '1px solid ' + (deleteReason === r ? 'rgba(180,205,255,0.40)' : 'rgba(255,255,255,0.08)'),
                  color: '#FFFFFF',
                  fontFamily: "'Inter Tight', sans-serif", fontSize: 14, fontWeight: 500,
                  marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}>
                  <span>{r}</span>
                  {deleteReason === r && (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B4CDFF" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="5 12 10 17 19 7"/></svg>
                  )}
                </button>
              ))}

              <button
                onClick={() => setDeleteStep(2)}
                style={{
                  width: '100%', padding: '14px 16px', borderRadius: 14,
                  background: 'rgba(241,138,138,0.12)',
                  color: '#F18A8A',
                  border: '1px solid rgba(241,138,138,0.35)',
                  cursor: 'pointer',
                  fontFamily: "'Inter Tight', sans-serif",
                  fontSize: 15, fontWeight: 600, letterSpacing: '-0.01em',
                  marginTop: 20,
                }}
              >Continue</button>
            </React.Fragment>
          )}

          {deleteStep === 2 && (
            <React.Fragment>
              <div style={{
                fontSize: 11, letterSpacing: '0.16em', fontWeight: 600,
                color: '#B4CDFF', marginBottom: 10,
              }}>ONE LAST THING</div>
              <div style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-0.02em', marginBottom: 8 }}>
                Try Pro free for a month.
              </div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.70)', marginBottom: 20, lineHeight: 1.55 }}>
                Before you delete everything, take a month of Pro on us. Unlock posture trends, photo analysis, and the full exercise library. No charge today — cancel anytime.
              </div>

              <div style={{
                padding: '16px 16px',
                borderRadius: 14,
                background: 'linear-gradient(180deg, rgba(180,205,255,0.10), rgba(180,205,255,0.04))',
                border: '1px solid rgba(180,205,255,0.22)',
                marginBottom: 18,
              }}>
                {[
                  { t: 'Full posture analysis', d: 'Side-by-side photo comparisons over time.' },
                  { t: 'Unlimited daily reminders', d: 'Custom schedules across the week.' },
                  { t: 'Personalized exercise plans', d: 'Adapted to your assessment.' },
                ].map((row, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'flex-start', gap: 12,
                    paddingTop: i === 0 ? 0 : 12,
                    paddingBottom: i === 2 ? 0 : 12,
                    borderBottom: i === 2 ? 'none' : '1px solid rgba(255,255,255,0.06)',
                  }}>
                    <div style={{
                      width: 22, height: 22, borderRadius: 999,
                      background: 'rgba(180,205,255,0.16)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1,
                    }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#B4CDFF" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="5 12 10 17 19 7"/></svg>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#FFFFFF', letterSpacing: '-0.01em' }}>{row.t}</div>
                      <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.60)', marginTop: 2, lineHeight: 1.45 }}>{row.d}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.50)', textAlign: 'center', marginBottom: 14, lineHeight: 1.5 }}>
                30 days free, then $6.99/month. Cancel anytime in Subscription.
              </div>

              <button
                onClick={() => setDeleteStep(2.5)}
                style={{
                  width: '100%', padding: '14px 16px', borderRadius: 14,
                  background: '#B4CDFF',
                  color: '#0E1626',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: "'Inter Tight', sans-serif",
                  fontSize: 15, fontWeight: 600, letterSpacing: '-0.01em',
                  marginTop: 'auto',
                }}
              >Start my free month</button>
              <button
                onClick={() => setDeleteStep(3)}
                style={{
                  width: '100%', padding: '12px 16px', borderRadius: 14,
                  background: 'transparent',
                  color: 'rgba(255,255,255,0.55)',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: "'Inter Tight', sans-serif",
                  fontSize: 13.5, fontWeight: 500, letterSpacing: '-0.005em',
                  marginTop: 8,
                }}
              >No thanks, continue deleting</button>
            </React.Fragment>
          )}

          {deleteStep === 2.5 && (() => {
            const cardReady = trialCard.number.replace(/\s/g, '').length >= 12
              && trialCard.name.trim().length > 1
              && /^\d{1,2}\s*\/?\s*\d{2}$/.test(trialCard.exp.trim())
              && trialCard.cvc.replace(/\D/g, '').length >= 3;
            const formatNumber = (v) => v.replace(/\D/g, '').slice(0, 19).replace(/(.{4})/g, '$1 ').trim();
            const formatExp = (v) => {
              const d = v.replace(/\D/g, '').slice(0, 4);
              return d.length > 2 ? d.slice(0, 2) + ' / ' + d.slice(2) : d;
            };
            return (
              <React.Fragment>
                <div style={{
                  fontSize: 11, letterSpacing: '0.16em', fontWeight: 600,
                  color: '#B4CDFF', marginBottom: 10,
                }}>STEP 1 OF 1 · KEEP IT GOING</div>
                <div style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-0.02em', marginBottom: 8 }}>
                  Add a card to start your month.
                </div>
                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.70)', marginBottom: 18, lineHeight: 1.55 }}>
                  We won't charge anything today. After 30 days, Pro auto-renews at <span style={{ color: '#FFFFFF', fontWeight: 600 }}>$6.99/month</span> unless you cancel. You'll get a reminder 3 days before.
                </div>

                {/* Trial summary chip */}
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '12px 14px', borderRadius: 12,
                  background: 'rgba(180,205,255,0.10)',
                  border: '1px solid rgba(180,205,255,0.22)',
                  marginBottom: 16,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: 999,
                      background: 'rgba(180,205,255,0.18)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#B4CDFF" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 14"/></svg>
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#FFFFFF' }}>30 days free</div>
                      <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.55)' }}>Then $6.99/mo · Cancel anytime</div>
                    </div>
                  </div>
                  <div style={{
                    fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
                    color: '#B4CDFF', letterSpacing: '0.08em',
                  }}>$0.00</div>
                </div>

                <Card style={{ padding: 16, marginBottom: 14 }}>
                  <SheetLabel>Card number</SheetLabel>
                  <input
                    value={trialCard.number}
                    onChange={(e) => setTrialCard({ ...trialCard, number: formatNumber(e.target.value) })}
                    placeholder="1234 5678 9012 3456"
                    inputMode="numeric"
                    autoComplete="cc-number"
                    style={inputCss}
                  />
                  <div style={{ height: 12 }}></div>
                  <SheetLabel>Cardholder name</SheetLabel>
                  <input
                    value={trialCard.name}
                    onChange={(e) => setTrialCard({ ...trialCard, name: e.target.value })}
                    placeholder="Cameron Lee"
                    autoComplete="cc-name"
                    style={inputCss}
                  />
                  <div style={{ height: 12 }}></div>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <div style={{ flex: 1 }}>
                      <SheetLabel>Expiry</SheetLabel>
                      <input
                        value={trialCard.exp}
                        onChange={(e) => setTrialCard({ ...trialCard, exp: formatExp(e.target.value) })}
                        placeholder="MM / YY"
                        inputMode="numeric"
                        autoComplete="cc-exp"
                        style={inputCss}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <SheetLabel>CVC</SheetLabel>
                      <input
                        value={trialCard.cvc}
                        onChange={(e) => setTrialCard({ ...trialCard, cvc: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                        placeholder="123"
                        inputMode="numeric"
                        autoComplete="cc-csc"
                        style={inputCss}
                      />
                    </div>
                  </div>
                </Card>

                <div style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  fontSize: 11.5, color: 'rgba(255,255,255,0.48)',
                  marginBottom: 14, lineHeight: 1.5,
                }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  <span>Encrypted and processed by Stripe. We never see your full card number.</span>
                </div>

                <button
                  onClick={() => {
                    if (!cardReady) return;
                    if (onOpenPro) onOpenPro();
                    setView('main');
                    setDeleteStep(0);
                    setDeleteReason(null);
                    setDeleteTyped('');
                    setTrialCard({ number: '', name: '', exp: '', cvc: '' });
                    showPrivacyToast('Pro unlocked — 30 days free. Welcome back.');
                  }}
                  disabled={!cardReady}
                  style={{
                    width: '100%', padding: '14px 16px', borderRadius: 14,
                    background: cardReady ? '#B4CDFF' : 'rgba(180,205,255,0.22)',
                    color: cardReady ? '#0E1626' : 'rgba(255,255,255,0.45)',
                    border: 'none',
                    cursor: cardReady ? 'pointer' : 'not-allowed',
                    fontFamily: "'Inter Tight', sans-serif",
                    fontSize: 15, fontWeight: 600, letterSpacing: '-0.01em',
                    marginTop: 'auto',
                  }}
                >Start my 30 days free</button>
                <button
                  onClick={() => setDeleteStep(2)}
                  style={{
                    width: '100%', padding: '12px 16px', borderRadius: 14,
                    background: 'transparent',
                    color: 'rgba(255,255,255,0.55)',
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: "'Inter Tight', sans-serif",
                    fontSize: 13.5, fontWeight: 500, letterSpacing: '-0.005em',
                    marginTop: 8,
                  }}
                >Back</button>
              </React.Fragment>
            );
          })()}

          {deleteStep === 3 && (
            <React.Fragment>
              <div style={{ fontSize: 24, fontWeight: 600, letterSpacing: '-0.02em', marginBottom: 6, color: '#FFD3D3' }}>Confirm deletion</div>
              <div style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.70)', marginBottom: 18, lineHeight: 1.55 }}>
                Type <span style={{ fontFamily: "'JetBrains Mono', monospace", color: '#FFFFFF' }}>DELETE</span> to permanently remove your account.
              </div>

              <input
                value={deleteTyped}
                onChange={(e) => setDeleteTyped(e.target.value.toUpperCase())}
                placeholder="DELETE"
                style={{
                  width: '100%', padding: '14px 14px', borderRadius: 12,
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid ' + (deleteTyped === 'DELETE' ? 'rgba(241,138,138,0.45)' : 'rgba(255,255,255,0.08)'),
                  color: '#FFFFFF',
                  fontFamily: "'JetBrains Mono', monospace", fontSize: 16, letterSpacing: '0.2em',
                  textAlign: 'center', outline: 'none', boxSizing: 'border-box',
                  marginBottom: 'auto',
                }}
              />

              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.50)', margin: '14px 4px 0', lineHeight: 1.5 }}>
                We'll send a confirmation email. You have 7 days to cancel before your data is erased.
              </div>

              <button
                onClick={() => {
                  if (deleteTyped !== 'DELETE') return;
                  setDeleteStep(4);
                  // Brief success moment, then notify host which resets the app to Welcome.
                  setTimeout(() => { onDeleteAccount && onDeleteAccount(); }, 1700);
                }}
                disabled={deleteTyped !== 'DELETE'}
                style={{
                  width: '100%', padding: '14px 16px', borderRadius: 14,
                  background: deleteTyped === 'DELETE' ? '#F18A8A' : 'rgba(241,138,138,0.18)',
                  color: deleteTyped === 'DELETE' ? '#3A1010' : 'rgba(255,255,255,0.40)',
                  border: 'none',
                  cursor: deleteTyped === 'DELETE' ? 'pointer' : 'not-allowed',
                  fontFamily: "'Inter Tight', sans-serif",
                  fontSize: 15, fontWeight: 600, letterSpacing: '-0.01em',
                  marginTop: 16,
                }}
              >Permanently delete account</button>
            </React.Fragment>
          )}

          {deleteStep === 4 && (
            <div style={{
              flex: 1, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', textAlign: 'center',
              padding: '0 8px',
            }}>
              <div style={{
                width: 72, height: 72, borderRadius: '50%',
                background: 'rgba(180,205,255,0.14)',
                border: '1px solid rgba(180,205,255,0.28)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 22,
                animation: 'alignFadeIn 320ms ease-out both',
              }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#B4CDFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <div style={{
                fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em',
                color: '#FFFFFF', marginBottom: 8,
              }}>Account deleted</div>
              <div style={{
                fontSize: 13.5, color: 'rgba(255,255,255,0.62)',
                lineHeight: 1.55, maxWidth: 280,
              }}>Your data has been erased. Signing you out…</div>
              <style>{`@keyframes alignFadeIn { from { opacity: 0; transform: scale(0.92);} to { opacity: 1; transform: scale(1);} }`}</style>
            </div>
          )}
        </div>
      )}

      {privacyToast && (
        <div style={{
          position: 'absolute', left: 20, right: 20, bottom: 28,
          padding: '12px 14px', borderRadius: 12,
          background: 'rgba(255,255,255,0.10)',
          border: '1px solid rgba(255,255,255,0.14)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          color: '#FFFFFF',
          fontFamily: "'Inter Tight', sans-serif",
          fontSize: 13.5, fontWeight: 500, letterSpacing: '-0.005em',
          textAlign: 'center',
          boxShadow: '0 12px 40px rgba(0,0,0,0.45)',
          zIndex: 50,
        }}>{privacyToast}</div>
      )}
    </div>
  );
}

function AccountSheet({ value, onChange, onClose }) {
  const [name, setName] = React.useState(value.name);
  const [email, setEmail] = React.useState(value.email);
  const [verifyOpen, setVerifyOpen] = React.useState(false);
  const [passwordOpen, setPasswordOpen] = React.useState(false);
  const [pendingEmail, setPendingEmail] = React.useState(null);
  const [code, setCode] = React.useState('');
  // Password change state
  const [pwdCurrent, setPwdCurrent] = React.useState('');
  const [pwdNew, setPwdNew] = React.useState('');
  const [pwdConfirm, setPwdConfirm] = React.useState('');
  const [pwdShow, setPwdShow] = React.useState(false);
  const [pwdSaved, setPwdSaved] = React.useState(false);

  // Password validation
  const pwdHasLen = pwdNew.length >= 8;
  const pwdHasNum = /[0-9]/.test(pwdNew);
  const pwdHasMix = /[a-z]/.test(pwdNew) && /[A-Z]/.test(pwdNew);
  const pwdMatches = pwdNew.length > 0 && pwdNew === pwdConfirm;
  const canSavePwd = pwdCurrent.length > 0 && pwdHasLen && pwdHasNum && pwdHasMix && pwdMatches;

  const savePwd = () => {
    if (!canSavePwd) return;
    setPwdSaved(true);
    setTimeout(() => {
      setPwdSaved(false);
      setPwdCurrent('');
      setPwdNew('');
      setPwdConfirm('');
      setPasswordOpen(false);
    }, 1400);
  };

  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const dirty = (name.trim() !== value.name) || (email.trim() !== value.email);
  const emailChanged = email.trim() !== value.email;
  const canSave = dirty && validEmail && name.trim().length > 0;

  const save = () => {
    if (!canSave) return;
    if (emailChanged) {
      // Simulate sending a verification code
      setPendingEmail(email.trim());
      setVerifyOpen(true);
    } else {
      onChange(Object.assign({}, value, { name: name.trim() }));
      onClose();
    }
  };

  const confirmCode = () => {
    if (code.length < 4) return;
    onChange(Object.assign({}, value, { name: name.trim(), email: pendingEmail }));
    onClose();
  };

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 30,
      background: 'radial-gradient(120% 80% at 50% 28%, #2E4878 0%, #1B3460 50%, #142850 100%)',
      display: 'flex', flexDirection: 'column',
      fontFamily: "'Inter Tight', sans-serif", color: '#FFFFFF',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '60px 20px 12px',
      }}>
        <button
          onClick={verifyOpen ? () => setVerifyOpen(false) : passwordOpen ? () => setPasswordOpen(false) : onClose}
          aria-label="Back"
          style={{
            width: 36, height: 36, borderRadius: 999,
            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: '#FFF', padding: 0,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <div style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
          letterSpacing: '0.18em', color: 'rgba(180,205,255,0.7)',
        }}>{verifyOpen ? 'VERIFY EMAIL' : passwordOpen ? 'CHANGE PASSWORD' : 'ACCOUNT'}</div>
        <div style={{ width: 36 }}></div>
      </div>

      {!verifyOpen && !passwordOpen && (
        <React.Fragment>
          <div style={{ padding: '4px 20px 0' }}>
            <div style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-0.02em', marginBottom: 4 }}>Account</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', marginBottom: 22 }}>Update your name and email address.</div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 24px' }}>
            {/* Avatar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
              <div style={{
                width: 56, height: 56, borderRadius: 999,
                background: 'linear-gradient(135deg, #B4CDFF 0%, #7AA4E8 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#0D1F3C', fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em',
              }}>{(name.trim()[0] || 'C').toUpperCase()}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 500 }}>{name.trim() || 'Your name'}</div>
                <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.55)', marginTop: 1 }}>{email.trim() || 'no email'}</div>
              </div>
            </div>

            <SheetLabel>NAME</SheetLabel>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              style={{
                width: '100%', padding: '13px 14px', borderRadius: 12,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: '#FFFFFF', fontSize: 15,
                fontFamily: "'Inter Tight', sans-serif", outline: 'none',
                marginBottom: 18, boxSizing: 'border-box',
              }}
            />

            <SheetLabel>EMAIL ADDRESS</SheetLabel>
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              style={{
                width: '100%', padding: '13px 14px', borderRadius: 12,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid ' + (email && !validEmail ? 'rgba(255,140,140,0.4)' : 'rgba(255,255,255,0.08)'),
                color: '#FFFFFF', fontSize: 15,
                fontFamily: "'Inter Tight', sans-serif", outline: 'none',
                marginBottom: 8, boxSizing: 'border-box',
              }}
            />
            <div style={{
              fontSize: 12, color: email && !validEmail ? 'rgba(255,180,180,0.85)' : 'rgba(255,255,255,0.50)',
              margin: '0 2px 22px', lineHeight: 1.4,
            }}>
              {email && !validEmail
                ? 'Please enter a valid email address.'
                : emailChanged
                  ? "We'll send a 6-digit code to confirm this new address."
                  : "This is where we'll send reminders and weekly recaps."}
            </div>

            <button
              onClick={() => setPasswordOpen(true)}
              style={{
                width: '100%', padding: '14px 16px', borderRadius: 12,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.10)',
                color: '#FFFFFF', cursor: 'pointer',
                fontFamily: "'Inter Tight', sans-serif",
                fontSize: 14, fontWeight: 500,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                Change password
              </span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>
          </div>

          <div style={{ padding: '0 20px 24px' }}>
            <button
              onClick={save}
              disabled={!canSave}
              style={{
                width: '100%', padding: '14px 16px', borderRadius: 14,
                background: canSave ? '#B4CDFF' : 'rgba(180,205,255,0.25)',
                color: canSave ? '#0D1F3C' : 'rgba(255,255,255,0.45)',
                border: 'none', cursor: canSave ? 'pointer' : 'not-allowed',
                fontFamily: "'Inter Tight', sans-serif",
                fontSize: 15, fontWeight: 600, letterSpacing: '-0.01em',
              }}
            >Save changes</button>
          </div>
        </React.Fragment>
      )}

      {passwordOpen && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '4px 20px 24px', overflowY: 'auto' }}>
          <div style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-0.02em', marginBottom: 6 }}>Change password</div>
          <div style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.65)', marginBottom: 24, lineHeight: 1.5 }}>
            Enter your current password, then choose a new one.
          </div>

          <SheetLabel>CURRENT PASSWORD</SheetLabel>
          <input
            type={pwdShow ? 'text' : 'password'}
            value={pwdCurrent}
            onChange={(e) => setPwdCurrent(e.target.value)}
            placeholder="• • • • • • • •"
            style={{
              width: '100%', padding: '13px 14px', borderRadius: 12,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: '#FFFFFF', fontSize: 15,
              fontFamily: "'Inter Tight', sans-serif", outline: 'none',
              marginBottom: 18, boxSizing: 'border-box',
            }}
          />

          <SheetLabel>NEW PASSWORD</SheetLabel>
          <input
            type={pwdShow ? 'text' : 'password'}
            value={pwdNew}
            onChange={(e) => setPwdNew(e.target.value)}
            placeholder="At least 8 characters"
            style={{
              width: '100%', padding: '13px 14px', borderRadius: 12,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: '#FFFFFF', fontSize: 15,
              fontFamily: "'Inter Tight', sans-serif", outline: 'none',
              marginBottom: 10, boxSizing: 'border-box',
            }}
          />

          {/* Strength checklist */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 18 }}>
            <PwdCheck ok={pwdHasLen} text="At least 8 characters" />
            <PwdCheck ok={pwdHasMix} text="Upper and lowercase letters" />
            <PwdCheck ok={pwdHasNum} text="At least one number" />
          </div>

          <SheetLabel>CONFIRM NEW PASSWORD</SheetLabel>
          <input
            type={pwdShow ? 'text' : 'password'}
            value={pwdConfirm}
            onChange={(e) => setPwdConfirm(e.target.value)}
            placeholder="Re-enter new password"
            style={{
              width: '100%', padding: '13px 14px', borderRadius: 12,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid ' + (pwdConfirm && !pwdMatches ? 'rgba(255,140,140,0.4)' : 'rgba(255,255,255,0.08)'),
              color: '#FFFFFF', fontSize: 15,
              fontFamily: "'Inter Tight', sans-serif", outline: 'none',
              marginBottom: 8, boxSizing: 'border-box',
            }}
          />
          {pwdConfirm && !pwdMatches && (
            <div style={{ fontSize: 12, color: 'rgba(255,180,180,0.85)', margin: '0 2px 14px' }}>
              Passwords don't match.
            </div>
          )}

          <button
            onClick={() => setPwdShow((v) => !v)}
            style={{
              background: 'transparent', border: 'none', color: '#B4CDFF',
              fontFamily: "'Inter Tight', sans-serif", fontSize: 13, fontWeight: 500,
              cursor: 'pointer', alignSelf: 'flex-start', padding: '4px 0', marginTop: 4, marginBottom: 'auto',
            }}
          >{pwdShow ? 'Hide passwords' : 'Show passwords'}</button>

          <button
            onClick={savePwd}
            disabled={!canSavePwd || pwdSaved}
            style={{
              width: '100%', padding: '14px 16px', borderRadius: 14,
              background: pwdSaved ? '#9FDDA8' : canSavePwd ? '#B4CDFF' : 'rgba(180,205,255,0.25)',
              color: pwdSaved || canSavePwd ? '#0D1F3C' : 'rgba(255,255,255,0.45)',
              border: 'none', cursor: canSavePwd && !pwdSaved ? 'pointer' : 'not-allowed',
              fontFamily: "'Inter Tight', sans-serif",
              fontSize: 15, fontWeight: 600, letterSpacing: '-0.01em',
              marginTop: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}
          >
            {pwdSaved && (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            )}
            {pwdSaved ? 'Password updated' : 'Update password'}
          </button>
        </div>
      )}

      {verifyOpen && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '4px 20px 24px' }}>
          <div style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-0.02em', marginBottom: 6 }}>Verify your email</div>
          <div style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.65)', marginBottom: 28, lineHeight: 1.5 }}>
            We sent a 6-digit code to <span style={{ color: '#FFFFFF', fontWeight: 500 }}>{pendingEmail}</span>. Enter it below to confirm the change.
          </div>

          <input
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
            inputMode="numeric"
            placeholder="• • • • • •"
            style={{
              width: '100%', padding: '18px 14px', borderRadius: 14,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.10)',
              color: '#FFFFFF',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 22, letterSpacing: '0.4em', textAlign: 'center',
              outline: 'none', boxSizing: 'border-box',
              marginBottom: 14,
            }}
          />

          <button
            onClick={() => { /* placeholder resend */ }}
            style={{
              background: 'transparent', border: 'none', color: '#B4CDFF',
              fontFamily: "'Inter Tight', sans-serif", fontSize: 13, fontWeight: 500,
              cursor: 'pointer', alignSelf: 'flex-start', padding: 0, marginBottom: 'auto',
            }}
          >Didn't get a code? Resend</button>

          <button
            onClick={confirmCode}
            disabled={code.length < 6}
            style={{
              width: '100%', padding: '14px 16px', borderRadius: 14,
              background: code.length >= 6 ? '#B4CDFF' : 'rgba(180,205,255,0.25)',
              color: code.length >= 6 ? '#0D1F3C' : 'rgba(255,255,255,0.45)',
              border: 'none', cursor: code.length >= 6 ? 'pointer' : 'not-allowed',
              fontFamily: "'Inter Tight', sans-serif",
              fontSize: 15, fontWeight: 600, letterSpacing: '-0.01em',
              marginTop: 20,
            }}
          >Confirm & save</button>
        </div>
      )}
    </div>
  );
}

// ─────────────── Help center sheet ───────────────
function SignOutDialog({ onCancel, onConfirm }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 60,
      background: 'rgba(8,16,32,0.55)',
      backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24, fontFamily: "'Inter Tight', sans-serif",
    }}>
      <div style={{
        width: '100%', maxWidth: 320,
        padding: '22px 20px 18px',
        borderRadius: 18,
        background: 'rgba(28,44,80,0.92)',
        border: '1px solid rgba(255,255,255,0.10)',
        boxShadow: '0 24px 60px rgba(0,0,0,0.55)',
        color: '#FFFFFF', textAlign: 'center',
      }}>
        <div style={{ fontSize: 18, fontWeight: 600, letterSpacing: '-0.02em', marginBottom: 6 }}>Sign out?</div>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', lineHeight: 1.5, marginBottom: 18 }}>
          You'll be signed back out of this device. Your data stays safe.
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onCancel} style={{
            flex: 1, padding: '12px 14px', borderRadius: 12,
            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)',
            color: '#FFFFFF', cursor: 'pointer',
            fontFamily: "'Inter Tight', sans-serif", fontSize: 14, fontWeight: 500,
          }}>Cancel</button>
          <button onClick={onConfirm} style={{
            flex: 1, padding: '12px 14px', borderRadius: 12,
            background: '#F18A8A', border: 'none',
            color: '#3A1010', cursor: 'pointer',
            fontFamily: "'Inter Tight', sans-serif", fontSize: 14, fontWeight: 600,
          }}>Sign out</button>
        </div>
      </div>
    </div>
  );
}

const HELP_TOPICS = [
  {
    cat: 'Getting started',
    icon: 'play',
    items: [
      { q: 'How do I take my first posture photo?',
        a: "Tap 'Take photo' on the Today tab. Stand 6–8 feet from the camera with your phone at hip height against a plain wall. ALIGN's guide overlay will show you the exact stance. Good lighting and tight-fitting clothing make the analysis sharper." },
      { q: 'What does my Posture Score actually mean?',
        a: 'Your score (0–100) is a composite of head-forward angle, shoulder height balance, hip rotation, and spinal curvature, measured from your most recent photo. Most people start between 55–70. Anything above 80 is excellent.' },
      { q: 'How long until I see results?',
        a: 'Most members notice posture-score improvement after 3–4 weeks of consistent practice (4+ sessions/week). Visible changes in photos typically appear by week 6. Chronic pain reduction varies by condition.' },
    ],
  },
  {
    cat: 'Photos & assessment',
    icon: 'camera',
    items: [
      { q: 'Why does my analysis look different than last time?',
        a: "Posture varies day-to-day based on sleep, hydration, and recent activity. The trend over 2–3 weeks matters more than any single reading. We average the last 3 check-ins to smooth this out." },
      { q: 'Can I retake a photo if it came out wrong?',
        a: 'Yes. On the Tracking screen, tap any photo and choose "Retake". The old one stays in your history (you can hide it from the trend graph in Settings).' },
      { q: 'Where are my photos stored?',
        a: 'Photos are encrypted on-device and synced to your private ALIGN account. We never use them to train models. You can export or delete everything from Data & privacy.' },
    ],
  },
  {
    cat: 'Sessions & program',
    icon: 'body',
    items: [
      { q: 'My program feels too easy / too hard. Can I adjust it?',
        a: 'Tap the difficulty arrows at the end of any session, or open Program → Adjust intensity. Pro members get auto-adjusted plans based on completion + perceived effort.' },
      { q: 'Can I skip exercises I dislike?',
        a: "Long-press an exercise in your session and tap 'Replace'. We'll swap in an alternative targeting the same muscle group." },
      { q: 'Do I need any equipment?',
        a: 'No — the core program is bodyweight only. Some optional Pro programs use a foam roller or resistance band; these are clearly labelled.' },
    ],
  },
  {
    cat: 'Account & billing',
    icon: 'pro',
    items: [
      { q: 'How do I cancel my Pro subscription?',
        a: 'Profile → Subscription → "Cancel my plan". You\'ll keep Pro access until the end of your current billing period and we won\'t charge you again.' },
      { q: 'I was charged but didn\'t mean to renew.',
        a: 'If you cancelled within 48 hours of being charged, we refund automatically. Otherwise, send us a note — we always honour refund requests for accidental renewals within 14 days.' },
      { q: 'Can I share my account with my partner?',
        a: 'Each account stores one person\'s photos and program. A Family plan covering up to 4 people is in the works for 2026.' },
    ],
  },
  {
    cat: 'Privacy & data',
    icon: 'shield',
    items: [
      { q: 'Who can see my photos?',
        a: "Only you. Photos are encrypted client-side before upload. Even ALIGN engineers can't view them without your explicit, time-limited consent (used only when you contact support about a photo issue)." },
      { q: 'Can I delete everything?',
        a: 'Profile → Data & privacy → "Delete my account". This permanently erases your photos, scores, sessions, and account within 7 days.' },
    ],
  },
];

function HelpCenterSheet({ onClose, onContact }) {
  const [query, setQuery] = React.useState('');
  const [openKey, setOpenKey] = React.useState(null);
  const [activeCat, setActiveCat] = React.useState(null);

  const q = query.trim().toLowerCase();
  const visibleCats = HELP_TOPICS
    .filter(c => !activeCat || c.cat === activeCat)
    .map(c => ({
      ...c,
      items: c.items.filter(it => !q || it.q.toLowerCase().includes(q) || it.a.toLowerCase().includes(q)),
    }))
    .filter(c => c.items.length > 0);
  const totalMatches = visibleCats.reduce((n, c) => n + c.items.length, 0);

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 30,
      background: 'radial-gradient(120% 80% at 50% 28%, #2E4878 0%, #1B3460 50%, #142850 100%)',
      display: 'flex', flexDirection: 'column',
      fontFamily: "'Inter Tight', sans-serif", color: '#FFFFFF',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '60px 20px 12px',
      }}>
        <button onClick={onClose} aria-label="Back" style={{
          width: 36, height: 36, borderRadius: 999,
          background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', color: '#FFF', padding: 0,
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <div style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
          letterSpacing: '0.18em', color: 'rgba(180,205,255,0.7)',
        }}>HELP CENTER</div>
        <div style={{ width: 36 }}></div>
      </div>

      <div style={{ padding: '4px 20px 0' }}>
        <div style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-0.02em', marginBottom: 4 }}>How can we help?</div>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', marginBottom: 18 }}>Search articles or reach out — we usually reply within 24 hours.</div>

        {/* Search */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '12px 14px', borderRadius: 12, marginBottom: 14,
          background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)',
        }}>
          <span style={{ color: 'rgba(180,205,255,0.8)', display: 'flex' }}>
            {Icon.search ? Icon.search(16, 'rgba(180,205,255,0.85)') : null}
          </span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search help articles…"
            style={{
              flex: 1, background: 'transparent', border: 'none', outline: 'none',
              color: '#FFFFFF', fontFamily: "'Inter Tight', sans-serif",
              fontSize: 14, padding: 0,
            }}
          />
          {query && (
            <button onClick={() => setQuery('')} aria-label="Clear" style={{
              background: 'transparent', border: 'none', padding: 0,
              color: 'rgba(255,255,255,0.55)', cursor: 'pointer', display: 'flex',
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 6l12 12M18 6l-12 12"/></svg>
            </button>
          )}
        </div>

        {/* Category chips */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 18 }}>
          <button onClick={() => setActiveCat(null)} style={chipStyle(!activeCat)}>All</button>
          {HELP_TOPICS.map((c) => (
            <button key={c.cat} onClick={() => setActiveCat(c.cat === activeCat ? null : c.cat)} style={chipStyle(activeCat === c.cat)}>{c.cat}</button>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 16px' }}>
        {totalMatches === 0 ? (
          <div style={{
            padding: '22px 16px', borderRadius: 14, textAlign: 'center',
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)',
            fontSize: 13.5, color: 'rgba(255,255,255,0.65)', lineHeight: 1.55,
          }}>
            No matches for "<span style={{ color: '#FFFFFF', fontWeight: 500 }}>{query}</span>".<br/>
            Try different words, or send us a note below.
          </div>
        ) : visibleCats.map((c) => (
          <div key={c.cat} style={{ marginBottom: 16 }}>
            <SheetLabel>{c.cat.toUpperCase()}</SheetLabel>
            <div style={{
              borderRadius: 14, overflow: 'hidden',
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)',
            }}>
              {c.items.map((it, i) => {
                const key = c.cat + ':' + i;
                const open = openKey === key;
                return (
                  <div key={key} style={{
                    borderTop: i === 0 ? 'none' : '1px solid rgba(255,255,255,0.06)',
                  }}>
                    <button
                      onClick={() => setOpenKey(open ? null : key)}
                      style={{
                        width: '100%', textAlign: 'left', cursor: 'pointer',
                        padding: '14px 16px', display: 'flex',
                        alignItems: 'center', gap: 12, background: 'transparent', border: 'none',
                        color: '#FFFFFF', fontFamily: "'Inter Tight', sans-serif",
                      }}
                    >
                      <div style={{ flex: 1, fontSize: 14, fontWeight: 500, lineHeight: 1.4 }}>{it.q}</div>
                      <span style={{ color: 'rgba(255,255,255,0.4)', transition: 'transform 200ms', transform: open ? 'rotate(90deg)' : 'none' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                      </span>
                    </button>
                    {open && (
                      <div style={{
                        padding: '0 16px 14px',
                        fontSize: 13, color: 'rgba(255,255,255,0.72)', lineHeight: 1.55,
                      }}>{it.a}</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Contact card */}
        <div style={{
          marginTop: 8, padding: 16, borderRadius: 14,
          background: 'linear-gradient(135deg, rgba(180,205,255,0.10) 0%, rgba(180,205,255,0.03) 100%)',
          border: '1px solid rgba(180,205,255,0.20)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'rgba(180,205,255,0.18)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#B4CDFF',
            }}>{Icon.chat ? Icon.chat(18, '#B4CDFF') : null}</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>Still stuck?</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>Most answers within 24 hours.</div>
            </div>
          </div>
          <button onClick={onContact} style={{
            width: '100%', padding: '12px 14px', borderRadius: 12,
            background: '#B4CDFF', color: '#0D1F3C',
            border: 'none', cursor: 'pointer',
            fontFamily: "'Inter Tight', sans-serif",
            fontSize: 14, fontWeight: 600, letterSpacing: '-0.01em',
          }}>Contact support</button>
        </div>

        <div style={{
          textAlign: 'center', marginTop: 14,
          fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
          letterSpacing: '0.16em', color: 'rgba(255,255,255,0.4)',
        }}>ALIGN · v1.0.0 · STATUS NORMAL</div>
      </div>
    </div>
  );
}

function chipStyle(active) {
  return {
    padding: '7px 12px', borderRadius: 999, cursor: 'pointer',
    background: active ? '#B4CDFF' : 'rgba(255,255,255,0.05)',
    border: '1px solid ' + (active ? '#B4CDFF' : 'rgba(255,255,255,0.10)'),
    color: active ? '#0D1F3C' : 'rgba(255,255,255,0.78)',
    fontFamily: "'Inter Tight', sans-serif",
    fontSize: 12, fontWeight: active ? 600 : 500,
    letterSpacing: '-0.005em',
    transition: 'background 160ms, color 160ms, border-color 160ms',
  };
}

// ─────────────── Feedback sheet ───────────────
function FeedbackSheet({ email, onClose, onSubmitted }) {
  const TYPES = [
    { id: 'bug',     label: 'Bug',     desc: 'Something\'s broken' },
    { id: 'idea',    label: 'Idea',    desc: 'I wish ALIGN could…' },
    { id: 'praise',  label: 'Praise',  desc: 'Something I love' },
    { id: 'other',   label: 'Other',   desc: 'General feedback' },
  ];
  const [type, setType] = React.useState('idea');
  const [rating, setRating] = React.useState(0);
  const [note, setNote] = React.useState('');
  const [includeLogs, setIncludeLogs] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);
  const [done, setDone] = React.useState(false);

  const canSend = note.trim().length >= 6 && !submitting;

  const submit = () => {
    if (!canSend) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setDone(true);
      setTimeout(() => {
        const msg = type === 'praise' ? 'Thanks — we\'ll share it with the team.' : 'Feedback sent. We read every note.';
        onSubmitted && onSubmitted(msg);
      }, 900);
    }, 800);
  };

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 30,
      background: 'radial-gradient(120% 80% at 50% 28%, #2E4878 0%, #1B3460 50%, #142850 100%)',
      display: 'flex', flexDirection: 'column',
      fontFamily: "'Inter Tight', sans-serif", color: '#FFFFFF',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '60px 20px 12px',
        opacity: done ? 0 : 1, transition: 'opacity 240ms',
      }}>
        <button onClick={onClose} aria-label="Back" style={{
          width: 36, height: 36, borderRadius: 999,
          background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', color: '#FFF', padding: 0,
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <div style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
          letterSpacing: '0.18em', color: 'rgba(180,205,255,0.7)',
        }}>FEEDBACK</div>
        <div style={{ width: 36 }}></div>
      </div>

      {done ? (
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 28px 60px',
        }}>
          <div style={{
            width: 72, height: 72, borderRadius: '50%',
            background: 'rgba(180,205,255,0.14)',
            border: '1px solid rgba(180,205,255,0.28)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 22, animation: 'alignFadeIn 320ms ease-out both',
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#B4CDFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em', marginBottom: 8 }}>Got it — thanks.</div>
          <div style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.62)', lineHeight: 1.55, maxWidth: 280 }}>
            Your note went to the ALIGN team. We read every one, and we'll reply at <span style={{ color: '#FFFFFF' }}>{email}</span> if it needs a response.
          </div>
          <style>{`@keyframes alignFadeIn { from { opacity: 0; transform: scale(0.92);} to { opacity: 1; transform: scale(1);} }`}</style>
        </div>
      ) : (
        <React.Fragment>
          <div style={{ padding: '4px 20px 0' }}>
            <div style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-0.02em', marginBottom: 4 }}>Send us a note</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', marginBottom: 18 }}>Bug, idea, or kind word — we read all of it.</div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 24px' }}>
            <SheetLabel>TYPE</SheetLabel>
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, marginBottom: 18,
            }}>
              {TYPES.map((t) => {
                const active = type === t.id;
                return (
                  <button key={t.id} onClick={() => setType(t.id)} style={{
                    padding: '12px 12px', borderRadius: 12, textAlign: 'left',
                    background: active ? 'rgba(180,205,255,0.16)' : 'rgba(255,255,255,0.04)',
                    border: '1px solid ' + (active ? '#B4CDFF' : 'rgba(255,255,255,0.08)'),
                    color: '#FFFFFF', cursor: 'pointer',
                    fontFamily: "'Inter Tight', sans-serif",
                    transition: 'background 160ms, border-color 160ms',
                  }}>
                    <div style={{ fontSize: 14, fontWeight: 600, letterSpacing: '-0.01em', marginBottom: 2 }}>{t.label}</div>
                    <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.55)' }}>{t.desc}</div>
                  </button>
                );
              })}
            </div>

            <SheetLabel>OVERALL EXPERIENCE</SheetLabel>
            <div style={{
              display: 'flex', justifyContent: 'space-between', gap: 8,
              padding: '14px 12px', borderRadius: 14, marginBottom: 18,
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)',
            }}>
              {[1, 2, 3, 4, 5].map((n) => {
                const filled = rating >= n;
                return (
                  <button key={n} onClick={() => setRating(rating === n ? 0 : n)} aria-label={n + ' stars'} style={{
                    flex: 1, padding: '6px 0', background: 'transparent', border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <svg width="28" height="28" viewBox="0 0 24 24"
                      fill={filled ? '#F5E6C8' : 'none'}
                      stroke={filled ? '#F5E6C8' : 'rgba(255,255,255,0.35)'}
                      strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round">
                      <path d="M12 3l2.7 5.5 6 .9-4.3 4.2 1 6L12 16.8 6.6 19.6l1-6L3.3 9.4l6-.9L12 3z"/>
                    </svg>
                  </button>
                );
              })}
            </div>

            <SheetLabel>YOUR MESSAGE</SheetLabel>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value.slice(0, 1000))}
              placeholder={
                type === 'bug'    ? 'What were you doing when it broke? What did you expect?' :
                type === 'idea'   ? "I wish ALIGN could…" :
                type === 'praise' ? 'What\'s working for you?' :
                                    'Tell us anything.'
              }
              rows={6}
              style={{
                width: '100%', padding: '12px 14px', borderRadius: 12, resize: 'vertical',
                background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)',
                color: '#FFFFFF', fontFamily: "'Inter Tight', sans-serif",
                fontSize: 14, lineHeight: 1.5, outline: 'none',
                boxSizing: 'border-box', minHeight: 120,
              }}
            />
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              fontSize: 11, color: 'rgba(255,255,255,0.45)',
              fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.08em',
              margin: '6px 2px 18px',
            }}>
              <span>{note.length < 6 ? 'AT LEAST 6 CHARS' : 'LOOKS GOOD'}</span>
              <span>{note.length} / 1000</span>
            </div>

            <SheetLabel>FROM</SheetLabel>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px 14px', borderRadius: 12, marginBottom: 14,
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)',
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: 8,
                background: 'rgba(180,205,255,0.10)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{Icon.mail ? Icon.mail(14, '#B4CDFF') : null}</div>
              <div style={{ flex: 1, fontSize: 13.5, color: 'rgba(255,255,255,0.85)' }}>{email}</div>
              <span style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
                letterSpacing: '0.14em', color: 'rgba(255,255,255,0.5)',
              }}>{"WE'LL REPLY HERE"}</span>
            </div>

            <button
              onClick={() => setIncludeLogs(!includeLogs)}
              style={{
                width: '100%', textAlign: 'left', cursor: 'pointer',
                padding: '12px 14px', borderRadius: 12, marginBottom: 22,
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)',
                display: 'flex', alignItems: 'flex-start', gap: 12,
                fontFamily: "'Inter Tight', sans-serif", color: '#FFFFFF',
              }}
            >
              <div style={{
                width: 18, height: 18, borderRadius: 5, marginTop: 1, flexShrink: 0,
                background: includeLogs ? '#B4CDFF' : 'transparent',
                border: '1.5px solid ' + (includeLogs ? '#B4CDFF' : 'rgba(255,255,255,0.30)'),
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {includeLogs && (
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#0D1F3C" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                )}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13.5, fontWeight: 500 }}>Include anonymous app logs</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', marginTop: 2, lineHeight: 1.45 }}>
                  Recent screen, device, and error info — no photos or personal data. Helps us debug faster.
                </div>
              </div>
            </button>

            <button
              onClick={submit}
              disabled={!canSend}
              style={{
                width: '100%', padding: '14px 16px', borderRadius: 14,
                background: canSend ? '#B4CDFF' : 'rgba(180,205,255,0.22)',
                color: canSend ? '#0D1F3C' : 'rgba(255,255,255,0.45)',
                border: 'none', cursor: canSend ? 'pointer' : 'not-allowed',
                fontFamily: "'Inter Tight', sans-serif",
                fontSize: 15, fontWeight: 600, letterSpacing: '-0.01em',
              }}
            >{submitting ? 'Sending…' : 'Send feedback'}</button>
          </div>
        </React.Fragment>
      )}
    </div>
  );
}

window.ProfileScreen = ProfileScreen;
