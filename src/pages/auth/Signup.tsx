import { useState } from 'react';
import api from '../../lib/axios.ts';
import { Link, useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import OAuthButtons from '../../features/auth/OAuthButtons';

export default function Signup() {
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/auth/members', { email, password, username });
      nav('/login');
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        setError(err.response?.data?.message ?? '회원가입 실패');
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('회원가입 실패');
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-base-200">
      <div className="w-full max-w-md card bg-base-100 shadow-lg">
        <form className="card-body gap-4" onSubmit={onSubmit}>
          <h1 className="text-2xl font-bold text-center">회원가입</h1>

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
            className="input input-bordered w-full"
            placeholder="닉네임"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            className="input input-bordered w-full"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="btn btn-primary w-full" type="submit">
            회원가입
          </button>

          <div className="divider">또는</div>
          <OAuthButtons />

          <p className="text-sm text-center mt-2">
            이미 계정이 있으신가요?{' '}
            <Link to="/login" className="link link-primary">
              로그인
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
