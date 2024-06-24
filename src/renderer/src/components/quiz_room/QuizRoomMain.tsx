/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from 'react'
import { IoIosArrowBack } from 'react-icons/io'
import { MdNavigateNext } from 'react-icons/md'
import { NavLink, useNavigate, useParams } from 'react-router-dom'
import ClincherParticipantsPage from './ClincherParticipantsPage'
import ClincherScoringPage from './ClincherScoringPage'
import LeaderboardPage from './LeaderboardPage'
import QuestionPage from './QuestionPage'
import RankingPage from './RankingPage'
import ScoringPage from './ScoringPage'

export default function QuizRoomMain() {
  const { id } = useParams()

  const [quizData, setQuizData] = useState()
  const [socket, setSocket] = useState()
  const [currentPage, setCurrentPage] = useState('start')
  const [isDone, setIsDone] = useState(false)
  const [isConfirmExit, setConfirmExit] = useState(false)

  const [currentRound, setCurrentRound] = useState('easy')
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)

  const [clincherParticipants, setClincherParticipants] = useState<any[]>([])
  const [clincherSlots, setClincherSlots] = useState(0)
  const [clincherQuestionIndex, setClincherQuestionIndex] = useState(0)
  const [clincherWinners, setClincherWinners] = useState<any[]>([])
  const [historyData, setHistoryData] = useState()
  const [scoreParticipants, setScoreParticipants] = useState()

  const quizDataRef = useRef()
  quizDataRef.current = quizData
  const currentPageRef = useRef()
  currentPageRef.current = currentPage
  const isConfirmExitRef = useRef()
  isConfirmExitRef.current = isConfirmExit
  const currentRoundRef = useRef()
  currentRoundRef.current = currentRound
  const clincherParticipantsRef = useRef()
  clincherParticipantsRef.current = clincherParticipants
  const historyDataRef = useRef()
  historyDataRef.current = historyData
  const questionPageRef = useRef()
  const scoringPageRef = useRef()
  const scoringClincherPageRef = useRef()
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
      setHistoryData({
        user: sessionStorage.getItem('username'),
        title: _quizData.title,
        description: _quizData.description,
        settings: _quizData.settings,
        scoring_type: _quizData.scoring_type,
        date: new Date().toISOString().slice(0, 10),
        questions: _quizData.questions,
        participants: _quizData.participants,
        clincher: _quizData.clincher,
        item_analysis: []
      })
      const participants = _quizData.participants.map((participant) => ({
        ...participant,
        score: 0
      }))
      const questions = {
        easy: _quizData.questions.filter((question) => {
          return question.difficulty === 'easy'
        }),
        average: _quizData.questions.filter((question) => {
          return question.difficulty === 'average'
        }),
        hard: _quizData.questions.filter((question) => {
          return question.difficulty === 'hard'
        })
      }

      _quizData = { ..._quizData, questions: questions, participants: participants }
      setQuizData(_quizData)
    }
    getQuiz()
    try {
      const { createClient } = deepgram
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
    } catch {
      setSocket(null)
    }
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
          voiceCommand(transcript)
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
        microphoneRef.current?.stop()
        clearInterval(keepAliveIntervalId.current)
        const closeMessage = JSON.stringify({ type: 'CloseStream' })
        socket?.send(closeMessage)
      }
    }
  }, [socket, isDone])

  function voiceCommand(transcript) {
    console.log(transcript)
    const command = transcript.match(/\b(\w+)\b/g)
    if (command[0] === 'participant' || command[0] === 'participants') {
      // let id: number
      const ids: number[] = []
      for (let i = 1; i < command.length - 1; i++) {
        if (new Set(['want', 'plan', 'point', 'one']).has(command[i])) {
          ids.push(1)
        } else if (new Set(['to', 'too', 'two']).has(command[i])) {
          ids.push(2)
        } else if (new Set(['tree', 'three']).has(command[i])) {
          ids.push(3)
        } else if (new Set(['for', 'four']).has(command[i])) {
          ids.push(4)
        } else if (new Set(['file', 'five']).has(command[i])) {
          ids.push(5)
        } else if (new Set(['sex', 'six']).has(command[i])) {
          ids.push(6)
        } else if (new Set(["haven't", 'seven']).has(command[i])) {
          ids.push(7)
        } else if (new Set(['ate', 'eight']).has(command[i])) {
          ids.push(8)
        } else if (new Set(['dine', 'nine', 'mine', 'nine']).has(command[i])) {
          ids.push(9)
        } else if (new Set(['then', 'ten']).has(command[i])) {
          ids.push(10)
        } else {
          ids.push(parseInt(command[i]))
        }

        // if (typeof id !== 'number') {
        //   return
        // }
      }

      let isCorrect: boolean
      if (new Set(['correct', 'current', 'connect']).has(command[command.length - 1])) {
        isCorrect = true
      } else if (new Set(['incorrect', 'in correct']).has(command[command.length - 1])) {
        isCorrect = false
      } else {
        return
      }

      if (currentPageRef.current === 'scoring') {
        scoringPageRef.current.scoreParticipant(ids, isCorrect)
      } else if (currentPageRef.current === 'clincherScoring') {
        scoringClincherPageRef?.current.scoreParticipant(ids, isCorrect)
      }
    } else if (
      new Set(['begin quiz', 'begin please', 'begin with', 'big increase', 'begins with']).has(
        transcript
      ) &&
      currentPageRef.current === 'start'
    ) {
      setCurrentPage('question')
    } else if (new Set(['stop quiz', 'stop please', 'stop with']).has(transcript)) {
      setConfirmExit(true)
    } else if (
      new Set(['confirm stop quiz', 'confirm stop please', 'confirm stop with']).has(transcript) &&
      isConfirmExitRef.current
    ) {
      setIsDone(true)
      navigate('/')
    } else if (
      new Set(['cancel stop quiz', 'cancel stop please', 'cancel stop with']).has(transcript) &&
      isConfirmExitRef.current
    ) {
      setConfirmExit(false)
    } else if (
      new Set(['start timer', 'add timer']).has(transcript) &&
      (currentPageRef.current === 'question' || currentPageRef.current === 'clincherQuestion')
    ) {
      questionPageRef?.current?.start()
    } else if (
      new Set(['show answer', 'no answer', 'show and save']).has(transcript) &&
      (currentPageRef.current === 'question' || currentPageRef.current === 'clincherQuestion')
    ) {
      questionPageRef?.current?.showAnswer()
    } else if (new Set(['begin scoring', 'begins scoring', 'begins carding']).has(transcript)) {
      if (currentPageRef.current === 'question') {
        setCurrentPage('scoring')
      } else if (currentPageRef.current === 'clincherQuestion') {
        setCurrentPage('clincherScoring')
      }
    } else if (
      new Set([
        'finished scoring',
        'finish scoring',
        'finish starting',
        'spanish scoring',
        'famous scoring',
        'femish scoring',
        'femenish scoring',
        'image scoring',
        'famesh scoring',
        'english scoring'
      ]).has(transcript)
    ) {
      finishedScoring()
    } else if (transcript === 'next question') {
      if (currentPageRef.current === 'ranking') {
        nextQuestion()
      } else if (currentPageRef.current === 'elimination') {
        setCurrentPage('question')
      }
    } else if (
      new Set(['start clincher', 'start clean share']).has(transcript) &&
      currentPageRef.current === 'clincher'
    ) {
      setCurrentPage('clincherQuestion')
    } else if (transcript === 'next round' || transcript === 'x round') {
      // currentPage is roundEnd
      if (currentPageRef.current === 'roundEnd') {
        endRound()
      } else if (currentPageRef.current === 'clincherWinners') {
        if (quizDataRef.current.participants.length !== 1) {
          setCurrentPage('elimination')
          setCurrentQuestionIndex(0)
          setClincherWinners([])
        } else {
          setIsDone(true)
        }
      }
    } else if (
      new Set([
        'finish quiz',
        'finish please',
        'finish with',
        'finished quiz',
        'finish with',
        'spanish quiz'
      ]).has(transcript)
    ) {
      setCurrentPage('ranking')
      setIsDone(true)
    }
  }

  function finishedScoring() {
    if (currentPageRef.current === 'scoring') {
      scoringPageRef?.current.sendScores()
      setCurrentPage('ranking')
    } else if (currentPageRef.current === 'clincherScoring') {
      scoringClincherPageRef?.current.sendScores()
    }
  }

  function eliminateParticipants(scores) {
    const correctScores = scores
      .filter((score) => score.isCorrect === true)
      .map((score) => {
        return score.id
      })
    let correctParticipants = clincherParticipantsRef.current?.filter((participant, index) =>
      correctScores.includes(index)
    )
    let incorrectParticipants = clincherParticipantsRef.current?.filter(
      (participant, index) => !correctScores.includes(index)
    )

    if (correctParticipants.length > clincherSlots) {
      setClincherParticipants(correctParticipants)
      setCurrentPage('clincher')
      incorrectParticipants = incorrectParticipants.map((participant) => ({
        ...participant,
        isWin: false,
        isClincher: false
      }))
      const prevParticipants = historyDataRef.current[currentRoundRef.current]?.participants
      setHistoryData((prev) => ({
        ...prev,
        [currentRoundRef.current]: {
          participants: [...prevParticipants, ...incorrectParticipants]
        }
      }))
    } else if (correctParticipants.length < clincherSlots) {
      setClincherWinners((prev) => [...prev, ...correctParticipants])
      setClincherSlots((prev) => prev - correctParticipants.length)
      setClincherParticipants(incorrectParticipants)
      setCurrentPage('clincher')
      correctParticipants = correctParticipants.map((participant) => ({
        ...participant,
        isWin: true,
        isClincher: true
      }))
      const prevParticipants = historyDataRef.current[currentRoundRef.current]?.participants
      setHistoryData((prev) => ({
        ...prev,
        [currentRoundRef.current]: {
          participants: [...prevParticipants, ...correctParticipants]
        }
      }))
    } else {
      // Revision
      let addToParticipants: any[] = []
      if (quizData?.scoring_type === 'accumulate' || quizData.scoring_type === 'partial') {
        addToParticipants = [...quizData.participants, ...clincherWinners, ...correctParticipants]
      } else if (quizData?.scoring_type === 'perround') {
        addToParticipants = [
          ...quizData.participants,
          ...clincherWinners,
          ...correctParticipants
        ].map((participant) => {
          return { ...participant, score: 0 }
        })
      }

      setQuizData((prev) => ({
        ...prev,
        participants: [...addToParticipants]
      }))
      setClincherWinners((prev) => [...prev, ...correctParticipants])
      setClincherParticipants([])
      setClincherSlots(0)
      setCurrentPage('clincherWinners')
      incorrectParticipants = incorrectParticipants.map((participant) => ({
        ...participant,
        isWin: false,
        isClincher: false
      }))
      correctParticipants = correctParticipants.map((participant) => ({
        ...participant,
        isWin: true,
        isClincher: true
      }))
      const prevParticipants = historyDataRef.current[currentRoundRef.current]?.participants
      setHistoryData((prev) => ({
        ...prev,
        [currentRoundRef.current]: {
          participants: [...prevParticipants, ...correctParticipants, ...incorrectParticipants],
          questions: [...quizDataRef.current.questions[currentRoundRef.current]]
        }
      }))
      if (currentRoundRef.current === 'easy') {
        setCurrentRound('average')
      } else if (currentRoundRef.current === 'average') {
        setCurrentRound('hard')
      }
    }
    setClincherQuestionIndex((prev) => prev + 1)
  }

  function scoreParticipant(scores: { id: number; isCorrect: boolean }[]) {
    const newParticipants = quizData.participants.map((participant, index) => {
      const score = scores.find((score) => score.id === index)
      if (score?.isCorrect) {
        const setting = quizData?.settings.find((setting) => setting.difficulty === currentRound)
        participant.score += setting.points
        participant.isCorrect = true
      } else {
        const setting = quizData?.settings.find((setting) => setting.difficulty === currentRound)
        // revision
        participant.isCorrect = false

        if (quizData?.scoring_type === 'partial') {
          participant.score += setting.partial_points
        }
      }
      return participant
    })
    // revision
    const itemAnalysis = {
      question: quizData.questions[currentRound][currentQuestionIndex].question,
      answer: quizData.questions[currentRound][currentQuestionIndex].answer,
      participants: newParticipants.map((p) => {
        const { score, ...rest } = p
        return rest
      })
    }
    setHistoryData((prev) => ({ ...prev, item_analysis: [...prev.item_analysis, itemAnalysis] }))
    setQuizData((prev) => ({ ...prev, participants: newParticipants }))
  }

  function nextQuestion() {
    setCurrentPage('question')
    setCurrentQuestionIndex((prev) => prev + 1)
  }

  function endRound() {
    let number_participants
    if (currentRoundRef.current === 'easy') {
      number_participants = quizDataRef.current?.settings.find(
        (setting) => setting.difficulty === 'average'
      ).number_participants
    } else if (currentRoundRef.current === 'average') {
      number_participants = quizDataRef.current?.settings.find(
        (setting) => setting.difficulty === 'hard'
      ).number_participants
    } else if (currentRoundRef.current === 'hard') {
      number_participants = 1
    }

    const sortedParticipants = quizDataRef.current?.participants.sort(compare)
    const cutOffScore = sortedParticipants[number_participants - 1].score
    const cutOffParticipants = sortedParticipants.slice(number_participants)
    const tiedLowerParticipants = cutOffParticipants.filter(
      (participant) => participant.score === cutOffScore
    )

    if (tiedLowerParticipants.length > 0) {
      let inParticipants = sortedParticipants.filter((participant, index) => {
        return participant.score > cutOffScore
      })
      setQuizData((prev) => ({ ...prev, participants: inParticipants }))
      const tiedParticipants = quizDataRef.current?.participants.filter(
        (participant) => participant.score === cutOffScore
      )
      const slots =
        number_participants -
        quizDataRef.current?.participants.filter((participant) => participant.score > cutOffScore)
          .length
      setClincherParticipants(tiedParticipants)
      setClincherSlots(slots)
      setCurrentPage('clincher')
      inParticipants = inParticipants.map((participant) => ({
        ...participant,
        isWin: true,
        isClincher: false
      }))
      setHistoryData((prev) => ({
        ...prev,
        [currentRoundRef.current]: {
          participants: [...inParticipants],
          questions: [...quizDataRef.current?.questions[currentRoundRef.current]]
        }
      }))
    } else {
      let inParticipants = sortedParticipants.filter((participant, index) => {
        return index < number_participants
      })
      let outParticipants = sortedParticipants.filter((participant, index) => {
        return index >= number_participants
      })

      if (currentRoundRef.current === 'hard') {
        setQuizData((prev) => ({ ...prev, participants: inParticipants }))
        setIsDone(true)
        setCurrentQuestionIndex(0)
      } else {
        // revision
        let newParticipants
        if (quizData?.scoring_type === 'accumulate' || quizData.scoring_type === 'partial') {
          newParticipants = inParticipants
        } else if (quizData?.scoring_type === 'perround') {
          newParticipants = inParticipants.map((participant) => {
            return { ...participant, score: 0 }
          })
        }
        setQuizData((prev) => ({ ...prev, participants: newParticipants }))
        setCurrentPage('elimination')
        setCurrentQuestionIndex(0)
      }

      inParticipants = inParticipants.map((participant) => ({
        ...participant,
        isWin: true,
        isClincher: false
      }))
      outParticipants = outParticipants.map((participant) => ({
        ...participant,
        isWin: false,
        isClincher: false
      }))
      setHistoryData((prev) => ({
        ...prev,
        [currentRoundRef.current]: {
          participants: [...inParticipants, ...outParticipants],
          questions: [...quizDataRef.current.questions[currentRoundRef.current]]
        }
      }))
      if (currentRoundRef.current === 'easy') {
        setCurrentRound('average')
      } else if (currentRoundRef.current === 'average') {
        setCurrentRound('hard')
      } else if (currentRoundRef.current === 'hard') {
        setIsDone(true)
      }
    }
  }

  async function createQuizHistory() {
    // const _historyData = { ...historyData, participants: scoreParticipants }
    await window.api.createQuizHistory(historyData)
  }

  if (currentPage === 'start') {
    return isConfirmExit ? (
      <div className="w-full h-full flex justify-center items-center text-center">
        <div className="bg-slate-50 rounded-xl shadow-xl p-8 max-w-md">
          <p className="font-medium text-4xl mb-12">Are you sure you want to stop quiz?</p>
          <button
            className="block text-center px-4 py-2 rounded-lg bg-red-500 text-white mx-auto text-2xl font-semibold mb-4 hover:bg-red-600"
            onClick={() => {
              setIsDone(true)
              navigate('/')
            }}
          >
            Confirm Stop Quiz
          </button>
          <button
            className="block text-center px-4 py-2 rounded-lg bg-slate-200 mx-auto text-2xl font-semibold mb-4 hover:bg-slate-300"
            onClick={() => setConfirmExit(false)}
          >
            Cancel Stop Quiz
          </button>
        </div>
      </div>
    ) : (
      <>
        <div className="w-full h-full flex justify-center items-center text-center">
          <div>
            <button
              onClick={() => setConfirmExit(true)}
              className="w-fit flex justify-between items-center gap-2 fixed top-0 left-0"
            >
              <IoIosArrowBack size={32} />
              <p className="font-medium">Stop Quiz</p>
            </button>
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
    if (quizData.questions[currentRound].length > currentQuestionIndex) {
      return isConfirmExit ? (
        <div className="w-full h-full flex justify-center items-center text-center">
          <div className="bg-slate-50 rounded-xl shadow-xl p-8 max-w-md">
            <p className="font-medium text-4xl mb-12">Are you sure you want to stop quiz?</p>
            <button
              className="block text-center px-4 py-2 rounded-lg bg-red-500 text-white mx-auto text-2xl font-semibold mb-4 hover:bg-red-600"
              onClick={() => {
                setIsDone(true)
                navigate('/')
              }}
            >
              Confirm Stop Quiz
            </button>
            <button
              className="block text-center px-4 py-2 rounded-lg bg-slate-200 mx-auto text-2xl font-semibold mb-4 hover:bg-slate-300"
              onClick={() => setConfirmExit(false)}
            >
              Cancel Stop Quiz
            </button>
          </div>
        </div>
      ) : (
        <>
          <button
            onClick={() => setConfirmExit(true)}
            className="w-fit flex justify-between items-center gap-2 fixed top-0 left-0"
          >
            <IoIosArrowBack size={32} />
            <p className="font-medium">Stop Quiz</p>
          </button>
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
            data={quizData.questions[currentRound][currentQuestionIndex]}
            questionNo={currentQuestionIndex + 1}
            settings={quizData.settings}
          />
        </>
      )
    } else {
      setCurrentPage('roundEnd')
    }
  } else if (currentPage === 'scoring' && !isDone) {
    return isConfirmExit ? (
      <div className="w-full h-full flex justify-center items-center text-center">
        <div className="bg-slate-50 rounded-xl shadow-xl p-8 max-w-md">
          <p className="font-medium text-4xl mb-12">Are you sure you want to stop quiz?</p>
          <button
            className="block text-center px-4 py-2 rounded-lg bg-red-500 text-white mx-auto text-2xl font-semibold mb-4 hover:bg-red-600"
            onClick={() => {
              setIsDone(true)
              navigate('/')
            }}
          >
            Confirm Stop Quiz
          </button>
          <button
            className="block text-center px-4 py-2 rounded-lg bg-slate-200 mx-auto text-2xl font-semibold mb-4 hover:bg-slate-300"
            onClick={() => setConfirmExit(false)}
          >
            Cancel Stop Quiz
          </button>
        </div>
      </div>
    ) : (
      <>
        <button
          onClick={() => setConfirmExit(true)}
          className="w-fit flex justify-between items-center gap-2 fixed top-0 left-0"
        >
          <IoIosArrowBack size={32} />
          <p className="font-medium">Stop Quiz</p>
        </button>
        <div className="w-full flex justify-between items-center p-4">
          <h1 className="mt-4 mx-4 text-4xl font-bold">Scoring</h1>
          <button className="flex justify-between items-center" onClick={() => finishedScoring()}>
            <p className="font-medium">Finish Scoring</p>
            <MdNavigateNext size={32} />
          </button>
        </div>
        <ScoringPage
          ref={scoringPageRef}
          data={quizData.participants}
          onFinishScoring={(scores: { id: number; isCorrect: boolean }[]) =>
            scoreParticipant(scores)
          }
        />
      </>
    )
  } else if (currentPage === 'ranking' && !isDone) {
    return isConfirmExit ? (
      <div className="w-full h-full flex justify-center items-center text-center">
        <div className="bg-slate-50 rounded-xl shadow-xl p-8 max-w-md">
          <p className="font-medium text-4xl mb-12">Are you sure you want to stop quiz?</p>
          <button
            className="block text-center px-4 py-2 rounded-lg bg-red-500 text-white mx-auto text-2xl font-semibold mb-4 hover:bg-red-600"
            onClick={() => {
              setIsDone(true)
              navigate('/')
            }}
          >
            Confirm Stop Quiz
          </button>
          <button
            className="block text-center px-4 py-2 rounded-lg bg-slate-200 mx-auto text-2xl font-semibold mb-4 hover:bg-slate-300"
            onClick={() => setConfirmExit(false)}
          >
            Cancel Stop Quiz
          </button>
        </div>
      </div>
    ) : (
      <>
        <button
          onClick={() => setConfirmExit(true)}
          className="w-fit flex justify-between items-center gap-2 fixed top-0 left-0"
        >
          <IoIosArrowBack size={32} />
          <p className="font-medium">Stop Quiz</p>
        </button>
        <div className="w-full flex justify-between items-center p-4">
          <h1 className="mt-4 mx-4 text-4xl font-bold">Scores</h1>
          <button className="flex justify-between items-center" onClick={() => nextQuestion()}>
            <p className="font-medium">Next Question</p>
            <MdNavigateNext size={32} />
          </button>
        </div>
        <RankingPage data={quizData.participants} />
      </>
    )
  } else if (currentPage === 'roundEnd' && !isDone) {
    return isConfirmExit ? (
      <div className="w-full h-full flex justify-center items-center text-center">
        <div className="bg-slate-50 rounded-xl shadow-xl p-8 max-w-md">
          <p className="font-medium text-4xl mb-12">Are you sure you want to stop quiz?</p>
          <button
            className="block text-center px-4 py-2 rounded-lg bg-red-500 text-white mx-auto text-2xl font-semibold mb-4 hover:bg-red-600"
            onClick={() => {
              setIsDone(true)
              navigate('/')
            }}
          >
            Confirm Stop Quiz
          </button>
          <button
            className="block text-center px-4 py-2 rounded-lg bg-slate-200 mx-auto text-2xl font-semibold mb-4 hover:bg-slate-300"
            onClick={() => setConfirmExit(false)}
          >
            Cancel Stop Quiz
          </button>
        </div>
      </div>
    ) : (
      <>
        <div className="w-full flex justify-end items-center p-4">
          <button className="flex justify-between items-center" onClick={() => endRound()}>
            <p className="font-medium">Next Round</p>
            <MdNavigateNext size={32} />
          </button>
        </div>
        <div className="w-full h-96 flex justify-center items-center text-center">
          <div>
            <button
              onClick={() => setConfirmExit(true)}
              className="w-fit flex justify-between items-center gap-2 fixed top-0 left-0"
            >
              <IoIosArrowBack size={32} />
              <p className="font-medium">Stop Quiz</p>
            </button>
            <h1 className="text-6xl font-bold mb-6 capitalize">
              {currentRound === 'hard' ? 'difficult' : currentRound} Round Finished
            </h1>
          </div>
        </div>
      </>
    )
  } else if (currentPage === 'elimination' && !isDone) {
    return isConfirmExit ? (
      <div className="w-full h-full flex justify-center items-center text-center">
        <div className="bg-slate-50 rounded-xl shadow-xl p-8 max-w-md">
          <p className="font-medium text-4xl mb-12">Are you sure you want to stop quiz?</p>
          <button
            className="block text-center px-4 py-2 rounded-lg bg-red-500 text-white mx-auto text-2xl font-semibold mb-4 hover:bg-red-600"
            onClick={() => {
              setIsDone(true)
              navigate('/')
            }}
          >
            Confirm Stop Quiz
          </button>
          <button
            className="block text-center px-4 py-2 rounded-lg bg-slate-200 mx-auto text-2xl font-semibold mb-4 hover:bg-slate-300"
            onClick={() => setConfirmExit(false)}
          >
            Cancel Stop Quiz
          </button>
        </div>
      </div>
    ) : (
      <>
        <button
          onClick={() => setConfirmExit(true)}
          className="w-fit flex justify-between items-center gap-2 fixed top-0 left-0"
        >
          <IoIosArrowBack size={32} />
          <p className="font-medium">Stop Quiz</p>
        </button>
        <div className="w-full flex justify-between items-center p-4">
          <h1 className="mt-4 mx-4 text-4xl font-bold">Participants for Next Round</h1>
          <button
            className="flex justify-between items-center"
            onClick={() => setCurrentPage('question')}
          >
            <p className="font-medium">Next Question</p>
            <MdNavigateNext size={32} />
          </button>
        </div>
        <RankingPage data={quizData.participants} />
      </>
    )
  } else if (currentPage === 'clincher' && !isDone) {
    return isConfirmExit ? (
      <div className="w-full h-full flex justify-center items-center text-center">
        <div className="bg-slate-50 rounded-xl shadow-xl p-8 max-w-md">
          <p className="font-medium text-4xl mb-12">Are you sure you want to stop quiz?</p>
          <button
            className="block text-center px-4 py-2 rounded-lg bg-red-500 text-white mx-auto text-2xl font-semibold mb-4 hover:bg-red-600"
            onClick={() => {
              setIsDone(true)
              navigate('/')
            }}
          >
            Confirm Stop Quiz
          </button>
          <button
            className="block text-center px-4 py-2 rounded-lg bg-slate-200 mx-auto text-2xl font-semibold mb-4 hover:bg-slate-300"
            onClick={() => setConfirmExit(false)}
          >
            Cancel Stop Quiz
          </button>
        </div>
      </div>
    ) : (
      <>
        <button
          onClick={() => setConfirmExit(true)}
          className="w-fit flex justify-between items-center gap-2 fixed top-0 left-0"
        >
          <IoIosArrowBack size={32} />
          <p className="font-medium">Stop Quiz</p>
        </button>
        <div className="w-full flex justify-between items-center p-4">
          <div className="mt-4 mx-4 ">
            <h1 className="text-3xl font-bold">We have a tie</h1>
            <h1 className="text-4xl font-bold">Clincher Round</h1>
          </div>
          <button
            className="flex justify-between items-center"
            onClick={() => setCurrentPage('clincherQuestion')}
          >
            <p className="font-medium">Start Clincher</p>
            <MdNavigateNext size={32} />
          </button>
        </div>
        <ClincherParticipantsPage data={clincherParticipants} />
      </>
    )
  } else if (currentPage === 'clincherQuestion' && !isDone) {
    return isConfirmExit ? (
      <div className="w-full h-full flex justify-center items-center text-center">
        <div className="bg-slate-50 rounded-xl shadow-xl p-8 max-w-md">
          <p className="font-medium text-4xl mb-12">Are you sure you want to stop quiz?</p>
          <button
            className="block text-center px-4 py-2 rounded-lg bg-red-500 text-white mx-auto text-2xl font-semibold mb-4 hover:bg-red-600"
            onClick={() => {
              setIsDone(true)
              navigate('/')
            }}
          >
            Confirm Stop Quiz
          </button>
          <button
            className="block text-center px-4 py-2 rounded-lg bg-slate-200 mx-auto text-2xl font-semibold mb-4 hover:bg-slate-300"
            onClick={() => setConfirmExit(false)}
          >
            Cancel Stop Quiz
          </button>
        </div>
      </div>
    ) : (
      <>
        <button
          onClick={() => setConfirmExit(true)}
          className="w-fit flex justify-between items-center gap-2 fixed top-0 left-0"
        >
          <IoIosArrowBack size={32} />
          <p className="font-medium">Stop Quiz</p>
        </button>
        <div className="w-full flex justify-end items-center p-4">
          <button
            className="flex justify-between items-center"
            onClick={() => setCurrentPage('clincherScoring')}
          >
            <p className="font-medium">Begin Scoring</p>
            <MdNavigateNext size={32} />
          </button>
        </div>
        <QuestionPage
          ref={questionPageRef}
          data={quizData.clincher[clincherQuestionIndex]}
          questionNo={clincherQuestionIndex + 1}
          settings={quizData.settings}
        />
      </>
    )
  } else if (currentPage === 'clincherScoring' && !isDone) {
    return isConfirmExit ? (
      <div className="w-full h-full flex justify-center items-center text-center">
        <div className="bg-slate-50 rounded-xl shadow-xl p-8 max-w-md">
          <p className="font-medium text-4xl mb-12">Are you sure you want to stop quiz?</p>
          <button
            className="block text-center px-4 py-2 rounded-lg bg-red-500 text-white mx-auto text-2xl font-semibold mb-4 hover:bg-red-600"
            onClick={() => {
              setIsDone(true)
              navigate('/')
            }}
          >
            Confirm Stop Quiz
          </button>
          <button
            className="block text-center px-4 py-2 rounded-lg bg-slate-200 mx-auto text-2xl font-semibold mb-4 hover:bg-slate-300"
            onClick={() => setConfirmExit(false)}
          >
            Cancel Stop Quiz
          </button>
        </div>
      </div>
    ) : (
      <>
        <button
          onClick={() => setConfirmExit(true)}
          className="w-fit flex justify-between items-center gap-2 fixed top-0 left-0"
        >
          <IoIosArrowBack size={32} />
          <p className="font-medium">Stop Quiz</p>
        </button>
        <div className="w-full flex justify-between items-center p-4">
          <h1 className="mt-4 mx-4 text-4xl font-bold">Clincher Scoring</h1>
          <button className="flex justify-between items-center" onClick={() => finishedScoring()}>
            <p className="font-medium">Finish Scoring</p>
            <MdNavigateNext size={32} />
          </button>
        </div>
        <ClincherScoringPage
          ref={scoringClincherPageRef}
          data={clincherParticipants}
          onFinishScoring={(scores: { id: number; isCorrect: boolean }[]) =>
            eliminateParticipants(scores)
          }
        />
      </>
    )
  } else if (currentPage === 'clincherWinners' && !isDone) {
    return isConfirmExit ? (
      <div className="w-full h-full flex justify-center items-center text-center">
        <div className="bg-slate-50 rounded-xl shadow-xl p-8 max-w-md">
          <p className="font-medium text-4xl mb-12">Are you sure you want to stop quiz?</p>
          <button
            className="block text-center px-4 py-2 rounded-lg bg-red-500 text-white mx-auto text-2xl font-semibold mb-4 hover:bg-red-600"
            onClick={() => {
              setIsDone(true)
              navigate('/')
            }}
          >
            Confirm Stop Quiz
          </button>
          <button
            className="block text-center px-4 py-2 rounded-lg bg-slate-200 mx-auto text-2xl font-semibold mb-4 hover:bg-slate-300"
            onClick={() => setConfirmExit(false)}
          >
            Cancel Stop Quiz
          </button>
        </div>
      </div>
    ) : (
      <>
        <button
          onClick={() => setConfirmExit(true)}
          className="w-fit flex justify-between items-center gap-2 fixed top-0 left-0"
        >
          <IoIosArrowBack size={32} />
          <p className="font-medium">Stop Quiz</p>
        </button>
        <div className="w-full flex justify-between items-center p-4">
          <h1 className="mt-4 mx-4 text-4xl font-bold">Clincher Winners</h1>
          <button
            className="flex justify-between items-center"
            onClick={() => {
              if (quizData.participants.length !== 1) {
                setCurrentPage('elimination')
                setCurrentQuestionIndex(0)
                setClincherWinners([])
              } else {
                setIsDone(true)
              }
            }}
          >
            <p className="font-medium">Next Round</p>
            <MdNavigateNext size={32} />
          </button>
        </div>
        <ClincherParticipantsPage data={clincherWinners} />
      </>
    )
  } else if (isDone) {
    createQuizHistory()
    microphoneRef.current?.stop()
    clearInterval(keepAliveIntervalId.current)
    const closeMessage = JSON.stringify({ type: 'CloseStream' })
    socket?.send(closeMessage)

    return (
      <>
        <div className="w-full flex justify-between items-center p-4">
          <h1 className="mt-4 mx-4 text-4xl font-bold">Leaderboard</h1>
          <NavLink className="flex justify-between items-center" to={'/'}>
            <p className="font-medium">Home</p>
            <MdNavigateNext size={32} />
          </NavLink>
        </div>
        <LeaderboardPage data={quizData.participants} />
      </>
    )
  }
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
