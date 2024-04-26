import { NavLink } from 'react-router-dom'
import { SidebarData } from './SidebarData'
import { SlOptionsVertical } from 'react-icons/sl'

export default function Sidebar() {
  return (
    <nav className="min-h-screen max-w-fit p-4 bg-blue-300 flex flex-col justify-between">
      <div>
        <h1 className="text-2xl font-bold mb-16 mt-6">Voice Quiz</h1>
        <ul className="flex flex-col gap-8">
          {SidebarData.map((item, index) => {
            return (
              <li key={index} className="hover:bg-blue-400">
                <NavLink to={item.path} className="flex items-center gap-2">
                  {item.icon}
                  <span>{item.title}</span>
                </NavLink>
              </li>
            )
          })}
        </ul>
      </div>

      <div className="flex justify-between items-center">
        <div className="w-8 h-8 rounded-full bg-slate-100"></div>
        <p>Username</p>
        <SlOptionsVertical />
      </div>
    </nav>
  )
}
