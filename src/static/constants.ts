export const PAGE_SIZE = 10;

const raw = (import.meta.env.VITE_OAUTH2_PROVIDERS as string) || '';
const providerIds = raw
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

export const OAUTH_PROVIDERS = providerIds.map(
  (id): { id: string; label: string } => ({
    id,
    label: id.charAt(0).toUpperCase() + id.slice(1),
  }),
) satisfies ReadonlyArray<{ id: string; label: string }>;

export const OAUTH2_AUTH_PATH = import.meta.env.VITE_OAUTH2_PATH;

export const APP_URL = import.meta.env.VITE_APP_URL || window.location.origin;

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
