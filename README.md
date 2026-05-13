# ALIGN — Mobile UI Kit

Pixel-fidelity recreation of the ALIGN mobile app for posture correction. Built as a click-through prototype around 7 core screens: **Welcome → Questionnaire → Photos guidées → Bilan → Aujourd'hui (home) → Séance / Pro**.

## Structure

| File | Purpose |
|---|---|
| `index.html` | Interactive demo — pick any screen, toggle Pro state, click through |
| `components.jsx` | Shared primitives: `PrimaryButton`, `Card`, `Chip`, `TabBar`, `Icon`, `Screen`, … |
| `WelcomeScreen.jsx` | First-launch screen |
| `QuestionnaireScreen.jsx` | Onboarding question with multi-select chips |
| `PhotoScreen.jsx` | Optional guided posture photos |
| `BilanScreen.jsx` | Assessment results (precise or estimated) |
| `TodayScreen.jsx` | Home hub with today's session, stats, week list, Pro upsell |
| `SessionScreen.jsx` | Active exercise with timer + posture diagram |
| `ProScreen.jsx` | Pro subscription paywall |
| `ios-frame.jsx` | iOS device frame (starter component) |

## Dynamic tab bar

The hero interaction is the **disappearing Pro tab**: in the demo, toggle the "Compte Pro actif" pill to see the tab bar shrink from 5 to 4 items as the Pro tab is removed after subscription. Same effect when you click *S'abonner à ALIGN Pro* on the Pro screen.

## Notes
- All copy is in French and follows the tone defined in the root `README.md` (CONTENT FUNDAMENTALS).
- All design tokens come from `../../colors_and_type.css` — no hardcoded brand colors.
- Posture silhouettes are loaded from `../../assets/posture/*.svg`.
