# Lullby Web

Standalone Next app for the Lullby landing and shared preset preview pages.
This folder can be moved out of the mobile app repo and deployed by itself.

## Local Development

```sh
npm install
npm run dev
```

Open:

- `http://localhost:3000`
- `http://localhost:3000/preset?id=PRESET_ID`

## Vercel

Use `lullby-web` as the Vercel root directory.

- Framework preset: `Next.js`
- Build command: `npm run build`
- Output directory: `.next`

The Apple App Site Association file is served from:

`/.well-known/apple-app-site-association`

Production URLs:

- `https://lullby.mckyzcky.com`
- `https://lullby.mckyzcky.com/preset?id=PRESET_ID`
