import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import LeaderboardPage from './LeaderboardPage'
import QuestionPage from './QuestionPage'
import { QuizData } from './QuizData'
import RankingPage from './RankingPage'
import ScoringPage from './ScoringPage'

export default function QuizRoomMain() {
  const { id } = useParams()
  const quizData = QuizData.find((item) => String(item.id) === id)

  const questions = quizData.questions
  const participants = quizData.participants.map((participant) => ({
    ...participant,
    score: 0
  }))

  const [socket, setSocket] = useState()
  const [isLoading, setIsLoading] = useState(true)
  const [isStarted, setIsStarted] = useState(false)
  const [currentPage, setCurrentPage] = useState('start')
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [isDone, setIsDone] = useState(false)
  const [participantsScore, setParticipantsScore] = useState(participants)

  const questionPageRef = useRef()
  const scoringPageRef = useRef()

  async function getMicrophone() {
    const userMedia = await navigator.mediaDevices.getUserMedia({
      audio: true
    })
    return new MediaRecorder(userMedia)
  }

  async function openMicrophone(microphone, socket) {
    await microphone.start(500)

    microphone.onstart = () => {
      setIsLoading(false)
      console.log('client: microphone opened')
      document.body.classList.add('recording')
    }

    microphone.onstop = () => {
      console.log('client: microphone closed')
      document.body.classList.remove('recording')
    }

    microphone.ondataavailable = (e) => {
      const data = e.data
      // console.log('client: sent data to websocket')
      socket.send(data)
    }
  }

  async function closeMicrophone(microphone) {
    microphone.stop()
  }

  async function start(socket) {
    let microphone

    console.log('client: waiting to open microphone')
    if (!microphone) {
      // open and close the microphone
      microphone = await getMicrophone()
      await openMicrophone(microphone, socket)
    } else {
      await closeMicrophone(microphone)
      microphone = undefined
    }
  }

  useEffect(() => {
    const { createClient } = deepgram
    // don't hard code the API here
    const _deepgram = createClient('b48716aeb2761c8fafe5ed04a1a84af0f2675adc')

    const _socket = _deepgram.listen.live({
      language: 'en',
      model: 'nova-2',
      numerals: true,
      punctuate: false,
      diarize: true,

      // To get UtteranceEnd, the following must be set:
      interim_results: true,
      utterance_end_ms: 1000,
      vad_events: true
    })

    setSocket(_socket)

    _socket.on('open', async () => {
      // Keep alive the connection
      setInterval(() => {
        const keepAliveMsg = JSON.stringify({ type: 'KeepAlive' })
        _socket.send(keepAliveMsg)
      }, 3000)
      await start(_socket)
    })

    return () => {
      // socket.close()
    }
  }, [])

  useEffect(() => {
    if (socket && !isDone) {
      socket.on('Results', (data) => {
        const transcript = data.channel.alternatives[0].transcript
        if (transcript !== '' && data.is_final) {
          console.log(transcript)
          if (transcript === 'begin quiz' || transcript === 'begin please') {
            setIsStarted(true)
            setCurrentPage('question')
          } else if (transcript === 'stop quiz') {
            // exit quiz
            return
          } else if (transcript === 'start timer') {
            questionPageRef.current.start()
          } else if (transcript === 'stop timer') {
            return
          } else if (transcript === 'show answer') {
            questionPageRef.current.showAnswer()
          } else if (transcript === 'begin scoring') {
            setCurrentPage('scoring')
          } else if (transcript === 'finished scoring' || transcript === 'finish scoring') {
            scoringPageRef.current.sendScores()
            setCurrentPage('ranking')
          } else if (transcript === 'next question') {
            setCurrentPage('question')
            setCurrentQuestionIndex((prev) => prev + 1)
          }

          const command = transcript.match(/\b(\w+)\b/g)
          if (command[0] === 'participant') {
            const id = parseInt(command[1])
            // 1 = want, plan, one
            // 2 = to, too, two
            // 3 = tree, three
            // 4 = for, four
            // 6 = sex, six
            // 8 = ate, eight
            // 9 = dine, line, mine, nine
            // 10 = then, ten
            if (typeof id !== 'number') {
              return
            }
            let isCorrect: boolean
            if (command[2] === 'correct') {
              isCorrect = true
            } else if (command[2] === 'incorrect') {
              isCorrect = false
            } else {
              return
            }
            scoringPageRef.current.scoreParticipant(id, isCorrect)
          }
        }
      })

      socket.on('error', (e) => console.error(e))
      socket.on('warning', (e) => console.warn(e))
      socket.on('Metadata', (e) => console.log(e))
      socket.on('close', (e) => console.log(e))
    }
  }, [socket, isDone])

  function scoreParticipant(scores: { id: number; isCorrect: boolean }[]) {
    const newParticipantsScore = participantsScore.map((participant) => {
      const score = scores.find((score) => score.id === participant.id)
      if (score?.isCorrect) {
        participant.score += 1
      }
      return participant
    })
    setParticipantsScore(newParticipantsScore)
  }

  if (currentPage === 'start' && !isLoading) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <h1 className="text-6xl font-bold">Begin Quiz</h1>
      </div>
    )
  } else if (currentPage === 'question' && !isDone) {
    if (questions.length > currentQuestionIndex) {
      return <QuestionPage ref={questionPageRef} data={questions[currentQuestionIndex]} />
    } else {
      setIsDone(true)
    }
  } else if (currentPage === 'scoring' && !isDone) {
    return (
      <ScoringPage
        ref={scoringPageRef}
        data={participants}
        onFinishScoring={(scores: { id: number; isCorrect: boolean }[]) => scoreParticipant(scores)}
      />
    )
  } else if (currentPage === 'ranking' && !isDone) {
    return <RankingPage data={participantsScore} />
  } else if (isDone) {
    return <LeaderboardPage data={participantsScore} />
  }

  return (
    <div className="w-full h-full flex justify-center items-center">
      <h1 className="text-6xl font-bold">Quiz Room Loading...</h1>
    </div>
  )
}
