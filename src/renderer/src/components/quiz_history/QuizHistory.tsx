import { QuizHistoryData } from './QuizHistoryData'
import QuizHistoryItem from './QuizHistoryItem'

export default function QuizHistory() {
  return (
    <section className="p-2">
      <div className="w-full flex justify-end my-2">
        <input
          className="py-1 px-2 border-2 rounded-md border-slate-700"
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
