import { thumbUrl } from '../cloudinary';

export default function RecentStrip({ items, activePublicId, onSelect }) {
  if (!items.length) return null;
  return (
    <section className="panel recent" aria-label="Recent uploads">
      <h2 className="panel-title">Recent uploads</h2>
      <div className="recent-row">
        {items.map((item) => (
          <button
            key={item.public_id}
            className={`recent-thumb ${item.public_id === activePublicId ? 'active' : ''}`}
            onClick={() => onSelect(item)}
            title={item.public_id}
          >
            <img src={thumbUrl(item.public_id, 120, 120, item.cloud)} alt="" loading="lazy" />
          </button>
        ))}
      </div>
    </section>
  );
}
