import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../features/auth/AuthContext';
import OAuthButtons from '../../features/auth/OAuthButtons';
import { AxiosError } from 'axios';

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
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        setError(err.response?.data?.message ?? '로그인 실패');
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('로그인 실패');
      }
    }
  };

  return (
    <div className="max-w-md mx-auto card bg-base-100 shadow">
      <form className="card-body gap-4" onSubmit={onSubmit}>
        <h1 className="card-title">로그인</h1>
        {error && <div className="alert alert-error">{error}</div>}
        <input
          className="input input-bordered"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          className="input input-bordered"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="btn btn-primary" type="submit">
          로그인
        </button>
        <div className="divider">또는</div>
        <OAuthButtons />
        <p className="text-sm">
          계정이 없으신가요?{' '}
          <Link to="/signup" className="link">
            회원가입
          </Link>
        </p>
      </form>
    </div>
  );
}
