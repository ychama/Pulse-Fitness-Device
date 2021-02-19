import SignIn from './SignIn';
import NotFound from './NotFound';
import ForgotPassword from './ForgotPassword';
import ChangePassword from './ChangePassword';

const settings = {
  activeLayout: 'layout1',
  layout1Settings: {
    topbar: {
      show: false,
    },
    leftSidebar: {
      show: false,
      mode: 'close',
    },
  },
  layout2Settings: {
    mode: 'full',
    topbar: {
      show: false,
    },
    navbar: { show: false },
  },
  secondarySidebar: { show: false },
  footer: { show: false },
};

const sessionRoutes = [
  {
    path: '/session/signin',
    component: SignIn,
    settings,
    name: 'Sign In',
  },
  {
    path: '/session/forgot-password',
    component: ForgotPassword,
    settings,
    name: 'Forgot Password',
  },
  {
    path: '/session/404',
    component: NotFound,
    settings,
    name: 'Page Not Found',
  },
  {
    path: '/session/change-password',
    component: ChangePassword,
    settings,
    name: 'Change Password',
  },
];

export default sessionRoutes;
