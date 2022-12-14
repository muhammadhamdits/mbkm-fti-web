import {
  Paper,
  Grid,
  Typography,
  Button,
  ListItemAvatar,
  ListItemText,
  ListItem,
  List,
  Avatar,
  Box,
  Chip,
  CircularProgress,
  Divider,
  Alert,
  AlertTitle,
  ListItemButton,
  ListItemIcon,
  Checkbox,
  DialogActions,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  LinearProgress,
  IconButton,
  ListItemSecondaryAction,
  Menu,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  TextField,
  Link
} from '@mui/material'
import {
  Download,
  Lock,
  Upload,
  WorkspacePremium,
  ExpandMore,
  ArrowRight,
  Delete,
  Edit,
  EditOff,
  Save,
  KeyboardDoubleArrowRight
} from '@mui/icons-material'
import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { useParams, useOutletContext, useNavigate } from 'react-router-dom'
import secureLocalStorage from 'react-secure-storage'
import Modal from '../components/Modal'
import { formatDate, isLater, isInRange, capitalize } from '../assets/utils'
import moment from 'moment'
import NotFoundPage from './404'

const StdSelect = (props) => {
  return(
    <FormControl fullWidth margin="normal" variant="standard">
      <InputLabel>{props.label}</InputLabel>
      <Select
        required
        fullWidth
        value={props.value}
        onChange={props.onChange} >
        {props.items.map((item) => (
          item.id === 'applied' ? (
            <MenuItem key={item.id} value={item.id} disabled>{item.name}</MenuItem>
          ) : (
            <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
          )
        ))}
      </Select>
    </FormControl>
  )
}

const UploadFileDetail = (props) => {
  const { data, baseUrl, token, callback, field } = props
  const [isLoading, setIsLoading] = useState(false)
  const inputFileRef = useRef(null)
  const [file, setFile] = useState(null)
  const [fileName, setFileName] = useState('')
  const handleUploadButton = () => {
    inputFileRef.current.click()
  }

  const handleFileChange = (e) => {
    setFile(e.target.files[0])
    setFileName(e.target.files[0].name)
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    const formData = new FormData()

    formData.append('file', file)
    const objectName = 'StudentProgram'
    const objectField = field
    const objectIdString = JSON.stringify({
      studentId: data.studentId,
      programId: data.programId
    })
    const query = `objectName=${objectName}&objectId=${objectIdString}&objectField=${objectField}`

    await axios.post(`${baseUrl}/upload?${query}`,
      formData,
      { headers: { Authorization: `Bearer ${token}` } }
    )
    setIsLoading(false)
    callback('Berhasil mengunggah dokumen')
  }

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex' }}>
        <CircularProgress />
      </Box>
    )
  }else{
    return (
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="subtitle1" sx={{ fontWeight: 400 }}>
            Unggah dokumen bukti bahwa kamu telah diterima dalam program ini
          </Typography>
          <Typography variant="caption" sx={{ mt: 1 }}>
            Pastikan dokumen dalam format PDF.
          </Typography>
          <input
            type="file"
            accept="application/pdf"
            ref={inputFileRef}
            onChangeCapture={ handleFileChange }
            style={{ display: 'none' }} />
          <Typography
            variant="subtitle2"
            visibility={ fileName ? 'visible' : 'hidden' }
            sx={{ mt: 2 }}>
            {fileName}
          </Typography>
          <Button
            variant='outlined'
            color='primary'
            size="small"
            fullWidth
            onClick={ handleUploadButton }
            startIcon={<Upload />}>
            Unggah
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Divider sx={{ mt: 1, mb: 3 }} />
          <Button
            size="large"
            disabled={!fileName}
            variant='contained'
            color='primary'
            fullWidth
            onClick={handleSubmit}>
            Simpan
          </Button>
        </Grid>
      </Grid>
    )
  }
}

