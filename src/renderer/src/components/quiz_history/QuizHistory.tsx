import { QuizHistoryData } from './QuizHistoryData'
import { FaFileExport } from 'react-icons/fa'
import { SlOptionsVertical } from 'react-icons/sl'
import { useNavigate } from 'react-router-dom'

export default function QuizHistory() {
  return (
    <section className="p-4">
      <div className="w-full flex justify-end my-2">
        <input
          className="py-1 px-2 border rounded-md border-slate-700"
          type="search"
          placeholder="Search quiz history"
        />
      </div>
      <div className="flex justify-between py-2 px-4">
        <p>Title</p>
        <p>Date</p>
        <p>Options</p>
      </div>
      <div>
        <ul className="flex flex-col gap-y-4">
          {QuizHistoryData.map((data) => {
            return (
              <li key={data.id}>
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
      className="flex justify-between items-center p-4 rounded-lg  shadow-md hover:cursor-pointer hover:bg-myBlue-1 duration-100 ease-in-out hover:text-white"
      onClick={handleClick}
    >
      <p className="text-2xl font-semibold">{props.title}</p>
      <p>
        <time dateTime={props.date}>{props.date}</time>
      </p>
      <div className="flex gap-4">
        <button>
          <FaFileExport />
        </button>
        <button>
          <SlOptionsVertical />
        </button>
      </div>
    </div>
  )
}
