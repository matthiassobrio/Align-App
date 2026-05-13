// ALIGN — Onboarding questionnaire screen
function DragSlider({ label, value, setValue, min, max, unit }) {
  const trackRef = React.useRef(null);
  const [dragging, setDragging] = React.useState(false);
  const pct = ((value - min) / (max - min)) * 100;

  const updateFromClientX = (clientX) => {
    const rect = trackRef.current.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    setValue(Math.round(min + ratio * (max - min)));
  };

  React.useEffect(() => {
    if (!dragging) return;
    const move = (e) => {
      const x = e.touches ? e.touches[0].clientX : e.clientX;
      updateFromClientX(x);
    };
    const stop = () => setDragging(false);
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', stop);
    window.addEventListener('touchmove', move, { passive: false });
    window.addEventListener('touchend', stop);
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', stop);
      window.removeEventListener('touchmove', move);
      window.removeEventListener('touchend', stop);
    };
  }, [dragging]);

  const start = (e) => {
    e.preventDefault();
    setDragging(true);
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    updateFromClientX(x);
  };

  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.62)', fontWeight: 500 }}>{label}</div>
        <div style={{ fontFamily: "'Inter Tight', sans-serif", fontSize: 17, fontWeight: 600, color: '#FFFFFF', fontVariantNumeric: 'tabular-nums' }}>
          {value}<span style={{ fontSize: 11, color: 'rgba(180,205,255,0.7)', marginLeft: 3, fontWeight: 500, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.06em' }}>{unit}</span>
        </div>
      </div>
      <div
        ref={trackRef}
        onMouseDown={start}
        onTouchStart={start}
        style={{ position: 'relative', height: 22, cursor: 'pointer', touchAction: 'none', userSelect: 'none' }}
      >
        <div style={{
          position: 'absolute', left: 0, right: 0, top: 10,
          height: 2, borderRadius: 2, background: 'rgba(255,255,255,0.10)',
        }}>
          <div style={{
            position: 'absolute', left: 0, top: 0, bottom: 0,
            width: `${pct}%`, background: '#B4CDFF',
            boxShadow: '0 0 6px rgba(180,205,255,0.6)',
          }} />
        </div>
        <div style={{
          position: 'absolute', top: 1, left: `${pct}%`,
          transform: 'translateX(-50%)',
          width: 20, height: 20, borderRadius: '50%',
          background: '#FFFFFF',
          boxShadow: dragging
            ? '0 0 0 6px rgba(180,205,255,0.18), 0 4px 12px rgba(0,0,0,0.3)'
            : '0 2px 8px rgba(0,0,0,0.25)',
          border: '1.5px solid #B4CDFF',
          transition: dragging ? 'none' : 'box-shadow 0.18s ease',
        }} />
      </div>
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <div style={{
      fontSize: 11, color: 'rgba(180,205,255,0.7)',
      fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase',
      marginBottom: 10, marginTop: 6,
    }}>{children}</div>
  );
}

function OtherSheet({ title, options, selected, onToggle, onClose }) {
  const [query, setQuery] = React.useState('');
  const filtered = options.filter(o => o.toLowerCase().includes(query.toLowerCase()) && !selected.includes(o));
  const customable = query.trim() && !options.some(o => o.toLowerCase() === query.toLowerCase()) && !selected.some(o => o.toLowerCase() === query.toLowerCase());

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 10, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }} />
      <div style={{
        position: 'relative', background: '#0F1B33',
        borderTop: '1px solid rgba(180,205,255,0.16)',
        borderRadius: '20px 20px 0 0', padding: '14px 20px 24px',
        maxHeight: '78%', display: 'flex', flexDirection: 'column',
      }}>
        <div style={{ width: 36, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.18)', margin: '0 auto 14px' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ fontSize: 16, fontWeight: 600, color: '#FFF' }}>{title}</div>
          <button onClick={onClose} style={{ background: 'transparent', border: 0, color: 'rgba(255,255,255,0.6)', fontSize: 13, cursor: 'pointer' }}>Done</button>
        </div>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search or type your own…"
          style={{
            width: '100%', boxSizing: 'border-box',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.10)',
            borderRadius: 10, padding: '10px 12px',
            color: '#FFF', fontSize: 14, fontFamily: 'inherit',
            outline: 'none', marginBottom: 14,
          }}
        />
        <div style={{ overflowY: 'auto', display: 'flex', flexWrap: 'wrap', gap: 8, paddingBottom: 6 }}>
          {customable && (
            <Chip compact onClick={() => { onToggle(query.trim()); setQuery(''); }} style={{ borderStyle: 'dashed', color: '#B4CDFF' }}>
              + Add "{query.trim()}"
            </Chip>
          )}
          {filtered.map(o => (
            <Chip key={o} compact onClick={() => onToggle(o)}>{o}</Chip>
          ))}
          {!filtered.length && !customable && (
            <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, padding: '8px 4px' }}>Nothing else to add.</div>
          )}
        </div>
      </div>
    </div>
  );
}

