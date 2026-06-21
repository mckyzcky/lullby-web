# Lullby Web Landing Page Handoff

Use this as the starting context for working on the Lullby web landing page in a separate Codex chat.

## Project Context

Lullby is an Expo SDK 55 mobile app for ambient sleep sounds. Users build custom sleep mixes, run timers, save presets, share public presets, and unlock Pro features through RevenueCat.

The mobile app lives in:

- `app/` for Expo Router routes
- `src/` for shared feature code, components, store, theme, audio catalog, and utilities

The web landing page must stay separate from the mobile app. Do not fold landing-page work into the Expo app routes unless explicitly requested.

## Web App Boundary

The intended website shape is a standalone Next.js app under:

```text
lullby-web/
```

It should be independently deployable and movable without depending on the Expo app build.

Expected standalone files from the previous web-app shape:

```text
lullby-web/package.json
lullby-web/app/layout.js
lullby-web/app/page.js
lullby-web/app/preset/page.js
lullby-web/app/globals.css
lullby-web/public/icon.png
lullby-web/public/favicon.ico
lullby-web/public/.well-known/apple-app-site-association
```

Before changing anything, inspect the current worktree. At the time this handoff was written, `git status` showed many existing user changes and `lullby-web/` appeared as deleted. Treat that as user-owned state unless the current prompt specifically asks you to restore or recreate it.

## Product Details To Reflect

Core promise:

Lullby helps people create calm sleep soundscapes from layered ambient sounds, save favorite mixes, and share presets with others.

Current bundled sounds:

- Campfire
- Forest
- Rain
- Thunder
- Waves
- Winds
- Bass

Important app features:

- Mix multiple ambient sounds with per-sound volume.
- Run sleep timers.
- Save personal presets.
- Browse app-generated, community, user-saved, custom, and favorite presets.
- Share presets through public HTTPS links.
- Use weather-aware and time-aware suggestions when enabled.
- Unlock Pro-only behavior through RevenueCat.
- Add custom audio files as a Pro-oriented feature.

Tone:

- Calm, premium, sleep-focused, minimal.
- Avoid cluttered marketing sections.
- Keep the first viewport focused on the product name, the sleep-mix value proposition, and a clear app-oriented call to action.

Visual direction:

- Match the app's dark theme.
- Default palette from `src/constants/theme.ts`:
  - Background: `#0B1020`
  - Surface: `#151B2D`
  - Primary: `#5EEAD4`
  - Secondary: `#7C9EFF`
  - Warm accent: `#F6C177`
  - Text primary: `#F8FAFC`
  - Text secondary: `#94A3B8`
  - Border: `rgba(255,255,255,0.12)`
- Font family in the app is Montserrat.
- Use the app icon from `src/assets/icon.png` or copy it into `lullby-web/public/icon.png` if the standalone site needs its own asset.

## Routes And Deep-Link Requirements

Production domain:

```text
https://lullby.mckyzcky.com
```

Required public routes:

```text
/
/preset?id=PRESET_ID
/.well-known/apple-app-site-association
```

Preset sharing currently creates links like:

```text
https://lullby.mckyzcky.com/preset?id=...
```

The `/preset` page is not just a generic landing page. It supports rich link previews and Universal Links for shared presets. The mobile app is configured with:

```text
applinks:lullby.mckyzcky.com
```

Keep the Apple App Site Association file aligned with the public route shape. For the subdomain version, `/preset*` is the important path.

Expected shared preset behavior:

- Show a branded Lullby preview.
- Include useful metadata for rich iOS previews.
- Preserve the preset ID query parameter in metadata/canonical links where relevant.
- Redirect or hand off to the app using Universal Links behavior.
- Do not replace the mobile `app/shared-preset.tsx` behavior unless asked.

## Deployment Notes

The web app should deploy to Vercel with the root directory set to `lullby-web`.

If `/.well-known/apple-app-site-association` returns `200` but `/` or `/preset` return `404` with `x-vercel-error: NOT_FOUND`, first check the Vercel Root Directory. A common failure mode is deploying the wrong folder, such as `public`, instead of `lullby-web`.

## Guardrails

- Keep web work in `lullby-web/`.
- Do not edit mobile app files unless the current prompt explicitly asks for it.
- Do not change shared preset URLs without coordinating with `src/features/presets/sharePreset.ts`.
- Do not change associated domains in `app.json` unless explicitly asked.
- Do not rely on Expo static export for this landing page; previous attempts hit server-rendering issues from mobile-only storage/state.
- Preserve existing user changes. Check `git status --short` before editing.

## Useful Files To Inspect

Mobile context:

```text
README.md
app.json
src/constants/theme.ts
src/assets/sounds.json
src/features/presets/sharePreset.ts
src/features/audio/sounds.ts
app/(tabs)/mix/index.tsx
app/(tabs)/presets/index.tsx
```

Web context, if present:

```text
lullby-web/package.json
lullby-web/app/layout.js
lullby-web/app/page.js
lullby-web/app/preset/page.js
lullby-web/app/globals.css
lullby-web/public/.well-known/apple-app-site-association
```

## Suggested Work Order For The Other Chat

1. Run `git status --short` and inspect whether `lullby-web/` currently exists or is deleted.
2. Confirm the user wants either a restoration of the standalone web app or a redesign/update of the existing standalone app.
3. Keep all web edits inside `lullby-web/`.
4. Build or update the landing page at `/`.
5. Preserve or recreate `/preset?id=...` with metadata and Universal Link support.
6. Verify locally with `npm run build` inside `lullby-web`.
7. For live deployment issues, verify Vercel Root Directory before changing code.

## Verification Commands

From the repo root:

```bash
git status --short
```

From the standalone web app:

```bash
cd lullby-web
npm install
npm run build
```

After deployment, verify:

```text
https://lullby.mckyzcky.com
https://lullby.mckyzcky.com/preset?id=test
https://lullby.mckyzcky.com/.well-known/apple-app-site-association
```
