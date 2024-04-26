import { useNavigate, useParams } from 'react-router-dom'
import { QAData } from './QAData'
import { IoMdArrowRoundBack } from 'react-icons/io'

export default function QAItemDetail() {
  const { id } = useParams()
  const data = QAData.find((item) => String(item.id) === id)
  const navigate = useNavigate()
  function handleBack(): void {
    navigate(-1)
  }
  return (
    <section className="p-2">
      <button onClick={handleBack}>
        <IoMdArrowRoundBack />
      </button>
      {!data ? (
        <p>Not Found Question and Answer Item</p>
      ) : (
        <>
          <h3 className="text-xl font-semibold">{data.title}</h3>
          <p>{data.dateCreated}</p>
          <p>{data.description}</p>
          <hr />
          <div>
            <h4 className="text-lg font-medium">Questions</h4>
            <ul className="flex flex-col gap-y-2">
              {data.qaList.map((qa, index) => {
                return (
                  <li key={index}>
                    Question {index + 1}
                    <br />
                    {qa.question}
                    <br />
                    Choices: [{qa.choices}]
                    <br />
                    Answer: {qa.answer}
                  </li>
                )
              })}
            </ul>
          </div>
        </>
      )}
    </section>
  )
}