function QuestionnaireScreen({ step = 2, total = 6, onNext, onBack }) {
  const [selected, setSelected] = React.useState(['Neck', 'Lower back']);
  const [sports, setSports] = React.useState(['Running', 'Yoga']);
  const [age, setAge] = React.useState(32);
  const [height, setHeight] = React.useState(172);
  const [weight, setWeight] = React.useState(68);
  const [sitting, setSitting] = React.useState(7);
  const [zoneSheet, setZoneSheet] = React.useState(false);
  const [sportSheet, setSportSheet] = React.useState(false);
  const toggle = (zone) => setSelected(s => s.includes(zone) ? s.filter(z => z !== zone) : [...s, zone]);
  const toggleSport = (s) => setSports(arr => arr.includes(s) ? arr.filter(x => x !== s) : [...arr, s]);
  const zones = ['Neck', 'Shoulders', 'Upper back', 'Lower back', 'Hips', 'Knees', 'None'];
  const moreZones = ['Jaw', 'Mid back', 'Glutes', 'Hamstrings', 'Calves', 'Ankles', 'Wrists', 'Elbows', 'Feet'];
  const sportsList = ['Running', 'Cycling', 'Yoga', 'Pilates', 'Strength', 'Swimming', 'Climbing', 'Tennis', 'None'];
  const moreSports = ['Boxing', 'Crossfit', 'Dance', 'Golf', 'Hiking', 'Martial arts', 'Rowing', 'Skiing', 'Soccer', 'Surfing', 'Walking'];

  return (
    <Screen padBottom={120}>
      <ScreenHeader
        left={
          <button onClick={onBack} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 999, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#FFF' }}>
            {Icon.arrowLeft(16)}
          </button>
        }
        right={
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.52)', fontWeight: 500, fontVariantNumeric: 'tabular-nums' }}>
            {step}/{total}
          </div>
        }
      />

      <div style={{ padding: '0 20px 12px' }}>
        <ProgressBar value={(step / total) * 100} />
      </div>

      <div style={{ padding: '8px 20px 0' }}>
        <Eyebrow>Question {step}</Eyebrow>
        <h1 style={{
          fontFamily: "'Inter Tight', sans-serif",
          fontSize: 24, fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1.2,
          margin: '8px 0 4px', color: '#FFFFFF',
        }}>
          A bit about you.
        </h1>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.62)', margin: '0 0 18px' }}>
          So we can tailor your program.
        </p>

        {/* 1. Body sliders */}
        <SectionLabel>Body</SectionLabel>
        <DragSlider label="Age"    value={age}    setValue={setAge}    min={16}  max={80}  unit="yrs" />
        <DragSlider label="Height" value={height} setValue={setHeight} min={140} max={210} unit="cm" />
        <DragSlider label="Weight" value={weight} setValue={setWeight} min={40}  max={140} unit="kg" />

        <div style={{ height: 14 }} />

        {/* 2. Tension zones */}
        <SectionLabel>Where do you feel tension?</SectionLabel>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 18 }}>
          {zones.map(z => (
            <Chip key={z} selected={selected.includes(z)} onClick={() => toggle(z)} compact>
              {z}
            </Chip>
          ))}
          {selected.filter(z => !zones.includes(z)).map(z => (
            <Chip key={z} selected onClick={() => toggle(z)} compact>{z}</Chip>
          ))}
          <Chip onClick={() => setZoneSheet(true)} compact style={{ borderStyle: 'dashed', color: 'rgba(180,205,255,0.85)' }}>+ Other</Chip>
        </div>

        <SectionLabel>Sports & activities</SectionLabel>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 20 }}>
          {sportsList.map(s => (
            <Chip key={s} selected={sports.includes(s)} onClick={() => toggleSport(s)} compact>
              {s}
            </Chip>
          ))}
          {sports.filter(s => !sportsList.includes(s)).map(s => (
            <Chip key={s} selected onClick={() => toggleSport(s)} compact>{s}</Chip>
          ))}
          <Chip onClick={() => setSportSheet(true)} compact style={{ borderStyle: 'dashed', color: 'rgba(180,205,255,0.85)' }}>+ Other</Chip>
        </div>

        {/* 4. Sitting per day */}
        <SectionLabel>Lifestyle</SectionLabel>
        <DragSlider label="Sitting / day" value={sitting} setValue={setSitting} min={0} max={16} unit="h" />
      </div>

      <StickyBottom>
        <PrimaryButton onClick={onNext} disabled={selected.length === 0}>Continue</PrimaryButton>
      </StickyBottom>

      {zoneSheet && (
        <OtherSheet
          title="Add a tension area"
          options={moreZones}
          selected={selected}
          onToggle={toggle}
          onClose={() => setZoneSheet(false)}
        />
      )}
      {sportSheet && (
        <OtherSheet
          title="Add an activity"
          options={moreSports}
          selected={sports}
          onToggle={toggleSport}
          onClose={() => setSportSheet(false)}
        />
      )}
    </Screen>
  );
}

window.QuestionnaireScreen = QuestionnaireScreen;
