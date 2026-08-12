const configuredApiUrl = process.env.EXPO_PUBLIC_URL_API?.trim();

if (!configuredApiUrl) {
  throw new Error('EXPO_PUBLIC_URL_API não foi configurada no arquivo .env');
}

export const API_URL = configuredApiUrl.replace(/\/+$/, '');
