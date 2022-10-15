import { BrowserRouter, Route, Routes } from 'react-router-dom'
import LoginPage from './pages/Login'
import DashboardLayout from './layouts/Dashboard'
import Home from './pages/Home'
import Program from './pages/Program'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Home />} />
          <Route path="/programs/1" element={<Program />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App