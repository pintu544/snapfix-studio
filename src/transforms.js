// One-click transformations for SnapFix Studio.
// Each entry builds a Cloudinary URL-transformation string applied on the fly
// to the image — no re-uploads, no backend, pure Cloudinary.
//
const encodePrompt = (p) => encodeURIComponent(p.trim()).replace(/!/g, '%21');

export const SECTIONS = [
  { id: 'ai', title: 'AI Magic' },
  { id: 'crop', title: 'Smart Crop' },
  { id: 'expand', title: 'AI Expand' },
  { id: 'creative', title: 'Creative' },
];

export const TRANSFORMS = [
  // ---- AI Magic ----
  {
    id: 'original',
    section: 'ai',
    label: 'Original',
    desc: 'Unedited image',
    badge: null,
    liveThumb: true,
    build: () => 'f_auto,q_auto',
  },
  {
    id: 'bg-remove',
    section: 'ai',
    label: 'Remove BG',
    desc: 'AI background removal',
    badge: 'AI',
    liveThumb: false,
    build: () => 'e_background_removal,f_auto,q_auto',
  },
  {
    id: 'bg-replace',
    section: 'ai',
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
    section: 'ai',
    label: 'Enhance',
    desc: 'Auto improve quality',
    badge: 'AI',
    liveThumb: true,
    build: () => 'e_improve,f_auto,q_auto',
  },
  {
    id: 'upscale',
    section: 'ai',
    label: 'AI Upscale',
    desc: 'Generative 2x upscale',
    badge: 'AI',
    liveThumb: true,
    build: () => 'e_upscale,f_auto,q_auto',
  },
  // ---- Smart Crop ----
  {
    id: 'square',
    section: 'crop',
    label: 'Square 1:1',
    desc: 'Smart crop',
    badge: null,
    liveThumb: true,
    build: () => 'c_fill,g_auto,ar_1:1,f_auto,q_auto',
  },
  {
    id: 'portrait',
    section: 'crop',
    label: 'Portrait 4:5',
    desc: 'Smart crop',
    badge: null,
    liveThumb: true,
    build: () => 'c_fill,g_auto,ar_4:5,f_auto,q_auto',
  },
  {
    id: 'wide',
    section: 'crop',
    label: 'Wide 16:9',
    desc: 'Smart crop',
    badge: null,
    liveThumb: true,
    build: () => 'c_fill,g_auto,ar_16:9,f_auto,q_auto',
  },
  // ---- AI Expand (generative-fill outpainting) ----
  {
    id: 'expand-11',
    section: 'expand',
    label: 'Expand 1:1',
    desc: 'AI outpainting',
    badge: 'AI',
    liveThumb: true,
    build: () => 'c_pad,b_gen_fill,w_1080,h_1080,f_auto,q_auto',
  },
  {
    id: 'expand-45',
    section: 'expand',
    label: 'Expand 4:5',
    desc: 'AI outpainting',
    badge: 'AI',
    liveThumb: true,
    build: () => 'c_pad,b_gen_fill,w_1080,h_1350,f_auto,q_auto',
  },
  {
    id: 'expand-169',
    section: 'expand',
    label: 'Expand 16:9',
    desc: 'AI outpainting',
    badge: 'AI',
    liveThumb: true,
    build: () => 'c_pad,b_gen_fill,w_1280,h_720,f_auto,q_auto',
  },
  {
    id: 'expand-916',
    section: 'expand',
    label: 'Expand 9:16',
    desc: 'AI outpainting',
    badge: 'AI',
    liveThumb: true,
    build: () => 'c_pad,b_gen_fill,w_1080,h_1920,f_auto,q_auto',
  },
  // ---- Creative ----
  {
    id: 'oil',
    section: 'creative',
    label: 'Oil Paint',
    desc: 'Artistic effect',
    badge: null,
    liveThumb: true,
    build: () => 'e_oil_paint,f_auto,q_auto',
  },
  {
    id: 'cartoon',
    section: 'creative',
    label: 'Cartoonify',
    desc: 'Artistic effect',
    badge: null,
    liveThumb: true,
    build: () => 'e_cartoonify,f_auto,q_auto',
  },
  {
    id: 'noir',
    section: 'creative',
    label: 'Noir',
    desc: 'Black & white',
    badge: null,
    liveThumb: true,
    build: () => 'e_grayscale,f_auto,q_auto',
  },
  {
    id: 'vignette',
    section: 'creative',
    label: 'Vignette',
    desc: 'Soft focus edges',
    badge: null,
    liveThumb: true,
    build: () => 'e_vignette:60,f_auto,q_auto',
  },
];

export const getTransform = (id) => TRANSFORMS.find((t) => t.id === id) || TRANSFORMS[0];

/** Transforms visible for the active image. */
export const visibleTransforms = () => TRANSFORMS;
