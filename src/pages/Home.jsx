import { useEffect, useState } from 'react'
import {
  Paper,
  Grid,
  Fab,
  TextField,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  FormControlLabel,
  Switch,
  DialogActions,
  Button,
  Alert,
  AlertTitle
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import Card from '../components/Card'
import Modal from '../components/Modal'
import { delay } from '../assets/utils'
import { useOutletContext } from 'react-router-dom'
import secureLocalStorage from 'react-secure-storage'
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker'
import axios from 'axios'
import moment from 'moment'

const StdTextField = (props) => {
  return (
    <TextField
      required
      name={props.name}
      label={props.label}
      defaultValue={props.value}
      fullWidth
      variant="standard"
      margin="normal" />
  )
}

const MlTextField = (props) => {
  return (
    <TextField
      required
      name={props.name}
      label={props.label}
      defaultValue={props.value}
      fullWidth
      multiline
      maxRows={props.rows}
      variant="standard"
      margin="normal" />
  )
}

const StdSelect = (props) => {
  return(
    <FormControl fullWidth margin="normal" variant="standard">
      <InputLabel>{props.label}</InputLabel>
      <Select
        fullWidth
        value={props.value}
        onChange={props.onChange} >
        {props.items.map((item) => (
          <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

const StdDatePick = (props) => {
  return (
    <MobileDatePicker
      label={props.label}
      inputFormat="DD MMMM YYYY"
      value={props.value}
      onChange={props.onChange}
      renderInput={(params) => <TextField fullWidth margin="normal" variant="standard" {...params} />}
    />
  )
}

const AddProgramForm = (props) => {
  const programTypes = props.programTypes
  const agencies = props.agencies
  const callback = props.callback
  const token = secureLocalStorage.getItem('token')
  const baseURL = process.env.REACT_APP_API_URL
  const placements = [
    {id: 'remote', name: 'Remote'},
    {id: 'onsite', name: 'Onsite'},
    {id: 'hybrid', name: 'Hybrid'}
  ]
  const [programType, setProgramType] = useState('')
  const [agency, setAgency] = useState('')
  const [placement, setPlacement] = useState('')
  const [openAt, setOpenAt] = useState(moment())
  const [closeAt, setCloseAt] = useState(moment())
  const [startsAt, setStartsAt] = useState(moment())
  const [endsAt, setEndsAt] = useState(moment())

  const handleProgramTypeChange = (event) => {
    setProgramType(event.target.value)
  }

  const handleAgencyChange = (event) => {
    setAgency(event.target.value)
  }

  const handlePlacementChange = (event) => {
    setPlacement(event.target.value)
  }

  const handleOpenAtChange = (date) => {
    setOpenAt(date)
  }

  const handleCloseAtChange = (date) => {
    setCloseAt(date)
  }

  const handleStartsAtChange = (date) => {
    setStartsAt(date)
  }

  const handleEndsAtChange = (date) => {
    setEndsAt(date)
  }

  const saveProgram = async (event) => {
    event.preventDefault()
    const params = {
      name: event.target.name.value,
      programTypeId: programType,
      agencyId: agency,
      placement: placement,
      isCertified: event.target.isCertified.checked,
      startsAt: moment(startsAt).format('YYYY-MM-DD'),
      endsAt: moment(endsAt).format('YYYY-MM-DD'),
      openAt: moment(openAt).format('YYYY-MM-DD'),
      closeAt: moment(closeAt).format('YYYY-MM-DD'),
      description: event.target.description.value,
      minTerms: event.target.minTerms.value,
      sksCount: event.target.sksCount.value
    }

    try {
      await axios.post(`${baseURL}/programs`, params, {
        headers: { Authorization: `Bearer ${token}` }
      })
      callback()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <form onSubmit={saveProgram}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <StdTextField name="name" label="Nama Program" />
            <StdSelect
              label="Jenis Program"
              value={programType}
              onChange={handleProgramTypeChange}
              items={programTypes} />
            <StdSelect
              label="Instansi"
              value={agency}
              onChange={handleAgencyChange}
              items={agencies} />
            <MlTextField name="description" label="Deskripsi" rows='4' />
            <StdTextField name="sksCount" label="SKS" />
            <StdTextField name="minTerms" label="Minimal Semester" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <StdSelect
              label="Penempatan"
              value={placement}
              onChange={handlePlacementChange}
              items={placements} />
            <StdDatePick
              label="Tanggal Buka Pendaftaran"
              value={openAt}
              onChange={handleOpenAtChange} />
            <StdDatePick
              label="Tanggal Tutup Pendaftaran"
              value={closeAt}
              onChange={handleCloseAtChange} />
            <StdDatePick
              label="Tanggal Mulai Program"
              value={startsAt}
              onChange={handleStartsAtChange} />
            <StdDatePick
              label="Tanggal Selesai Program"
              value={endsAt}
              onChange={handleEndsAtChange} />
            <FormControlLabel
              sx={{ mx: 0, mt: 2, width: '100%', display: 'flex', justifyContent: 'space-between' }}
              control={<Switch color="primary" name='isCertified' />}
              label="Bersertifikat"
              labelPlacement="start"
            />
          </Grid>
        </Grid>
        <DialogActions>
          <Button type="submit">
            Simpan
          </Button>
        </DialogActions>
      </form>
    </>
  )
}

const Home = () => {
  const user = useOutletContext()
  const baseUrl = process.env.REACT_APP_API_URL
  const token = secureLocalStorage.getItem('token')
  const [programs, setPrograms] = useState([])
  const [programTypes, setProgramTypes] = useState([])
  const [agencies, setAgencies] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [open, setOpen] = useState(false)
  const [showAlert, setShowAlert] = useState(false)

  const getAxios = async (endpoint) => {
    try {
      const res = await axios.get(`${baseUrl}/${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      return res.data
    } catch (error) {
      console.log(error)
    }
  }

  const fetchPrograms = async () => {
    setIsLoading(true)
    try {
      const resProTypes = await getAxios('program-types')
      const resAgencies = await getAxios('agencies')
      const response = await getAxios('programs')
      setProgramTypes(resProTypes.programTypes)
      setAgencies(resAgencies.agencies)
      setPrograms(response.programs)
    } catch (e) {
      console.log(e)
    }
    setIsLoading(false)
    setIsLoaded(true)
  }

  const setModalOpen = () => {
    setOpen(!open)
  }

  const callback = async () => {
    setModalOpen()
    setShowAlert(true)
    await delay(24000)
    setShowAlert(false)
  }

  useEffect(() => {
    if (!isLoaded) fetchPrograms()
  })

  if(isLoading) return <div>Loading...</div>
  else if(programs.length){
    return (
      <>
        {showAlert &&
          <Alert severity="success">
            <AlertTitle>Sukses</AlertTitle>
            Kamu telah berhasil mengusulkan program! Kamu akan mendapatkan notifikasi jika program telah disetujui atau ditolak.
          </Alert>
        }
        <Modal
          open={open}
          setOpen={setModalOpen}
          title="Usulkan program baru"
          children={
            <AddProgramForm
              agencies={agencies}
              programTypes={programTypes}
              callback={callback} />
          } />
        {user.role === 'student' && 
          <Fab
            onClick={setModalOpen}
            variant="extended"
            size="medium"
            color="primary"
            aria-label="add"
            sx={{
              margin: 0,
              top: 'auto',
              right: 32,
              bottom: 32,
              left: 'auto',
              position: 'fixed',
              paddingRight: 2,
              paddingLeft: 1
            }}>
            <AddIcon sx={{ mr: 1 }} />
            Usulkan Program
          </Fab>
        }
        <Paper
          sx={{
            p: 2,
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Grid container spacing={2} alignItems="stretch">
            { programs.map((program, index) => (
              program.status === 'approved' &&
              <Grid item xs={12} md={6} lg={4} key={index}>
                <Card program={program} />
              </Grid>
            )) }
          </Grid>
        </Paper>
      </>
    )
  } else return <>Empty</>
}

export default Home