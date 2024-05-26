type RankingPageProp = {
  data: {
    score: number
    name: string
  }[]
}

export default function RankingPage(props: RankingPageProp) {
  return (
    <div className="max-h-full">
      <div className="max-w-sm mx-auto">
        {props.data.map((participant, index) => {
          return (
            <RankingItem
              key={crypto.randomUUID()}
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
