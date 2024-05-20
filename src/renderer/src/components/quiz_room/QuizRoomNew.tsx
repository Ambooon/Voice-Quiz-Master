import { useEffect, useRef, useState } from 'react'
import { MdNavigateNext } from 'react-icons/md'
import { NavLink, useNavigate, useParams } from 'react-router-dom'
import LeaderboardPage from './LeaderboardPage'
import QuestionPage from './QuestionPage'
import RankingPage from './RankingPage'
import ScoringPage from './ScoringPage'

export default function QuizRoomMain() {
  const { id } = useParams()
  // const quizData = QuizData.find((item) => String(item.id) === '1')
  // const questions = quizData.questions
  // const participants = quizData.participants.map((participant) => ({
  //   ...participant,
  //   score: 0
  // }))

  const [quizData, setQuizData] = useState()
  const [questions, setQuestions] = useState()
  const [participants, setParticipants] = useState()
  const [participantsScore, setParticipantsScore] = useState()
  const [socket, setSocket] = useState()
  const [currentPage, setCurrentPage] = useState('start')
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [isDone, setIsDone] = useState(false)
  const [isClincher, setIsClincher] = useState(false)

  const questionPageRef = useRef()
  const scoringPageRef = useRef()
  const microphoneRef = useRef<MediaRecorder | null>(null)
  const keepAliveIntervalId = useRef<NodeJS.Timeout>()
  const navigate = useNavigate()

  async function getMicrophone() {
    const userMedia = await navigator.mediaDevices.getUserMedia({
      audio: true
    })
    return new MediaRecorder(userMedia)
  }

  async function openMicrophone(microphone, socket) {
    await microphone.start(500)
    microphoneRef.current = microphone
    microphone.onstart = () => {
      // setIsLoading(false)
      console.log('client: microphone opened')
      document.body.classList.add('recording')
    }

    microphone.onstop = () => {
      console.log('client: microphone closed')
      document.body.classList.remove('recording')
    }

    microphone.ondataavailable = (e) => {
      const data = e.data
      socket.send(data)
    }
  }

  async function start(socket) {
    const microphone = await getMicrophone()
    await openMicrophone(microphone, socket)
  }

  useEffect(() => {
    async function getQuiz() {
      let _quizData = await window.api.getQuiz(id)
      setQuizData(_quizData)
      const participants = _quizData.participants.map((participant) => ({
        ...participant,
        score: 0
      }))
      _quizData = { ..._quizData, participants: participants }
      setQuestions(_quizData.questions)
      setParticipants(participants)
      setParticipantsScore(participants)
    }
    getQuiz()
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
      await start(_socket)
    })
  }, [])

  useEffect(() => {
    if (socket && !isDone) {
      // Keep alive the connection
      keepAliveIntervalId.current = setInterval(() => {
        const keepAliveMsg = JSON.stringify({ type: 'KeepAlive' })
        socket.send(keepAliveMsg)
      }, 3000)

      socket.on('Results', (data) => {
        const transcript = data.channel.alternatives[0].transcript
        if (transcript !== '' && data.is_final) {
          console.log(transcript)
          if (
            transcript === 'begin quiz' ||
            transcript === 'begin please' ||
            transcript === 'begin with' ||
            transcript === 'big increase'
          ) {
            setCurrentPage('question')
          } else if (transcript === 'stop quiz') {
            setIsDone(true)
            navigate('/')
          } else if (transcript === 'start timer' || transcript === 'add timer') {
            questionPageRef.current.start()
          } else if (
            transcript === 'show answer' ||
            transcript === 'no answer' ||
            transcript === 'show and save'
          ) {
            questionPageRef.current.showAnswer()
          } else if (
            transcript === 'begin scoring' ||
            transcript === 'begins scoring' ||
            transcript === 'begins carding'
          ) {
            setCurrentPage('scoring')
          } else if (
            transcript === 'finished scoring' ||
            transcript === 'finish scoring' ||
            transcript === 'finish starting'
          ) {
            finishedScoring()
          } else if (transcript === 'next question') {
            nextQuestion()
          } else if (transcript === 'begin clincher') {
            setCurrentPage('clincher')
            setIsClincher(true)
            setCurrentQuestionIndex(0)
          } else if (
            transcript === 'finish quiz' ||
            transcript === 'finish please' ||
            transcript === 'finish with'
          ) {
            setCurrentPage('ranking')
            setIsDone(true)
          }
          const command = transcript.match(/\b(\w+)\b/g)
          if (command[0] === 'participant' || command[0] === 'participants') {
            let id: number
            if (['want', 'plan', 'point', 'one'].includes(command[1])) {
              id = 1
            } else if (['to', 'too', 'two'].includes(command[1])) {
              id = 2
            } else if (['tree', 'three'].includes(command[1])) {
              id = 3
            } else if (['for', 'four'].includes(command[1])) {
              id = 4
            } else if (['file', 'five'].includes(command[1])) {
              id = 5
            } else if (['sex', 'six'].includes(command[1])) {
              id = 6
            } else if (["haven't", 'seven'].includes(command[1])) {
              id = 7
            } else if (['ate', 'eight'].includes(command[1])) {
              id = 8
            } else if (['dine', 'nine', 'mine', 'nine'].includes(command[1])) {
              id = 9
            } else if (['then', 'ten'].includes(command[1])) {
              id = 10
            } else {
              id = parseInt(command[1])
            }

            if (typeof id !== 'number') {
              return
            }
            let isCorrect: boolean
            if (command[2] === 'correct' || command[2] === 'current') {
              isCorrect = true
            } else if (command[2] === 'incorrect' || command[2] === 'in correct') {
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

    if (isDone) {
      clearInterval(keepAliveIntervalId.current)
    }

    return () => {
      if (!isDone && socket) {
        console.log('closed')
        microphoneRef.current?.stop()
        clearInterval(keepAliveIntervalId.current)
        const closeMessage = JSON.stringify({ type: 'CloseStream' })
        socket.send(closeMessage)
      }
    }
  }, [socket, isDone])

  function finishedScoring() {
    scoringPageRef.current.sendScores()
    setCurrentPage('ranking')
  }
  function nextQuestion() {
    setCurrentPage('question')
    setCurrentQuestionIndex((prev) => prev + 1)
  }

  function compare(a: { score: number }, b: { score: number }) {
    if (a.score < b.score) {
      return 1
    }
    if (a.score > b.score) {
      return -1
    }
    return 0
  }

  function scoreParticipant(scores: { id: number; isCorrect: boolean }[]) {
    const newParticipantsScore = participantsScore.map((participant, index) => {
      const score = scores.find((score) => score.id === index)
      if (score?.isCorrect) {
        if (!isClincher) {
          const points = quizData?.settings.find(
            (setting) => setting.difficulty === questions[currentQuestionIndex].difficulty
          )

          participant.score += points.points
        } else if (isClincher) {
          const points = quizData?.settings.find(
            (setting) => setting.difficulty === quizData.clincher[currentQuestionIndex].difficulty
          )

          participant.score += points.points

          // if (currentQuestionIndex >= Math.floor(quizData?.clincher.length / 2)) {
          //   participantsScore.sort(compare)
          //   console.log(participantsScore)
          // }
        }
      }
      return participant
    })
    setParticipantsScore(newParticipantsScore)
  }

  async function createQuizHistory() {
    const date = new Date().toISOString().slice(0, 10)
    const { _id, ..._quizData } = quizData
    const historyData = { ..._quizData, date: date, participants: participantsScore }
    console.log(_quizData)

    const result = await window.api.createQuizHistory(historyData)
    if (result) {
      console.log(result)
    }
  }
  if (currentPage === 'start') {
    return (
      <>
        <div className="w-full h-full flex justify-center items-center text-center">
          <div>
            <h1 className="text-6xl font-bold mb-6">
              {socket ? 'Begin Quiz' : 'Voice-activated loading...'}
            </h1>
            <button
              className="px-8 py-4 rounded-full bg-myBlue-1 text-white hover:bg-myBlue-2"
              onClick={() => setCurrentPage('question')}
            >
              Start
            </button>
          </div>
        </div>
      </>
    )
  } else if (currentPage === 'question' && !isDone) {
    if (questions.length > currentQuestionIndex) {
      return (
        <>
          <div className="w-full flex justify-end items-center p-4">
            <button
              className="flex justify-between items-center"
              onClick={() => setCurrentPage('scoring')}
            >
              <p className="font-medium">Begin Scoring</p>
              <MdNavigateNext size={32} />
            </button>
          </div>
          <QuestionPage
            ref={questionPageRef}
            data={questions[currentQuestionIndex]}
            settings={quizData.settings}
          />
        </>
      )
    } else {
      const sortedParticipantsScore = participantsScore
      sortedParticipantsScore.sort(compare)
      if (
        sortedParticipantsScore[0].score === sortedParticipantsScore[1].score &&
        sortedParticipantsScore.length > 1
      ) {
        return (
          <>
            <div className="w-full h-full flex justify-center items-center text-center">
              <div>
                <h1 className="text-6xl font-bold mb-6">Begin Clincher</h1>
                <button
                  className="px-8 py-4 rounded-full bg-myBlue-1 text-white hover:bg-myBlue-2"
                  onClick={() => {
                    setCurrentPage('clincher')
                    setIsClincher(true)
                    setCurrentQuestionIndex(0)
                  }}
                >
                  Start
                </button>
              </div>
            </div>
          </>
        )
      } else {
        setIsDone(true)
      }
    }
  } else if (currentPage === 'scoring' && !isDone) {
    return (
      <>
        <div className="w-full flex justify-between items-center p-4">
          <h1 className="mt-4 mx-4 text-4xl font-bold">Scoring</h1>
          <button className="flex justify-between items-center" onClick={() => finishedScoring()}>
            <p className="font-medium">Finish Scoring</p>
            <MdNavigateNext size={32} />
          </button>
        </div>
        <ScoringPage
          ref={scoringPageRef}
          data={participants}
          onFinishScoring={(scores: { id: number; isCorrect: boolean }[]) =>
            scoreParticipant(scores)
          }
        />
      </>
    )
  } else if (currentPage === 'ranking' && !isDone) {
    return (
      <>
        <div className="w-full flex justify-between items-center p-4">
          <h1 className="mt-4 mx-4 text-4xl font-bold">Scores</h1>
          <button className="flex justify-between items-center" onClick={() => nextQuestion()}>
            <p className="font-medium">Next Question</p>
            <MdNavigateNext size={32} />
          </button>
        </div>
        <RankingPage data={participantsScore} />
      </>
    )
  } else if (currentPage === 'clincher' && !isDone) {
    if (quizData.clincher.length > currentQuestionIndex) {
      // console.log(currentQuestionIndex)
      // if (currentQuestionIndex >= Math.floor(quizData.clincher.length / 2)) {
      //   console.log('run')
      // }
      return (
        <>
          <div className="w-full flex justify-end items-center p-4">
            <button
              className="flex justify-between items-center"
              onClick={() => setCurrentPage('scoring')}
            >
              <p className="font-medium">Begin Scoring</p>
              <MdNavigateNext size={32} />
            </button>
          </div>
          <QuestionPage
            ref={questionPageRef}
            data={quizData?.clincher[currentQuestionIndex]}
            settings={quizData.settings}
          />
        </>
      )
    } else {
      setIsDone(true)
    }
  } else if (isDone) {
    createQuizHistory()
    microphoneRef.current?.stop()
    clearInterval(keepAliveIntervalId.current)
    const closeMessage = JSON.stringify({ type: 'CloseStream' })
    socket.send(closeMessage)

    return (
      <>
        <div className="w-full flex justify-between items-center p-4">
          <h1 className="mt-4 mx-4 text-4xl font-bold">Leaderboard</h1>
          <NavLink className="flex justify-between items-center" to={'/'}>
            <p className="font-medium">Home</p>
            <MdNavigateNext size={32} />
          </NavLink>
        </div>
        <LeaderboardPage data={participantsScore} />
      </>
    )
  }

  return (
    <div className="w-full h-full flex justify-center items-center">
      <h1 className="text-6xl font-bold">Quiz Room Loading...</h1>
    </div>
  )
}
