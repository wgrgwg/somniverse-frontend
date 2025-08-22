import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../features/auth/AuthContext';

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuthContext();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="navbar bg-base-100 shadow">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost normal-case text-xl">
          Somniverse
        </Link>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1 gap-2">
          <li>
            <Link to="/dreams/me">꿈일기</Link>
          </li>

          {user && (user.role === 'MANAGER' || user.role === 'ADMIN') && (
            <li>
              <Link to="/admin/dreams">꿈일기 관리</Link>
            </li>
          )}

          {user && user.role === 'ADMIN' && (
            <li>
              <Link to="/admin/members">회원관리</Link>
            </li>
          )}

          {!user ? (
            <>
              <li>
                <Link to="/login">로그인</Link>
              </li>
              <li>
                <Link to="/signup">회원가입</Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/me">내정보</Link>
              </li>
              <li>
                <button onClick={handleLogout}>로그아웃</button>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
}
