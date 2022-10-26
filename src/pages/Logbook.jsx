import {
  Paper,
  Grid,
  Typography,
  Button,
  ListItemAvatar,
  ListItemText,
  ListItem,
  ListItemIcon,
  List,
  Avatar,
  Box,
  Chip,
  ListItemButton,
  InputBase,
  IconButton,
  Divider,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  DialogActions
} from '@mui/material'
import { CheckCircle, DangerousRounded, Download, Lock, Upload, RemoveCircle, Send } from '@mui/icons-material'
import Accordion from '../components/Accordion'
import MenuIcon from '@mui/icons-material/Menu'
import SearchIcon from '@mui/icons-material/Search'
import DirectionsIcon from '@mui/icons-material/Directions'
import axios from 'axios'
import { useEffect, useState, useRef } from 'react'
import secureLocalStorage from 'react-secure-storage'
import { Outlet, useParams, useNavigate } from 'react-router-dom'
import Modal from '../components/Modal'
import { DateTimePicker } from '@mui/x-date-pickers'
import moment from 'moment'

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

const MyProgram = () => {  
  const { id } = useParams()
  const navigate = useNavigate()
  const token = secureLocalStorage.getItem('token')
  const baseUrl = process.env.REACT_APP_API_URL
  const [logbooks, setLogbooks] = useState([])
  const [studentProgramCourses, setStudentProgramCourses] = useState([])
  const [loaded, setLoaded] = useState(false)
  const [Loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)

  const setModalOpen = () => {
    setOpen(!open)
  }

  const handleAddLogbook = () => {
    setModalOpen()
  }

  const navigateLogbookDetail = (logbookId) => {
    navigate(`/logbooks/${id}/detail/${logbookId}`)
  }

  const callback = (data) => {
    const newLogbooks = [
      ...logbooks,
      data
    ]
    setLogbooks(newLogbooks)
    setModalOpen()
  }

  const fetchLogbooks = async () => {
    const response = await axios.get(`${baseUrl}/student-programs/${id}/logbooks`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data.logbooks
  }

  const fetchStudentProgramCourses = async () => {
    const response = await axios.get(`${baseUrl}/student-programs/${id}/courses`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    const filteredCourses = response.data.studentProgramCourses.filter(
      course => course.status === 'accepted'
    )
    return filteredCourses
  }

  const fetchData = async () => {
    setLogbooks(await fetchLogbooks())
    setStudentProgramCourses(await fetchStudentProgramCourses())
  }
  
  if(!loaded && !Loading){
    setLoading(true)
    fetchData().then(() => {
      setLoaded(true)
      setLoading(false)
    })
  }

  if(loaded){
    return (
      <Grid container spacing={2}>
        <Modal
          open={open}
          setOpen={setModalOpen}
          title={'Tambah logbook'}
          children={
            <CreateLogbookForm
              baseUrl={baseUrl}
              token={token}
              courses={studentProgramCourses}
              programId={id}
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
              Logbook - Backend Developer Intern
            </Typography>
  
            <Box sx={{ mt: 2, justifyContent: 'flex-end', display: 'flex' }}>
              <Button
                onClick={handleAddLogbook}
                variant='contained'
                color='primary'
                size='small'>
                Tambah Logbook
              </Button>
            </Box>
  
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
                    <CheckCircle color='success' />
                    <RemoveCircle color='disable' />
                    <DangerousRounded color='error' />
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

export default MyProgram