import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { useEffect, useState } from 'react'
import { FaFileExport } from 'react-icons/fa'
import { IoMdArrowRoundBack } from 'react-icons/io'
import { useNavigate, useParams } from 'react-router-dom'

const tabs = ['Participants', 'Questions', 'Clinchers', 'Settings']

export default function QuizHistoryDetail() {
  const { id } = useParams()
  const [data, setData] = useState()
  const [activeTab, setActiveTab] = useState(0)
  const navigate = useNavigate()
  function handleBack(): void {
    navigate(-1)
  }

  useEffect(() => {
    async function getData() {
      const result = await window.api.getQuizHistory(id)
      setData(result)
    }
    getData()
  }, [])

  function exportPDF() {
    const doc = new jsPDF()
    const participants: string[][] = []
    data?.participants.forEach((participant) => {
      participants.push([...Object.values(participant)].map((item) => String(item)))
    })
    const questions: string[][] = []
    data?.questions.forEach((question) => {
      questions.push([...Object.values(question)].map((item) => String(item)))
    })

    const clinchers: string[][] = []
    data?.clincher.forEach((clinch) => {
      clinchers.push([...Object.values(clinch)].map((item) => String(item)))
    })

    const settings: string[][] = []
    data?.settings.forEach((setting) => {
      settings.push([...Object.values(setting)].map((item) => String(item)))
    })

    const text = [`${data.title + ' ' + '(' + data.date + ')'}`, data.description]

    doc.text(text, 14, 10)
    let height = 0
    text.forEach((item) => {
      height += doc.getTextDimensions(item).h
    })

    let finalY = height + 15

    doc.text('Participants', 14, finalY + 15)
    autoTable(doc, {
      startY: finalY + 20,
      head: [['Name', 'Description', 'Score']],
      body: participants
    })

    finalY = doc.lastAutoTable.finalY
    doc.text('Questions', 14, finalY + 15)
    autoTable(doc, {
      startY: finalY + 20,
      head: [['Question', 'Answer', 'Choices', 'Difficulty']],
      body: questions
    })

    finalY = doc.lastAutoTable.finalY
    doc.text('Clincher Questions', 14, finalY + 15)
    autoTable(doc, {
      startY: finalY + 20,
      head: [['Question', 'Answer', 'Choices', 'Difficulty']],
      body: clinchers
    })
    finalY = doc.lastAutoTable.finalY
    doc.text('Settings', 14, finalY + 15)
    autoTable(doc, {
      startY: finalY + 20,
      head: [['Difficulty', 'Points', 'Time (Seconds)']],
      body: settings
    })

    doc.save('test.pdf')
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
          <div className="flex justify-between">
            <div>
              <div className="flex justify-between items-baseline w-fit gap-8 mb-2">
                <h3 className="font-semibold text-3xl">{data.title}</h3>
                <p className="font-light text-sm text-gray-600">{data.date}</p>
              </div>
              <p className="mb-8 text-gray-800 max-w-xl">{data.description}</p>
            </div>
            <div className="m-8">
              <button
                className="text-white rounded-lg bg-myBlue-1 px-6 py-2 hover:bg-myBlue-2"
                onClick={() => exportPDF()}
              >
                <FaFileExport size={32} />
              </button>
            </div>
          </div>

          <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200">
            {tabs.map((item, index) => {
              return (
                <li key={crypto.randomUUID()} className="me-2">
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

          {activeTab === 1 && (
            <div
              className="relative overflow-x-auto shadow-md sm:rounded-lg max-h-96 mb-8 mt-4"
              id="questions"
            >
              <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      No.
                      <button>
                        <svg
                          className="w-3 h-3 ms-1.5"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                        </svg>
                      </button>
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
                      <div className="flex items-center">
                        Difficulty
                        <button>
                          <svg
                            className="w-3 h-3 ms-1.5"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                          </svg>
                        </button>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.questions.map((question, index) => (
                    <QuestionItem
                      key={crypto.randomUUID()}
                      id={question.id}
                      index={index + 1}
                      question={question.question}
                      answer={question.answer}
                      choices={question.choices}
                      difficulty={question.difficulty}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 0 && (
            <div
              className="relative overflow-x-auto shadow-md sm:rounded-lg mb-8 mt-4 max-h-96"
              id="myTable"
            >
              <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      No.
                      <button>
                        <svg
                          className="w-3 h-3 ms-1.5"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                        </svg>
                      </button>
                    </th>
                    <th scope="col" className="px-6 py-3">
                      <div className="flex items-center">
                        Name
                        <button>
                          <svg
                            className="w-3 h-3 ms-1.5"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                          </svg>
                        </button>
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3">
                      <div className="flex items-center">
                        Score
                        <button>
                          <svg
                            className="w-3 h-3 ms-1.5"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                          </svg>
                        </button>
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.participants.map((participant, index) => (
                    <ParticipantItem
                      key={crypto.randomUUID()}
                      id={participant.id}
                      index={index + 1}
                      name={participant.name}
                      score={participant.score}
                      description={participant.description}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 2 && (
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg max-h-96 mb-8 mt-4">
              <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      No.
                      <button>
                        <svg
                          className="w-3 h-3 ms-1.5"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                        </svg>
                      </button>
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
                      <div className="flex items-center">
                        Difficulty
                        <button>
                          <svg
                            className="w-3 h-3 ms-1.5"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                          </svg>
                        </button>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.clincher.map((question, index) => (
                    <QuestionItem
                      key={crypto.randomUUID()}
                      id={question.id}
                      index={index + 1}
                      question={question.question}
                      answer={question.answer}
                      choices={question.choices}
                      difficulty={question.difficulty}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 3 && (
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg max-h-96 mb-8 mt-4">
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
                      Time (Seconds)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.settings.map((setting) => (
                    <SettingItem key={crypto.randomUUID()} data={setting} />
                  ))}
                </tbody>
              </table>
            </div>
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
    </tr>
  )
}

type ParticipantItemProp = {
  id: number
  index: number
  name: string
  description?: string
  score: number
}

function ParticipantItem(props: ParticipantItemProp) {
  return (
    <tr className="bg-white border-b hover:bg-gray-200">
      <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
        {props.index}
      </th>
      <td className="px-6 py-4 text-gray-800">{props.name}</td>
      <td className="px-6 py-4">{props.score}</td>
      <td className="px-6 py-4">{props.description ? props.description : '-'}</td>
    </tr>
  )
}

type SettingItemProp = {
  data: { difficulty: string; points: number; time: number }
}

function SettingItem(props: SettingItemProp) {
  return (
    <>
      <tr className="border-b">
        <th
          scope="row"
          className="capitalize px-6 py-4 font-medium text-gray-900 whitespace-nowrap flex justify-between items-center"
        >
          {props.data.difficulty}
        </th>

        <td className="px-6 py-4 text-gray-800">{props.data.points}</td>
        <td className="px-6 py-4 text-gray-800">{props.data.time}</td>
      </tr>
    </>
  )
}
