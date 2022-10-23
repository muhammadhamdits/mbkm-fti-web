import * as React from 'react'
import {
  AddOutlined,
  DeleteOutline,
  EditOutlined,
  Settings
} from '@mui/icons-material'
import {
  Button,
  TextField,
  FormControlLabel,
  Switch,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  DialogActions,
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
  Tooltip
} from '@mui/material'
import axios from 'axios'
import moment from 'moment'
import secureLocalStorage from 'react-secure-storage'
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker'
import Modal from '../components/Modal'
import { isInRange, isLater } from '../assets/utils'

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
        <TableCell align='center'>
          Mata Kuliah
        </TableCell>
        <TableCell align='center'>
          Status
        </TableCell>
        <TableCell align='center'>
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

const AddProgramForm = (props) => {
  const handleSetPrograms = props.setPrograms
  const programTypes = props.programTypes
  const agencies = props.agencies
  const token = secureLocalStorage.getItem('token')
  const baseURL = process.env.REACT_APP_API_URL
  const [programType, setProgramType] = React.useState('')
  const [agency, setAgency] = React.useState('')
  const [placement, setPlacement] = React.useState('')
  const [openAt, setOpenAt] = React.useState(moment())
  const [closeAt, setCloseAt] = React.useState(moment())
  const [startsAt, setStartsAt] = React.useState(moment())
  const [endsAt, setEndsAt] = React.useState(moment())

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
      handleSetPrograms(response.data.program, 'create')
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

const EditProgramForm = (props) => {
  const handleSetPrograms = props.setPrograms
  const program = props.program
  const programTypes = props.programTypes
  const agencies = props.agencies
  const [programType, setProgramType] = React.useState(program.programTypeId)
  const [agency, setAgency] = React.useState(program.agencyId)
  const [placement, setPlacement] = React.useState(program.placement)
  const [openAt, setOpenAt] = React.useState(program.openAt)
  const [closeAt, setCloseAt] = React.useState(program.closeAt)
  const [startsAt, setStartsAt] = React.useState(program.startsAt)
  const [endsAt, setEndsAt] = React.useState(program.endsAt)
  const token = secureLocalStorage.getItem('token')
  const baseUrl = process.env.REACT_APP_API_URL

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
      openAt: moment(startsAt).format('YYYY-MM-DD'),
      closeAt: moment(endsAt).format('YYYY-MM-DD'),
      startsAt: moment(startsAt).format('YYYY-MM-DD'),
      endsAt: moment(endsAt).format('YYYY-MM-DD'),
      description: event.target.description.value,
      sksCount: event.target.sksCount.value,
      minTerms: event.target.minTerms.value,
      isCertified: event.target.isCertified.checked
    }

    try {
      const response = await axios.put(`${baseUrl}/programs/${program.id}`, params, {
        headers: { Authorization: `Bearer ${token}` }
      })
      handleSetPrograms(response.data.program, 'update')
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <form onSubmit={saveProgram}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField 
            fullWidth 
            margin="dense" 
            variant="standard" 
            label="Nama Program" 
            defaultValue={program.name}
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
            defaultValue={program.description}
            name='description' />
          <TextField
            fullWidth
            margin="dense"
            variant="standard"
            label="SKS"
            defaultValue={program.sksCount}
            name='sksCount' />
          <TextField
            fullWidth
            margin="dense"
            variant="standard"
            label="Minimal Semseter"
            defaultValue={program.minTerms}
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
            control={<Switch color="primary" name='isCertified' defaultChecked={program.isCertified} />}
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
  )
}

