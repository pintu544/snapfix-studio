import { useCallback, useEffect, useState } from 'react';
import { CLOUD_NAME, isConfigured } from './config';
import { uploadImage, transformUrl, downloadImage, SAMPLES, thumbUrl } from './cloudinary';
import { getTransform } from './transforms';
import Uploader from './components/Uploader.jsx';
import TransformPanel from './components/TransformPanel.jsx';
import CompareSlider from './components/CompareSlider.jsx';
import RecentStrip from './components/RecentStrip.jsx';
import SocialKit from './components/SocialKit.jsx';

const RECENT_KEY = 'snapfix.recent.v1';
const MAX_RECENT = 12;

function loadRecent() {
  try {
    const raw = JSON.parse(localStorage.getItem(RECENT_KEY));
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
}

export default function App() {
  const configured = isConfigured();
  const [current, setCurrent] = useState(null); // { public_id, cloud }
  const [activeId, setActiveId] = useState('original');
  const [bgPrompt, setBgPrompt] = useState('tropical beach at sunset');
  const [uploading, setUploading] = useState(null); // { progress, name } | null
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState('');
  const [recent, setRecent] = useState(loadRecent);

  const isSample = !!current && current.cloud !== CLOUD_NAME;

  useEffect(() => {
    try {
      localStorage.setItem(RECENT_KEY, JSON.stringify(recent.slice(0, MAX_RECENT)));
    } catch {
      /* storage full / unavailable — session memory still works */
    }
  }, [recent]);

  const handleFiles = useCallback(
    async (fileList) => {
      setError('');
      if (!configured) {
        setError('Add your Cloudinary cloud name and unsigned upload preset in src/config.js, then rebuild.');
        return;
      }
      const file = fileList?.[0];
      if (!file) return;
      if (!file.type.startsWith('image/')) {
        setError('Please choose an image file (JPG, PNG, WebP).');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError('That image is over 10 MB — please pick a smaller one.');
        return;
      }
      setUploading({ progress: 0, name: file.name });
      try {
        const res = await uploadImage(file, (p) =>
          setUploading({ progress: p, name: file.name })
        );
        const item = { public_id: res.public_id, cloud: CLOUD_NAME };
        setCurrent(item);
        setActiveId('original');
        setRecent((r) =>
          [{ ...item, ts: Date.now() },
           ...r.filter((x) => x.public_id !== res.public_id)].slice(0, MAX_RECENT)
        );
      } catch (e) {
        setError(e.message || 'Upload failed. Please try again.');
      } finally {
        setUploading(null);
      }
    },
    [configured]
  );

  const handleSample = useCallback((sample) => {
    setError('');
    setCurrent({ public_id: sample.publicId, cloud: sample.cloud, sample: true });
    setActiveId('original');
  }, []);

  const transform = getTransform(activeId);
  const originalUrl = current ? transformUrl(current.public_id, 'f_auto,q_auto', current.cloud) : null;
  const previewUrl = current ? transformUrl(current.public_id, transform.build(bgPrompt), current.cloud) : null;

  const handleDownload = async () => {
    if (!previewUrl || downloading) return;
    setDownloading(true);
    setError('');
    try {
      const base = current.public_id.split('/').pop().replace(/\.[^.]+$/, '');
      await downloadImage(previewUrl, `snapfix-${transform.id}-${base}.jpg`);
    } catch {
      // Fallback: open the transformed image in a new tab so the user can save it.
      window.open(previewUrl, '_blank', 'noopener');
      setError('Direct download was blocked — the image opened in a new tab instead.');
    } finally {
      setDownloading(false);
    }
  };

  const selectRecent = (item) => {
    setError('');
    setCurrent({ public_id: item.public_id, cloud: item.cloud || CLOUD_NAME });
    setActiveId('original');
  };

  return (
    <div className="app">
      <header className="header">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">
            <svg width="26" height="26" viewBox="0 0 32 32">
              <rect width="32" height="32" rx="8" fill="#6366f1" />
              <path d="M10 20l4-6 3 4 2-3 3 5z" fill="white" />
              <circle cx="21" cy="11" r="2.2" fill="white" />
            </svg>
          </span>
          <div>
            <h1 className="brand-name">SnapFix Studio</h1>
            <p className="brand-tag">AI photo transformer · powered by Cloudinary</p>
          </div>
        </div>
        <a
          className="hack-badge"
          href="https://hackindia.org/2026/pixels-to-products-cloudinary-ai-hackathon-2026"
          target="_blank"
          rel="noopener noreferrer"
        >
          Pixels to Products · PS-03
        </a>
      </header>

      {!configured && (
        <div className="config-warning" role="alert">
          <strong>Setup needed:</strong> open <code>src/config.js</code> and add your Cloudinary
          cloud name + unsigned upload preset, then rebuild. Uploads are disabled until then —
          but the sample photos below still work.
        </div>
      )}

      {error && (
        <div className="error-bar" role="alert">
          {error}
          <button className="error-dismiss" onClick={() => setError('')} aria-label="Dismiss error">✕</button>
        </div>
      )}

      {!current ? (
        <section className="hero">
          <p className="hero-kicker">AI PHOTO STUDIO</p>
          <h2 className="hero-title">
            One photo. <span className="hero-accent">Infinite versions.</span>
          </h2>
          <p className="hero-sub">
            Remove backgrounds, conjure new scenes with generative AI, outpaint any
            aspect ratio, and ship a full social-media kit — all rendered live by Cloudinary.
          </p>
          <div className="sample-block">
            <p className="sample-title">No photo handy? Try a sample — no upload needed:</p>
            <div className="sample-row">
              {SAMPLES.map((s) => (
                <button key={s.id} className="sample-card" onClick={() => handleSample(s)}>
                  <img src={thumbUrl(s.publicId, 320, 200, s.cloud)} alt={s.label} loading="lazy" />
                  <span className="sample-label">{s.label}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="hero-upload">
            <Uploader onFiles={handleFiles} uploading={uploading} disabled={!configured} />
            <p className="stage-hint">
              …or upload your own to unlock everything, including AI background removal &amp; replace.
            </p>
          </div>
        </section>
      ) : (
        <main className="main">
          <div className="stage-col">
            <section className="stage">
              <CompareSlider before={originalUrl} after={previewUrl} afterLabel={transform.label} />
              <div className="stage-actions">
                <button className="btn btn-ghost" onClick={() => setCurrent(null)} disabled={!!uploading}>
                  New photo
                </button>
                <button className="btn btn-primary" onClick={handleDownload} disabled={downloading}>
                  {downloading ? 'Preparing…' : '⬇ Download'}
                </button>
              </div>
              <p className="transform-note">
                Showing: <strong>{transform.label}</strong>
                {transform.needsPrompt && bgPrompt.trim() ? ` — “${bgPrompt.trim()}”` : ''}
                {isSample && <span className="sample-pill">sample photo</span>}
              </p>
            </section>
            <SocialKit image={current} onError={setError} />
          </div>

          <aside className="sidebar">
            <TransformPanel
              activeId={activeId}
              onSelect={setActiveId}
              image={current}
              bgPrompt={bgPrompt}
              onPromptChange={setBgPrompt}
              disabled={!current}
            />
            <RecentStrip items={recent} activePublicId={current?.public_id} onSelect={selectRecent} />
          </aside>
        </main>
      )}

      <footer className="footer">
        <div className="how-strip">
          <span><strong>1.</strong> Upload or pick a sample</span>
          <span><strong>2.</strong> Apply AI magic</span>
          <span><strong>3.</strong> Export your social kit</span>
        </div>
        <p>
          Built for the <strong>Pixels to Products — Cloudinary AI Hackathon 2026</strong> (PS-03) ·
          upload, AI transformation &amp; delivery by <strong>Cloudinary</strong>
        </p>
      </footer>
    </div>
  );
}
