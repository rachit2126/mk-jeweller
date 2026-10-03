/**
 * Centralized image resolver for MK Silver Hub media and collections.
 * Handles HTTPS URLs, cloud storage, relative paths, CDN URLs, and Mongo references.
 */
export function resolveCollectionImage(raw?: any): string {
  if (!raw) return '';

  let url = '';
  if (typeof raw === 'string') {
    url = raw.trim();
  } else if (typeof raw === 'object') {
    url = (raw.url || raw.secure_url || raw.src || raw.path || '').trim();
  }

  if (!url) return '';

  // Data URLs or Blob URLs
  if (url.startsWith('data:') || url.startsWith('blob:')) {
    return url;
  }

  // Absolute URLs (HTTPS, HTTP, Cloud storage, CDN)
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  // Clean relative public assets
  if (url.startsWith('/')) {
    return url;
  }

  // Relative path without leading slash
  if (
    url.startsWith('uploads/') ||
    url.startsWith('images/') ||
    url.startsWith('assets/') ||
    url.startsWith('icons/')
  ) {
    return `/${url}`;
  }

  return `/${url}`;
}
