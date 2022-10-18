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

const AddProgramTypeForm = () => {
  const token = secureLocalStorage.getItem('token')
  const baseURL = process.env.REACT_APP_API_URL

  const saveProgramType = async (e) => {
    e.preventDefault()
    const params = {
      name: e.target.name.value,
      description: e.target.description.value
    }

    try {
      const res = await axios.post(`${baseURL}/program-types`, params, {
        headers: { Authorization: `Bearer ${token}` }
      })
      console.log(res)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <form onSubmit={saveProgramType}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            margin='normal'
            required
            name="name"
            label="Nama"
            fullWidth
            variant="standard" />
          <TextField
            margin='normal'
            required
            name="description"
            label="Deskripsi"
            fullWidth
            multiline
            maxRows={4}
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
}

const ProgramTable = () => {
  const token = secureLocalStorage.getItem('token')
  const baseURL = process.env.REACT_APP_API_URL
  const [open, setOpen] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [programTypes, setProgramTypes] = React.useState([])

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

  React.useEffect(() => {
    if(!isLoading && programTypes.length === 0) getProgramTypes()
  }, [isLoading, programTypes])

  if(isLoading) return <div>Loading...</div>
  else if(programTypes.length){
    return (
      <Box sx={{ width: '100%' }}>
        <Modal
            open={open}
            setOpen={handleShowModal}
            title="Tambah jenis program"
            children={<AddProgramTypeForm />} />
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
                {programTypes.map((programType, index) => (
                  <TableRow hover key={programType.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{programType.name}</TableCell>
                    <TableCell>{programType.description}</TableCell>
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