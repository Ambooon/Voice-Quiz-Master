import { IoIosArrowBack } from 'react-icons/io'
import { NavLink, Outlet } from 'react-router-dom'

export const QuizRoomLayout = () => (
  <div className="p-2 relative h-screen w-full">
    <NavLink to={'/'} className="w-fit flex justify-between items-center gap-2 fixed top-0 left-0">
      <IoIosArrowBack size={32} />
      <p className="font-medium">Stop Quiz</p>
    </NavLink>
    <div className="flex-1 h-full">
      <Outlet />
    </div>
  </div>
)
