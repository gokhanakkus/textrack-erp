import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import MainLayout from '../layouts/MainLayout'
import Login from '../pages/Login'
import Dashboard from '../pages/Dashboard'
import Orders from '../pages/Orders'
import Stocks from '../pages/Stocks'
import Production from '../pages/Production'
import QualityControl from '../pages/QualityControl'
import Notifications from '../pages/Notifications'
import Customers from '../pages/Customers'
import Finance from '../pages/Finance'

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard',       element: <Dashboard /> },
      { path: 'customers',       element: <Customers /> },
      { path: 'orders',          element: <Orders /> },
      { path: 'stocks',          element: <Stocks /> },
      { path: 'production',      element: <Production /> },
      { path: 'quality-control', element: <QualityControl /> },
      { path: 'notifications',   element: <Notifications /> },
      { path: 'finance',         element: <Finance /> },
    ],
  },
])

export default function AppRouter() {
  return <RouterProvider router={router} />
}
