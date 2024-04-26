import { ParticipantData } from './ParticipantData'
import ParticipantItem from './ParticipantItem'

export default function ParticipantManagement() {
  return (
    <section>
      <ul className="flex flex-col gap-y-4">
        {ParticipantData.map((data) => {
          return (
            <ParticipantItem
              key={data.id}
              id={data.id}
              title={data.title}
              date={data.dateCreated}
              description={data.description}
            />
          )
        })}
      </ul>
    </section>
  )
}
