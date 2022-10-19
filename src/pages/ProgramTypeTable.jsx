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
import secureLocalStorage from 'react-secure-storage'
import axios from 'axios'
import { Button, DialogActions, Grid, TextField } from '@mui/material'
import { capitalize } from '../assets/utils'

const EnhancedTableHead = () => {
  return (
    <TableHead>
      <TableRow>
        <TableCell >
          #
        </TableCell>
        <TableCell>
          Jenis Program
        </TableCell>
        <TableCell >
          Deskripsi
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
        Daftar Jenis Program
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

const ProgramTypeForm = (props) => {
  const { action, data, callback } = props
  const token = secureLocalStorage.getItem('token')
  
  const handleSubmit = async (e) => {
    e.preventDefault()

    let params = {}
    let baseUrl = `${process.env.REACT_APP_API_URL}/program-types`
    const headers = { headers: { Authorization: `Bearer ${token}` } }

    if(action !== 'Tambah') baseUrl += `/${data.id}`
    if(action !== 'Hapus') {
      params = {
        name: e.target.name.value,
        description: e.target.description.value
      }
    }

    try {
      let response = null
      if(action === 'Tambah') response = await axios.post(baseUrl, params, headers)
      else if(action === 'Edit') response = await axios.put(baseUrl, params, headers)
      else response = await axios.delete(baseUrl, headers)

      callback(response.data.programType)
    } catch (error) {
      console.log(error)
    }
  }

  if(action !== 'Hapus'){
    return (
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              margin='normal'
              required
              name="name"
              label="Nama"
              fullWidth
              defaultValue={data.name || ''}
              variant="standard" />
            <TextField
              margin='normal'
              required
              name="description"
              label="Deskripsi"
              fullWidth
              multiline
              maxRows={4}
              defaultValue={data.description || ''}
              variant="standard" />
          </Grid>
        </Grid>
        <DialogActions>
          <Button type="submit">
            Simpan
          </Button>
        </DialogActions>
      </form>
    )
  } else {
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
          <Button onClick={callback}>
            Batal
          </Button>
          <Button onClick={handleSubmit}>
            Hapus
          </Button>
        </DialogActions>
      </>
    )
  }
}

const ProgramTypeTable = () => {
  const token = secureLocalStorage.getItem('token')
  const baseURL = process.env.REACT_APP_API_URL
  const [open, setOpen] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [programTypes, setProgramTypes] = React.useState([])
  const [programType, setProgramType] = React.useState({})
  const [action, setAction] = React.useState('')

  const handleShowModal = () => {
    setOpen(!open)
  }

  const getProgramTypes = async () => {
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

  const handleActionModal = (action, data = {}) => {
    setAction(action)
    setProgramType(data)
    handleShowModal()
  }

  const callback = (data) => {
    if(data){
      if(action === 'Tambah') setProgramTypes([...programTypes, data])
      else if(action === 'Edit') {
        const newProgramTypes = programTypes.map(pt => {
          if(pt.id === data.id) return data
          return pt
        })
        setProgramTypes(newProgramTypes)
      } else {
        const newProgramTypes = programTypes.filter(pt => pt.id !== programType.id)
        setProgramTypes(newProgramTypes)
      }
    }

    handleShowModal()
  }

  React.useEffect(() => {
    if(!isLoading && programTypes.length === 0) getProgramTypes()
  })

  if(isLoading) return <div>Loading...</div>
  else if(programTypes.length){
    return (
      <Box sx={{ width: '100%' }}>
        <Modal
          open={open}
          setOpen={handleShowModal}
          title={`${capitalize(action)} jenis program`}
          children={
            <ProgramTypeForm 
              action={action} 
              data={programType} 
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
                {programTypes.map((programType, index) => (
                  <TableRow hover key={programType.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{programType.name}</TableCell>
                    <TableCell>{programType.description}</TableCell>
                    <TableCell sx={{ width: '120px' }}>
                      <IconButton 
                        color='warning'
                        onClick={handleActionModal.bind(this, 'Edit', programType)} >
                        <Edit />
                      </IconButton>
                      <IconButton
                        color='error'
                        onClick={handleActionModal.bind(this, 'Hapus', programType)}>
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

export default ProgramTypeTable