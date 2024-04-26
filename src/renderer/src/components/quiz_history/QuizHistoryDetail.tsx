import { useParams, useNavigate } from 'react-router-dom'
import { QuizHistoryData } from './QuizHistoryData'
import { IoMdArrowRoundBack } from 'react-icons/io'

export default function QuizHistoryDetail() {
  const { id } = useParams()
  const data = QuizHistoryData.find((item) => String(item.id) === id)
  const navigate = useNavigate()
  function handleBack(): void {
    navigate(-1)
  }
  return (
    <section>
      <button onClick={handleBack}>
        <IoMdArrowRoundBack />
      </button>
      {!data ? (
        <p>Not Found Quiz Item</p>
      ) : (
        <>
          <h3>{data.title}</h3>
          <p>{data.date}</p>
        </>
      )}
    </section>
  )
}
