import { Outlet } from 'react-router-dom'

export default function ParticipantManagementLayout() {
  return (
    <div>
      <header>
        <h2 className="text-4xl font-bold my-2">Participant Management</h2>
        <hr />
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  )
}
