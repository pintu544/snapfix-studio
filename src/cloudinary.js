// All Cloudinary interactions for SnapFix Studio.
// URLs are built from src/config.js so credentials are injected in one place.

import { CLOUD_NAME, UPLOAD_PRESET } from './config';

/** Build a Cloudinary delivery URL for a public_id + transformation string. */
export function transformUrl(publicId, transformation) {
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transformation}/${publicId}`;
}

/** Small thumbnail URL used in the transform panel + recent strip. */
export function thumbUrl(publicId, w = 160, h = 120) {
  return transformUrl(publicId, `c_fill,g_auto,w_${w},h_${h},f_auto,q_auto`);
}

/**
 * Upload an image file to Cloudinary with the unsigned preset.
 * Uses XHR so we can report upload progress. Resolves with the
 * Cloudinary upload response JSON ({ public_id, secure_url, ... }).
 */
export function uploadImage(file, onProgress) {
  return new Promise((resolve, reject) => {
    const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
    const form = new FormData();
    form.append('file', file);
    form.append('upload_preset', UPLOAD_PRESET);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          resolve(JSON.parse(xhr.responseText));
        } catch {
          reject(new Error('Upload succeeded but the response was unreadable.'));
        }
      } else {
        let detail = '';
        try {
          detail = JSON.parse(xhr.responseText)?.error?.message || '';
        } catch {
          /* ignore */
        }
        reject(
          new Error(
            `Upload failed (HTTP ${xhr.status}). ${detail || 'Check your cloud name and unsigned upload preset in src/config.js.'}`
          )
        );
      }
    };
    xhr.onerror = () => reject(new Error('Network error during upload. Check your connection and try again.'));
    xhr.send(form);
  });
}

/** Download a remote image URL to the user's device with a friendly filename. */
export async function downloadImage(url, filename) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download failed (HTTP ${res.status}).`);
  const blob = await res.blob();
  const objectUrl = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = objectUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(objectUrl), 5000);
}
