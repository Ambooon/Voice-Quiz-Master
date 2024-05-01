import { ParticipantData } from './ParticipantData'

export default function RankingPage() {
  return (
    <div className="max-h-screen">
      <h1 className="mt-4 mb-12 mx-4 text-4xl font-bold text-center">Ranking</h1>
      <div className="max-w-sm mx-auto">
        {ParticipantData.map((participant, index) => {
          return (
            <RankingItem
              key={index}
              index={index + 1}
              name={participant.name}
              score={participant.score}
            />
          )
        })}
      </div>
    </div>
  )
}

type RankingItemProp = {
  index: number
  name: string
  score: number
}

function RankingItem(props: RankingItemProp) {
  return (
    <div className="flex justify-between items-center bg-slate-100 p-4 mb-2 rounded-md max-w-sm">
      <p className="font-medium">
        {props.index}. {props.name}
      </p>
      <p>{props.score} pts</p>
    </div>
  )
}
