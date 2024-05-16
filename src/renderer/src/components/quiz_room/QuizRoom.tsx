import { FaPlay } from 'react-icons/fa'
import { IoIosAdd } from 'react-icons/io'
import { NavLink } from 'react-router-dom'

export default function QuizRoom() {
  return (
    <div className="flex justify-center items-center h-screen gap-24">
      <div className="text-myBlue-1 size-40 border-2 border-myBlue-1 rounded-md flex justify-center items-center text-center hover:cursor-pointer hover:bg-myBlue-2 hover:text-white ease-out duration-100">
        <div>
          <h2 className="font-bold text-xl">Create New Quiz</h2>
          <IoIosAdd className="mx-auto" size={52} />
        </div>
      </div>
      <NavLink
        to={'/quiz-management'}
        className="text-myBlue-1 size-40 border-2 border-myBlue-1 rounded-md flex justify-center items-center text-center hover:cursor-pointer hover:bg-myBlue-2 hover:text-white ease-out duration-100"
      >
        <div>
          <h2 className="font-bold text-xl mb-2">Start Existing Quiz</h2>
          <FaPlay className="mx-auto" size={32} />
        </div>
      </NavLink>
    </div>
  )
}
