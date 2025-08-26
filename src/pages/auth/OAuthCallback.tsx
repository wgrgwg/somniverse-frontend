import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../features/auth/AuthContext.tsx';

export default function OAuthCallback() {
  const nav = useNavigate();
  const { restore } = useAuthContext();

  useEffect(() => {
    (async () => {
      try {
        await restore();
        nav('/');
      } catch {
        nav('/login');
      }
    })();
  }, [nav, restore]);

  return (
    <div className="h-[60vh] flex items-center justify-center">
      <span className="loading loading-spinner loading-lg" />
    </div>
  );
}
