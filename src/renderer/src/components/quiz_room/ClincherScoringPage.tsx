import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { FaCheck } from 'react-icons/fa'
import { RxCross2 } from 'react-icons/rx'
import correctSFX from '../../assets/sounds/CorrectSFX.mp3'
import wrongSFX from '../../assets/sounds/WrongSFX.mp3'

type ScoringPageProp = {
  data: { name: string }[]
  onFinishScoring: (scores: { id: number; isCorrect: boolean }[]) => void
}

const ClincherScoringPage = forwardRef((props: ScoringPageProp, ref) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [participants, setParticipants] = useState<any[]>([])
  useEffect(() => {
    const newParticipants = props.data.map((item) => ({
      ...item,
      isScored: false,
      isCorrect: false
    }))
    setParticipants(newParticipants)
  }, [])
  const _correctSFX = new Audio(correctSFX)
  const _wrongSFX = new Audio(wrongSFX)

  function scoreParticipant(id: number, isCorrect = false) {
    const nextParticipants = [...participants]
    // const participant = nextParticipants.find((p) => p.id === id)
    const participant = nextParticipants.find((p, index) => index + 1 === id)
    if (participant) {
      participant.isScored = true
      participant.isCorrect = isCorrect
      if (participant.isCorrect) {
        _correctSFX.play()
      } else {
        _wrongSFX.play()
      }
    }
    setParticipants(nextParticipants)
  }

  function sendScores() {
    const scores = participants.map((participant, index) => {
      const { isCorrect } = participant
      return { id: index, isCorrect: isCorrect }
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
    <div className="max-h-full">
      {/* <div className="bg-myBlue-3 shadow-md p-4 w-fit rounded-full mx-auto text-white mb-12">
        <FaMicrophone size={40} />
      </div> */}
      <div className="max-w-sm mx-auto">
        {participants.map((participant, index) => {
          return (
            <RankingItem
              key={crypto.randomUUID()}
              index={index + 1}
              id={participant.id}
              name={participant.name}
              isCorrect={participant.isCorrect}
              isScored={participant.isScored}
              onManualScore={(id, isCorrect) => scoreParticipant(id, isCorrect)}
            />
          )
        })}
      </div>
    </div>
  )
})

ClincherScoringPage.displayName = 'ClincherScoringPage'

type RankingItemProp = {
  index: number
  id: number
  name: string
  isCorrect: boolean
  isScored: boolean
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

      <div className="flex justify-between gap-4 items-center">
        <button onClick={() => props.onManualScore(props.index, true)}>
          <FaCheck />
        </button>
        <button onClick={() => props.onManualScore(props.index, false)}>
          <RxCross2 />
        </button>
      </div>
    </div>
  )
}

export default ClincherScoringPage
