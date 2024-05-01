import { useState } from 'react'
import { IoIosAdd, IoMdArrowRoundBack } from 'react-icons/io'
import { MdDelete, MdEdit } from 'react-icons/md'
import { useNavigate, useParams } from 'react-router-dom'
import { QuizData } from './QuizData'

const tabs = ['Questions', 'Participants']

export default function QuizItemDetail() {
  const { id } = useParams()
  const data = QuizData.find((item) => String(item.id) === id)
  const [activeTab, setActiveTab] = useState(0)
  const navigate = useNavigate()
  function handleBack(): void {
    navigate(-1)
  }
  return (
    <section className="p-4">
      <button onClick={handleBack}>
        <IoMdArrowRoundBack size={28} />
      </button>
      {!data ? (
        <p>Not Found Quiz Item</p>
      ) : (
        <>
          <div className="flex justify-between items-baseline w-fit gap-4 mb-2">
            <h3 className="font-semibold text-3xl">{data.title}</h3>
            <p className="font-light text-sm text-gray-600 ml-2">{data.date}</p>
            <button className="px-3 py-1 rounded-lg bg-myBlue-1 text-white">Edit</button>
          </div>
          <p className="mb-8 text-gray-800 max-w-xl">{data.description}</p>
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
                <button>
                  <IoIosAdd size={28} className=" bg-myBlue-1 text-white rounded-md" />
                </button>
              </div>
              <div className="relative overflow-x-auto shadow-md sm:rounded-lg mb-8">
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
                      <th scope="col" className="px-6 py-3">
                        <div className="flex items-center">Points</div>
                      </th>
                      <th scope="col" className="px-6 py-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.questions.map((question, index) => (
                      <QuestionItem
                        key={question.id}
                        id={question.id}
                        index={index + 1}
                        question={question.question}
                        answer={question.answer}
                        choices={question.choices}
                        difficulty={question.difficulty}
                        points={question.points}
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
                <button>
                  <IoIosAdd size={28} className=" bg-myBlue-1 text-white rounded-md" />
                </button>
              </div>
              <div className="relative first-line:overflow-x-auto shadow-md sm:rounded-lg max-h-96">
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
                    {data.participants.map((participant, index) => (
                      <ParticipantItem
                        key={participant.id}
                        id={participant.id}
                        index={index + 1}
                        name={participant.name}
                        description={participant.description}
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

type QuestionItemProp = {
  id: number
  index: number
  question: string
  answer: string
  choices?: string[]
  difficulty: string
  points: number
}

function QuestionItem(props: QuestionItemProp) {
  return (
    <tr className="bg-white border-b hover:bg-gray-200">
      <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
        {props.index}
      </th>
      <td className="px-6 py-4 text-gray-800">{props.question}</td>
      <td className="px-6 py-4">{props.answer}</td>
      <td className="px-6 py-4">{props.choices ? props.choices : '-'}</td>
      <td className="px-6 py-4">{props.difficulty}</td>
      <td className="px-6 py-4">{props.points}</td>
      <td className="py-4 flex justify-center items-center gap-4">
        <button>
          <MdEdit size={20} className="text-slate-800" />
        </button>
        <button>
          <MdDelete size={20} className="text-red-600" />
        </button>
      </td>
    </tr>
  )
}

type ParticipantItemProp = {
  id: number
  index: number
  name: string
  description?: string
}

function ParticipantItem(props: ParticipantItemProp) {
  return (
    <tr className="bg-white border-b hover:bg-gray-200">
      <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
        {props.index}
      </th>
      <td className="px-6 py-4 text-gray-800">{props.name}</td>
      <td className="px-6 py-4">{props.description ? props.description : '-'}</td>
      <td className="py-4 flex justify-center items-center gap-4">
        <button>
          <MdEdit size={20} className="text-slate-800" />
        </button>
        <button>
          <MdDelete size={20} className="text-red-600" />
        </button>
      </td>
    </tr>
  )
}
