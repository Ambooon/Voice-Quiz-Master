import { Navigate, Outlet } from 'react-router-dom'

export default function PrivateRoutes() {
  return sessionStorage.getItem('isLoggedIn') === 'true' ? <Outlet /> : <Navigate to={'/login'} />
}
