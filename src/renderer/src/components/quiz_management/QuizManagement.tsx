import { useState } from 'react'
import { MdDelete } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import { QuizData } from './QuizData'

export default function QuizManagement() {
  const [quizData, setQuizData] = useState(QuizData)

  return (
    <section className="p-4">
      <div className="w-full flex justify-end mt-2 mb-4">
        <button className="px-4 py-2 rounded-lg bg-myBlue-1 text-white hover:bg-myBlue-2">
          Create Quiz
        </button>
      </div>
      <div className="grid grid-cols-9 justify-items-center items-center py-2 px-4 font-bold">
        <p className="col-span-3">Title</p>
        <p className="col-span-3">Description</p>
        <p className="col-span-2">Date</p>
        <p className="col-span-1">Options</p>
      </div>
      <div>
        <ul className="flex flex-col gap-y-4">
          {quizData.map((data, index) => {
            return (
              <li key={data.id}>
                <QuizItem
                  key={index}
                  id={data.id}
                  title={data.title}
                  date={data.date}
                  description={data.description}
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
  id: number
  title: string
  description: string
  date: string //year-month-day 2002-08-29
}

function QuizItem(props: QuizItemProp) {
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
        <button>
          <MdDelete />
        </button>
      </div>
    </div>
  )
}
