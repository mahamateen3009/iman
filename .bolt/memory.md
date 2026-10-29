# Project memory

## Product intent & audience

- **Iman**: age-tailored digital wellbeing platform (hackathon project)
- Team: Baito Bytes (Maha Mateen — lead, Sania Gulzar, Stanzin Chuskit)
- Hackathon: Hacktoberfest Kashmir (2026)
- Target users span multiple age groups; UI adapts presentation per age group
- Core features: prayer tracking, prayer reminders, conversation history, game progress, user profiles

## Brand personality & voice

- Wellbeing/spiritual context (name "Iman" = faith); tone should feel calm, supportive, age-adaptive
- Hackathon-demo polish expected — production-worthy, not throwaway

## Visual design & UX direction

- Framework: React 18 + TypeScript, Vite, Tailwind CSS, Lucide React icons (confirmed in `package.json`)
- `@/` path alias maps to `src/`; import via `@/components/Foo` not deep relative paths
- Age-adaptive layouts: responsive grids, dynamic styling per age group
- Low-signal fault tolerance: UI must remain smooth during network drops; localStorage fallback prevents infinite spinners/freezes
- Global `.bolt/prompt` instructions govern design quality and icon usage — not restated here

## Decisions, constraints & rationale

- **Auth**: currently running in **local mock mode** for hackathon demo — `signIn`/`signUp` create localStorage-backed sessions, do NOT call Supabase Auth. Supabase Auth code paths exist but are unused at runtime.
- **DB schema** (Supabase / PostgreSQL): actual tables are `profiles`, `conversations`, `prayer_tracker`, `prayer_reminders`, `game_progress`. Profile stores: name, age, age-group, DOB, gender, voice preferences.
- **Deployment**: no `vercel.json` or CI/CD config in project; deployment status unverified. Not a git repo locally.
- `package.json` name is still `vite-react-typescript-starter` — known mismatch; may need renaming to `iman`.
- Architecture: decoupled SPA, four layers (presentation / build / backend / data resilience)

## Open questions & assumptions

- Live URL `iman-wellbeing.vercel.app` unverified — user needs to confirm
- GitHub repo `mahamateen3009/iman` unverified — no git repo locally
- CI/CD claim unsubstantiated — no `.github/workflows/`
- Should `package.json` be renamed to `iman`?
- Will mock auth be replaced with real Supabase Auth before final submission, or kept as-is?