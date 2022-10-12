import { BrowserRouter, Route, Routes } from 'react-router-dom'
import DefaultLayout from './layouts/DefaultLayout'
import HomePage from './pages/Home'
import LogBookPage from './pages/Logbook'
import LoginPage from './pages/Login'
import ProgramDetailPage from './pages/ProgramDetail'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<DefaultLayout />}>
          <Route index element={<HomePage />} />
          <Route path="programs/:id" element={<ProgramDetailPage />} />
          <Route path="logbooks" element={<LogBookPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App