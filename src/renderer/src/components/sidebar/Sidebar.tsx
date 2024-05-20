import { IoIosSettings } from 'react-icons/io'
import { NavLink } from 'react-router-dom'
import { SidebarData } from './SidebarData'

export default function Sidebar() {
  return (
    <nav className="min-h-screen max-w-fit p-4 flex flex-col justify-between bg-myBlue-3 text-white">
      <div>
        <h1 className="text-2xl font-bold mb-16 mt-6">Voice Quiz</h1>
        <ul className="flex flex-col gap-4">
          {SidebarData.map((item, index) => {
            return (
              <NavLink key={index} to={item.path}>
                <li className="hover:bg-myBlue-2 ease-in-out duration-100 px-2 py-4 rounded-md">
                  <div className="flex items-center gap-2">
                    {item.icon}
                    <span className="text-sm">{item.title}</span>
                  </div>
                </li>
              </NavLink>
            )
          })}
        </ul>
      </div>

      <div className="flex justify-between items-center">
        <p>Hello, {sessionStorage.getItem('username')}</p>
        <NavLink to={'/profile'}>
          <IoIosSettings />
        </NavLink>
      </div>
    </nav>
  )
}
