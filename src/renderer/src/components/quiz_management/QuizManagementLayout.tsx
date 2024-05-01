import { Outlet } from 'react-router-dom'

export default function QuizManagementLayout() {
  return (
    <div>
      <header>
        <h2 className="my-2 mx-4 text-4xl font-bold">Quiz Management</h2>
        <hr />
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  )
}
