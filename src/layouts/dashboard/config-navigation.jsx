import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const navConfig = [
  {
    title: 'dashboard',
    path: '/auth',
    icon: icon('ic_analytics'),
  },
  {
    title: 'user',
    path: '/auth/user',
    icon: icon('ic_user'),
  },
  {
    title: 'product',
    path: '/auth/products',
    icon: icon('ic_cart'),
  },
  {
    title: 'Expense',
    path: '/auth/expense',
    icon: icon('ic_user'),
  },
  {
    title: 'Groups',
    path: '/auth/group',
    icon: icon('ic_user'),
  },
  {
    title: 'Reports',
    path: '',
    icon: icon('ic_blog'),
  },
  // {
  //   title: 'login',
  //   path: '/login',
  //   icon: icon('ic_lock'),
  // },
  {
    title: 'Not found',
    path: '/404',
    icon: icon('ic_disabled'),
  },
];

export default navConfig;
