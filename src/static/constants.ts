export const PAGE_SIZE = 10;
export const OAUTH_PROVIDERS = [
  { id: 'google', label: 'Google' },
  { id: 'naver', label: 'Naver' },
] as const;

export const OAUTH2_AUTH_PATH =
  import.meta.env.VITE_OAUTH2_AUTH_PATH || '/oauth2/authorization';

export const APP_URL = import.meta.env.VITE_APP_URL || window.location.origin;
