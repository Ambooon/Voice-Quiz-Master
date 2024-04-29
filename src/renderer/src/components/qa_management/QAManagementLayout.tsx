import { Outlet } from 'react-router-dom'

export default function QuizHistoryLayout() {
  return (
    <div>
      <header>
        <h2 className="my-2 mx-4 text-4xl font-bold">Question and Answer Management</h2>
        <hr />
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  )
}
