import { useRef, useState } from 'react';

export default function Uploader({ onFiles, uploading, disabled }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const pick = () => inputRef.current?.click();

  return (
    <div
      className={`uploader ${dragging ? 'dragging' : ''} ${uploading ? 'busy' : ''}`}
      onClick={pick}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        if (!disabled && !uploading) onFiles(e.dataTransfer.files);
      }}
      role="button"
      tabIndex={0}
      aria-label="Upload a photo"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') pick();
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          if (!uploading) onFiles(e.target.files);
          e.target.value = '';
        }}
      />
      {uploading ? (
        <div className="upload-progress">
          <div className="spinner" aria-hidden="true" />
          <p className="upload-name">{uploading.name}</p>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${uploading.progress}%` }} />
          </div>
          <p className="progress-label">Uploading… {uploading.progress}%</p>
        </div>
      ) : (
        <div className="upload-idle">
          <div className="upload-icon" aria-hidden="true">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </div>
          <p className="upload-title">Drop a photo here, or <span className="link">browse</span></p>
          <p className="upload-sub">JPG, PNG, WebP · up to 10 MB</p>
        </div>
      )}
    </div>
  );
}
