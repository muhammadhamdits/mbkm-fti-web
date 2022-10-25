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
  IconButton
} from '@mui/material'
import {
  Download,
  Lock,
  Upload,
  WorkspacePremium,
  ExpandMore,
  ArrowRight,
  Delete
} from '@mui/icons-material'
import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import secureLocalStorage from 'react-secure-storage'
import Modal from '../components/Modal'
import { formatDate, isLater, isInRange, capitalize } from '../assets/utils'

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

const MyProgram = () => {  
  const { id } = useParams()
  const baseUrl = process.env.REACT_APP_API_URL
  const token = secureLocalStorage.getItem('token')
  const [isLoading, setIsLoading] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [studentProgram, setStudentProgram] = useState(null)
  const [studentProgramCourses, setStudentProgramCourses] = useState([])
  const [notAddedCourses, setNotAddedCourses] = useState([])
  const [open, setOpen] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  const [field, setField] = useState(null)
  const [expanded, setExpanded] = useState(false)
  const [totalSks, setTotalSks] = useState(0)
  const [alertStatus, setAlertStatus] = useState('success')

  const handleChange = (panel) => (event, isExpanded) => {
    if(event.target.className.baseVal === '') return
    setExpanded(isExpanded ? panel : false)
  }

  const handleFetchData = async () => {
    const response = await axios.get(`${baseUrl}/student-programs/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    setStudentProgram(response.data.studentProgram)
  }

  const handleFetchStudentProgramCourses = async () => {
    const response = await axios.get(`${baseUrl}/student-programs/${id}/courses`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    setStudentProgramCourses(response.data.studentProgramCourses)
    setTotalSks(response.data.totalSks)
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
    setIsLoading(true)
    setIsLoaded(false)
    try {
      await handleFetchData()
      await handleFetchStudentProgramCourses()
    } catch (e) {
      console.log(e)
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

  const handleDeleteStudentProgramCourse = async (courseId) => {
    
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
    setModalOpen()
  }

  useEffect(() => {
    if (!isLoaded && !isLoading) fetchStudentProgram()
    else if (isLoaded && parseInt(studentProgram.programId) !== parseInt(id))
      fetchStudentProgram()
  })

  if (isLoading) {
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
          title={field ? "Upload file" : "Tambah konversi mata kuliah"}
          children={
            field ? 
              <UploadFileDetail
                data={studentProgram}
                baseUrl={baseUrl}
                token={token}
                field={field}
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
              Program Saya - { studentProgram.program.name }
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
                  secondary="Husnil Kamil, M.T" />
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
                  <Button
                    disabled={totalSks === studentProgram.program.sksCount}
                    onClick={handleAddStudentProgramCourse}
                    variant='contained'
                    color='primary'
                    size="small" >
                    Tambah Matkul
                  </Button>
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
                    <IconButton
                      size="small"
                      color="error"
                      onClick={handleDeleteStudentProgramCourse.bind(this, item.courseId)}
                      sx={{ ml: -3, mr: 1, mt: -1 }} >
                        <Delete />
                    </IconButton>
                    <Typography sx={{ width: '33%', flexShrink: 0 }}>
                      {item.course.name}
                    </Typography>
                    <Chip
                      label={`${item.course.sks} SKS`}
                      color="primary"
                      size="small"
                      sx={{ marginLeft: 2 }}/>
                    <Chip
                      label="Disetujui"
                      color="success"
                      size="small"
                      sx={{ marginLeft: 1 }}/>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant='body2'>
                      Total jam konversi: <b>24 jam 17 menit</b> dari <b>48 jam</b>
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={ ((24/48)+((17/60)/48))*100 } 
                      sx={{ width: '100%', marginTop: 1 }} />
                    <Typography variant='body1' sx={{ marginTop: 3 }}>
                      Daftar CPMK:
                    </Typography>
                    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                      {item.course?.cpmks?.map((cpmk, index) => (
                        <ListItem sx={{ padding: 0}} key={cpmk.achievementCode}>
                          <ListItemIcon>
                            <ArrowRight sx={{ padding: 0 }} />
                          </ListItemIcon>
                          <ListItemText>
                            <Typography variant='overline'>
                              {cpmk.achievementCode} - {cpmk.title}
                            </Typography>
                          </ListItemText>
                        </ListItem>
                      ))}
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
                      Mohon maaf permohonan pendaftaran anda ditolak. Silakan hubungi jurusan untuk informasi lebih lanjut.
                    </Typography>
                  </>
                } { studentProgram.status === 'accepted' && isLater(studentProgram.program.startsAt) &&
                  <>
                    <Chip label="Diterima" color="success" size="small" sx={{ marginTop: 1 }}/>
                    <Typography variant='caption' align="center">
                      Selamat anda diterima di program ini. program ini akan dimulai pada tanggal {formatDate(studentProgram.program.startsAt)}
                    </Typography>
                  </>
                } { studentProgram.status === 'accepted' && isInRange(new Date(), studentProgram.program.openAt, studentProgram.program.closeAt) &&
                  <>
                    <Chip label="Sedang berlangsung" color="info" size="small" sx={{ marginTop: 1 }}/>
                    <Typography variant='caption' align="center">
                      Program sedang berlangsung.
                    </Typography>
                  </>
                } { studentProgram.status === 'accepted' &&
                  !isLater(new Date(studentProgram.program.closeAt).setDate(new Date(studentProgram.program.closeAt).getDate() + 1)) &&
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
                    ['applied', 'rejected'].includes(studentProgram.status)
                  }
                  variant='outlined'
                  color='primary'
                  size="small"
                  startIcon={
                    ['applied', 'rejected'].includes(studentProgram.status) ? <Lock /> : 
                    ['approved'].includes(studentProgram.status) ? <Upload /> :
                    <Download />
                  }>
                  {
                    ['applied', 'rejected'].includes(studentProgram.status) ? 'Terkunci' :
                    ['approved'].includes(studentProgram.status) ? 'Unggah' :
                    'Unduh'
                  }
                </Button>
  
                <Typography variant='subtitle2' sx={{ marginTop: 2 }}>
                  Dokumen Laporan Akhir
                </Typography>
                <Button disabled variant='outlined' color='primary' size="small" startIcon={<Lock />}>
                  Terkunci
                </Button>
  
                <Typography variant='subtitle2' sx={{ marginTop: 2 }}>
                  Dokumen Poster
                </Typography>
                <Button disabled variant='outlined' color='primary' size="small" startIcon={<Lock />}>
                  Terkunci
                </Button>
  
                <Typography variant='subtitle2' sx={{ marginTop: 2 }}>
                  Rekap Nilai
                </Typography>
                <Button disabled variant='outlined' color='primary' size="small" startIcon={<Lock />}>
                  Terkunci
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