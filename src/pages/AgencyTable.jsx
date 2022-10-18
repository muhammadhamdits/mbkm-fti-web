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
import { DialogActions, Grid, TextField, Button } from '@mui/material'

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
      <Tooltip title="Tampah Program">
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

const AddAgencyForm = () => {
  const token = secureLocalStorage.getItem('token')
  const baseURL = process.env.REACT_APP_API_URL

  const handleSubmit = async (e) => {
    e.preventDefault()
    const params = {
      name: e.target.name.value,
      address: e.target.address.value,
      description: e.target.description.value,
      webUrl: e.target.webUrl.value,
      field: e.target.field.value
    }

    try {
      const response = await axios.post(`${baseURL}/agencies`, params, {
        headers: { Authorization: `Bearer ${token}` }
      })
      console.log(response)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            required
            name="name"
            label="Nama Instansi"
            fullWidth
            variant="standard"
            margin="normal" />
          <TextField
            required
            name="address"
            label="Alamat"
            fullWidth
            variant="standard"
            margin="normal" />
          <TextField
            name="description"
            label="Deskripsi"
            fullWidth
            multiline
            maxRows={4}
            variant="standard"
            margin="normal" />
          <TextField
            required
            name="webUrl"
            label="Alamat Website"
            fullWidth
            variant="standard"
            margin="normal" />
          <TextField
            name="field"
            label="Bidang"
            fullWidth
            variant="standard"
            margin="normal" />
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

const ProgramTable = () => {
  const [open, setOpen] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [isLoaded, setIsLoaded] = React.useState(false)
  const [agencies, setAgencies] = React.useState([])
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

  React.useEffect(() => {
    if(!isLoaded && !isLoading) fetchAgencies()
  }, [isLoaded, isLoading])

  if(isLoading) return <div>Loading...</div>
  else if(isLoaded && agencies.length){
    return (
      <Box sx={{ width: '100%' }}>
        <Modal
          open={open}
          setOpen={handleShowModal}
          title="Tambah instansi"
          children={<AddAgencyForm />} />
        <Paper sx={{ width: '100%', mb: 2, paddingX: 2, paddingY: 1 }}>
          <EnhancedTableToolbar setOpen={handleShowModal} />
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
                      <IconButton color='warning'>
                        <Edit />
                      </IconButton>
                      <IconButton color='error'>
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

export default ProgramTable