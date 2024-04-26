import { useNavigate } from 'react-router-dom'

type ParticipantItemProp = {
  id: number
  title: string
  date: string
  description: string
}

export default function ParticipantItem(props: ParticipantItemProp) {
  const navigate = useNavigate()
  function handleClick() {
    navigate(`/participant-management/${props.id}`)
  }
  return (
    <div
      className="bg-slate-200 flex justify-between items-center p-4 hover:cursor-pointer"
      onClick={handleClick}
    >
      <p>{props.title}</p>
      <p>{props.date}</p>
      <p>{props.description}</p>
    </div>
  )
}
