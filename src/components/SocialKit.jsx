import { useState } from 'react';
import { transformUrl, downloadImage } from '../cloudinary';

// One-click platform-ready variants, all smart-cropped with auto gravity.
const PLATFORMS = [
  { id: 'ig-post', label: 'Instagram Post', dims: '1080 × 1080', w: 1080, h: 1080 },
  { id: 'ig-story', label: 'Instagram Story', dims: '1080 × 1920', w: 1080, h: 1920 },
  { id: 'yt-thumb', label: 'YouTube Thumbnail', dims: '1280 × 720', w: 1280, h: 720 },
  { id: 'x-post', label: 'X Post', dims: '1200 × 675', w: 1200, h: 675 },
  { id: 'li-banner', label: 'LinkedIn Banner', dims: '1584 × 396', w: 1584, h: 396 },
];

const fullUrl = (image, p) =>
  transformUrl(image.public_id, `c_fill,g_auto,w_${p.w},h_${p.h},f_auto,q_auto`, image.cloud);

// Lightweight preview (same crop, smaller) so the grid loads fast.
const previewUrl = (image, p) => {
  const ph = Math.min(360, Math.round((360 * p.h) / p.w));
  return transformUrl(image.public_id, `c_fill,g_auto,w_360,h_${ph},f_auto,q_auto`, image.cloud);
};

export default function SocialKit({ image, onError }) {
  const [busyId, setBusyId] = useState(null);
  const [downloadingAll, setDownloadingAll] = useState(false);

  const downloadOne = async (p) => {
    if (busyId || downloadingAll) return;
    setBusyId(p.id);
    try {
      await downloadImage(fullUrl(image, p), `snapfix-${p.id}.jpg`);
    } catch {
      onError?.('Direct download was blocked — right-click the image and save it instead.');
    } finally {
      setBusyId(null);
    }
  };

  const downloadAll = async () => {
    if (downloadingAll || busyId) return;
    setDownloadingAll(true);
    setErrorClear();
    for (const p of PLATFORMS) {
      try {
        await downloadImage(fullUrl(image, p), `snapfix-${p.id}.jpg`);
      } catch {
        onError?.('One or more downloads were blocked by the browser.');
        break;
      }
      await new Promise((r) => setTimeout(r, 600));
    }
    setDownloadingAll(false);
  };

  const setErrorClear = () => onError?.('');

  return (
    <section className="panel kit" aria-label="Social media kit">
      <div className="kit-head">
        <div>
          <h2 className="panel-title">Social Kit</h2>
          <p className="kit-sub">One photo → every platform, smart-cropped by AI.</p>
        </div>
        <button
          className="btn btn-primary kit-download-all"
          onClick={downloadAll}
          disabled={downloadingAll}
        >
          {downloadingAll ? 'Downloading…' : '⬇ Download All'}
        </button>
      </div>
      <div className="kit-grid">
        {PLATFORMS.map((p) => (
          <figure key={p.id} className="kit-card">
            <div className="kit-img-wrap">
              <img src={previewUrl(image, p)} alt={p.label} loading="lazy" />
            </div>
            <figcaption>
              <span className="kit-label">{p.label}</span>
              <span className="kit-dims">{p.dims}</span>
              <button
                className="btn btn-ghost kit-dl"
                onClick={() => downloadOne(p)}
                disabled={!!busyId || downloadingAll}
              >
                {busyId === p.id ? 'Saving…' : 'Download'}
              </button>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
