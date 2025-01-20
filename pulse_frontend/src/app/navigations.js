const navigations = [
  {
    name: 'Dashboard',
    path: '/',
    icon: 'dashboard',
  },

  {
    name: 'Sessions',
    icon: 'trending_up',
    children: [
      {
        name: 'Sign in',
        iconText: 'SI',
        path: '/session/signin',
      },
      {
        name: 'Sign up',
        iconText: 'SU',
        path: '/session/signup',
      },
      {
        name: 'Forgot password',
        iconText: 'FP',
        path: '/session/forgot-password',
      },
      {
        name: 'Error',
        iconText: '404',
        path: '/session/404',
      },
    ],
  },
];

export default navigations;
