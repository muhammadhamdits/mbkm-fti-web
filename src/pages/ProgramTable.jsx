import * as React from 'react'
import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { AddOutlined, ContentPasteSearchOutlined, DeleteOutline, EditOutlined, Label } from '@mui/icons-material'
import { Button, TextField, FormControlLabel, Switch, Select, MenuItem, FormControl, InputLabel, Grid, DialogActions } from '@mui/material'
import axios from 'axios'
import secureLocalStorage from 'react-secure-storage'
import Modal from '../components/Modal'
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker'
import moment from 'moment'
import { useOutletContext } from 'react-router-dom'

const EnhancedTableHead = () => {
  return (
    <TableHead>
      <TableRow>
        <TableCell >
          #
        </TableCell>
        <TableCell>
          Nama Program
        </TableCell>
        <TableCell >
          Jenis Program
        </TableCell>
        <TableCell >
          Nama Instansi
        </TableCell>
        <TableCell >
          Status
        </TableCell>
        <TableCell >
          Action
        </TableCell>
      </TableRow>
    </TableHead>
  )
}

const EnhancedTableToolbar = (props) => {
  const setOpen = props.setOpen

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
        Daftar Program
      </Typography>
      <Tooltip title="Tampah Program">
        <IconButton color="primary" onClick={setOpen}>
          <AddOutlined />
          <Typography variant="button" sx={{ ml: 1 }}>
            Tambah
          </Typography>
        </IconButton>
      </Tooltip>
    </Toolbar>
  )
}

