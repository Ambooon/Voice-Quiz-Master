import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { FaPlay } from 'react-icons/fa'
import buzzerSFX from '../../assets/sounds/BuzzerSFX.mp3'

type QuestionPageProp = {
  data:
    | {
        question: string
        answer: string
        difficulty: string
        choices?: string[]
      }
    | undefined
  questionNo: number
  settings: {
    difficulty: string
    points: number
    time: number
  }[]
}

const QuestionPage = forwardRef((props: QuestionPageProp, ref) => {
  const [isAnswer, setIsAnswer] = useState(false)
  const [isShowAnswer, setIsShowAnswer] = useState(false)
  const Ref = useRef(null)
  const [timer, setTimer] = useState('00:00')
  const _buzzerSFX = new Audio(buzzerSFX)
  const [timerWidth, setTimerWidth] = useState(100)

  const settingsRef = useRef()
  const minutesRef = useRef<number | undefined>()
  const secondsRef = useRef<number | undefined>()

  const getTimeRemaining = (e) => {
    const total = Date.parse(e) - Date.parse(new Date())
    const seconds = Math.floor((total / 1000) % 60)
    const minutes = Math.floor((total / 1000 / 60) % 60)
    const hours = Math.floor((total / 1000 / 60 / 60) % 24)
    return {
      total,
      hours,
      minutes,
      seconds
    }
  }

  const startTimer = (e) => {
    const { total, hours, minutes, seconds } = getTimeRemaining(e)
    if (total >= 0) {
      setTimer(
        (minutes > 9 ? minutes : '0' + minutes) + ':' + (seconds > 9 ? seconds : '0' + seconds)
      )
      setTimerWidth((total / (settingsRef.current.time * 1000)) * 100)
      // console.log(total)
    } else {
      if (Ref.current) clearInterval(Ref.current)
      setIsAnswer(true)
      _buzzerSFX.play()
    }
  }

  const clearTimer = (e) => {
    // change duration here
    setTimer(`${minutesRef.current}:${secondsRef.current}`)
    if (Ref.current) clearInterval(Ref.current)
    const id = setInterval(() => {
      startTimer(e)
    }, 1000)
    Ref.current = id
  }

  const getDeadTime = () => {
    const deadline = new Date()
    // change duration here
    deadline.setSeconds(deadline.getSeconds() + settingsRef.current.time)
    return deadline
  }

  useEffect(() => {
    // change duration here
    settingsRef.current = props.settings.find(
      (setting) => setting.difficulty === props.data.difficulty
    )
    minutesRef.current = Math.floor(settingsRef.current?.time / 60)
    secondsRef.current = settingsRef.current?.time - minutesRef.current * 60

    setTimer(`${minutesRef.current}:${secondsRef.current}`)
  }, [])

  function start() {
    clearTimer(getDeadTime())
  }

  useImperativeHandle(ref, () => {
    return {
      start,
      showAnswer: () => {
        if (isAnswer) {
          setIsShowAnswer(true)
        }
      }
    }
  })

  return (
    <div className="p-4 h-full w-full relative">
      {!isAnswer ? (
        <>
          <div className="fixed top-12 left-4">
            <p className="font-bold text-2xl capitalize">
              {props.data?.difficulty === 'hard' ? 'difficult' : props.data?.difficulty} round
            </p>
            <p className="font-medium text-lg">Question No. {props.questionNo}</p>
          </div>
          <div className="flex justify-center items-center gap-4 ">
            <p className="text-center font-bold text-2xl mb-2">{timer}</p>
            <button className="text-myBlue-1 hover:text-myBlue-2" onClick={() => start()}>
              <FaPlay />
            </button>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 max-w-lg mx-auto mb-6">
            {/* <div className={'bg-blue-600 h-2.5 rounded-full'}></div> */}
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${timerWidth}%` }}
            ></div>
            {/* <p className="text-lg font-light text-center mt-2 capitalize">
              Difficulty: {props.data?.difficulty}
            </p> */}
          </div>
          <h1 className="font-bold text-4xl text-center mb-12">{props.data.question}</h1>
          <div>
            {props.data.choices &&
              props.data.choices.map((choice) => {
                return <Choice key={crypto.randomUUID()} text={choice} />
              })}
          </div>
        </>
      ) : (
        <>
          <div className="w-full my-auto flex justify-center items-center text-center">
            <div>
              <div className="flex justify-center items-center gap-4">
                <h2 className="text-2xl font-medium">Show Answer:</h2>
                <button
                  className="text-myBlue-1 hover:text-myBlue-2"
                  onClick={() => setIsShowAnswer(true)}
                >
                  <FaPlay />
                </button>
              </div>
              <h1 className="text-8xl font-bold">{isShowAnswer && props.data.answer}</h1>
            </div>
          </div>
        </>
      )}
    </div>
  )
})

QuestionPage.displayName = 'QuestionPage'

type ChoiceType = {
  text: string
}

function Choice(props: ChoiceType) {
  return (
    <div className="bg-slate-100 shadow-sm rounded-sm max-w-lg p-4 mb-4 mx-auto text-center">
      <h2 className="font-semibold text-2xl">{props.text}</h2>
    </div>
  )
}

export default QuestionPage
