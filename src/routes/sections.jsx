import { lazy, Suspense } from 'react';
import { useSelector } from 'react-redux';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import DashboardLayout from 'src/layouts/dashboard';

import CustomMain from './custom.main';

export const IndexPage = lazy(() => import('src/pages/app'));
export const BlogPage = lazy(() => import('src/pages/blog'));
export const UserPage = lazy(() => import('src/pages/user'));
export const SignInPage = lazy(() => import('src/pages/signin'));
export const ProductsPage = lazy(() => import('src/pages/products'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));
export const HomePage = lazy(() => import('src/pages/home'));
export const ExpensePage = lazy(()=>import('src/pages/expense'));
export const GroupPage = lazy(()=>import('src/pages/group'));
export const ExpenseRequestPage = lazy(()=>import('src/pages/expense-request'));
export const SignUpPage = lazy(()=>import('src/pages/signup'));


// ----------------------------------------------------------------------

export default function Router() {
  const auth = useSelector((state)=>state.auth);
  const routes = useRoutes([
    {
      path: 'auth',
      element: 
        auth.isLoggedIn && auth.currentUser ? (
        <DashboardLayout>
          <Suspense>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ):<Navigate to="/login" />,
      children: [
        { element: <IndexPage />, index: true },
        { path: 'user', element: <UserPage /> },
        { path: 'products', element: <ProductsPage /> },
        { path: 'blog', element: <BlogPage /> },
        { path: 'expense', element: <ExpensePage /> },
        { path: 'group', element: <GroupPage /> },
        {path:'expense-request', element :<ExpenseRequestPage/>}

      ],
    },
    {
      element: <CustomMain />,
      children: [
        {
          path: 'login',
          element: <SignInPage />,
        },
        {
          path: 'home',
          element: <HomePage />,
        },
        {
          path: 'signup',
          element: <SignUpPage />,
        },
        {
          path: '404',
          element: <Page404 />,
        },
      ],
    },
    //  {
    //   path: 'login',
    //   element: <LoginPage />,
    // },
    // {
    //   path: '404',
    //   element: <Page404 />,
    // },
    // {
    //   path: 'home',
    //   element: <Page404 />,
    // },

    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
