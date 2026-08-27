# Avika Nigam — Interactive Portfolio

An interactive digital portfolio for Avika Nigam: BCA student, AI/ML learner and software builder.
Built as a dark, cinematic single-page experience with a placeholder for a future real-time AI avatar
you can talk to by voice.

## Getting started

```bash
npm install
npm run dev
```

```bash
npm run build     # production build
npm run preview   # preview the production build
```

## Structure

- `src/data/portfolioData.ts` — all content (single source of truth, separate from UI)
- `src/components/portfolio/*` — Navbar, Hero, AvatarExperience, VoiceInteraction, About, Skills,
  SkillGroup, Projects, ProjectCard, ProjectDetail, Journey, Milestone, WhatIBring, Contact,
  ContactForm, Footer
- `src/routes/` — file-based routing (home page + custom 404)
- `src/styles.css` — design tokens (colors, gradients, animations)

## Backend

The database is used for one thing only: storing contact form submissions in a
`contact_messages` table. Row-level security allows inserts from the public site and no reads,
updates or deletes. There is no login or signup anywhere on the site.

## Future AI avatar (architecture only — not implemented)

```
visitor speech -> speech-to-text -> LLM -> portfolio knowledge
               -> response -> text-to-speech -> real-time avatar -> visitor
```

`AvatarExperience` is presentation-only and driven by a single `state` prop
(`idle | listening | thinking | speaking | error`). A real-time avatar provider can later be mounted
inside its stage without touching the surrounding UI. No API keys live in the frontend; any future
keys stay server-side via environment variables.
