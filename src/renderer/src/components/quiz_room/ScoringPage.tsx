import { FaCheck, FaMicrophone } from 'react-icons/fa'
import { RxCross2 } from 'react-icons/rx'
import { ParticipantData } from './ParticipantData'

export default function QuizRoom() {
  return (
    <div className="max-h-screen">
      <h1 className="mt-4 mx-4 text-4xl font-bold">Scoring</h1>
      <div className="bg-myBlue-3 shadow-md p-4 w-fit rounded-full mx-auto text-white mb-12">
        <FaMicrophone size={40} />
      </div>
      <div className="max-w-sm mx-auto">
        {ParticipantData.map((participant, index) => {
          return (
            <RankingItem key={index} index={index + 1} name={participant.name} isCorrect={true} />
          )
        })}
      </div>

      <div className="w-fit ml-auto px-8">
        <label className="inline-flex items-center cursor-pointer">
          <input type="checkbox" value="" className="sr-only peer" />
          <div className="relative w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          <span className="ms-3 text-sm font-medium text-gray-900">Manual</span>
        </label>
      </div>
    </div>
  )
}

type RankingItemProp = {
  index: number
  name: string
  isCorrect: boolean
}

function RankingItem(props: RankingItemProp) {
  return (
    <div
      className={
        props.isCorrect
          ? 'flex justify-between items-center bg-myBlue-1 text-white p-4 mb-2 rounded-md w-sm'
          : 'flex justify-between items-center bg-red-500 text-white p-4 mb-2 rounded-md w-sm'
      }
    >
      <p className="font-medium">
        {props.index}. {props.name}
      </p>
      {/* <p className="text-white">{props.isCorrect ? <FaCheck /> : <RxCross2 />}</p> */}
      <div className="flex justify-between gap-4 items-center">
        <button>
          <FaCheck />
        </button>
        <button>
          <RxCross2 />
        </button>
      </div>
    </div>
  )
}
