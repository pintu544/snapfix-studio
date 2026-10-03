# 📸 SnapFix Studio

**AI photo transformer — upload a photo, apply one-click AI transformations, compare before/after, download.**

Built for the **Pixels to Products — Cloudinary AI Hackathon 2026** · Track **PS-03 · Your Media-Savvy Startup**.

## The problem

Everyone takes photos, but making them look great still needs editing skills or heavyweight apps.
SnapFix Studio is a zero-install web tool: drop in any photo and get studio-quality results in one
click — AI background removal, AI-generated background replacement, auto-enhance, and smart crops
for every social format. No accounts, no backend, no waiting.

## How Cloudinary is used (core, not just hosting)

Cloudinary is the entire media engine of this app — every pixel the user sees is uploaded,
transformed, optimized, and delivered by Cloudinary:

| Feature | Cloudinary API / transformation |
|---|---|
| Upload with progress | `POST https://api.cloudinary.com/v1_1/<cloud>/image/upload` with an **unsigned upload preset** (XHR for progress events) |
| AI background removal | `e_background_removal` (Cloudinary AI add-on) |
| AI background replace | `e_gen_background_replace:prompt_<user text>` (generative AI) |
| Auto enhance | `e_improve` |
| Smart crops (1:1, 4:5, 16:9) | `c_fill,g_auto,ar_<ratio>` (AI gravity-aware cropping) |
| Delivery | `f_auto,q_auto` on every URL — automatic format (AVIF/WebP) + quality optimization |
| Thumbnails / recents | `c_fill,g_auto,w_*,h_*` on-the-fly derived images |

Transformations are applied as **URL parameters on the original upload** — no re-uploads, no
server-side processing, no API secret in the browser (unsigned preset keeps it safe).

## Tech stack

- **React 18 + Vite** (JavaScript) — pure static frontend, zero backend
- **Cloudinary** — upload API, AI transformations, CDN delivery
- **CSS** (custom, no framework) — dark UI, mobile-responsive, before/after slider
- **localStorage** — recent-uploads session history (public_ids only)

## Local setup

```bash
npm install
```

Then add your Cloudinary credentials in `src/config.js`:

```js
export const CLOUD_NAME = 'your_cloud_name';       // from cloudinary.com dashboard
export const UPLOAD_PRESET = 'your_upload_preset'; // Settings → Upload → unsigned preset
```

```bash
npm run dev     # dev server at http://localhost:5173
npm run build   # production build → dist/
npm run preview # preview the production build
```

> The free Cloudinary tier covers everything this app needs. Uploads use an **unsigned**
> preset, so the API secret is never exposed.

## Deployment (Railway)

The repo is deploy-ready for Railway static hosting:

- `vite.config.js` uses `base: './'` (relative asset paths)
- `server.js` serves `dist/` on `process.env.PORT` via the `serve` package
- `package.json` → `"start": "node server.js"`
- `railway.json` → NIXPACKS builder, `npm run build`, start command `npm start`

Delete the old Railway service, create a new one from this repo, and it deploys with zero config.

## Project structure

```
src/
  config.js            # CLOUD_NAME + UPLOAD_PRESET (single place to inject credentials)
  cloudinary.js        # upload (XHR+progress), URL builders, download helper
  transforms.js        # the 7 one-click transformations
  App.jsx              # state orchestration
  components/
    Uploader.jsx       # drag & drop + file picker + progress
    TransformPanel.jsx # transform cards + AI background prompt input
    CompareSlider.jsx  # before/after drag slider
    RecentStrip.jsx    # session recents from localStorage
```

## Submission checklist

- [x] Cloudinary is an active part of the product (upload + AI transform + deliver)
- [x] Public GitHub repo with README and setup instructions
- [x] Live working demo (deployed)
- [ ] 2–4 min demo video
- [ ] Cloudinary feedback survey (cld.media/hackathon-survey)
