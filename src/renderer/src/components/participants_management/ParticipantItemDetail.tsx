import { useNavigate, useParams } from 'react-router-dom'
import { ParticipantData } from './ParticipantData'
import { IoMdArrowRoundBack } from 'react-icons/io'

export default function ParticipantItemDetail() {
  const { id } = useParams()
  const data = ParticipantData.find((item) => String(item.id) === id)
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
        <p>Not Found Participant Item</p>
      ) : (
        <>
          <h3 className="text-xl font-semibold">{data.title}</h3>
          <p>{data.dateCreated}</p>
          <p>{data.description}</p>
          <hr />
          <div>
            <h4 className="text-lg font-medium">Participants</h4>
            <ul className="flex flex-col gap-y-2">
              {data.participants.map((participant, index) => {
                return <li key={index}>{participant.name}</li>
              })}
            </ul>
          </div>
        </>
      )}
    </section>
  )
}
