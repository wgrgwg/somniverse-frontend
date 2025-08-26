import { APP_URL, OAUTH2_AUTH_PATH } from '../../static/constants';

const API_BASE = import.meta.env.VITE_API_BASE_URL.replace(/\/api$/, '');
type ProviderId = 'google' | 'naver';

export default function OAuthButtons() {
  const start = (provider: ProviderId) => {
    const url = `${API_BASE}${OAUTH2_AUTH_PATH}/${provider}?redirect_uri=${encodeURIComponent(`${APP_URL}/oauth2/redirect`)}`;
    window.location.href = url;
  };
  return (
    <div className="flex gap-2">
      <button
        type="button"
        className="btn btn-outline"
        onClick={() => start('google')}
      >
        Google로 계속
      </button>
      <button
        type="button"
        className="btn btn-outline"
        onClick={() => start('naver')}
      >
        Naver로 계속
      </button>
    </div>
  );
}
