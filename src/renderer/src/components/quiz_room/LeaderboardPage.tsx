type RankingPageProp = {
  data: {
    score: number
    name: string
  }[]
}

export default function LeaderboardPage(props: RankingPageProp) {
  return (
    <div className="max-h-screen">
      <div className="max-w-sm mx-auto">
        <h1 className="text-center text-6xl font-bold mb-4 ">Winner</h1>
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
    <div
      className={`flex justify-between items-center p-4 mb-2 rounded-md max-w-sm ${props.index === 1 ? 'bg-myBlue-1 text-white' : 'bg-slate-100'}`}
    >
      <p className="font-medium">
        {props.index}. {props.name}
      </p>
      {/* <p>{props.score} pts</p> */}
    </div>
  )
}
