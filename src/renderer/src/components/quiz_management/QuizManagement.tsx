import { useEffect, useState } from 'react'
import { FaCheck } from 'react-icons/fa6'
import { MdDelete } from 'react-icons/md'
import { RxCross2 } from 'react-icons/rx'
import { NavLink, useNavigate } from 'react-router-dom'

// type QuizDataType = {
//   _id: ObjectId
//   title: string
//   date: string
//   description?: string
// }
export default function QuizManagement() {
  // const [quizData, setQuizData] = useState<QuizDataType[]>([])
  const [quizData, setQuizData] = useState([])

  useEffect(() => {
    async function getQuizzes() {
      // change the argument to current user
      setQuizData(await window.api.getQuizzes(sessionStorage.getItem('username')))
    }
    getQuizzes()
  }, [])

  function handleDelete(e, id) {
    e.stopPropagation()
    window.api.deleteQuiz(id)
    window.location.reload()
  }

  return (
    <section className="p-4">
      <div className="w-full flex justify-end mt-2 mb-4">
        <NavLink
          to={'/quiz-management/create'}
          className="px-4 py-2 rounded-lg bg-myBlue-1 text-white hover:bg-myBlue-2"
        >
          Create Quiz
        </NavLink>
      </div>
      <div className="grid grid-cols-9 justify-items-center items-center py-2 px-4 font-bold">
        <p className="col-span-3">Title</p>
        <p className="col-span-3">Description</p>
        <p className="col-span-2">Date</p>
        <p className="col-span-1">Options</p>
      </div>
      <div>
        <ul className="flex flex-col gap-y-4">
          {quizData.map((data) => {
            return (
              <li key={crypto.randomUUID()}>
                <QuizItem
                  key={crypto.randomUUID()}
                  id={data.id}
                  title={data.title}
                  date={data.date}
                  description={data.description}
                  onDelete={(e, id) => handleDelete(e, id)}
                />
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

type QuizItemProp = {
  id: string
  title: string
  description?: string
  date: string //year-month-day 2002-08-29
  onDelete: (e, id) => void
}

function QuizItem(props: QuizItemProp) {
  const [isPopup, setIsPopup] = useState(false)
  const navigate = useNavigate()
  function handleClick() {
    navigate(`/quiz-management/${props.id}`)
  }
  return (
    <div
      className="grid grid-cols-9 justify-items-center items-center p-4 rounded-lg  shadow-md hover:cursor-pointer hover:bg-myBlue-1 duration-100 ease-in-out hover:text-white"
      onClick={handleClick}
    >
      <p className="text-2xl font-semibold col-span-3">{props.title}</p>
      <p className="col-span-3">{props.description}</p>
      <p className="col-span-2">
        <time dateTime={props.date}>{props.date}</time>
      </p>
      <div className="col-span-1">
        {isPopup ? (
          <div className=" flex justify-between items-center gap-4">
            <button
              className="hover:text-red-500"
              onClick={(e) => {
                e.stopPropagation()
                props.onDelete(e, props.id)
              }}
            >
              <FaCheck size={20} />
            </button>
            <button
              className="hover:text-red-500"
              onClick={(e) => {
                e.stopPropagation()
                setIsPopup((prev) => !prev)
              }}
            >
              <RxCross2 size={20} />
            </button>
          </div>
        ) : (
          <button
            className="hover:text-red-500"
            onClick={(e) => {
              e.stopPropagation()
              setIsPopup((prev) => !prev)
            }}
          >
            <MdDelete size={28} />
          </button>
        )}
      </div>
    </div>
  )
}
