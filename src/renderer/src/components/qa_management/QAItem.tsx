import { useNavigate } from 'react-router-dom'

type QAItemProp = {
  id: number
  title: string
  date: string
  description: string
}

export default function QAItem(props: QAItemProp) {
  const navigate = useNavigate()
  function handleClick() {
    navigate(`/qa-management/${props.id}`)
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
