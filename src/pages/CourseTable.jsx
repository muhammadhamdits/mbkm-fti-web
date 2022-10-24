import * as React from 'react'
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
  DialogActions
} from '@mui/material'
import axios from 'axios'
import secureLocalStorage from 'react-secure-storage'
import Modal from '../components/Modal'

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
  const [cpmks, setCpmks] = React.useState([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [isLoaded, setIsLoaded] = React.useState(false)

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
    setCpmks([...cpmks, { achievementCode: '', title: '' }])
  }

  const handleSaveCPMKs = async () => {
    const achievementCodes = cpmks.map(cpmk => cpmk.achievementCode)
    const titles = cpmks.map(cpmk => cpmk.title)
    // const inputs = document.querySelectorAll('input')
    // const achievementCodes = Array.from(inputs).filter((input) => {
    //   if(input.name.includes('achievementCode')) return input.value
    // }).map((input) => input.value)
    // const titles = Array.from(inputs).filter((input) => {
    //   if(input.name.includes('title')) return input.value
    // }).map((input) => input.value)
    try {
      const payload = {achievementCodes, titles}
      await axios.put(`${baseUrl}/courses/${data.id}/achievements`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      callback()
    } catch (error) {
      console.log(error)
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

  React.useEffect(() => {
    if(!isLoaded && !isLoading) fetchCPMKs()
  }, [isLoaded, isLoading])

  if(isLoading) return <div>Loading...</div>
  else{
    return (
      <>
        <Button
          onClick={handleAddInput}
          size="small"
          variant="contained"
          color="primary"
          startIcon={<AddOutlined />}
          sx={{ mb: 2 }} >
          Tambah CPMK
        </Button>
        {cpmks.map((cpmk, index) => (
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
            <Grid item xs={8} key={`${index}-gm`}>
              <TextField
                required
                fullWidth
                label="Nama CPMK"
                variant="standard"
                value={cpmk.title}
                onChange={handleTitleChange.bind(this, index)}
                key={`${index}-nc`} />
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
        ))}
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
  const token = secureLocalStorage.getItem('token')
  const [courses, setCourses] = React.useState([])
  const [course, setCourse] = React.useState({})
  const [isLoading, setIsLoading] = React.useState(false)
  const [isLoaded, setIsLoaded] = React.useState(false)
  const [open, setOpen] = React.useState(false)

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

  React.useEffect(() => {
    if(!isLoaded && !isLoading) fetchCourses()
  }, [isLoaded, isLoading])

  if(isLoading) return <>Loading</>
  else if(isLoaded && courses) {
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
                {courses.map((course, index) => (
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
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    )
  } else  return <>Empty</>
}

export default CourseTable