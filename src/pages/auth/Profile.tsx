import { useAuthContext } from '../../features/auth/AuthContext.tsx';
import { Link } from 'react-router-dom';

export default function Profile() {
  const { user } = useAuthContext();
  return (
    <div className="max-w-xl mx-auto card bg-base-100 shadow">
      <div className="card-body">
        <h1 className="card-title">내 정보</h1>
        {!user ? (
          <p>로그인이 필요합니다.</p>
        ) : (
          <ul className="menu">
            <li>
              <span>ID: {user.id}</span>
            </li>
            <li>
              <span>이메일: {user.email}</span>
            </li>
            <li>
              <span>닉네임: {user.username}</span>
            </li>
            <li>
              <span>권한: {user.role}</span>
            </li>
          </ul>
        )}
        <div className="card-actions justify-end">
          <Link className="btn" to="/dreams/me">
            내 꿈 보러가기
          </Link>
        </div>
      </div>
    </div>
  );
}
