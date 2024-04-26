import QAItem from './QAItem'
import { QAData } from './QAData'
import { useState } from 'react'
import QAFormModal from './QAFormModal'

export default function QAManagement() {
  const [isShowModal, setIsShowModal] = useState(false)
  function handleClick() {
    setIsShowModal(false)
  }
  return (
    <section>
      {isShowModal ? (
        <QAFormModal onClick={handleClick} />
      ) : (
        <>
          <button onClick={() => setIsShowModal(!isShowModal)}>Add</button>
          <ul className="flex flex-col gap-y-4">
            {QAData.map((data) => {
              return (
                <QAItem
                  key={data.id}
                  id={data.id}
                  title={data.title}
                  date={data.dateCreated}
                  description={data.description}
                />
              )
            })}
          </ul>
        </>
      )}
    </section>
  )
}
