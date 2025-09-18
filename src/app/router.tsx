import { createBrowserRouter } from 'react-router-dom';
import Root from './Root';
import Home from '../pages/Home';
import Login from '../pages/auth/Login';
import Signup from '../pages/auth/Signup';
import OAuthCallback from '../pages/auth/OAuthCallback';
import Profile from '../pages/auth/Profile';
import MyDreams from '../pages/dreams/MyDreams';
import DreamEditor from '../pages/dreams/DreamEditor';
import DreamDetail from '../pages/dreams/DreamDetail';
import AdminDreams from '../pages/admin/AdminDreams';
import Members from '../pages/admin/Members';
import MemberDetail from '../pages/admin/MemberDetail';
import Protected from '../components/Protected';
import AdminDreamDetail from '../pages/admin/AdminDreamDetail';
import Dreams from '../pages/dreams/Dreams.tsx';

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
          { path: 'dreams', element: <Dreams /> },
          { path: 'dreams/me', element: <MyDreams /> },
          { path: 'dreams/new', element: <DreamEditor mode="create" /> },
          { path: 'dreams/:id', element: <DreamDetail /> },
          { path: 'dreams/:id/edit', element: <DreamEditor mode="edit" /> },
        ],
      },

      {
        element: <Protected role="MANAGER" />,
        children: [
          { path: 'admin/dreams', element: <AdminDreams /> },
          { path: 'admin/dreams/:id', element: <AdminDreamDetail /> },
        ],
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
