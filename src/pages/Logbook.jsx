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
import { Outlet, useParams } from 'react-router-dom'
import Modal from '../components/Modal'
import { DateTimePicker } from '@mui/x-date-pickers'
import moment from 'moment'

const CreateLogbookForm = (props) => {
  const { baseUrl, token, callback, courses } = props
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
      starts_at: moment(startsAt).format('YYYY-MM-DD HH:mm:ss'),
      ends_at: moment(endsAt).format('YYYY-MM-DD HH:mm:ss'),
      course_id: courseId,
      cpmk_code: cpmkCode
    }
    // /student-programs/:programId/logbooks
    console.log(payload)
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
              {cpmk.achievementCode} - {cpmk.achievementName}
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

  const callback = () => {
    // Todo
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
                <ListItemButton key={logbook.id}>
                  <ListItemAvatar>
                    {logbook.id}
                  </ListItemAvatar>
                  <ListItemText
                    primary={logbook.title}
                    secondary={logbook.description} />
                  <ListItemIcon>
                    <CheckCircle color='success' />
                  </ListItemIcon>
                </ListItemButton>
              ))}
              <ListItemButton>
                <ListItemAvatar>
                  <Avatar>
                    15
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="Pengenalan Kegiatan"
                  secondary="Dasar-dasar Pemrograman - Membuat aplikasi sederhana" />
                <ListItemIcon>
                  <CheckCircle color='success' />
                </ListItemIcon>
              </ListItemButton>
              <ListItemButton>
                <ListItemAvatar>
                  <Avatar>
                    14
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="Memahami Konsep"
                  secondary="Dasar-dasar Pemrograman - Membuat aplikasi sederhana" />
                <ListItemIcon>
                  <DangerousRounded color='error' />
                </ListItemIcon>
              </ListItemButton>
              <ListItemButton>
                <ListItemAvatar>
                  <Avatar>
                    13
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="Melihat-lihat"
                  secondary="Data Mining - Menggali data" />
                <ListItemIcon>
                  <RemoveCircle color='disable' />
                </ListItemIcon>
              </ListItemButton>
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