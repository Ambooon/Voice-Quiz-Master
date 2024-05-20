import { useEffect, useState } from 'react'
import { FaCheck } from 'react-icons/fa'
import { MdDelete } from 'react-icons/md'
import { RxCross2 } from 'react-icons/rx'
import { useNavigate } from 'react-router-dom'

export default function QuizHistory() {
  const [quizData, setQuizData] = useState()

  useEffect(() => {
    async function getQuizzes() {
      // change the argument to current user
      setQuizData(await window.api.getQuizzesHistory(sessionStorage.getItem('username')))
    }
    getQuizzes()
  }, [])

  function handleDelete(e, id) {
    e.stopPropagation()
    window.api.deleteQuizHistory(id)
    window.location.reload()
  }

  return (
    <section className="p-4">
      <div className="grid grid-cols-7 justify-items-center items-center py-2 px-4 font-bold">
        <p className="col-span-3">Title</p>
        <p className="col-span-3">Date</p>
        <p className="col-span-1">Options</p>
      </div>
      <div>
        <ul className="flex flex-col gap-y-4">
          {quizData?.map((data, index) => {
            return (
              <li key={index}>
                <QuizHistoryItem
                  key={crypto.randomUUID()}
                  id={data.id}
                  title={data.title}
                  date={data.date}
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

type QuizHistoryItemProp = {
  id: number
  title: string
  date: string //year-month-day 2002-08-29
  onDelete: (e, id) => void
}

function QuizHistoryItem(props: QuizHistoryItemProp) {
  const [isPopup, setIsPopup] = useState(false)
  const navigate = useNavigate()
  function handleClick() {
    navigate(`/quiz-history/${props.id}`)
  }
  return (
    <div
      className="grid grid-cols-7 justify-items-center items-center p-4 rounded-lg  shadow-md hover:cursor-pointer hover:bg-myBlue-1 duration-100 ease-in-out hover:text-white"
      onClick={() => handleClick()}
    >
      <p className="text-2xl font-semibold col-span-3">{props.title}</p>
      <p className="col-span-3">
        <time dateTime={props.date}>{props.date}</time>
      </p>
      <div className="flex gap-4 col-span-1">
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
