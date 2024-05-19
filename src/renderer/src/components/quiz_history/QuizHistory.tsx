import { MdDelete } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import { QuizData } from './QuizHistoryData'

export default function QuizHistory() {
  return (
    <section className="p-4">
      <div className="grid grid-cols-7 justify-items-center items-center py-2 px-4 font-bold">
        <p className="col-span-3">Title</p>
        <p className="col-span-3">Date</p>
        <p className="col-span-1">Options</p>
      </div>
      <div>
        <ul className="flex flex-col gap-y-4">
          {QuizData.map((data, index) => {
            return (
              <li key={index}>
                <QuizHistoryItem key={data.id} id={data.id} title={data.title} date={data.date} />
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
}

function QuizHistoryItem(props: QuizHistoryItemProp) {
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
        <button
          onClick={(e) => {
            e.stopPropagation
            console.log('delete')
          }}
        >
          <MdDelete />
        </button>
      </div>
    </div>
  )
}
