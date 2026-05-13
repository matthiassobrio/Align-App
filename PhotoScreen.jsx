// ALIGN — Photo capture / guided photo screen (optional step in onboarding)
function PhotoScreen({ onNext, onSkip }) {
  return (
    <Screen padBottom={180}>
      <ScreenHeader
        left={
          <button style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 999, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#FFF' }}>
            {Icon.close(18)}
          </button>
        }
        right={<div style={{ fontSize: 13, color: 'rgba(255,255,255,0.52)', fontWeight: 500 }}>Step 5/6</div>}
      />

      <div style={{ padding: '0 20px' }}>
        <Eyebrow>Precise assessment</Eyebrow>
        <h1 style={{
          fontFamily: "'Inter Tight', sans-serif",
          fontSize: 28, fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1.2,
          margin: '12px 0 8px', color: '#FFFFFF',
        }}>
          Three guided photos
        </h1>
        <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.72)', margin: '0 0 24px', lineHeight: 1.55 }}>
          For a precise reading, take a photo of yourself from the front, side, and back.
          You can also get an estimate without photos.
        </p>

        <div style={{
          height: 280, borderRadius: 24,
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-around',
          marginBottom: 20,
        }}>
          {['front', 'side', 'back'].map((view, i) => (
            <div key={view} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, opacity: i === 0 ? 1 : 0.45 }}>
              <div style={{ color: i === 0 ? '#B4CDFF' : 'rgba(255,255,255,0.5)', height: 160 }}>
                <object data={`../../assets/posture/${view}.svg`} type="image/svg+xml" style={{ height: '100%', pointerEvents: 'none' }} />
              </div>
              <div style={{ fontSize: 11, color: i === 0 ? '#B4CDFF' : 'rgba(255,255,255,0.5)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                {view === 'front' ? 'Front' : view === 'side' ? 'Side' : 'Back'}
              </div>
            </div>
          ))}
        </div>

        <Card>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <div style={{ color: '#B4CDFF', flexShrink: 0, marginTop: 2 }}>{Icon.camera(20, '#B4CDFF')}</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#FFFFFF', marginBottom: 4 }}>Tips</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.62)', lineHeight: 1.5 }}>
                Wear fitted clothing, use a neutral background, place the phone at hip height. Your photos stay on your device.
              </div>
            </div>
          </div>
        </Card>
      </div>

      <StickyBottom>
        <PrimaryButton onClick={onNext}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            {Icon.camera(18, '#0D1F3C')} Take the first photo
          </span>
        </PrimaryButton>
        <div style={{ textAlign: 'center', marginTop: 12 }}>
          <LinkButton onClick={onSkip}>get an estimate without photos</LinkButton>
        </div>
      </StickyBottom>
    </Screen>
  );
}

window.PhotoScreen = PhotoScreen;
