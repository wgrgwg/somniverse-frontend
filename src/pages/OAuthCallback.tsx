import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../features/auth/AuthContext';

export default function OAuthCallback() {
  const nav = useNavigate();
  const { restore } = useAuthContext();

  useEffect(() => {
    (async () => {
      try {
        await restore();
        nav('/'); // 홈(공개 꿈 목록) 또는 /dreams/me 등
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
