export function parseJwt<T = unknown>(token: string): T | null {
  try {
    const base64 = token.split('.')[1] ?? '';
    const base64Padded = base64.replace(/-/g, '+').replace(/_/g, '/');
    const decoded = atob(base64Padded);

    const json = new TextDecoder().decode(
      Uint8Array.from(decoded, (c) => c.charCodeAt(0)),
    );

    return JSON.parse(json) as T;
  } catch {
    return null;
  }
}
