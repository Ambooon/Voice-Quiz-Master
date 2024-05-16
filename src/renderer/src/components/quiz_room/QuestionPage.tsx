import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'

type QuestionPageProp = {
  data: {
    question: string
    answer: string
    choices?: string[]
  }
}

const QuestionPage = forwardRef((props: QuestionPageProp, ref) => {
  const [isAnswer, setIsAnswer] = useState(false)
  const [isShowAnswer, setIsShowAnswer] = useState(false)
  const Ref = useRef(null)
  const [timer, setTimer] = useState('00:00:00')

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
        (hours > 9 ? hours : '0' + hours) +
          ':' +
          (minutes > 9 ? minutes : '0' + minutes) +
          ':' +
          (seconds > 9 ? seconds : '0' + seconds)
      )
    } else {
      if (Ref.current) clearInterval(Ref.current)
      setIsAnswer(true)
    }
  }

  const clearTimer = (e) => {
    // change duration here
    setTimer('00:00:05')
    if (Ref.current) clearInterval(Ref.current)
    const id = setInterval(() => {
      startTimer(e)
    }, 1000)
    Ref.current = id
  }

  const getDeadTime = () => {
    const deadline = new Date()
    // change duration here
    deadline.setSeconds(deadline.getSeconds() + 5)
    return deadline
  }

  useEffect(() => {
    // change duration here
    setTimer('00:00:05')
  }, [])

  function start() {
    clearTimer(getDeadTime())
  }

  useImperativeHandle(ref, () => {
    return {
      start,
      showAnswer: () => {
        setIsShowAnswer(true)
      }
    }
  })

  return (
    <div className="p-8 h-screen w-full">
      {!isAnswer ? (
        <>
          <p className="text-center font-bold text-2xl mb-2">{timer}</p>
          <div className="w-full bg-gray-200 rounded-full h-2.5 max-w-lg mx-auto mb-8">
            <div className={'bg-blue-600 h-2.5 rounded-full'}></div>
            {/* <div className="bg-blue-600 h-2.5 rounded-full" style="width: 45%"></div> */}
          </div>
          <h1 className="font-bold text-4xl text-center mb-12">{props.data.question}</h1>
          <div>
            {props.data.choices &&
              props.data.choices.map((choice, index) => {
                return <Choice key={index} text={choice} />
              })}
          </div>
        </>
      ) : (
        <>
          <div className="w-full h-full flex justify-center items-center text-center">
            <div>
              <h2 className="text-2xl font-medium">Answer is:</h2>
              <h1 className="text-6xl font-bold">{isShowAnswer && props.data.answer}</h1>
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
    <div className="bg-slate-50 shadow-sm rounded-sm max-w-lg p-4 mb-4 mx-auto">
      <h2 className="font-semibold text-2xl">{props.text}</h2>
    </div>
  )
}

export default QuestionPage