const AddStudentProgramCourse = (props) => {
  const { programCourses, baseUrl, token, callback, programId } = props
  const [checked, setChecked] = useState([])

  const handleCheckCourse = (value) => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked)
  }

  const handleSave = async () => {
    const payload = { courseIds: checked }
    try{
      await axios.post(`${baseUrl}/student-programs/${programId}/courses`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      callback('Berhasil menambahkan mata kuliah untuk dikonversi')
    } catch (err) {
      if(err.response?.status === 400){
        callback(err.response.data.error, 'error')
      }else console.log(err)
    }
  }

  if(programCourses.length === 0){
    return (
      <Typography variant="subtitle1" sx={{ fontWeight: 400 }}>
        Tidak ada mata kuliah yang tersedia untuk dikonversi.
        Silahkan hubungi admin untuk menambahkan mata kuliah.
      </Typography>
    )
  }else{
    return(
      <>
        <List sx={{ width: '100%' }}>
          {programCourses.map((course) => (
            <ListItem
              disablePadding
              secondaryAction={
                <Chip
                  color="primary"
                  size="small"
                  label={`${course.sks} SKS`} />
              }
              key={course.id}>
              <ListItemButton
                onClick={handleCheckCourse.bind(this, course.id)}
                sx={{ mr: 8 }}
                dense>
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={checked.includes(course.id)}
                    tabIndex={-1}
                    disableRipple
                  />
                </ListItemIcon>
                <ListItemText primary={course.name} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <DialogActions>
          <Button onClick={handleSave}>
            Simpan
          </Button>
        </DialogActions>
      </>
    )
  }
}

const DeleteStudentProgramCourse = (props) => {
  const { data, baseUrl, token, callback } = props

  const handleDelete = async () => {
    const payload = { courseIds: [data.courseId] }
    try{
      await axios.delete(`${baseUrl}/student-programs/${data.programId}/courses`,
        { data: payload, headers: { Authorization: `Bearer ${token}` } }
      )
      callback(`Berhasil menghapus mata kuliah ${data.course.name} dari program ini`)
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <>
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="subtitle2" gutterBottom>
          Apakah anda yakin ingin menghapus mata kuliah <b>{data.course.name}</b> dari program ini?
        </Typography>
      </Grid>
    </Grid>
    <DialogActions>
      <Button>
        Batal
      </Button>
      <Button onClick={handleDelete}>
        Hapus
      </Button>
    </DialogActions>
  </>
  )
}

const BasicMenu = (props) => {
  const { lecturers, setCallback, token, baseUrl, studentProgram, callback } = props
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const [selectedId, setSelectedId] = useState(null)

  const handleClick = (event) => { setAnchorEl(event.currentTarget) }
  const handleClose = () => { setAnchorEl(null) }
  const handleChange = (lecturerId) => {
    setCallback(lecturerId)
    setSelectedId(lecturerId)
    handleClose()
  }
  const handleCancel = () => {
    setCallback(null)
    setSelectedId(null)
  }
  const handleSave = async () => {
    const payload = {
      studentId: studentProgram.studentId,
      programId: studentProgram.programId,
      lecturerId: selectedId
    }
    await axios.put(`${baseUrl}/student-programs/lecturer`,
      payload,
      { headers: { Authorization: `Bearer ${token}` } }
    )
    setSelectedId(null)
    callback('Berhasil assign dosen pembimbing ke program ini')
  }

  return (
    <>
      { !selectedId &&
        <IconButton
          color="warning"
          id="basic-button"
          aria-controls={open ? 'basic-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
        >
          <Edit />
        </IconButton>
      }
      {selectedId &&
        <>
          <IconButton color="error" onClick={handleCancel}>
            <EditOff />
          </IconButton>
          <IconButton color="success" onClick={handleSave}>
            <Save />
          </IconButton>
        </>
      }
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{'aria-labelledby': 'basic-button'}}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {lecturers.map((lecturer) => (
          <MenuItem
            key={lecturer.id}
            onClick={handleChange.bind(this, lecturer.id)} >
            {lecturer.name}
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}

const ConfirmStudentProgramCourse = (props) => {
  const { data, courseIds, baseUrl, token, callback } = props
  const [courseStatus, setCourseStatus] = useState('accepted')

  const handleStatusChange = (e) => {
    setCourseStatus(e.target.value) 
  }

  const handleUpdateStatus = async () => {
    const payload = {
      studentId: data.studentId,
      courseIds: courseIds, 
      status: courseStatus
    }
    try{
      await axios.put(`${baseUrl}/student-programs/${data.programId}/courses`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      callback('Berhasil mengubah status mata kuliah')
    } catch (err) {
      console.log(err)
    }
  }

  const courseNames = data.program.courses.map((course) => {
    if(courseIds.includes(course.id)){
      return course.name
    } else return null
  }).filter((course) => course !== null).join(', ')

  return(
    <>
      <Typography variant="body2" color="text.secondary">
        Apakah anda yakin ingin mengubah status konversi mata kuliah 
        <b> {courseNames} </b> 
        menjadi <b> {courseStatus}</b>?
      </Typography>
      <StdSelect
        label="Status"
        value={courseStatus}
        onChange={handleStatusChange}
        items={[
          { id: 'accepted', name: 'Disetujui' },
          { id: 'rejected', name: 'Ditolak' }
        ]} />
      <DialogActions>
        <Button
          onClick={handleUpdateStatus}>
          Simpan
        </Button>
      </DialogActions>
    </>
  )
}

const MyProgram = () => {  
  const { id, studentId } = useParams()
  const user = useOutletContext()
  const navigate = useNavigate()
  const baseUrl = process.env.REACT_APP_API_URL
  const token = secureLocalStorage.getItem('token')
  const [isLoading, setIsLoading] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [studentProgram, setStudentProgram] = useState(null)
  const [studentProgramCourses, setStudentProgramCourses] = useState([])
  const [studentProgramCourse, setStudentProgramCourse] = useState(null)
  const [notAddedCourses, setNotAddedCourses] = useState([])
  const [open, setOpen] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  const [field, setField] = useState(null)
  const [expanded, setExpanded] = useState(false)
  const [totalSks, setTotalSks] = useState(0)
  const [alertStatus, setAlertStatus] = useState('success')
  const [isDeleting, setIsDeleting] = useState(false)
  const [lecturers, setLecturers] = useState([])
  const [lecturer, setLecturer] = useState(null)
  const [checked, setChecked] = useState([])
  const [isConfirming, setIsConfirming] = useState(false)
  const [isInputScore, setIsInputScore] = useState(false)
  const [is404, setIs404] = useState(false)
  const [currentId, setCurrentId] = useState(null)

  const handleChange = (panel) => (event, isExpanded) => {
    if(event.target.className.baseVal === '') return
    if(event.target.dataset?.testid === 'DeleteIcon') return
    if(event.target.type === 'checkbox') return
    setExpanded(isExpanded ? panel : false)
  }

  const handleFetchData = async () => {
    try {
      let query = ``
      if(user.role !== 'student') query = `?studentId=${studentId}`
      else query = `?studentId=${user.id}`
      const response = await axios.get(`${baseUrl}/student-programs/${id}${query}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setStudentProgram(response.data.studentProgram)
      setLecturer(response.data.studentProgram.lecturer)
    } catch (err) {
      setIs404(true)
    }
  }

  const handleFetchLecturers = async () => {
    const response = await axios.get(`${baseUrl}/lecturers`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
    setLecturers(response.data.lecturers)
  }

  const handleFetchStudentProgramCourses = async () => {
    try {
      let query = ``
      if(user.role !== 'student') query = `?studentId=${studentId}`
      const response = await axios.get(`${baseUrl}/student-programs/${id}/courses${query}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setStudentProgramCourses(response.data.studentProgramCourses)
      setTotalSks(response.data.totalSks)
    } catch (err) {
      setIs404(true)
    }
  }

  const handleSetNotAddedCourses = (allData, addedData) => {
    const notAdded = allData.filter((item) => {
      return !addedData.some((item2) => {
        return item2.courseId === item.id
      })
    })
    setNotAddedCourses(notAdded)
  }

  const fetchStudentProgram = async () => {
    setCurrentId(id)
    setIs404(false)
    setIsLoading(true)
    setIsLoaded(false)
    try {
      await handleFetchData()
      await handleFetchStudentProgramCourses()
      await handleFetchLecturers()
    } catch (e) {
      setIs404(true)
    }
    setIsLoading(false)
    setIsLoaded(true)
  }

  const handleFileDownload = async (url) => {
    const newUrl = url + `?token=${token}`
    window.open(newUrl, '_blank')
  }

  const handleUploadFile = async (fieldName) => {
    setField(fieldName)
    setModalOpen()
  }

  const handleAddStudentProgramCourse = async () => {
    if(notAddedCourses.length === 0)
      handleSetNotAddedCourses(studentProgram.program.courses, studentProgramCourses)
    setField(null)
    setModalOpen()
  }

  const setModalOpen = () => {
    setOpen(!open)
  }

  const handleDeleteStudentProgramCourse = async (studentProgramCourse) => {
    setStudentProgramCourse(studentProgramCourse)
    setIsDeleting(true)
    setField(null)
    setModalOpen()
  }

  const handleSetLecturer = (lecturerId) => {
    setLecturer(lecturers.find((lecturer) => lecturer.id === lecturerId))
  }

  const handleConfirmCourse = async () => {
    setIsConfirming(true)
    setIsDeleting(false)
    setField(null)
    setModalOpen()
  }

  const handleCheck = (courseId) => {
    if(checked.includes(courseId)) {
      setChecked(checked.filter((id) => id !== courseId))
    }else{
      const newChecked = [...checked, courseId]
      setChecked(newChecked)
    }
  }

  const handleScoreSubmit = async (e) => {
    e.preventDefault()
    let data = JSON.parse(e.target.data.value)
    let achievementCodes = []
    let scores = []
    data.course.cpmks.forEach(cpmk => {
      achievementCodes.push(cpmk.achievementCode)
      scores.push(e.target[cpmk.achievementCode].value)
    })
    const payload = {
      studentId: data.studentId,
      programId: data.programId,
      courseId: data.courseId,
      achievementCodes: achievementCodes,
      scores: scores
    }

    await axios.put(`${baseUrl}/student-programs/${data.programId}/course-achievements/${data.courseId}`,
      payload,
      { headers: { Authorization: `Bearer ${token}` } }
    )
    await handleFetchStudentProgramCourses()
    setAlertMessage('Berhasil menginput nilai')
    setAlertStatus('success')
    setShowAlert(true)
    setIsInputScore(false)
  }

  const callback = (msg, status = 'success') => {
    setAlertMessage(msg)
    setAlertStatus(status)
    if(status === 'success'){
      setNotAddedCourses([])
      handleFetchData()
      handleFetchStudentProgramCourses()
    }
    setShowAlert(true)
    setOpen(false)
    setIsDeleting(false)
    setField(null)
    setIsConfirming(false)
    setChecked([])
  }

  useEffect(() => {
    if (!isLoaded && !isLoading) fetchStudentProgram()
    else if (
      isLoaded &&
      !is404 &&
      parseInt(studentProgram?.programId) !== parseInt(id))
      fetchStudentProgram()
    else if (is404 && currentId !== id) fetchStudentProgram()
  })

  if (is404) return <NotFoundPage />
  else if (isLoading) {
    return (
      <>Loading</>
    )
  } else if(isLoaded && parseInt(studentProgram.programId) === parseInt(id)) {
    return (
      <Grid container spacing={2}>
        {showAlert &&
          <Grid item xs={12}>
            <Alert severity={alertStatus}>
              <AlertTitle>{capitalize(alertStatus)}</AlertTitle>
              {alertMessage}
            </Alert>
          </Grid>
        }
        <Modal
          open={open}
          setOpen={setModalOpen}
          title={
            field ? "Upload file" : 
            isDeleting ? "Hapus mata kuliah?" : 
            isConfirming ? "Konfirmasi konversi mata kuliah" :
            "Tambah konversi mata kuliah"
          }
          children={
            field ? 
              <UploadFileDetail
                data={studentProgram}
                baseUrl={baseUrl}
                token={token}
                field={field}
                callback={callback} />
            : isDeleting ?
              <DeleteStudentProgramCourse
                data={studentProgramCourse}
                baseUrl={baseUrl}
                token={token}
                callback={callback} />
            : isConfirming ?
              <ConfirmStudentProgramCourse
                data={studentProgram}
                courseIds={checked}
                baseUrl={baseUrl}
                token={token}
                callback={callback} />
            : <AddStudentProgramCourse
                programId={id}
                programCourses={notAddedCourses}
                baseUrl={baseUrl}
                token={token}
                callback={callback} />
          } />
        <Grid item xs={12} md={7} lg={8}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Typography variant='h6'>
              Program Saya - <Link
              href='#'
              underline='none'
              onClick={(e) => {
                e.preventDefault()
                navigate(`/programs/${id}`)
              }}>{ studentProgram.program.name }</Link>
            </Typography>
  
            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <WorkspacePremium />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="Dosen Pembimbing"
                  secondary={
                    lecturer ? lecturer.name : 
                    <Typography variant='body2' color='error'>
                      Belum ada dosen pembimbing
                    </Typography>
                  } />
                <ListItemSecondaryAction>
                  {user.role === 'admin' &&
                    <BasicMenu
                      token={token}
                      baseUrl={baseUrl}
                      callback={callback}
                      lecturers={lecturers}
                      studentProgram={studentProgram}
                      setCallback={handleSetLecturer} />
                  }
                </ListItemSecondaryAction>
              </ListItem>
            </List>
  
            <Typography variant='subtitle2'>
              Konversi Mata Kuliah
            </Typography>
            <Grid container spacing={2} sx={{ marginBottom: 1 }}>
              <Grid item xs={6}>
                <Typography variant='caption'>
                  Total SKS: {totalSks} dari {studentProgram.program.sksCount}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  {user.role === 'student' &&
                    <Button
                      disabled={
                        (totalSks === studentProgram.program.sksCount) ||
                        (studentProgram.status === 'rejected') ||
                        (studentProgram.status === 'accepted' &&
                        !isLater(studentProgram.program.endsAt))
                      }
                      onClick={handleAddStudentProgramCourse}
                      variant='contained'
                      color='primary'
                      size="small" >
                      Tambah Matkul
                    </Button>
                  }{ user.role === 'lecturer' &&
                    <Button
                      disabled={checked.length === 0}
                      onClick={handleConfirmCourse}
                      variant='contained'
                      color='primary'
                      size="small" >
                      Konfirmasi Matkul
                    </Button>
                  }
                </Box>
              </Grid>
            </Grid>
            <Box>
              {studentProgramCourses.map((item, index) => (
                <Accordion
                  key={index}
                  expanded={expanded === item.courseId}
                  onChange={handleChange(item.courseId)}>
                  <AccordionSummary
                    expandIcon={<ExpandMore />}
                    aria-controls="panel1bh-content"
                    id="panel1bh-header"
                  > 
                    {user.role === 'student' &&
                      <IconButton
                        disabled={item.status === 'accepted'}
                        size="small"
                        color="error"
                        onClick={handleDeleteStudentProgramCourse.bind(this, item)}
                        sx={{ ml: -3, mr: 1, mt: -1 }} >
                          <Delete
                            visibility={item.status === 'accepted' ? 'hidden' : 'visible'} />
                      </IconButton>
                    }{user.role === 'lecturer' &&
                      <Checkbox
                        checked={checked.includes(item.courseId)}
                        onChange={handleCheck.bind(this, item.courseId)}
                        inputProps={{ 'aria-label': 'primary checkbox' }}
                        sx={{ ml: -3, mr: 1, mt: -1 }} />
                    }
                    <Typography sx={{ width: '33%', flexShrink: 0 }}>
                      {item.course.name}
                    </Typography>
                    <Chip
                      label={`${item.course.sks} SKS`}
                      color="primary"
                      size="small"
                      sx={{ marginLeft: 2 }}/>
                    <Chip
                      label={
                        item.status === 'proposed' ? 'Diajukan' :
                        item.status === 'accepted' ? 'Disetujui' :
                        'Ditolak'
                      }
                      color={
                        item.status === 'proposed' ? 'secondary' :
                        item.status === 'accepted' ? 'success' :
                        'error'
                      }
                      size="small"
                      sx={{ marginLeft: 1 }}/>
                    <Chip
                      label={`Nilai : ${item.score || '-'}`}
                      color="info"
                      size="small"
                      sx={{ marginLeft: 1 }}/>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant='body2'>
                      Total jam konversi: <b>{moment.duration(item.progress).asHours().toFixed(2)} jam</b> dari <b>{moment.duration(item.timeNeeded).asHours().toFixed(2)} jam</b>
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={ (item.progress/item.timeNeeded)*100 } 
                      sx={{ width: '100%', marginTop: 1 }} />
                      
                    <Grid container spacing={2} sx={{ marginTop: 1 }}>
                      <Grid item xs={6}>
                        <Typography variant='body1'>
                          Daftar CPMK:
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                          <Button
                            onClick={
                              () => {
                                let action = user.role === 'lecturer' ?
                                setIsInputScore(item.courseId) :
                                null
                                return action
                              }
                            }>
                            Nilai
                          </Button>
                        </Box>
                      </Grid>
                    </Grid>
                      
                    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                      <form onSubmit={handleScoreSubmit}>
                        {item.course?.cpmks?.map((cpmk, index) => (
                          <ListItem
                            sx={{ padding: 0}}
                            key={cpmk.achievementCode}>
                            <ListItemIcon>
                              <ArrowRight sx={{ padding: 0 }} />
                            </ListItemIcon>
                            <ListItemText
                              primary={`${cpmk.achievementCode} - ${cpmk.cpmk.title}`}
                              secondary={`Bobot penilaian: ${cpmk.cpmk.weight}`} >
                            </ListItemText>
                            <ListItemText sx={{ textAlign: 'right' }}>
                              { (isInputScore === item.courseId && user.role === 'lecturer') &&
                                <TextField
                                  name={cpmk.achievementCode}
                                  autoComplete='off'
                                  sx={{ width: '52px', paddingRight: 1 }}
                                  variant='standard'
                                  size='small'
                                  defaultValue={cpmk.score}
                                  type='number' />
                              }
                              { isInputScore !== item.courseId &&
                                <Typography variant='overline'>
                                  { cpmk.score || '-' }
                                </Typography>
                              }
                            </ListItemText>
                          </ListItem>
                        ))}
                        { isInputScore === item.courseId &&
                          <Box sx={{
                            display: 'flex',
                            marginTop: 2,
                            marginBottom: 0,
                            justifyContent: 'flex-end' }}>
                            <Button onClick={() => setIsInputScore(null) }>Batal</Button>
                            <Button
                              value={JSON.stringify(item)}
                              name='data'
                              type='submit'>Simpan</Button>
                          </Box>
                        }
                      </form>
                    </List>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={5} lg={4}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Paper
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <Typography variant='h6'>
                  Status
                </Typography>
                { studentProgram.status === 'applied' &&
                  <>
                    <Chip label="Terdaftar" color="secondary" size="small" sx={{ marginTop: 1 }}/>
                    <Typography variant='caption' align="center">
                      Menunggu persetujuan dari jurusan
                    </Typography>
                  </>
                } { studentProgram.status === 'approved' &&
                  <>
                    <Chip label="Disetujui" color="success" size="small" sx={{ marginTop: 1 }}/>
                    <Typography variant='caption' align="center">
                      Menunggu upload dokumen penerimaan di instansi oleh mahasiswa
                    </Typography>
                  </>
                } { studentProgram.status === 'rejected' &&
                  <>
                    <Chip label="Ditolak" color="error" size="small" sx={{ marginTop: 1 }}/>
                    <Typography variant='caption' align="center">
                      {studentProgram.reason}
                    </Typography>
                  </>
                } { studentProgram.status === 'accepted' && isLater(studentProgram.program.startsAt) &&
                  <>
                    <Chip label="Diterima" color="success" size="small" sx={{ marginTop: 1 }}/>
                    <Typography variant='caption' align="center">
                      Selamat anda diterima di program ini. program ini akan dimulai pada tanggal {formatDate(studentProgram.program.startsAt)}
                    </Typography>
                  </>
                } { studentProgram.status === 'accepted' && isInRange(new Date(), studentProgram.program.startsAt, studentProgram.program.endsAt) &&
                  <>
                    <Chip label="Sedang berlangsung" color="info" size="small" sx={{ marginTop: 1 }}/>
                    <Typography variant='caption' align="center">
                      Program sedang berlangsung.
                    </Typography>
                  </>
                } { studentProgram.status === 'accepted' &&
                  !isLater(studentProgram.program.endsAt) &&
                  <>
                    <Chip label="Selesai" color="primary" size="small" sx={{ marginTop: 1 }}/>
                    <Typography variant='caption' align="center">
                      Program telah berakhir.
                    </Typography>
                  </>
                }
  
                <Typography variant='subtitle2' sx={{ marginTop: 2 }}>
                  Dokumen Rekomendasi PA
                </Typography>
                <Button
                  variant='outlined'
                  color='primary'
                  size="small"
                  onClick={handleFileDownload.bind(this, studentProgram.advisorRecommendationFile)}
                  startIcon={<Download />}>
                  Unduh
                </Button>
  
                <Typography variant='subtitle2' sx={{ marginTop: 2 }}>
                  Dokumen Penerimaan Instansi
                </Typography>
                <Button
                  onClick={
                    ['accepted'].includes(studentProgram.status) ?
                    handleFileDownload.bind(this, studentProgram.acceptanceFile) :
                    handleUploadFile.bind(this, 'acceptanceFile')
                  }
                  disabled={
                    ['applied', 'rejected'].includes(studentProgram.status) ||
                    (['approved'].includes(studentProgram.status) && user.role !== 'student')
                    
                  }
                  variant='outlined'
                  color='primary'
                  size="small"
                  startIcon={
                    ['applied', 'rejected'].includes(studentProgram.status) ? <Lock /> : 
                    ['approved'].includes(studentProgram.status) && user.role !== 'student' ? <Lock /> :
                    ['approved'].includes(studentProgram.status) ? <Upload /> :
                    <Download />
                  }>
                  {
                    ['applied', 'rejected'].includes(studentProgram.status) ? 'Terkunci' :
                    ['approved'].includes(studentProgram.status) && user.role !== 'student' ? 'Terkunci' :
                    ['approved'].includes(studentProgram.status) ? 'Unggah' :
                    'Unduh'
                  }
                </Button>
  
                <Typography variant='subtitle2' sx={{ marginTop: 2 }}>
                  Logbooks
                </Typography>
                <Button
                  onClick={() => {
                    if(user.role === 'student') {
                      navigate(`/logbooks/${studentProgram.programId}`)
                    }else{
                      navigate(`/students/${studentProgram.studentId}/logbooks/${studentProgram.programId}`)
                    }
                  }}
                  disabled={
                    ['applied', 'rejected'].includes(studentProgram.status)
                  }
                  variant='outlined'
                  color='primary'
                  size="small"
                  startIcon={<KeyboardDoubleArrowRight />}>
                  Logbook
                </Button>

                <Typography variant='subtitle2' sx={{ marginTop: 2 }}>
                  Dokumen Laporan Akhir
                </Typography>
                <Button
                  disabled={
                    ['applied', 'rejected'].includes(studentProgram.status) ||
                    !!isLater(studentProgram.program.endsAt)
                  }
                  onClick={
                    studentProgram.completionFile ?
                    handleFileDownload.bind(this, studentProgram.completionFile) :
                    handleUploadFile.bind(this, 'completionFile')
                  }
                  variant='outlined'
                  color='primary'
                  size="small"
                  startIcon={
                    ['applied', 'rejected'].includes(studentProgram.status) ||
                    !!isLater(studentProgram.program.endsAt) ?
                    <Lock /> : !studentProgram.completionFile ?
                    <Upload /> : <Download />
                  }>
                  {
                    ['applied', 'rejected'].includes(studentProgram.status) ||
                    !!isLater(studentProgram.program.endsAt) ?
                    'Terkunci' : !studentProgram.completionFile ?
                    'Unggah' : 'Unduh'
                  }
                </Button>
  
                <Typography variant='subtitle2' sx={{ marginTop: 2 }}>
                  Dokumen Poster
                </Typography>
                <Button
                  disabled={
                    ['applied', 'rejected'].includes(studentProgram.status) ||
                    !!isLater(studentProgram.program.endsAt)
                  }
                  onClick={
                    studentProgram.posterFile ?
                    handleFileDownload.bind(this, studentProgram.posterFile) :
                    handleUploadFile.bind(this, 'posterFile')
                  }
                  variant='outlined'
                  color='primary'
                  size="small"
                  startIcon={
                    ['applied', 'rejected'].includes(studentProgram.status) ||
                    !!isLater(studentProgram.program.endsAt) ?
                    <Lock /> : !studentProgram.posterFile ?
                    <Upload /> : <Download />
                  }>
                  {
                    ['applied', 'rejected'].includes(studentProgram.status) ||
                    !!isLater(studentProgram.program.endsAt) ?
                    'Terkunci' : !studentProgram.posterFile ?
                    'Unggah' : 'Unduh'
                  }
                </Button>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    )
  } else return <></>
}

export default MyProgram