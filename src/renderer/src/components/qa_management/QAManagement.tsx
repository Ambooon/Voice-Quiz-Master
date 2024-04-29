import { QAData } from './QAData'
import { FaFileExport } from 'react-icons/fa'
import { SlOptionsVertical } from 'react-icons/sl'
import { useNavigate } from 'react-router-dom'
import { IoIosAdd } from 'react-icons/io'

export default function QAManagement() {
  return (
    <section className="p-4">
      <div className="w-full flex justify-between my-2">
        <div className="flex justify-between items-center rounded-md bg-myBlue-1 pl-1 py-2 pr-3 text-white font-medium hover:cursor-pointer hover:bg-myBlue-2">
          <IoIosAdd size={24} />
          Add Set
        </div>
        <input
          className="py-1 px-2 border rounded-md border-slate-700"
          type="search"
          placeholder="Search QA set"
        />
      </div>
      <div className="flex justify-between py-2 px-4">
        <p>Title</p>
        <p>Description</p>
        <p>Date</p>
        <p>Options</p>
      </div>
      <div>
        <ul className="flex flex-col gap-y-4">
          {QAData.map((data) => {
            return (
              <li key={data.id}>
                <QAItem
                  key={data.id}
                  id={data.id}
                  title={data.title}
                  date={data.date}
                  description={data.description}
                />
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

type QAItemProp = {
  id: number
  title: string
  date: string //year-month-day 2002-08-29
  description: string
}

function QAItem(props: QAItemProp) {
  const navigate = useNavigate()
  function handleClick() {
    navigate(`/qa-management/${props.id}`)
  }
  return (
    <div
      className="flex justify-between items-center p-4 rounded-lg  shadow-md hover:cursor-pointer hover:bg-myBlue-1 duration-100 ease-in-out hover:text-white"
      onClick={handleClick}
    >
      <p className="text-2xl font-semibold">{props.title}</p>
      <p>{props.description}</p>
      <p>
        <time dateTime={props.date}>{props.date}</time>
      </p>
      <div className="flex gap-4">
        <button>
          <FaFileExport />
        </button>
        <button>
          <SlOptionsVertical />
        </button>
      </div>
    </div>
  )
}
