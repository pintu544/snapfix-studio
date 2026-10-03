import { SECTIONS, visibleTransforms } from '../transforms';
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

const EXPAND_ICON = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M15 3h6v6" />
    <path d="M9 21H3v-6" />
    <path d="M21 3l-7 7" />
    <path d="M3 21l7-7" />
  </svg>
);

const ART_ICON = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="9" />
    <circle cx="8.5" cy="10" r="1.2" fill="currentColor" stroke="none" />
    <circle cx="12" cy="7.5" r="1.2" fill="currentColor" stroke="none" />
    <circle cx="15.5" cy="10" r="1.2" fill="currentColor" stroke="none" />
    <path d="M12 21c-1 0-1.5-.8-1.5-1.8 0-1.2 1-1.6 1-2.7 0-1-1-1.4-2.3-1.4" />
  </svg>
);

const SECTION_ICONS = { ai: AI_ICON, crop: CROP_ICON, expand: EXPAND_ICON, creative: ART_ICON };

export default function TransformPanel({
  activeId,
  onSelect,
  image, // { public_id, cloud } | null
  bgPrompt,
  onPromptChange,
  disabled,
}) {
  const transforms = visibleTransforms();

  return (
    <section className="panel" aria-label="Transformations">
      <h2 className="panel-title">Transform</h2>
      {SECTIONS.map((section) => {
        const items = transforms.filter((t) => t.section === section.id);
        if (!items.length) return null;
        return (
          <div key={section.id} className="transform-section">
            <h3 className="transform-section-title">{section.title}</h3>
            <div className="transform-grid">
              {items.map((t) => {
                const active = t.id === activeId;
                const showThumb = t.liveThumb && image;
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
                          src={thumbUrl(image.public_id, 160, 120, image.cloud)}
                          alt=""
                          loading="lazy"
                          className="thumb-img"
                        />
                      ) : (
                        <span className="thumb-icon">{SECTION_ICONS[section.id]}</span>
                      )}
                      {t.badge && <span className="badge">{t.badge}</span>}
                    </span>
                    <span className="transform-label">{t.label}</span>
                    <span className="transform-desc">{t.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      {transforms.find((t) => t.id === activeId)?.needsPrompt && (
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