const AddProgramForm = () => {
  const user = useOutletContext()
  const token = secureLocalStorage.getItem('token')
  const baseURL = process.env.REACT_APP_API_URL
  const [programTypes, setProgramTypes] = React.useState([])
  const [agencies, setAgencies] = React.useState([])
  const [programType, setProgramType] = React.useState('')
  const [agency, setAgency] = React.useState('')
  const [placement, setPlacement] = React.useState('')
  const [openAt, setOpenAt] = React.useState(moment())
  const [closeAt, setCloseAt] = React.useState(moment())
  const [startsAt, setStartsAt] = React.useState(moment())
  const [endsAt, setEndsAt] = React.useState(moment())
  const [isLoading, setIsLoading] = React.useState(false)
  
  const fetchProgramTypes = async () => {
    setIsLoading(true)
    try {
      const response = await axios.get(`${baseURL}/program-types`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setProgramTypes(response.data.programTypes)
    } catch (error) {
      console.log(error)
    }
    setIsLoading(false)
  }

  const fetchAgencies = async () => {
    setIsLoading(true)
    try {
      const response = await axios.get(`${baseURL}/agencies`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setAgencies(response.data.agencies)
    } catch (error) {
      console.log(error)
    }
    setIsLoading(false)
  }

  React.useEffect(() => {
    if(!isLoading && !programTypes.length) fetchProgramTypes()
    if(!isLoading && !agencies.length) fetchAgencies()
  }, [isLoading, programTypes, agencies])

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
      const response = await axios.post(`${baseURL}/programs`, params, {
        headers: { Authorization: `Bearer ${token}` }
      })
      console.log(response)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <form onSubmit={saveProgram}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField 
              fullWidth 
              margin="dense" 
              variant="standard" 
              label="Nama Program" 
              name='name' />
            <FormControl fullWidth margin="dense" variant="standard">
              <InputLabel>Jenis Program</InputLabel>
              <Select
                fullWidth
                value={programType}
                onChange={handleProgramTypeChange} >
                {programTypes.map((programType) => (
                  <MenuItem key={programType.id} value={programType.id}>{programType.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="dense" variant="standard">
              <InputLabel>Instansi</InputLabel>
              <Select
                fullWidth
                value={agency}
                onChange={handleAgencyChange} >
                {agencies.map((agency) => (
                  <MenuItem key={agency.id} value={agency.id}>{agency.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              margin="dense"
              variant="standard"
              label="Deskripsi"
              multiline
              maxRows={2}
              name='description' />
            <TextField
              fullWidth
              margin="dense"
              variant="standard"
              label="SKS"
              name='sksCount' />
            <TextField
              fullWidth
              margin="dense"
              variant="standard"
              label="Minimal Semseter"
              name='minTerms' />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth margin="dense" variant="standard">
              <InputLabel>Penempatan</InputLabel>
              <Select
                fullWidth
                value={placement}
                onChange={handlePlacementChange} >
                <MenuItem value="onsite">Onsite</MenuItem>
                <MenuItem value="remote">Remote</MenuItem>
                <MenuItem value="hybrid">Hybrid</MenuItem>
              </Select>
            </FormControl>
            <MobileDatePicker
              label="Registration Open Date"
              inputFormat="DD MMMM YYYY"
              value={openAt}
              onChange={handleOpenAtChange}
              renderInput={(params) => <TextField fullWidth margin="dense" variant="standard" {...params} />}
            />
            <MobileDatePicker
              label="Registration Close Date"
              inputFormat="DD MMMM YYYY"
              value={closeAt}
              onChange={handleCloseAtChange}
              renderInput={(params) => <TextField fullWidth margin="dense" variant="standard" {...params} />}
            />
            <MobileDatePicker
              label="Start Date"
              inputFormat="DD MMMM YYYY"
              value={startsAt}
              onChange={handleStartsAtChange}
              renderInput={(params) => <TextField fullWidth margin="dense" variant="standard" {...params} />}
            />
            <MobileDatePicker
              label="Ends Date"
              inputFormat="DD MMMM YYYY"
              value={endsAt}
              onChange={handleEndsAtChange}
              renderInput={(params) => <TextField fullWidth margin="dense" variant="standard" {...params} />}
            />
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

const ProgramTable = () => {
  const baseUrl = process.env.REACT_APP_API_URL
  const [isLoading, setIsLoading] = React.useState(false)
  const [programs, setPrograms] = React.useState([])
  const [open, setOpen] = React.useState(false)

  const setChildOpen = () => {
    setOpen(!open)
  }

  const fetchData = async () => {
    setIsLoading(true)
    const response = await axios.get(`${baseUrl}/programs`, {
      headers: { Authorization: `Bearer ${secureLocalStorage.getItem('token')}` }
    })
    setPrograms(response.data.programs)
    setIsLoading(false)
  }

  React.useEffect(() => {
    if(!isLoading && !programs.length) fetchData()
  }, [isLoading, programs])

  if(isLoading) return <h1>Loading...</h1>
  else if(programs.length) {
    return (
      <Box sx={{ width: '100%' }}>
        <Modal
          open={open}
          setOpen={setChildOpen}
          title="Tambah data program"
          children={<AddProgramForm />} />
        <Paper sx={{ width: '100%', mb: 2, paddingX: 2, paddingY: 1 }}>
          <EnhancedTableToolbar setOpen={setChildOpen} />
          <TableContainer>
            <Table
              sx={{ minWidth: 750 }}
              aria-labelledby="tableTitle"
              size="small"
            >
              <EnhancedTableHead />
              <TableBody>
                {programs.map((program, index) => (
                  <TableRow hover key={program.id}>
                    <TableCell>{ (index++)+1 }</TableCell>
                    <TableCell>{ program.name }</TableCell>
                    <TableCell>{ program.programType.name }</TableCell>
                    <TableCell>{ program.agency.name }</TableCell>
                    <TableCell>
                      <Button variant='contained' color='success' size='small'>
                        Aktif
                      </Button>
                    </TableCell>
                    <TableCell>
                      <IconButton color='warning'>
                        <EditOutlined />
                      </IconButton>
                      <IconButton color='error'>
                        <DeleteOutline />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    )
  } else return <></>
}

export default ProgramTable