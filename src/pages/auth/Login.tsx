import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../features/auth/AuthContext';
import OAuthButtons from '../../features/auth/OAuthButtons';

export default function Login() {
  const nav = useNavigate();
  const { login } = useAuthContext();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await login({ email, password });
      nav('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : '로그인에 실패했습니다.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-base-200">
      <div className="w-full max-w-md card bg-base-100 shadow-lg">
        <form className="card-body gap-4" onSubmit={onSubmit}>
          <h1 className="text-2xl font-bold text-center">로그인</h1>

          {error && (
            <div className="alert alert-error py-2 text-sm">{error}</div>
          )}

          <input
            className="input input-bordered w-full"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            className="input input-bordered w-full"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="btn btn-primary w-full" type="submit">
            로그인
          </button>

          <div className="divider">또는</div>
          <OAuthButtons />

          <p className="text-sm text-center mt-2">
            계정이 없으신가요?{' '}
            <Link to="/signup" className="link link-primary">
              회원가입
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
