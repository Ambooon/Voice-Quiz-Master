import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { FaCheck } from 'react-icons/fa'
import { RxCross2 } from 'react-icons/rx'

type ScoringPageProp = {
  data: { id: number; name: string }[]
  onFinishScoring: (scores: { id: number; isCorrect: boolean }[]) => void
}

const ScoringPage = forwardRef((props: ScoringPageProp, ref) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [participants, setParticipants] = useState<any[]>([])
  const [isManual, setIsManual] = useState(false)
  useEffect(() => {
    const newParticipants = props.data.map((item) => ({
      ...item,
      isScored: false,
      isCorrect: false
    }))
    setParticipants(newParticipants)
  }, [])

  function scoreParticipant(id: number, isCorrect = false) {
    const nextParticipants = [...participants]
    const participant = nextParticipants.find((p) => p.id === id)
    if (participant) {
      participant.isScored = true
      participant.isCorrect = isCorrect
    }
    setParticipants(nextParticipants)
  }

  function sendScores() {
    const scores = participants.map((participant) => {
      const { id, isCorrect, ...rest } = participant
      return { id: id, isCorrect: isCorrect }
    })
    props.onFinishScoring(scores)
  }

  useImperativeHandle(ref, () => {
    return {
      scoreParticipant,
      sendScores
    }
  })

  return (
    <div className="max-h-screen">
      <h1 className="mt-4 mx-4 text-4xl font-bold">Scoring</h1>
      {/* <div className="bg-myBlue-3 shadow-md p-4 w-fit rounded-full mx-auto text-white mb-12">
        <FaMicrophone size={40} />
      </div> */}
      <div className="w-fit ml-auto px-8">
        <label className="inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            value=""
            onClick={() => setIsManual((prev) => !prev)}
            className="sr-only peer"
          />
          <div className="relative w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          <span className="ms-3 text-sm font-medium text-gray-900">Manual</span>
        </label>
      </div>
      <div className="max-w-sm mx-auto">
        {participants.map((participant, index) => {
          return (
            <RankingItem
              key={index}
              index={index + 1}
              id={participant.id}
              name={participant.name}
              isCorrect={participant.isCorrect}
              isScored={participant.isScored}
              isManual={isManual}
              onManualScore={(id, isCorrect) => scoreParticipant(id, isCorrect)}
            />
          )
        })}
      </div>
    </div>
  )
})

ScoringPage.displayName = 'ScoringPage'

type RankingItemProp = {
  index: number
  id: number
  name: string
  isCorrect: boolean
  isScored: boolean
  isManual: boolean
  onManualScore: (id: number, isCorrect: boolean) => void
}

function RankingItem(props: RankingItemProp) {
  return (
    <div
      className={
        props.isScored
          ? `flex justify-between items-center ${props.isCorrect ? 'bg-myBlue-1' : 'bg-red-500'} text-white p-4 mb-2 rounded-md w-sm`
          : 'flex justify-between items-center bg-slate-300 text-white p-4 mb-2 rounded-md w-sm'
      }
    >
      <p className="font-medium">
        {props.index}. {props.name}
      </p>
      {/* <p className="text-white">{props.isCorrect ? <FaCheck /> : <RxCross2 />}</p> */}

      {props.isManual && (
        <div className="flex justify-between gap-4 items-center">
          <button onClick={() => props.onManualScore(props.id, true)}>
            <FaCheck />
          </button>
          <button onClick={() => props.onManualScore(props.id, false)}>
            <RxCross2 />
          </button>
        </div>
      )}
    </div>
  )
}

export default ScoringPage
