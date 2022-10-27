import { BrowserRouter, Route, Routes } from 'react-router-dom'
import LoginPage from './pages/Login'
import DashboardLayout from './layouts/Dashboard'
import Home from './pages/Home'
import Program from './pages/Program'
import MyProgram from './pages/MyProgram'
import Logbook from './pages/Logbook'
import ProgramTable from './pages/ProgramTable'
import CourseTable from './pages/CourseTable'
import ProgramTypeTable from './pages/ProgramTypeTable'
import StudentProgramTable from './pages/StudentProgramTable'
import AgencyTable from './pages/AgencyTable'
import UserTable from './pages/UserTable'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import LogbookDetail from './pages/LogbookDetail'

const App = () => {
  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<Home />} />
            <Route path="/programs/:id" element={<Program />} />
            <Route path="/my-programs/:id" element={<MyProgram />} />
            <Route path="/logbooks/:id" element={<Logbook />}>
              <Route path="detail/:logbookId" element={<LogbookDetail />} />
            </Route>
            <Route path="/students/:studentId/logbooks/:programId" element={<Logbook />} >
              <Route path="detail/:logbookId" element={<LogbookDetail />} />
            </Route>
            <Route path="/programs" element={<ProgramTable />} />
            <Route path="/courses" element={<CourseTable />} />
            <Route path="/program-types" element={<ProgramTypeTable />} />
            <Route path="/student-programs" element={<StudentProgramTable />} />
            <Route path="/student-programs/:id/:studentId" element={<MyProgram />} />
            <Route path="/agencies" element={<AgencyTable />} />
            <Route path="/users" element={<UserTable />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </LocalizationProvider>
  )
}

export default App