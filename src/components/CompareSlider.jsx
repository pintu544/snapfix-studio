import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Before/after comparison slider.
 * Drag (pointer or touch) anywhere on the image to move the divider.
 */
export default function CompareSlider({ before, after, afterLabel }) {
  const [pos, setPos] = useState(50);
  const [loaded, setLoaded] = useState(false);
  const trackRef = useRef(null);

  // Reset the divider + loading state whenever the transformed image changes.
  useEffect(() => {
    setPos(50);
    setLoaded(false);
  }, [after]);

  const move = useCallback((clientX) => {
    const el = trackRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.min(97, Math.max(3, pct)));
  }, []);

  return (
    <div
      ref={trackRef}
      className="compare"
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        move(e.clientX);
      }}
      onPointerMove={(e) => {
        if (e.buttons === 1) move(e.clientX);
      }}
      role="slider"
      aria-label="Before and after comparison"
      aria-valuenow={Math.round(pos)}
      aria-valuemin={0}
      aria-valuemax={100}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'ArrowLeft') setPos((p) => Math.max(3, p - 4));
        if (e.key === 'ArrowRight') setPos((p) => Math.min(97, p + 4));
      }}
    >
      {/* After (transformed) fills the frame */}
      <img src={after} alt={afterLabel || 'Transformed'} className="compare-img" draggable={false} onLoad={() => setLoaded(true)} />
      {/* Before (original) clipped to the left of the divider */}
      <img
        src={before}
        alt="Original"
        className="compare-img compare-before"
        draggable={false}
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
      />
      {!loaded && (
        <div className="compare-loading" aria-hidden="true">
          <div className="spinner" />
          <span>Applying AI magic…</span>
        </div>
      )}
      <div className="compare-divider" style={{ left: `${pos}%` }} aria-hidden="true">
        <span className="compare-handle">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 6 4 12 9 18" />
            <polyline points="15 6 20 12 15 18" />
          </svg>
        </span>
      </div>
      <span className="compare-tag tag-before">Before</span>
      <span className="compare-tag tag-after">After</span>
    </div>
  );
}
