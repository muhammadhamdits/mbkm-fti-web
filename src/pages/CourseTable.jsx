import { useState } from 'react'
import {
  AddOutlined,
  Delete,
  Edit,
  Sync
} from '@mui/icons-material'
import {
  Button,
  Grid,
  TextField,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Toolbar,
  Typography,
  Paper,
  IconButton,
  Tooltip,
  DialogActions,
  Alert,
  AlertTitle
} from '@mui/material'
import axios from 'axios'
import secureLocalStorage from 'react-secure-storage'
import { useOutletContext } from 'react-router-dom'
import Modal from '../components/Modal'
import { capitalize } from '../assets/utils'
import NotFoundPage from './404'

const EnhancedTableHead = () => {
  return (
    <TableHead>
      <TableRow>
        <TableCell >
          #
        </TableCell>
        <TableCell>
          Mata Kuliah
        </TableCell>
        <TableCell >
          SKS
        </TableCell>
        <TableCell >
          Action
        </TableCell>
      </TableRow>
    </TableHead>
  )
}

const EnhancedTableToolbar = () => {
  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 }
      }}
    >
      <Typography
        sx={{ flex: '1 1 100%' }}
        variant="h6"
        id="tableTitle"
        component="div"
      >
        Daftar Mata Kuliah
      </Typography>
      <Tooltip title="Tampah Program">
        <IconButton color="primary">
          <Sync />
          <Typography variant="button" sx={{ ml: 1 }}>
            Sync Matkul
          </Typography>
        </IconButton>
      </Tooltip>
    </Toolbar>
  )
}