const DeleteProgramForm = (props) => {
  const handleSetPrograms = props.setPrograms
  const token = secureLocalStorage.getItem('token')
  const baseUrl = process.env.REACT_APP_API_URL
  const id = props.id

  const handleDelete = async () => {
    try {
      const response = await axios.delete(`${baseUrl}/programs/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      handleSetPrograms(id, 'delete')
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="subtitle2" gutterBottom>
            Apakah anda yakin ingin menghapus program ini?
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

const StatusProgramForm = (props) => {
  const { program, callback } = props
  const token = secureLocalStorage.getItem('token')
  const baseUrl = process.env.REACT_APP_API_URL
  const [statusProgram, setStatusProgram] = React.useState(program.status)

  const handleSetStatusProgram = (e) => {
    setStatusProgram(e.target.value)
  }

  const handleUpdateStatus = async () => {
    try {
      const response = await axios.put(`${baseUrl}/programs/${program.id}`,
        { status: statusProgram },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      callback(response.data.program, 'status')
    } catch (error) {
      console.log(error)
    }
  }

  return(
    <>
      <Typography variant="subtitle2" gutterBottom>
        Konfirmasi status usulan program
      </Typography>
      <FormControl fullWidth margin="normal" variant="standard">
        <InputLabel>Status Program</InputLabel>
        <Select
          required
          fullWidth
          value={statusProgram}
          onChange={handleSetStatusProgram} >
          <MenuItem key='proposed' value='proposed' disabled>Diajukan</MenuItem>
          <MenuItem key='approved' value='approved'>Disetujui</MenuItem>
          <MenuItem key='rejected' value='rejected'>Ditolak</MenuItem>
        </Select>
      </FormControl>
      <DialogActions>
        <Button
          disabled={statusProgram === 'proposed'}
          onClick={handleUpdateStatus}>
          Simpan
        </Button>
      </DialogActions>
    </>
  )
}

const ProgramTable = () => {
  const baseUrl = process.env.REACT_APP_API_URL
  const [isLoading, setIsLoading] = React.useState(false)
  const [isLoaded, setIsLoaded] = React.useState(false)
  const [programs, setPrograms] = React.useState([])
  const [open, setOpen] = React.useState(false)
  const [editOpen, setEditOpen] = React.useState(false)
  const [deleteOpen, setDeleteOpen] = React.useState(false)
  const [statusOpen, setStatusOpen] = React.useState(false)
  const [editProgram, setEditProgram] = React.useState(null)
  const [deleteId, setDeleteId] = React.useState(null)
  const [agencies, setAgencies] = React.useState([])
  const [programTypes, setProgramTypes] = React.useState([])
  const token = secureLocalStorage.getItem('token')

  const fetchProgramTypes = async () => {
    setIsLoading(true)
    try {
      const response = await axios.get(`${baseUrl}/program-types`, {
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
      const response = await axios.get(`${baseUrl}/agencies`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setAgencies(response.data.agencies)
    } catch (error) {
      console.log(error)
    }
    setIsLoading(false)
  }

  const setEditModalOpen = () => {
    setEditOpen(!editOpen)
  }

  const setSelectedEditProgram = (program) => {
    setEditProgram(program)
    setEditModalOpen()
  }

  const setDeleteModalOpen = () => {
    setDeleteOpen(!deleteOpen)
  }

  const handleDeleteProgram = (id) => {
    setDeleteId(id)
    setDeleteModalOpen()
  }

  const setChildOpen = () => {
    setOpen(!open)
  }

  const fetchData = async () => {
    setIsLoading(true)
    const response = await axios.get(`${baseUrl}/programs`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    setPrograms(response.data.programs)
    setIsLoading(false)
  }

  const handleSetPrograms = (program, state) => {
    if (state === 'create') {
      setPrograms([...programs, program])
      setChildOpen()
    } else if (state === 'update' || state === 'status') {
      const newPrograms = programs.map(item => {
        if (item.id === program.id) {
          return program
        }
        return item
      })
      setPrograms(newPrograms)
      if(state === 'update') setEditModalOpen()
      else setStatusOpen()
    } else if (state === 'delete') {
      const newPrograms = programs.filter(item => item.id !== program)
      setPrograms(newPrograms)
      setDeleteModalOpen()
    }
  }

  const handleStatusChange = async (program) => {
    if(program.status === 'proposed'){
      setEditProgram(program)
      setStatusModalOpen()
    }
  }

  const setStatusModalOpen = () => {
    setStatusOpen(!statusOpen)
  }

  React.useEffect(() => {
    if(!isLoaded) {
      fetchAgencies()
      fetchProgramTypes()
      fetchData()  
      setIsLoaded(true)
    }
  }, [isLoaded])

  if(isLoading) return <>Loading</>
  else if(isLoaded && !isLoading) {
    return (
      <Box sx={{ width: '100%' }}>
        <Modal
          open={open}
          setOpen={setChildOpen}
          title="Tambah data program"
          children={
            <AddProgramForm
              agencies={agencies}
              programTypes={programTypes}
              setPrograms={handleSetPrograms} />
          } />
        <Modal
          open={editOpen}
          setOpen={setEditModalOpen}
          title="Update data program"
          children={
            <EditProgramForm
              program={editProgram}
              agencies={agencies}
              programTypes={programTypes}
              setPrograms={handleSetPrograms} />
          } />
        <Modal
          open={deleteOpen}
          setOpen={setDeleteModalOpen}
          title="Hapus data program?"
          children={
            <DeleteProgramForm
              id={deleteId}
              setPrograms={handleSetPrograms} />
          } />
        <Modal
          open={statusOpen}
          setOpen={setStatusModalOpen}
          title="Ubah status program"
          children={
            <StatusProgramForm
              program={editProgram}
              callback={handleSetPrograms} />
          } />
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
                    <TableCell align='center'>
                      <IconButton
                        color='secondary'
                        onClick={() => {}} >
                        <Settings />
                      </IconButton>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant='contained'
                        onClick={handleStatusChange.bind(this, program)}
                        color={
                          program.status === 'proposed' ? 'secondary' :
                          program.status === 'rejected' ? 'error' :
                          isInRange(new Date(), program.startsAt, program.endsAt) ||
                          !isLater(program.endsAt) ? 'primary' :
                          'success'
                        }
                        size='small'>
                        {
                          program.status === 'proposed' ? 'Diajukan' :
                          program.status === 'rejected' ? 'Ditolak' :
                          isInRange(new Date(), program.startsAt, program.endsAt) ? 'Sedang berlangsung' :
                          !isLater(program.endsAt) ? 'Selesai' :
                          'Aktif'
                        }
                      </Button>
                    </TableCell>
                    <TableCell align='center'>
                      <IconButton
                        color='warning'
                        onClick={setSelectedEditProgram.bind(this, program)}>
                        <EditOutlined />
                      </IconButton>
                      <IconButton
                        color='error'
                        onClick={handleDeleteProgram.bind(this, program.id)}>
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
  }
}

export default ProgramTable