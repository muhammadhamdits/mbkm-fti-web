import {
  Paper,
  Grid,
  Typography,
  Button,
  ListItemAvatar,
  ListItemText,
  ListItemIcon,
  List,
  Avatar,
  Box,
  ListItemButton,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  DialogActions,
  IconButton
} from '@mui/material'
import {
  CheckCircle,
  DangerousRounded,
  RemoveCircle,
  EditRounded
} from '@mui/icons-material'
import { useState } from 'react'
import { DateTimePicker } from '@mui/x-date-pickers'
import { Outlet, useParams, useNavigate, useOutletContext } from 'react-router-dom'
import axios from 'axios'
import moment from 'moment'
import secureLocalStorage from 'react-secure-storage'
import Modal from '../components/Modal'
import NotFoundPage from './404'
import { isInRange } from '../assets/utils'

const CreateLogbookForm = (props) => {
  const { baseUrl, token, callback, courses, programId } = props
  const [startsAt, setStartsAt] = useState(new Date())
  const [endsAt, setEndsAt] = useState(new Date())
  const [course, setCourse] = useState(null)
  const [courseId, setCourseId] = useState(-1)
  const [cpmkCode, setCpmkCode] = useState(-1)

  const handleFormValueChange = (value, setter) => {
    setter(value)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    const payload = {
      title: e.target.title.value,
      description: e.target.description.value,
      startsAt: moment(startsAt).format('YYYY-MM-DD HH:mm:ss'),
      endsAt: moment(endsAt).format('YYYY-MM-DD HH:mm:ss'),
      courseId: courseId,
      achievementCode: cpmkCode
    }

    const response = await axios.post(`${baseUrl}/student-programs/${programId}/logbooks`,
      payload,
      { headers: { Authorization: `Bearer ${token}` } }
    )
    callback(response.data.logbook)
  }

  return(
    <form onSubmit={handleSave}>
      <TextField
        sx={{ mt: 1 }}
        variant="standard"
        margin="normal"
        label="Judul kegiatan"
        name="title"
        required
        fullWidth />
      <TextField
        sx={{ mt: 1 }}
        variant="standard"
        margin="normal"
        label="Deskripsi kegiatan"
        name="description"
        required
        multiline
        rows={2}
        fullWidth />
      <DateTimePicker
        sx={{ mt: 1, mb: 1 }}
        fullWidth
        label="Tanggal dan waktu mulai kegiatan"
        value={startsAt}
        onChange={(date) => handleFormValueChange(date, setStartsAt)}
        renderInput={(params) => <TextField
          sx={{ mt: 1, mb: 1 }}
          required
          variant='standard' 
          fullWidth
          {...params} />
        } />
      <DateTimePicker
        sx={{ mt: 1, mb: 1 }}
        fullWidth
        label="Tanggal dan waktu selesai kegiatan"
        value={endsAt}
        onChange={(date) => handleFormValueChange(date, setEndsAt)}
        renderInput={(params) => <TextField
          sx={{ mt: 1, mb: 1 }}
          required
          variant='standard'
          fullWidth
          {...params} />
        } />
      <FormControl
        sx={{ mt: 1, mb: 1 }}
        fullWidth
        margin="normal"
        variant="standard" >
        <InputLabel>Mata kuliah yang dituju</InputLabel>
        <Select
          sx={{ mt: 1, mb: 1 }}
          required
          fullWidth
          value={courseId}
          onChange={(event) => {
            let selectedCourse = courses.find(course => course.courseId === event.target.value)
            setCourse(selectedCourse)
            handleFormValueChange(event.target.value, setCourseId)
          }} >
          <MenuItem value={-1} disabled>Pilih mata kuliah</MenuItem>
          {courses.map((course) => (
            <MenuItem
              key={course.courseId}
              value={course.courseId}>
              {course.course.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl
        sx={{ mt: 1, mb: 1 }}
        fullWidth
        margin="normal"
        variant="standard" >
        <InputLabel>CPMK yang dituju</InputLabel>
        <Select
          sx={{ mt: 1, mb: 1 }}
          required
          fullWidth
          value={cpmkCode}
          onChange={(event) => handleFormValueChange(event.target.value, setCpmkCode)} >
          <MenuItem value={-1} disabled>Pilih CPMK</MenuItem>
          {course?.course?.cpmks?.map((cpmk) => (
            <MenuItem
              key={cpmk.achievementCode}
              value={cpmk.achievementCode}>
              {cpmk.achievementCode} - {cpmk.title}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <DialogActions>
        <Button
          type='submit'>
          Simpan
        </Button>
      </DialogActions>
    </form>
  )
}

const UpdateLogbookForm = (props) => {
  const { baseUrl, token, callback, courses, logbook } = props
  const [course, setCourse] = useState(courses.find(course => course.courseId === logbook.courseId))
  const [courseId, setCourseId] = useState(logbook.courseId)
  const [cpmkCode, setCpmkCode] = useState(logbook.achievementCode)

  const handleFormValueChange = (value, setter) => {
    setter(value)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    const payload = {
      courseId: courseId,
      achievementCode: cpmkCode
    }

    const response = await axios.put(`${baseUrl}/logbooks/${logbook.id}`,
      payload,
      { headers: { Authorization: `Bearer ${token}` } }
    )
    callback(response.data.logbook)
  }

  return(
    <form onSubmit={handleSave}>
      <FormControl
        sx={{ mt: 1, mb: 1 }}
        fullWidth
        margin="normal"
        variant="standard" >
        <InputLabel>Mata kuliah yang dituju</InputLabel>
        <Select
          sx={{ mt: 1, mb: 1 }}
          required
          fullWidth
          value={courseId}
          onChange={(event) => {
            let selectedCourse = courses.find(course => course.courseId === event.target.value)
            setCourse(selectedCourse)
            handleFormValueChange(event.target.value, setCourseId)
          }} >
          <MenuItem value={-1} disabled>Pilih mata kuliah</MenuItem>
          {courses.map((course) => (
            <MenuItem
              key={course.courseId}
              value={course.courseId}>
              {course.course.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl
        sx={{ mt: 1, mb: 1 }}
        fullWidth
        margin="normal"
        variant="standard" >
        <InputLabel>CPMK yang dituju</InputLabel>
        <Select
          sx={{ mt: 1, mb: 1 }}
          required
          fullWidth
          value={cpmkCode}
          onChange={(event) => handleFormValueChange(event.target.value, setCpmkCode)} >
          <MenuItem value={-1} disabled>Pilih CPMK</MenuItem>
          {course?.course?.cpmks?.map((cpmk) => (
            <MenuItem
              key={cpmk.achievementCode}
              value={cpmk.achievementCode}>
              {cpmk.achievementCode} - {cpmk.title}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <DialogActions>
        <Button
          type='submit'>
          Simpan
        </Button>
      </DialogActions>
    </form>
  )
}

const LogbookPage = () => {  
  const navigate = useNavigate()
  let query = ''
  let { id, programId, studentId } = useParams()
  const user = useOutletContext()
  const token = secureLocalStorage.getItem('token')
  const baseUrl = process.env.REACT_APP_API_URL
  const [logbooks, setLogbooks] = useState([])
  const [logbook, setLogbook] = useState(null)
  const [studentProgram, setStudentProgram] = useState(null)
  const [studentProgramCourses, setStudentProgramCourses] = useState([])
  const [loaded, setLoaded] = useState(false)
  const [Loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [is404, setIs404] = useState(false)
  const [state, setState] = useState('create')
  
  if(user.role === 'lecturer') {
    id = programId
    query = `?studentId=${studentId}`
  }

  const setModalOpen = () => {
    setOpen(!open)
  }

  const handleButtonClick = (action = 'create', data = {}) => {
    if(action === 'update') setLogbook(data)
    setState(action)
    setModalOpen()
  }

  const navigateLogbookDetail = (logbookId) => {
    if(user.role !== 'lecturer') navigate(`/logbooks/${id}/detail/${logbookId}`)
    else navigate(`/students/${programId}/logbooks/${studentId}/detail/${logbookId}`)
  }

  const callback = (data) => {
    if(state !== 'create') return setModalOpen()
    const newLogbooks = [
      ...logbooks,
      data
    ]
    setLogbooks(newLogbooks)
    setModalOpen()
  }

  const fetchLogbooks = async () => {
    const response = await axios.get(`${baseUrl}/student-programs/${id}/logbooks${query}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data.logbooks
  }

  const fetchStudentProgram = async () => {
    try {
      const response = await axios.get(`${baseUrl}/student-programs/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if(response.data.studentProgram?.status === 'accepted') return response.data.studentProgram
      else setIs404(true)
    } catch (error) {
      setIs404(true)
    }
  }

  const fetchStudentProgramCourses = async () => {
    const response = await axios.get(`${baseUrl}/student-programs/${id}/courses${query}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    const filteredCourses = response.data.studentProgramCourses.filter(
      course => course.status === 'accepted'
    )
    return filteredCourses
  }

  const fetchData = async () => {
    setLogbooks(await fetchLogbooks())
    setStudentProgram(await fetchStudentProgram())
    setStudentProgramCourses(await fetchStudentProgramCourses())
  }
  
  if(!loaded && !Loading){
    setLoading(true)
    fetchData().then(() => {
      setLoaded(true)
      setLoading(false)
    })
  }

  if(is404 || (user.role !== 'lecturer' && studentId)) return <NotFoundPage />
  else if(loaded){
    return (
      <Grid container spacing={2}>
        <Modal
          open={open}
          setOpen={setModalOpen}
          title={'Tambah logbook'}
          children={
            state === 'create' ?
            <CreateLogbookForm
              baseUrl={baseUrl}
              token={token}
              courses={studentProgramCourses}
              programId={id}
              callback={callback} /> :
            <UpdateLogbookForm
              baseUrl={baseUrl}
              token={token}
              courses={studentProgramCourses}
              logbook={logbook}
              callback={callback} />
          } />
        <Grid item xs={12} md={6} lg={7}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Typography variant='h6'>
              Logbook - {studentProgram.program.name}
            </Typography>
            
            { user.role === 'student' && (
                <Box sx={{ mt: 2, justifyContent: 'flex-end', display: 'flex' }}>
                  <Button
                    onClick={() => handleButtonClick()}
                    disabled={!isInRange(
                      new Date(),
                      studentProgram.program.startsAt,
                      studentProgram.program.endsAt
                    )}
                    variant='contained'
                    color='primary'
                    size='small'>
                    Tambah Logbook
                  </Button>
                </Box>
              )
            }
  
            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
              {logbooks.map((logbook) => (
                <ListItemButton
                  onClick={() => navigateLogbookDetail(logbook.id)}
                  key={logbook.id}>
                  <ListItemAvatar>
                    <Avatar>{moment(logbook.startsAt).date()}</Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={logbook.title}
                    secondary={logbook.description} />
                  <ListItemIcon>
                    { logbook.status === 'proposed' ? <RemoveCircle color='secondary' /> :
                      logbook.status === 'accepted' ? <CheckCircle color='success' /> :
                      <>
                        <IconButton size="small">
                          <DangerousRounded color='error' />
                        </IconButton>
                        <IconButton
                          onClick={() => handleButtonClick('update', logbook)}
                          size="small">
                          <EditRounded color='warning' />
                        </IconButton>
                      </>
                    }
                  </ListItemIcon>
                </ListItemButton>
              ))}
            </List>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6} lg={5}>
          <Outlet />
        </Grid>
      </Grid>
    )
  }else return <>Loading</>
}

export default LogbookPage
