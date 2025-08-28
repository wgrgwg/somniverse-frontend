import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../features/auth/AuthContext';

function getTokenFromQuery(): string | null {
  try {
    const params = new URLSearchParams(window.location.search);
    return params.get('token');
  } catch {
    return null;
  }
}

export default function OAuthCallback() {
  const nav = useNavigate();
  const { restore } = useAuthContext();
  const onceRef = useRef(false);

  useEffect(() => {
    if (onceRef.current) return;
    onceRef.current = true;

    const token = getTokenFromQuery();
    if (token) localStorage.setItem('accessToken', token);

    (async () => {
      const ok = await restore();
      nav(ok ? '/' : '/login', { replace: true });
    })();
  }, [nav, restore]);

  return (
    <div className="h-[60vh] flex items-center justify-center">
      <span className="loading loading-spinner loading-lg" />
    </div>
  );
}
