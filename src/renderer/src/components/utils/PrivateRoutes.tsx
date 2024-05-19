import { Navigate, Outlet } from 'react-router-dom'

export default function PrivateRoutes() {
  // this indicate if the user is logged in or not
  // change to true if it is logged in
  // const [isLoggedIn, setIsLoggedIn]
  const auth = { token: true }
  return auth.token ? <Outlet /> : <Navigate to={'/login'} />
}
