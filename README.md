# NeuroLab Live

Interactive Neuromarketing Seminar Platform — a responsive web app for live audience participation in neuromarketing workshops.

## Tech Stack

- **Next.js 16** (App Router, Turbopack)
- **TypeScript**
- **Tailwind CSS v4**
- **Zustand** for state management
- **Recharts** for data visualization
- **qrcode.react** for QR code generation

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Architecture

- **Presenter mode**: Create a session → get a code/QR → manage exercises → view live results
- **Participant mode**: Join with code + alias → complete exercises on mobile

### Modules

| # | Module | Description |
|---|--------|-------------|
| 1 | Session Join | Enter code + alias / create session |
| 2 | Attention Test | 6 stimuli shown for 1.3s, recall/emotion/brand questions |
| 3 | Face Priming | 20 rounds, priming word → choose sympathetic face |
| 4 | Brand Quadrant | Map brands to CARE/LUST/PLAY/SEEKING quadrants |
| 5 | Free Energy Routine | Rate scenarios on 5 dimensions |
| 6 | Neuro Product Tuner | A×F/Z score → sensory recommendations |
| 7 | Company Diagnosis | Neuro Gap Map with current vs target system |
| 8 | Presenter Dashboard | QR code, live results, timer, export |

### File Structure

```
src/
├── app/
│   ├── globals.css         # Theme & custom styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Route controller
├── components/
│   ├── SessionJoin.tsx
│   ├── AttentionTest.tsx
│   ├── FacePriming.tsx
│   ├── BrandQuadrant.tsx
│   ├── FreeEnergy.tsx
│   ├── NeuroTuner.tsx
│   ├── CompanyDiagnosis.tsx
│   ├── PresenterDashboard.tsx
│   └── ParticipantView.tsx
├── data/
│   └── placeholders.ts     # Stimuli, brands, priming words
└── store/
    └── useSessionStore.ts  # Zustand global state
```

## Extending with Supabase/Firebase

The store is designed to be backend-ready. Replace Zustand actions with real-time database calls (e.g., Supabase Realtime channels or Firebase RTDB) to sync state across presenter and participants.

## Export

Presenter can export all session data as JSON via the dashboard.
