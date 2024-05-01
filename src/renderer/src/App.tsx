import { Routes, Route } from 'react-router-dom'
import Login from './components/authentication/Login'
import Register from './components/authentication/Register'
import { PageLayout } from './components/pages/PageLayout'
import QAManagement from './components/qa_management/QAManagement'
import QuizHistory from './components/quiz_history/QuizHistory'
import QuizHistoryDetail from './components/quiz_history/QuizHistoryDetail'
import QuizHistoryLayout from './components/quiz_history/QuizHistoryLayout'
import QAManagementLayout from './components/qa_management/QAManagementLayout'
import QAItemDetail from './components/qa_management/QAItemDetail'
import QuizManagement from './components/quiz_management/QuizManagement'
import QuizManagementLayout from './components/quiz_management/QuizManagementLayout'
import QuizItemDetail from './components/quiz_management/QuizItemDetail'
import QuizRoom from './components/quiz_room/QuizRoom'

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<PageLayout />}>
          <Route index element={<QuizRoom />} />
          <Route path="/quiz-management" element={<QuizManagementLayout />}>
            <Route index element={<QuizManagement />} />
            <Route path="/quiz-management/:id" element={<QuizItemDetail />} />
          </Route>
          <Route path="/qa-management" element={<QAManagementLayout />}>
            <Route index element={<QAManagement />} />
            <Route path="/qa-management/:id" element={<QAItemDetail />} />
          </Route>
          <Route path="/quiz-history" element={<QuizHistoryLayout />}>
            <Route index element={<QuizHistory />} />
            <Route path="/quiz-history/:id" element={<QuizHistoryDetail />} />
          </Route>
        </Route>
      </Routes>
    </>
  )
}

export default App