const CPMKList = (props) => {
  const { data, baseUrl, token, callback } = props
  const [cpmks, setCpmks] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [alertMsg, setAlertMsg] = useState('')
  const [alertSeverity, setAlertSeverity] = useState('error')

  const fetchCPMKs = async () => {
    setIsLoading(true)
    try {
      const response = await axios.get(`${baseUrl}/courses/${data.id}/achievements`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setCpmks(response.data.achievements)
    } catch (error) {
      console.log(error)
    }
    setIsLoading(false)
    setIsLoaded(true)
  }

  const handleAddInput = (e) => {
    setCpmks([...cpmks, { achievementCode: '', title: '', weight: 0 }])
  }

  const handleSaveCPMKs = async () => {
    const achievementCodes = cpmks.map(cpmk => cpmk.achievementCode)
    const titles = cpmks.map(cpmk => cpmk.title)
    const weights = cpmks.map(cpmk => cpmk.weight)
    const weightTotal = weights.reduce((a, b) => parseInt(a) + parseInt(b), 0)
    if (weightTotal !== 100) {
      handleAlert('Total bobot harus 100', 'error')
    } else {
      try {
        const payload = {achievementCodes, titles, weights}
        await axios.put(`${baseUrl}/courses/${data.id}/achievements`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        callback()
      } catch (error) {
        console.log(error)
      }
    }
  }

  const removeCPMK = (index) => {
    const newCPMKs = cpmks.filter((cpmk, i) => i !== index)
    setCpmks(newCPMKs)
  }

  const handleCodeChange = (index, e) => {
    const newCPMKs = [...cpmks]
    newCPMKs[index].achievementCode = e.target.value
    setCpmks(newCPMKs)
  }

  const handleTitleChange = (index, e) => {
    const newCPMKs = [...cpmks]
    newCPMKs[index].title = e.target.value
    setCpmks(newCPMKs)
  }

  const handleWeightChange = (index, e) => {
    const newCPMKs = [...cpmks]
    newCPMKs[index].weight = e.target.value
    setCpmks(newCPMKs)
  }

  const handleAlert = (msg, severity) => {
    setAlertMsg(msg)
    setAlertSeverity(severity)
    setShowAlert(true)
  }

  
  if(isLoading) return <div>Loading...</div>
  else if(!isLoaded && !isLoading) fetchCPMKs()
  else{
    return (
      <>
        {showAlert &&
          <Alert severity={alertSeverity}>
            <AlertTitle>{capitalize(alertSeverity)}</AlertTitle>
            {alertMsg}
          </Alert>
        }
        <DialogActions sx={{ marginY: 0 }}>
          <Button
            onClick={handleAddInput}
            size="small"
            variant="contained"
            color="primary"
            startIcon={<AddOutlined />}
            sx={{ mb: 2, mt: 0 }} >
            Tambah CPMK
          </Button>
        </DialogActions>
        {
          cpmks.length > 0 ?
          cpmks.map((cpmk, index) => (
            <Grid container spacing={2} key={`${index}-gc`} sx={{ mb: 1 }}>
              <Grid item xs={3} key={`${index}-gl`}>
                <TextField
                  required
                  fullWidth
                  label="Kode CPMK"
                  variant="standard"
                  value={cpmk.achievementCode}
                  onChange={handleCodeChange.bind(this, index)}
                  key={`${index}-kc`} />
              </Grid>
              <Grid item xs={6} key={`${index}-gml`}>
                <TextField
                  required
                  fullWidth
                  label="Nama CPMK"
                  variant="standard"
                  value={cpmk.title}
                  onChange={handleTitleChange.bind(this, index)}
                  key={`${index}-nc`} />
              </Grid>
              <Grid item xs={2} key={`${index}-gmr`}>
                <TextField
                  required
                  fullWidth
                  label="Bobot"
                  variant="standard"
                  value={cpmk.weight}
                  onChange={handleWeightChange.bind(this, index)}
                  key={`${index}-bc`} />
              </Grid>
              <Grid item xs={1} key={`${index}-gr`} >
                <IconButton
                  sx={{ paddingTop: 2, paddingLeft: 0 }}
                  color="error"
                  key={`${index}-ic`}
                  onClick={removeCPMK.bind(this, index)} >
                    <Delete />
                </IconButton>
              </Grid>
            </Grid>
          )) :
          <Grid container spacing={2} sx={{ mb: 1, minWidth: '360px' }}>
            <Grid item xs={12} key="0-gc">
              <Typography variant="body2" color="text.secondary" align="center">
                Belum ada CPMK
              </Typography>
            </Grid>
          </Grid>
        }
        <DialogActions>
          <Button
            onClick={handleSaveCPMKs} >
            Simpan
          </Button>
        </DialogActions>
      </>
    )
  }
}

const CourseTable = () => {
  const baseUrl = process.env.REACT_APP_API_URL
  const user = useOutletContext()
  const token = secureLocalStorage.getItem('token')
  const [courses, setCourses] = useState([])
  const [course, setCourse] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [open, setOpen] = useState(false)

  const fetchCourses = async () => {
    setIsLoading(true)
    try {
      const response = await axios.get(`${baseUrl}/courses`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setCourses(response.data.courses)
    } catch (error) {
      console.log(error)
    }
    setIsLoading(false)
    setIsLoaded(true)
  }

  const setModalOpen = () => {
    setOpen(!open)
  }

  const handleCPMKClick = (course) => {
    setCourse(course)
    setModalOpen()
  }

  const callback = () => {
    setModalOpen()
  }

  
  if(user?.role !== 'admin') return <NotFoundPage />
  else if(!isLoaded && !isLoading) fetchCourses()
  else if(isLoading) return <>Loading</>
  else if(isLoaded) {
    return (
      <Box sx={{ width: '100%' }}>
        <Modal
          open={open}
          setOpen={setModalOpen}
          title="Daftar CPMK"
          children={
            <CPMKList
              data={course}
              baseUrl={baseUrl}
              token={token}
              callback={callback} />
          } />
        <Paper sx={{ width: '100%', mb: 2, paddingX: 2, paddingY: 1 }}>
          <EnhancedTableToolbar />
          <TableContainer>
            <Table
              sx={{ minWidth: 750 }}
              aria-labelledby="tableTitle"
              size="small"
            >
              <EnhancedTableHead />
              <TableBody>
                { 
                  courses.length > 0 ?
                  courses.map((course, index) => (
                    <TableRow hover key={course.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{course.name}</TableCell>
                      <TableCell>{course.sks} SKS</TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          color="primary"
                          size="small"
                          onClick={handleCPMKClick.bind(this, course)}
                          startIcon={<Edit />}>
                          CPMK
                        </Button>
                      </TableCell>
                    </TableRow>
                  )) :
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      Tidak ada data
                    </TableCell>
                  </TableRow>
                }
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    )
  }
}

export default CourseTable