type RankingPageProp = {
  data: {
    name: string
  }[]
}

export default function ClincherParticipantsPage(props: RankingPageProp) {
  return (
    <div className="max-h-screen">
      <div className="max-w-sm mx-auto">
        {props.data.map((participant, index) => {
          return <RankingItem key={crypto.randomUUID()} index={index + 1} name={participant.name} />
        })}
      </div>
    </div>
  )
}

type RankingItemProp = {
  index: number
  name: string
}

function RankingItem(props: RankingItemProp) {
  return (
    <div className={`flex justify-between items-center p-4 mb-2 rounded-md max-w-sm bg-slate-50`}>
      <p className="font-medium">
        {props.index}. {props.name}
      </p>
    </div>
  )
}
