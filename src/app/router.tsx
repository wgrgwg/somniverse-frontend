import { createBrowserRouter, Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import OAuthCallback from '../pages/OAuthCallback';
import Profile from '../pages/Profile';
import MyDreams from '../pages/dreams/MyDreams';
import DreamEditor from '../pages/dreams/DreamEditor';
import DreamDetail from '../pages/dreams/DreamDetail';
import AdminDreams from '../pages/admin/AdminDreams';
import Members from '../pages/admin/Members';
import MemberDetail from '../pages/admin/MemberDetail';
import Protected from '../components/layout/Protected';

const Root = () => (
  <div className="min-h-screen bg-base-200">
    <Navbar />
    <main className="container mx-auto p-4">
      <Outlet />
    </main>
  </div>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      { index: true, element: <Home /> },
      { path: 'login', element: <Login /> },
      { path: 'signup', element: <Signup /> },
      { path: 'auth/callback', element: <OAuthCallback /> },

      {
        element: <Protected />,
        children: [
          { path: 'me', element: <Profile /> },
          { path: 'dreams/me', element: <MyDreams /> },
          { path: 'dreams/new', element: <DreamEditor mode="create" /> },
          { path: 'dreams/:id', element: <DreamDetail /> },
          { path: 'dreams/:id/edit', element: <DreamEditor mode="edit" /> },
        ],
      },

      {
        element: <Protected role="MANAGER" />,
        children: [{ path: 'admin/dreams', element: <AdminDreams /> }],
      },

      {
        element: <Protected role="ADMIN" />,
        children: [
          { path: 'admin/members', element: <Members /> },
          { path: 'admin/members/:id', element: <MemberDetail /> },
        ],
      },
    ],
  },
]);
