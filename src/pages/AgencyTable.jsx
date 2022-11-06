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
import { Add, Delete, Edit } from '@mui/icons-material'
import Modal from '../components/Modal'
import axios from 'axios'
import secureLocalStorage from 'react-secure-storage'
import { useOutletContext } from 'react-router-dom'
import { DialogActions, Grid, TextField, Button } from '@mui/material'
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
          Nama Instansi
        </TableCell>
        <TableCell >
          Alamat
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
        Daftar Instansi
      </Typography>
      <Tooltip title="Tampah Instansi">
        <IconButton color="primary" onClick={setOpen}>
          <Add />
          <Typography variant="button" sx={{ ml: 1 }}>
            Tambah
          </Typography>
        </IconButton>
      </Tooltip>
    </Toolbar>
  )
}

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

const AgencyForm = (props) => {
  const { action, data, callback } = props
  const token = secureLocalStorage.getItem('token')

  const handleSubmit = async (e) => {
    e.preventDefault()

    let params = {}
    let baseUrl = `${process.env.REACT_APP_API_URL}/agencies`
    const headers = { headers: { Authorization: `Bearer ${token}` } }

    if(action !== 'Tambah') baseUrl += `/${data.id}`
    if(action !== 'Hapus') {
      params = {
        name: e.target.name.value,
        address: e.target.address.value,
        description: e.target.description.value,
        webUrl: e.target.webUrl.value,
        field: e.target.field.value
      }
    }

    try {
      let response = null
      if(action === 'Tambah') response = await axios.post(baseUrl, params, headers)
      else if(action === 'Edit') response = await axios.put(baseUrl, params, headers)
      else response = await axios.delete(baseUrl, headers)

      callback(response.data.agency)
    } catch (error) {
      console.log(error)
    }
  }

  if(action === 'Hapus') {
    return (
      <>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              Apakah anda yakin ingin menghapus instansi ini?
            </Typography>
          </Grid>
        </Grid>
        <DialogActions>
          <Button onClick={callback}>Batal</Button>
          <Button onClick={handleSubmit}>Hapus</Button>
        </DialogActions>
      </>
    )
  } else{
    return (
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <StdTextField name="name" label="Nama Instansi" value={data.name || ''} />
            <StdTextField name="description" label="Deskripsi" value={data.description || ''} />
            <StdTextField name="address" label="Alamat" value={data.address || ''} />
            <StdTextField name="webUrl" label="Website" value={data.webUrl || ''} />
            <StdTextField name="field" label="Bidang" value={data.field || ''} />
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
}

const AgencyTable = () => {
  const user = useOutletContext()
  const [open, setOpen] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [isLoaded, setIsLoaded] = React.useState(false)
  const [agencies, setAgencies] = React.useState([])
  const [action, setAction] = React.useState('')
  const [agency, setAgency] = React.useState({})
  const token = secureLocalStorage.getItem('token')
  const baseURL = process.env.REACT_APP_API_URL

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
    setIsLoaded(true)
  }

  const handleShowModal = () => {
    setOpen(!open)
  }

  const handleActionModal = (action, data = {}) => {
    setAction(action)
    setAgency(data)
    handleShowModal()
  }

  const callback = (data) => {
    if(data){
      if(action === 'Tambah') setAgencies([...agencies, data])
      else if(action === 'Edit') {
        const newAgencies = agencies.map(a => {
          if(a.id === data.id) return data
          return a
        })
        setAgencies(newAgencies)
      } else {
        const newAgencies = agencies.filter(a => a.id !== agency.id)
        setAgencies(newAgencies)
      }
    }

    handleShowModal()
  }

  if(!isLoaded && !isLoading) fetchAgencies()

  if(user?.role !== 'admin') return <NotFoundPage />
  else if(isLoading) return <div>Loading...</div>
  else if(isLoaded && agencies.length){
    return (
      <Box sx={{ width: '100%' }}>
        <Modal
          open={open}
          setOpen={handleShowModal}
          title={`${capitalize(action)} instansi`}
          children={
            <AgencyForm
              action={action}
              data={agency}
              callback={callback} />
          } />
        <Paper sx={{ width: '100%', mb: 2, paddingX: 2, paddingY: 1 }}>
          <EnhancedTableToolbar setOpen={handleActionModal.bind(this, 'Tambah')} />
          <TableContainer>
            <Table
              sx={{ minWidth: 750 }}
              aria-labelledby="tableTitle"
              size="small"
            >
              <EnhancedTableHead />
              <TableBody>
                {agencies.map((agency, index) => (
                  <TableRow hover key={agency.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{agency.name}</TableCell>
                    <TableCell>{agency.address}</TableCell>
                    <TableCell sx={{ width: '120px' }}>
                      <IconButton
                        color='warning'
                        onClick={handleActionModal.bind(this, 'Edit', agency)} >
                        <Edit />
                      </IconButton>
                      <IconButton
                        color='error'
                        onClick={handleActionModal.bind(this, 'Hapus', agency)}>
                        <Delete />
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
  } else return <div>Empty</div>
}

export default AgencyTable