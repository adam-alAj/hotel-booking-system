const API_BASE_URL = 'http://localhost:8080';

export const getImageUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return API_BASE_URL + url;
};
