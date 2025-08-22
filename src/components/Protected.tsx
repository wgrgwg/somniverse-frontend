import { Navigate, Outlet } from 'react-router-dom';
import { useAuthContext } from '../features/auth/AuthContext';
import type { Role } from '../static/roles';

const rolePriority: Record<Role, number> = {
  USER: 1,
  MANAGER: 2,
  ADMIN: 3,
};

export default function Protected({ role = 'USER' }: { role?: Role }) {
  const { user, loading } = useAuthContext();

  if (loading) {
    return (
      <div className="h-[50vh] flex items-center justify-center">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  if (rolePriority[user.role] < rolePriority[role]) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
