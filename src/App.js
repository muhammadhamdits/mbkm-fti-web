import { BrowserRouter, Route, Routes } from 'react-router-dom'
import DefaultLayout from './layouts/DefaultLayout'
import HomePage from './pages/Home'
import ProgramDetailPage from './pages/ProgramDetail'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DefaultLayout />}>
          <Route index element={<HomePage />} />
          <Route path="programs/:id" element={<ProgramDetailPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App