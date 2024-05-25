import { Route, Routes } from 'react-router-dom'
import Login from './components/authentication/Login'
import ProfilePage from './components/authentication/ProfilePage'
import Register from './components/authentication/Register'
import { PageLayout } from './components/pages/PageLayout'
import QuizHistory from './components/quiz_history/QuizHistory'
import QuizHistoryDetail from './components/quiz_history/QuizHistoryDetail'
import QuizHistoryLayout from './components/quiz_history/QuizHistoryLayout'
import QuizItemDetail from './components/quiz_management/QuizItemDetail'
import QuizManagement from './components/quiz_management/QuizManagement'
import QuizManagementLayout from './components/quiz_management/QuizManagementLayout'
import QuizRoom from './components/quiz_room/QuizRoom'
import QuizRoomMain from './components/quiz_room/QuizRoomMain'
import PrivateRoutes from './components/utils/PrivateRoutes'

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<PrivateRoutes />}>
          <Route path="/quiz-room/:id" element={<QuizRoomMain />} />
          <Route path="/" element={<PageLayout />}>
            <Route path="/profile" element={<ProfilePage />} />
            <Route index element={<QuizRoom />} />
            <Route path="/quiz-management" element={<QuizManagementLayout />}>
              <Route index element={<QuizManagement />} />
              <Route path="/quiz-management/:id" element={<QuizItemDetail />} />
            </Route>
            <Route path="/quiz-history" element={<QuizHistoryLayout />}>
              <Route index element={<QuizHistory />} />
              <Route path="/quiz-history/:id" element={<QuizHistoryDetail />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </>
  )
}

export default App
