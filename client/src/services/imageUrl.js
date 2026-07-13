// Resolves a product's imageUrl into a fully-qualified URL the browser can load.
// - Absolute URLs (http://..., https://...) are returned as-is.
// - Relative paths returned by our own /api/upload endpoint (e.g. "/uploads/xyz.jpg")
//   are prefixed with the backend's origin, since the API and the uploaded files
//   are served by the Express server, not by the Vite dev server.
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const API_ORIGIN = API_URL.replace(/\/api\/?$/, '');

export const resolveImageUrl = (imageUrl) => {
  if (!imageUrl) return 'https://via.placeholder.com/400x400?text=Product';
  if (/^https?:\/\//i.test(imageUrl)) return imageUrl;
  return `${API_ORIGIN}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
};
