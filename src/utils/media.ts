import { API_URL } from '../config/variaveis';

export function resolveMediaUrl(value?: string | null, folder = 'ong') {
  if (!value) return null;
  if (/^(https?:|file:|data:|blob:)/i.test(value)) return value;

  const safePath = value
    .replace(/^\/+/, '')
    .split('/')
    .map((segment) => encodeURIComponent(decodeURIComponent(segment)))
    .join('/');

  return `${API_URL}/uploads/${folder}/${safePath}`;
}
