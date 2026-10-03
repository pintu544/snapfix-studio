// ---------------------------------------------------------------------------
// SnapFix Studio — Cloudinary configuration
//
// Fill these in with your own Cloudinary account details (free tier works):
//   1. Sign up at https://cloudinary.com (no credit card required)
//   2. Dashboard → copy your "Cloud name"
//   3. Settings → Upload → Upload presets → Add upload preset
//      → Signing Mode: Unsigned → Save → copy the preset name
//
// Only the cloud name + an UNSIGNED preset are needed — the API secret
// never leaves Cloudinary's servers, so this static site is safe to deploy.
// ---------------------------------------------------------------------------

export const CLOUD_NAME = 'ezve7bwi';
export const UPLOAD_PRESET = 'Pintukr';

export const isConfigured = () =>
  CLOUD_NAME !== 'YOUR_CLOUD_NAME' &&
  UPLOAD_PRESET !== 'YOUR_UPLOAD_PRESET' &&
  CLOUD_NAME.trim().length > 0;
