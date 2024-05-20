/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
import { FaCheck, FaPlay } from 'react-icons/fa'
import { ImCross } from 'react-icons/im'
import { IoIosAdd, IoMdArrowRoundBack } from 'react-icons/io'
import { MdDelete, MdEdit } from 'react-icons/md'
import { NavLink, useNavigate, useParams } from 'react-router-dom'

const tabs = ['Questions', 'Participants', 'Clincher Questions', 'Settings']
// type QuizDataType = {
//   id: string
//   title: string
//   user: string
//   date: string
//   description: string
//   settings: { difficulty: string; points: number; time: number }[]
//   questions: {
//     question: string
//     answer: string
//     difficulty: string
//     choices?: string[]
//   }
//   participants: {
//     name: string
//     description?: string
//   }
//   clincher: {
//     question: string
//     answer: string
//     difficulty: string
//     choices?: string[]
//   }
// }[]

export default function QuizItemDetail() {
  const { id } = useParams()

  const [activeTab, setActiveTab] = useState(0)
  const [quizData, setQuizData] = useState<any[]>([])
  const [isEdit, setIsEdit] = useState(false)

  const navigate = useNavigate()
  useEffect(() => {
    async function getQuiz() {
      setQuizData(await window.api.getQuiz(id))
    }
    if (id !== 'create') {
      getQuiz()
    } else {
      const _data = {
        title: 'Quiz Title',
        // change this user later, get it from logged user
        user: sessionStorage.getItem('username'),
        date: new Date().toISOString().slice(0, 10),
        description: 'Quiz Description',
        settings: [
          { difficulty: 'easy', points: 2, time: 15 },
          { difficulty: 'average', points: 5, time: 25 },
          { difficulty: 'hard', points: 10, time: 35 },
          { difficulty: 'clincher', points: 15, time: 40 }
        ],
        questions: [
          {
            question: 'Question 1',
            answer: 'Answer 1',
            choices: ['Choice 1', 'Choice 2'],
            difficulty: 'easy'
          }
        ],
        clincher: [
          {
            question: 'Clincher 1',
            answer: 'Answer 1',
            choices: ['Choice 1', 'Choice 2'],
            difficulty: 'clincher'
          }
        ],
        participants: [{ name: 'Participant 1', description: 'Participant Description' }]
      }
      setQuizData(_data)
    }
  }, [])

  function handleBack(): void {
    navigate(-1)
  }

  async function onSaveChanges() {
    // update the current state 'quizData' into the database
    if (id === 'create') {
      const result = await window.api.createQuiz(quizData)
      if (result) {
        navigate('/quiz-management')
      }
    } else {
      window.api.updateQuiz(id, quizData)
      window.location.reload()
    }
  }

  function onChangeOrder(_index: number, _isUp: boolean, _page: string) {
    // const newQuizData = {
    //   ...quizData,
    //   [page]: [quizData?.questions[index], quizData?.questions[index + 1]]
    // }
    // const arr = [1, 2, 3, 4]
    // const b = arr[1]
    // arr[1] = arr[0]
    // arr[0] = b
    // // arr = [arr[0], arr[1]] = [arr[1], arr[0]]
    // console.log(arr)
  }

  function onChangeSettings(data: { difficulty: string; points: number; time: number }) {
    if (quizData) {
      const newSettings = quizData.settings.map((setting) => {
        if (setting.difficulty === data.difficulty) {
          return data
        }
        return setting
      })
      const newQuizData = { ...quizData, settings: newSettings }
      setQuizData(newQuizData)
    }
  }

  function onEditQuiz(e) {
    if (quizData) {
      const newQuizData = { ...quizData, [e.target.name]: e.target.value }
      setQuizData(newQuizData)
    }
  }

  function onAddQuestionQuiz() {
    if (quizData) {
      const newQuestion = {
        question: 'Question',
        answer: 'Answer',
        choices: [],
        difficulty: 'easy'
      }

      const newQuizData = { ...quizData, questions: [...quizData.questions, newQuestion] }
      setQuizData(newQuizData)
    }
  }

  function onChangeQuestionQuiz(data, index) {
    if (quizData) {
      const newQuestions = quizData.questions.map((question, i) => {
        if (i === index) {
          return data
        }
        return question
      })
      const newQuizData = { ...quizData, questions: newQuestions }
      setQuizData(newQuizData)
    }
  }

  function onDeleteQuestionQuiz(index) {
    if (quizData) {
      const newQuestions = quizData.questions.filter((question, i) => {
        return i !== index
      })
      const newQuizData = { ...quizData, questions: newQuestions }
      setQuizData(newQuizData)
    }
  }

  function onAddClincherQuiz() {
    if (quizData) {
      const newClincher = {
        question: 'Question',
        answer: 'Answer',
        choices: [],
        difficulty: 'clincher'
      }

      const newQuizData = { ...quizData, clincher: [...quizData.clincher, newClincher] }
      setQuizData(newQuizData)
    }
  }

  function onChangeClincherQuiz(data, index) {
    if (quizData) {
      const newClincher = quizData.clincher.map((clincher, i) => {
        if (i === index) {
          return data
        }
        return clincher
      })

      const newQuizData = { ...quizData, clincher: newClincher }
      setQuizData(newQuizData)
    }
  }

  function onDeleteClincherQuiz(index) {
    if (quizData) {
      const newClincher = quizData.clincher.filter((clincher, i) => {
        return i !== index
      })
      const newQuizData = { ...quizData, clincher: newClincher }
      setQuizData(newQuizData)
    }
  }

  function onAddParticipantQuiz() {
    if (quizData) {
      const newParticipant = {
        name: 'Participant Name',
        description: ''
      }

      const newQuizData = { ...quizData, participants: [...quizData.participants, newParticipant] }
      setQuizData(newQuizData)
    }
  }

  function onChangeParticipantQuiz(data, index) {
    if (quizData) {
      const newParticipants = quizData.participants.map((participant, i) => {
        if (i === index) {
          return data
        }
        return participant
      })
      const newQuizData = { ...quizData, participants: newParticipants }
      setQuizData(newQuizData)
    }
  }

  function onDeleteParticipantQuiz(index) {
    if (quizData) {
      const newParticipants = quizData.participants.filter((participant, i) => {
        return i !== index
      })
      const newQuizData = { ...quizData, participants: newParticipants }
      setQuizData(newQuizData)
    }
  }

  return (
    <section className="p-4">
      <button onClick={handleBack}>
        <IoMdArrowRoundBack size={28} />
      </button>
      {!quizData ? (
        <p>Not Found Quiz Item</p>
      ) : (
        <>
          <div className="flex justify-between">
            <div>
              <div className="flex justify-between items-baseline w-fit gap-8 mb-2">
                {isEdit ? (
                  <input
                    required
                    type="text"
                    name="title"
                    value={quizData?.title}
                    onChange={(e) => onEditQuiz(e)}
                    className="font-semibold text-3xl border border-slate-900 rounded-sm px-1"
                  />
                ) : (
                  <h3 className="font-semibold text-3xl">{quizData?.title}</h3>
                )}

                <button onClick={() => setIsEdit((prev) => !prev)}>
                  <MdEdit />
                </button>
                <p className="font-light text-sm text-gray-600">{quizData?.date}</p>
              </div>
              {isEdit ? (
                <input
                  type="text"
                  name="description"
                  value={quizData?.description}
                  onChange={(e) => onEditQuiz(e)}
                  className="border border-slate-900 rounded-sm px-1"
                />
              ) : (
                <p className="mb-8 text-gray-800 max-w-xl">{quizData?.description}</p>
              )}
            </div>
            <div className="m-8 flex justify-between items-center gap-4">
              <button
                className="flex justify-between items-center gap-4 text-white rounded-lg bg-myBlue-1 px-6 py-2 hover:bg-myBlue-2"
                onClick={() => onSaveChanges()}
              >
                Save Changes
              </button>
              {id !== 'created' && (
                <NavLink
                  to={`/quiz-room/${quizData?.id}`}
                  className="flex justify-between items-center gap-4 text-white rounded-lg bg-myBlue-1 px-6 py-2 hover:bg-myBlue-2"
                >
                  Start Quiz <FaPlay size={16} />
                </NavLink>
              )}
            </div>
          </div>

          <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200">
            {tabs.map((item, index) => {
              return (
                <li key={index} className="me-2">
                  <button
                    aria-current="page"
                    className={
                      index === activeTab
                        ? 'inline-block p-4 text-myBlue-1 bg-gray-100 rounded-t-lg'
                        : 'inline-block p-4 rounded-t-lg'
                    }
                    onClick={() => setActiveTab(index)}
                  >
                    {item}
                  </button>
                </li>
              )
            })}
          </ul>

          {activeTab === 0 && (
            <>
              <div className="my-2 flex justify-end items-center">
                <button onClick={() => onAddQuestionQuiz()}>
                  <IoIosAdd size={28} className=" bg-myBlue-1 text-white rounded-md" />
                </button>
              </div>
              <div className="relative overflow-x-auto shadow-md sm:rounded-lg mb-8 max-h-96">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                    <tr>
                      <th scope="col" className="px-6 py-3">
                        No.
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Question
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Answer
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Choices
                      </th>
                      <th scope="col" className="px-6 py-3">
                        <div className="flex items-center">Difficulty</div>
                      </th>
                      <th scope="col" className="px-6 py-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {quizData.questions &&
                      quizData.questions.map((question, index) => (
                        <QuestionItem
                          key={crypto.randomUUID()}
                          id={index}
                          index={index + 1}
                          question={question.question}
                          answer={question.answer}
                          choices={question.choices}
                          difficulty={question.difficulty}
                          onChangeQuestionQuiz={(data) => onChangeQuestionQuiz(data, index)}
                          onDelete={() => onDeleteQuestionQuiz(index)}
                          onChangeOrder={(index: number, isUp: boolean, page: string) =>
                            onChangeOrder(index, isUp, page)
                          }
                        />
                      ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {activeTab === 1 && (
            <>
              <div className="my-2 flex justify-end items-center">
                <button onClick={() => onAddParticipantQuiz()}>
                  <IoIosAdd size={28} className=" bg-myBlue-1 text-white rounded-md" />
                </button>
              </div>
              <div className="relative overflow-x-auto shadow-md sm:rounded-lg mb-8 max-h-96">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                    <tr>
                      <th scope="col" className="px-6 py-3">
                        No.
                      </th>
                      <th scope="col" className="px-6 py-3">
                        <div className="flex items-center">Name</div>
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Description
                      </th>
                      <th scope="col" className="px-6 py-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {quizData &&
                      quizData.participants.map((participant, index) => (
                        <ParticipantItem
                          key={crypto.randomUUID()}
                          id={participant.id}
                          index={index + 1}
                          name={participant.name}
                          description={participant.description}
                          onChangeParticipantQuiz={(data) => onChangeParticipantQuiz(data, index)}
                          onDelete={() => onDeleteParticipantQuiz(index)}
                          onChangeOrder={(index: number, isUp: boolean, page: string) =>
                            onChangeOrder(index, isUp, page)
                          }
                        />
                      ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {activeTab === 2 && (
            <>
              <div className="my-2 flex justify-end items-center">
                <button onClick={() => onAddClincherQuiz()}>
                  <IoIosAdd size={28} className=" bg-myBlue-1 text-white rounded-md" />
                </button>
              </div>
              <div className="relative overflow-x-auto shadow-md sm:rounded-lg mb-8 max-h-96">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                    <tr>
                      <th scope="col" className="px-6 py-3">
                        No.
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Question
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Answer
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Choices
                      </th>
                      <th scope="col" className="px-6 py-3">
                        <div className="flex items-center">Difficulty</div>
                      </th>
                      <th scope="col" className="px-6 py-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {quizData &&
                      quizData.clincher.map((question, index) => (
                        <ClincherItem
                          key={crypto.randomUUID()}
                          id={question.id}
                          index={index + 1}
                          question={question.question}
                          answer={question.answer}
                          choices={question.choices}
                          difficulty={question.difficulty}
                          onChangeClincherQuiz={(data) => onChangeClincherQuiz(data, index)}
                          onDelete={() => onDeleteClincherQuiz(index)}
                          onChangeOrder={(index: number, isUp: boolean, page: string) =>
                            onChangeOrder(index, isUp, page)
                          }
                        />
                      ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {activeTab === 3 && (
            <>
              <div className="relative overflow-x-auto shadow-md sm:rounded-lg mb-8 my-10">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                    <tr>
                      <th scope="col" className="px-6 py-3">
                        Difficulty
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Points
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Timer (Seconds)
                      </th>
                      <th scope="col" className="px-6 py-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {quizData?.settings.map((setting) => (
                      <SettingItem
                        key={crypto.randomUUID()}
                        data={setting}
                        onChangeSettings={(data: {
                          difficulty: string
                          points: number
                          time: number
                        }) => onChangeSettings(data)}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </>
      )}
    </section>
  )
}

type SettingItemProp = {
  data: { difficulty: string; points: number; time: number }
  onChangeSettings: (data: { difficulty: string; points: number; time: number }) => void
}

function SettingItem(props: SettingItemProp) {
  const [isEdit, setIsEdit] = useState(false)
  const [settingsData, setSettingsData] = useState(props.data)

  function onConfirmEdit() {
    setIsEdit((prev) => !prev)
    props.onChangeSettings(settingsData)
  }

  function onCancelEdit() {
    setIsEdit((prev) => !prev)
    setSettingsData(props.data)
  }

  return (
    <>
      <tr className="border-b">
        <th
          scope="row"
          className="capitalize px-6 py-4 font-medium text-gray-900 whitespace-nowrap flex justify-between items-center"
        >
          {settingsData.difficulty}
        </th>
        {isEdit ? (
          <>
            <td className="px-6 py-4 text-gray-800">
              <input
                className="px-1 border border-slate-800 rounded-sm w-20"
                type="number"
                name="points"
                value={settingsData.points}
                onChange={(e) =>
                  setSettingsData((prev) => ({ ...prev, points: Number(e.target.value) }))
                }
              />
            </td>
            <td className="px-6 py-4 text-gray-800">
              <input
                className="px-1 border border-slate-800 rounded-sm w-20"
                type="number"
                name="time"
                value={settingsData.time}
                onChange={(e) =>
                  setSettingsData((prev) => ({ ...prev, time: Number(e.target.value) }))
                }
              />
            </td>
            <td className="py-4 flex justify-center items-center gap-4">
              <button onClick={() => onConfirmEdit()}>
                <FaCheck size={16} className="text-slate-800" />
              </button>
              <button onClick={() => onCancelEdit()}>
                <ImCross size={16} className="text-red-600" />
              </button>
            </td>
          </>
        ) : (
          <>
            <td className="px-6 py-4 text-gray-800">{settingsData.points}</td>
            <td className="px-6 py-4 text-gray-800">{settingsData.time}</td>
            <td className="py-4 flex justify-center items-center gap-4">
              <button onClick={() => setIsEdit((prev) => !prev)}>
                <MdEdit size={20} className="text-slate-800" />
              </button>
            </td>
          </>
        )}
      </tr>
    </>
  )
}

type QuestionItemProp = {
  id: number
  index: number
  question: string
  answer: string
  choices?: string[]
  difficulty: string
  onChangeQuestionQuiz: (data: {
    id: number
    question: string
    answer: string
    choices?: string[]
    difficulty: string
  }) => void
  onDelete: () => void
  onChangeOrder: (index: number, isUp: boolean, page: string) => void
}

function QuestionItem(props: QuestionItemProp) {
  const [questionData, setQuestionData] = useState(props)
  const [isEdit, setIsEdit] = useState(false)
  function onHandleChange(e) {
    const { name, value } = e.target
    setQuestionData((prev) => ({
      ...prev,
      [name]: value
    }))
  }
  function onConfirmEdit() {
    setIsEdit((prev) => !prev)
    const { index, ...rest } = questionData
    props.onChangeQuestionQuiz(rest)
  }
  function onCancelEdit() {
    setIsEdit((prev) => !prev)
    setQuestionData(props)
  }
  return (
    <>
      <tr className="border-b">
        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap ">
          {questionData.index}
          {/* <div className="flex flex-col justify-center items-center">
            <button onClick={() => props.onChangeOrder(props.index - 1, true, 'questions')}>
              <MdOutlineArrowDropUp size={20} />
            </button>
            <button onClick={() => props.onChangeOrder(props.index - 1, false, 'questions')}>
              <MdOutlineArrowDropDown size={20} />
            </button>
          </div> */}
        </th>
        {isEdit ? (
          <>
            <td className="px-6 py-4 text-gray-800">
              <input
                className="px-1 border border-slate-800 rounded-sm w-20"
                type="text"
                name="question"
                value={questionData.question}
                onChange={onHandleChange}
              />
            </td>
            <td className="px-6 py-4 text-gray-800">
              <input
                className="px-1 border border-slate-800 rounded-sm w-20"
                type="text"
                name="answer"
                value={questionData.answer}
                onChange={onHandleChange}
              />
            </td>
            <td className="px-6 py-4 text-gray-800">
              <input
                className="px-1 border border-slate-800 rounded-sm w-20"
                type="text"
                name="choices"
                value={questionData.choices}
                onChange={onHandleChange}
              />
            </td>
            {/* input select */}
            <td className="px-6 py-4 text-gray-800">
              <select
                name="difficulty"
                id="difficulty"
                className="px-1 border border-slate-800 rounded-sm"
                value={questionData.difficulty}
                onChange={onHandleChange}
              >
                <option value="easy">Easy</option>
                <option value="average">Average</option>
                <option value="hard">Hard</option>
              </select>
            </td>
            <td className="py-4 flex justify-center items-center gap-4">
              <button onClick={() => onConfirmEdit()}>
                <FaCheck size={16} className="text-slate-800" />
              </button>
              <button onClick={() => onCancelEdit()}>
                <ImCross size={16} className="text-red-600" />
              </button>
            </td>
          </>
        ) : (
          <>
            <td className="px-6 py-4 text-gray-800">{questionData.question}</td>
            <td className="px-6 py-4">{questionData.answer}</td>
            <td className="px-6 py-4">
              {questionData.choices?.length ? questionData.choices : '-'}
            </td>
            <td className="px-6 py-4">{questionData.difficulty}</td>
            <td className="py-4 flex justify-center items-center gap-4">
              <button onClick={() => setIsEdit((prev) => !prev)}>
                <MdEdit size={20} className="text-slate-800" />
              </button>
              <button onClick={() => props.onDelete()}>
                <MdDelete size={20} className="text-red-600" />
              </button>
            </td>
          </>
        )}
      </tr>
    </>
  )
}

type ParticipantItemProp = {
  id: number
  index: number
  name: string
  description?: string
  onChangeParticipantQuiz: (data: { id: number; name: string; description?: string }) => void
  onDelete: () => void
  onChangeOrder: (index: number, isUp: boolean, page: string) => void
}

function ParticipantItem(props: ParticipantItemProp) {
  const [participantData, setParticipantData] = useState(props)
  const [isEdit, setIsEdit] = useState(false)
  function onHandleChange(e) {
    const { name, value } = e.target
    setParticipantData((prev) => ({
      ...prev,
      [name]: value
    }))
  }
  function onConfirmEdit() {
    setIsEdit((prev) => !prev)
    const { index, ...rest } = participantData
    props.onChangeParticipantQuiz(rest)
  }
  function onCancelEdit() {
    setIsEdit((prev) => !prev)
    setParticipantData(props)
  }
  return (
    <>
      {isEdit ? (
        <>
          <tr className="bg-neutral-200 border-b">
            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
              {participantData.index}
            </th>
            <td className="px-6 py-4 text-gray-800">
              <input
                className="px-1 border border-slate-800 rounded-sm w-20"
                type="text"
                name="name"
                value={participantData.name}
                onChange={onHandleChange}
              />
            </td>
            <td className="px-6 py-4 text-gray-800">
              <input
                className="px-1 border border-slate-800 rounded-sm w-20"
                type="text"
                name="description"
                value={participantData.description}
                onChange={onHandleChange}
              />
            </td>
            <td className="py-4 flex justify-center items-center gap-4">
              <button onClick={() => onConfirmEdit()}>
                <FaCheck size={16} className="text-slate-800" />
              </button>
              <button onClick={() => onCancelEdit()}>
                <ImCross size={16} className="text-red-600" />
              </button>
            </td>
          </tr>
        </>
      ) : (
        <>
          <tr className="bg-white border-b hover:bg-gray-200">
            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
              {participantData.index}
            </th>
            <td className="px-6 py-4 text-gray-800">{participantData.name}</td>
            <td className="px-6 py-4">
              {participantData.description ? participantData.description : '-'}
            </td>
            <td className="py-4 flex justify-center items-center gap-4">
              <button onClick={() => setIsEdit((prev) => !prev)}>
                <MdEdit size={20} className="text-slate-800" />
              </button>
              <button onClick={() => props.onDelete()}>
                <MdDelete size={20} className="text-red-600" />
              </button>
            </td>
          </tr>
        </>
      )}
    </>
  )
}

type ClincherItemProp = {
  id: number
  index: number
  question: string
  answer: string
  choices?: string[]
  difficulty: string
  onChangeClincherQuiz: (data: {
    id: number
    question: string
    answer: string
    choices?: string[]
    difficulty: string
  }) => void
  onDelete: () => void
  onChangeOrder: (index: number, isUp: boolean, page: string) => void
}

function ClincherItem(props: ClincherItemProp) {
  const [clincherData, setClincherData] = useState(props)
  const [isEdit, setIsEdit] = useState(false)
  function onHandleChange(e) {
    const { name, value } = e.target
    setClincherData((prev) => ({
      ...prev,
      [name]: value
    }))
  }
  function onConfirmEdit() {
    setIsEdit((prev) => !prev)
    const { index, ...rest } = clincherData
    props.onChangeClincherQuiz(rest)
  }
  function onCancelEdit() {
    setIsEdit((prev) => !prev)
    setClincherData(props)
  }
  return (
    <>
      <tr className="border-b">
        <th
          scope="row"
          className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap flex justify-between items-center"
        >
          {clincherData.index}
          {/* <div className="flex flex-col justify-center items-center">
            <button onClick={() => props.onChangeOrder(props.index - 1, true, 'questions')}>
              <MdOutlineArrowDropUp size={20} />
            </button>
            <button onClick={() => props.onChangeOrder(props.index - 1, false, 'questions')}>
              <MdOutlineArrowDropDown size={20} />
            </button>
          </div> */}
        </th>
        {isEdit ? (
          <>
            <td className="px-6 py-4 text-gray-800">
              <input
                className="px-1 border border-slate-800 rounded-sm w-20"
                type="text"
                name="question"
                value={clincherData.question}
                onChange={onHandleChange}
              />
            </td>
            <td className="px-6 py-4 text-gray-800">
              <input
                className="px-1 border border-slate-800 rounded-sm w-20"
                type="text"
                name="answer"
                value={clincherData.answer}
                onChange={onHandleChange}
              />
            </td>
            <td className="px-6 py-4 text-gray-800">
              <input
                className="px-1 border border-slate-800 rounded-sm w-20"
                type="text"
                name="choices"
                value={clincherData.choices}
                onChange={onHandleChange}
              />
            </td>
            {/* input select */}
            <td className="px-6 py-4">{clincherData.difficulty}</td>
            <td className="py-4 flex justify-center items-center gap-4">
              <button onClick={() => onConfirmEdit()}>
                <FaCheck size={16} className="text-slate-800" />
              </button>
              <button onClick={() => onCancelEdit()}>
                <ImCross size={16} className="text-red-600" />
              </button>
            </td>
          </>
        ) : (
          <>
            <td className="px-6 py-4 text-gray-800">{clincherData.question}</td>
            <td className="px-6 py-4">{clincherData.answer}</td>
            <td className="px-6 py-4">
              {clincherData.choices?.length ? clincherData.choices : '-'}
            </td>
            <td className="px-6 py-4">{clincherData.difficulty}</td>
            <td className="py-4 flex justify-center items-center gap-4">
              <button onClick={() => setIsEdit((prev) => !prev)}>
                <MdEdit size={20} className="text-slate-800" />
              </button>
              <button onClick={() => props.onDelete()}>
                <MdDelete size={20} className="text-red-600" />
              </button>
            </td>
          </>
        )}
      </tr>
    </>
  )
}
