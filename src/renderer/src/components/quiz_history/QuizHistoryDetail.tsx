import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { useEffect, useState } from 'react'
import { FaFileExport } from 'react-icons/fa'
import { IoMdArrowRoundBack } from 'react-icons/io'
import { useNavigate, useParams } from 'react-router-dom'

const tabs = [
  'Participants',
  'Questions',
  'Clinchers',
  'Easy Round',
  'Average Round',
  'Difficult Round',
  'Item Analysis',
  'Settings'
]

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
      console.log(result)
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
    settings[3] = [settings[3][0], '-', settings[3][1], '-']
    const easy: string[][] = []
    data?.easy.participants.forEach((participant) => {
      easy.push(
        [...Object.values(participant)].map((item, index) => {
          if (index === 3) {
            return item === true ? 'Wins' : 'Lose'
          } else if (index === 4) {
            return item === true ? 'Qualified from clincher' : ''
          }
          return String(item)
        })
      )
    })

    const average: string[][] = []
    data?.average.participants.forEach((participant) => {
      average.push(
        [...Object.values(participant)].map((item, index) => {
          if (index === 3) {
            return item === true ? 'Wins' : 'Lose'
          } else if (index === 4) {
            return item === true ? 'Qualified from clincher' : ''
          }
          return String(item)
        })
      )
    })

    const hard: string[][] = []
    data?.hard.participants.forEach((participant) => {
      hard.push(
        [...Object.values(participant)].map((item, index) => {
          if (index === 3) {
            return item === true ? 'Wins' : 'Lose'
          } else if (index === 4) {
            return item === true ? 'Wins from clincher' : ''
          }
          return String(item)
        })
      )
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
      head: [['Name', 'Description']],
      body: participants
    })

    finalY = doc.lastAutoTable.finalY
    doc.text('Questions', 14, finalY + 15)
    autoTable(doc, {
      startY: finalY + 20,
      head: [['Image', 'Question', 'Answer', 'Choices', 'Difficulty']],
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
    doc.text('Easy Round', 14, finalY + 15)
    autoTable(doc, {
      startY: finalY + 20,
      head: [['Name', 'Description', 'Points', 'Wins Round', 'Wins Clincher']],
      body: easy
    })
    finalY = doc.lastAutoTable.finalY
    doc.text('Average Round', 14, finalY + 15)
    autoTable(doc, {
      startY: finalY + 20,
      head: [['Name', 'Description', 'Points', 'Wins Round', 'Wins Clincher']],
      body: average
    })
    finalY = doc.lastAutoTable.finalY
    doc.text('Difficult Round', 14, finalY + 15)
    autoTable(doc, {
      startY: finalY + 20,
      head: [['Name', 'Description', 'Points', 'Wins Round', 'Wins Clincher']],
      body: hard
    })
    finalY = doc.lastAutoTable.finalY
    doc.text('Settings', 14, finalY + 15)
    autoTable(doc, {
      startY: finalY + 20,
      head: [['Difficulty', 'Points', 'Time (Seconds)', 'No. of Participants']],
      body: settings
    })

    finalY = doc.lastAutoTable.finalY
    doc.text('Item Analysis', 14, finalY + 15)

    const nestedTableCell = {
      content: '',
      styles: { minCellHeight: participants.length * 10 }
    }
    const itemQuestions = data.item_analysis.map((obj, index) => [
      String(index + 1),
      obj.question,
      obj.answer,
      nestedTableCell
    ])

    const itemParticipants = data.item_analysis.map((obj) =>
      obj.participants.map((p) => [p.name, p.isCorrect ? 'Correct' : 'Incorrect'])
    )

    autoTable(doc, {
      startY: finalY + 20,
      theme: 'grid',
      head: [['No.', 'Question', 'Answer', 'Item Analysis']],
      body: itemQuestions,

      didDrawCell: function (data) {
        const items = itemParticipants

        for (let i = 0; i < items.length; i++) {
          if (data.column.index === 3 && data.cell.section === 'body' && data.row.index === i) {
            autoTable(doc, {
              startY: data.cell.y + 2,
              margin: { left: data.cell.x + 2 },
              tableWidth: data.cell.width - 4,
              columns: [
                { dataKey: 'name', header: 'Name' },
                { dataKey: 'isCorrect', header: 'Is Correct' }
              ],
              body: items[i]
            })
          }
        }
      },
      columnStyles: {
        3: { cellWidth: 80 }
      },
      bodyStyles: {
        minCellHeight: 30
      }
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
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Image
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
                  </tr>
                </thead>
                <tbody>
                  {data.questions.map((question, index) => (
                    <QuestionItem
                      key={crypto.randomUUID()}
                      index={index + 1}
                      image={question.image}
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
                    </th>
                    <th scope="col" className="px-6 py-3">
                      <div className="flex items-center">Name</div>
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
                      index={index + 1}
                      name={participant.name}
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
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Image
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
                  </tr>
                </thead>
                <tbody>
                  {data.clincher.map((question, index) => (
                    <QuestionItem
                      key={crypto.randomUUID()}
                      index={index + 1}
                      image={question.image}
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

          {activeTab === 6 && (
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg max-h-96 mb-8 mt-4">
              <table
                className="w-full text-sm text-left rtl:text-right text-gray-500"
                id="item-analysis-table"
              >
                <thead className="text-xs text-white uppercase bg-myBlue-2">
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
                  </tr>
                </thead>
                <tbody>
                  {data.item_analysis.map((question, index) => (
                    <ItemAnalysis
                      key={crypto.randomUUID()}
                      index={index + 1}
                      question={question.question}
                      answer={question.answer}
                      participants={question.participants}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 7 && (
            <>
              <p className="mt-8 mb-4 capitalize">Scoring Type: {data.scoring_type}</p>
              <div className="relative overflow-x-auto shadow-md sm:rounded-lg max-h-96">
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
                        Partial Points
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Time (Seconds)
                      </th>
                      <th scope="col" className="px-6 py-3">
                        No. of Participants
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
            </>
          )}

          {activeTab === 3 && (
            <>
              <div
                className="relative overflow-x-auto shadow-md sm:rounded-lg mb-8 mt-4 max-h-96"
                id="myTable"
              >
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
                        <div className="flex items-center">Score</div>
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Description
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Wins Round
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Wins Clincher
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.easy.participants.map((participant, index) => (
                      <ParticipantRoundItem
                        key={crypto.randomUUID()}
                        index={index + 1}
                        name={participant.name}
                        score={participant.score}
                        description={participant.description}
                        isWin={participant.isWin}
                        isClincher={participant.isClincher}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {activeTab === 4 && (
            <>
              <div
                className="relative overflow-x-auto shadow-md sm:rounded-lg mb-8 mt-4 max-h-96"
                id="myTable"
              >
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
                        <div className="flex items-center">Score</div>
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Description
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Wins Round
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Wins Clincher
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.average.participants.map((participant, index) => (
                      <ParticipantRoundItem
                        key={crypto.randomUUID()}
                        index={index + 1}
                        name={participant.name}
                        score={participant.score}
                        description={participant.description}
                        isWin={participant.isWin}
                        isClincher={participant.isClincher}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {activeTab === 5 && (
            <>
              <div
                className="relative overflow-x-auto shadow-md sm:rounded-lg mb-8 mt-4 max-h-96"
                id="myTable"
              >
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
                        <div className="flex items-center">Score</div>
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Description
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Wins Round
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Wins Clincher
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.hard.participants.map((participant, index) => (
                      <ParticipantRoundItem
                        key={crypto.randomUUID()}
                        index={index + 1}
                        name={participant.name}
                        score={participant.score}
                        description={participant.description}
                        isWin={participant.isWin}
                        isClincher={participant.isClincher}
                        isHard={true}
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
  index: number
  image: string
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
      <td className="px-6 py-4 text-gray-800">
        {props.image && (
          <img
            src={props.image}
            alt="question-image"
            style={{ width: '100px', height: '100px', objectFit: 'contain' }}
          />
        )}
      </td>
      <td className="px-6 py-4 text-gray-800">{props.question}</td>
      <td className="px-6 py-4">{props.answer}</td>
      <td className="px-6 py-4">{props.choices?.length ? props.choices : '-'}</td>
      <td className="px-6 py-4">{props.difficulty === 'hard' ? 'difficult' : props.difficulty}</td>
    </tr>
  )
}

type ItemAnalysisProp = {
  index: number
  question: string
  answer: string
  participants: []
}

function ItemAnalysis(props: ItemAnalysisProp) {
  return (
    <>
      <tr className="bg-myBlue-1 border-b hover:bg-myBlue-2 text-white">
        <th scope="row" className="px-6 py-4 font-medium whitespace-nowrap">
          {props.index}
        </th>
        <td className="px-6 py-4">{props.question}</td>
        <td className="px-6 py-4">{props.answer}</td>
      </tr>
      <tr className="bg-gray-100 text-slate-600">
        <th className="px-6 py-2">Name</th>
        <th colSpan={2} className="px-6 py-2">
          Is Correct
        </th>
      </tr>
      {props.participants.map((p, index) => {
        return (
          <tr key={index} className="bg-white border-b hover:bg-gray-200">
            <td className="px-6 py-4">{p.name}</td>
            <td colSpan={2} className="px-6 py-4">
              {p.isCorrect ? 'Correct' : 'Incorrect'}
            </td>
          </tr>
        )
      })}
    </>
  )
}

type ParticipantItemProp = {
  index: number
  name: string
  description?: string
}

function ParticipantItem(props: ParticipantItemProp) {
  return (
    <tr
      className={
        props.index === 1
          ? 'bg-myBlue-1 text-white hover:bg-myBlue-2 border-b'
          : 'bg-white border-b hover:bg-gray-200 text-gray-900'
      }
    >
      <th scope="row" className="px-6 py-4 font-medium  whitespace-nowrap">
        {props.index}
      </th>
      <td className="px-6 py-4">{props.name}</td>
      <td className="px-6 py-4">{props.description ? props.description : '-'}</td>
    </tr>
  )
}

type ParticipantRoundItemProp = {
  index: number
  name: string
  description?: string
  score: number
  isWin: boolean
  isClincher: boolean
  isHard?: boolean
}

function ParticipantRoundItem(props: ParticipantRoundItemProp) {
  return (
    <tr
      className={
        props.isWin
          ? 'bg-myBlue-1 text-white hover:bg-myBlue-2 border-b'
          : 'bg-white border-b hover:bg-gray-200 text-gray-900'
      }
    >
      <th scope="row" className="px-6 py-4 font-medium  whitespace-nowrap">
        {props.index}
      </th>
      <td className="px-6 py-4">{props.name}</td>
      <td className="px-6 py-4">{props.score}</td>
      <td className="px-6 py-4">{props.description ? props.description : '-'}</td>
      <td className="px-6 py-4">{props.isWin ? 'Win' : 'Lose'}</td>
      <td className="px-6 py-4">
        {props.isClincher ? `${props.isHard ? 'Wins' : 'Qualified'} from clincher` : ''}
      </td>
    </tr>
  )
}

type SettingItemProp = {
  data: {
    difficulty: string
    points: number
    partial_points: number
    time: number
    number_participants: number
  }
}

function SettingItem(props: SettingItemProp) {
  return (
    <>
      <tr className="border-b">
        <th
          scope="row"
          className="capitalize px-6 py-4 font-medium text-gray-900 whitespace-nowrap flex justify-between items-center"
        >
          {props.data.difficulty === 'hard' ? 'difficult' : props.data.difficulty}
        </th>

        <td className="px-6 py-4 text-gray-800">{props.data.points}</td>
        <td className="px-6 py-4 text-gray-800">{props.data.partial_points}</td>
        <td className="px-6 py-4 text-gray-800">{props.data.time}</td>
        <td className="px-6 py-4 text-gray-800">{props.data.number_participants}</td>
      </tr>
    </>
  )
}
