import { Outlet } from 'react-router-dom'
import Sidebar from '../sidebar/Sidebar'

export const PageLayout = () => (
  <div className="flex">
    <div>
      <Sidebar />
    </div>
    <div className="flex-1">
      <Outlet />
    </div>
  </div>
)
