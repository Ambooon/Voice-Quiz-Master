import { FaFileExport } from 'react-icons/fa'
import { SlOptionsVertical } from 'react-icons/sl'
import { useNavigate } from 'react-router-dom'

type QuizHistoryItemProp = {
  id: number
  title: string
  date: string //year-month-day 2002-08-29
}

export default function QuizHistoryItem(props: QuizHistoryItemProp) {
  const navigate = useNavigate()
  function handleClick() {
    navigate(`/quiz-history/${props.id}`)
  }
  return (
    <div
      className="bg-slate-200 flex justify-between items-center p-4 hover:cursor-pointer"
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
