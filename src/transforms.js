// One-click transformations for SnapFix Studio.
// Each entry builds a Cloudinary URL-transformation string applied on the fly
// to the uploaded image — no re-uploads, no backend, pure Cloudinary.

const encodePrompt = (p) => encodeURIComponent(p.trim()).replace(/!/g, '%21');

export const TRANSFORMS = [
  {
    id: 'original',
    label: 'Original',
    desc: 'Unedited upload',
    badge: null,
    liveThumb: true,
    build: () => 'f_auto,q_auto',
  },
  {
    id: 'bg-remove',
    label: 'Remove BG',
    desc: 'AI background removal',
    badge: 'AI',
    liveThumb: false,
    build: () => 'e_background_removal,f_auto,q_auto',
  },
  {
    id: 'bg-replace',
    label: 'AI Background',
    desc: 'Replace scene with AI',
    badge: 'AI',
    liveThumb: false,
    needsPrompt: true,
    build: (prompt) =>
      `e_gen_background_replace:prompt_${encodePrompt(prompt || 'studio')},f_auto,q_auto`,
  },
  {
    id: 'enhance',
    label: 'Enhance',
    desc: 'Auto improve quality',
    badge: 'AI',
    liveThumb: true,
    build: () => 'e_improve,f_auto,q_auto',
  },
  {
    id: 'square',
    label: 'Square 1:1',
    desc: 'Smart crop',
    badge: null,
    liveThumb: true,
    build: () => 'c_fill,g_auto,ar_1:1,f_auto,q_auto',
  },
  {
    id: 'portrait',
    label: 'Portrait 4:5',
    desc: 'Smart crop',
    badge: null,
    liveThumb: true,
    build: () => 'c_fill,g_auto,ar_4:5,f_auto,q_auto',
  },
  {
    id: 'wide',
    label: 'Wide 16:9',
    desc: 'Smart crop',
    badge: null,
    liveThumb: true,
    build: () => 'c_fill,g_auto,ar_16:9,f_auto,q_auto',
  },
];

export const getTransform = (id) => TRANSFORMS.find((t) => t.id === id) || TRANSFORMS[0];
