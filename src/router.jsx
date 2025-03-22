import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/QuestionnaireCatalog'
import QuestionnaireBuilder from './pages/QuestionnaireBuilder'
import QuizPage from './pages/QuizPage'
import QuestionnaireStatistics from './pages/QuestionnaireStatistics'

const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/create-quiz" element={<QuestionnaireBuilder />} />
      <Route path="/edit-quiz/:id" element={<QuestionnaireBuilder />} />
      <Route path="/run-quiz/:id" element={<QuizPage />} />
      <Route path="/stats-quiz/:id" element={<QuestionnaireStatistics />} />
      <Route path="*" element={<Home />} />
    </Routes>
  </BrowserRouter>
)

export default AppRouter
