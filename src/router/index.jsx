import FrontLayout from '../layouts/FrontLayout';
import HomePage from '../pages/HomePage';
import ProductsPage from '../pages/ProductsPage';
import ProductDetailPage from '../pages/ProductDetailPage';
import CartPage from '../pages/CartPage';
import NotFoundPage from '../pages/NotFoundPage';

import BackendLayout from '../layouts/BackendLayout';
import LoginPage from '../pages/LoginPage';
import AdminProductsPage from '../pages/AdminProductsPage';

import { createHashRouter } from 'react-router-dom';

const router = createHashRouter([
  {
    path: '/',
    element: <FrontLayout />,
    children: [
      {
        path: '',
        element: <HomePage />,
      },
      {
        path: 'products',
        element: <ProductsPage />,
      },
      {
        path: 'products/:id',
        element: <ProductDetailPage />,
      },
      {
        path: 'cart',
        element: <CartPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
  {
    path: '/admin',
    element: <BackendLayout />,
    children: [
      {
        path: '',
        element: <LoginPage />,
      },
      {
        path: 'admin-products',
        element: <AdminProductsPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);

export default router;
