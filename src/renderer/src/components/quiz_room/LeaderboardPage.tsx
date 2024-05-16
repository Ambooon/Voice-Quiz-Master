type RankingPageProp = {
  data: {
    score: number
    id: number
    name: string
    description: string
  }[]
}

export default function LeaderboardPage(props: RankingPageProp) {
  function compare(a, b) {
    if (a.score < b.score) {
      return 1
    }
    if (a.score > b.score) {
      return -1
    }
    return 0
  }

  props.data.sort(compare)

  return (
    <div className="max-h-screen">
      <h1 className="mt-4 mb-12 mx-4 text-4xl font-bold text-center">Leaderboard</h1>
      <div className="max-w-sm mx-auto">
        {props.data.map((participant, index) => {
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
    <div
      className={`flex justify-between items-center p-4 mb-2 rounded-md max-w-sm ${props.index === 1 ? 'bg-myBlue-1 text-white' : 'bg-slate-100'}`}
    >
      <p className="font-medium">
        {props.index}. {props.name}
      </p>
      <p>{props.score} pts</p>
    </div>
  )
}
