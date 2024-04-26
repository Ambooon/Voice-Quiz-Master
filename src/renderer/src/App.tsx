import { Routes, Route } from 'react-router-dom'
import Login from './components/authentication/Login'
import Register from './components/authentication/Register'
import { PageLayout } from './components/pages/PageLayout'
import Home from './components/pages/Home'
import QAManagement from './components/qa_management/QAManagement'
import QuizHistory from './components/quiz_history/QuizHistory'
import QuizHistoryDetail from './components/quiz_history/QuizHistoryDetail'
import QuizHistoryLayout from './components/quiz_history/QuizHistoryLayout'
import QAManagementLayout from './components/qa_management/QAManagementLayout'
import QAItemDetail from './components/qa_management/QAItemDetail'
import ParticipantManagement from './components/participant_management/ParticipantManagement'
import ParticipantManagementLayout from './components/participant_management/ParticipantManagementLayout'
import ParticipantItemDetail from './components/participant_management/ParticipantItemDetail'

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<PageLayout />}>
          <Route index element={<Home />} />
          <Route path="/participant-management" element={<ParticipantManagementLayout />}>
            <Route index element={<ParticipantManagement />} />
            <Route path="/participant-management/:id" element={<ParticipantItemDetail />} />
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
