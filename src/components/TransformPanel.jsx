import { TRANSFORMS } from '../transforms';
import { thumbUrl } from '../cloudinary';

const AI_ICON = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z" />
    <path d="M19 15l.9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9z" />
  </svg>
);

const CROP_ICON = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M6 2v14a2 2 0 0 0 2 2h14" />
    <path d="M18 22V8a2 2 0 0 0-2-2H2" />
  </svg>
);

export default function TransformPanel({
  activeId,
  onSelect,
  publicId,
  bgPrompt,
  onPromptChange,
  disabled,
}) {
  return (
    <section className="panel" aria-label="Transformations">
      <h2 className="panel-title">Transform</h2>
      <div className="transform-grid">
        {TRANSFORMS.map((t) => {
          const active = t.id === activeId;
          const showThumb = t.liveThumb && publicId;
          return (
            <button
              key={t.id}
              className={`transform-card ${active ? 'active' : ''}`}
              onClick={() => onSelect(t.id)}
              disabled={disabled}
              aria-pressed={active}
            >
              <span className="transform-thumb">
                {showThumb ? (
                  <img
                    src={thumbUrl(publicId)}
                    alt=""
                    loading="lazy"
                    className="thumb-img"
                    style={
                      t.id === 'square'
                        ? { aspectRatio: '1 / 1' }
                        : t.id === 'portrait'
                          ? { aspectRatio: '4 / 5' }
                          : t.id === 'wide'
                            ? { aspectRatio: '16 / 9' }
                            : undefined
                    }
                  />
                ) : (
                  <span className="thumb-icon">{t.badge ? AI_ICON : CROP_ICON}</span>
                )}
                {t.badge && <span className="badge">{t.badge}</span>}
              </span>
              <span className="transform-label">{t.label}</span>
              <span className="transform-desc">{t.desc}</span>
            </button>
          );
        })}
      </div>

      {TRANSFORMS.find((t) => t.id === activeId)?.needsPrompt && (
        <label className="prompt-field">
          <span className="prompt-label">Describe the new background</span>
          <input
            type="text"
            value={bgPrompt}
            onChange={(e) => onPromptChange(e.target.value)}
            placeholder="e.g. tropical beach at sunset"
            maxLength={120}
            disabled={disabled}
          />
        </label>
      )}
    </section>
  );
}
