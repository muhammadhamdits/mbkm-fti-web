import * as React from 'react'
import {
  AssignmentLate,
  AssignmentReturned,
  AssignmentTurnedIn
} from '@mui/icons-material'
import {
  Button,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
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
  Paper
} from '@mui/material'
import { Link, useOutletContext } from 'react-router-dom'
import secureLocalStorage from 'react-secure-storage'
import axios from 'axios'
import Modal from '../components/Modal'
import NotFoundPage from './404'

const EnhancedTableHead = () => {
  return (
    <TableHead>
      <TableRow>
        <TableCell >
          #
        </TableCell>
        <TableCell>
          Nama Mahasiswa
        </TableCell>
        <TableCell >
          Program
        </TableCell>
        <TableCell >
          Jenis Program
        </TableCell>
        <TableCell >
          Instansi
        </TableCell>
        <TableCell >
          Dosen Pembimbing
        </TableCell>
        <TableCell >
          Status
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
        Daftar Program Mahasiswa
      </Typography>
    </Toolbar>
  )
}

const StatusProgramDetail = (props) => {
  const { data, baseUrl, token, callback } = props
  const [status, setStatus] = React.useState(data.status)
  const [reason, setReason] = React.useState(data.reason)

  const handleStatusChange = (e) => {
    setStatus(e.target.value)
  }

  const handleReasonChange = (e) => {
    setReason(e.target.value)
  }

  const handleUpdateStatus = async () => {
    try{
      const payload = {
        studentId: data.studentId,
        programId: data.programId,
        status: status,
        reason: reason
      }
      await axios.put(`${baseUrl}/student-programs/status`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      })
      callback(payload)
    } catch (err) {
      console.log(err)
    }
  }

  if(data.status !== 'accepted'){
    return (
      <>
        <Typography variant="body2" color="text.secondary">
          Ganti Status Program Mahasiswa
        </Typography>
        <StdSelect
          label="Status"
          value={status}
          onChange={handleStatusChange}
          items={[
            { id: 'applied', name: 'Mengajukan Pendaftaran' },
            { id: 'approved', name: 'Disetujui' },
            { id: 'rejected', name: 'Ditolak' }
          ]} />
        <TextField
          name="reason"
          label="Alasan"
          defaultValue={data.reason}
          fullWidth
          variant="standard"
          multiline
          rows={4} 
          value={reason}
          onChange={handleReasonChange}
          margin="normal" />
        <DialogActions>
          <Button
            disabled={status === data.status}
            onClick={handleUpdateStatus}>
            Simpan
          </Button>
        </DialogActions>
      </>
    )
  }else{
    return(
      <>Tes</>
    )
  }
}

const StdSelect = (props) => {
  return(
    <FormControl fullWidth margin="normal" variant="standard">
      <InputLabel>{props.label}</InputLabel>
      <Select
        required
        fullWidth
        value={props.value}
        onChange={props.onChange} >
        {props.items.map((item) => (
          item.id === 'applied' ? (
            <MenuItem key={item.id} value={item.id} disabled>{item.name}</MenuItem>
          ) : (
            <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
          )
        ))}
      </Select>
    </FormControl>
  )
}

const ProgramTable = () => {
  const user = useOutletContext()
  const token = secureLocalStorage.getItem('token')
  const baseUrl = process.env.REACT_APP_API_URL
  const [studentPrograms, setStudentPrograms] = React.useState([])
  const [studentProgram, setStudentProgram] = React.useState({})
  const [isLoading, setIsLoading] = React.useState(false)
  const [isLoaded, setIsLoaded] = React.useState(false)
  const [open, setOpen] = React.useState(false)
  
  const fetchStudentPrograms = async () => {
    setIsLoading(true)
    try {
      const response = await axios.get(`${baseUrl}/student-programs`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setStudentPrograms(response.data.studentPrograms)
    } catch (error) {
      console.log(error)
    }
    setIsLoading(false)
    setIsLoaded(true)
  }

  const handleStatusClick = (data) => {
    if(user.role !== 'admin') return
    setStudentProgram(data)
    setModalOpen()
  }

  const setModalOpen = () => {
    setOpen(!open)
  }

  const callback = (data) => {
    const newStudentPrograms = studentPrograms.map((item) => {
      if(item.studentId === data.studentId && item.programId === data.programId){
        return {
          ...item,
          status: data.status,
          reason: data.reason
        }
      }else return item
    })
    setStudentPrograms(newStudentPrograms)
    setModalOpen()
  }

  React.useEffect(() => {
    if(!isLoaded) fetchStudentPrograms()
  })

  if(user?.role === 'student') return <NotFoundPage />
  else if(isLoading) {
    return (
      <>Loading</>
    )
  }else if(isLoaded && !!studentPrograms) {
    return (
      <Box sx={{ width: '100%' }}>
        <Modal
          open={open}
          setOpen={setModalOpen}
          title="Status Program"
          children={
            <StatusProgramDetail
              data={studentProgram}
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
                {studentPrograms.map((sP, index) => {
                  return (
                    <TableRow
                      hover
                      tabIndex={-1}
                      key={`${sP.studentId}-${sP.programId}`}
                    >
                      <TableCell>
                        {index + 1}
                      </TableCell>
                      <TableCell>
                        <Link
                          style={{ textDecoration: 'none', 
                          color: '#005FFF' }}
                          to={`/student-programs/${sP.programId}/${sP.studentId}`}>
                          {sP.student.name}
                        </Link>
                      </TableCell>
                      <TableCell>
                        {sP.program.name}
                      </TableCell>
                      <TableCell>
                        {sP.program.name}
                      </TableCell>
                      <TableCell>
                        {sP.program.name}
                      </TableCell>
                      <TableCell>
                        {sP.lecturer?.name || 'Belum ada'}
                      </TableCell>
                      <TableCell>
                      { sP.status === 'applied' ? 
                          <Button
                            variant="contained"
                            color="secondary"
                            size="small"
                            onClick={handleStatusClick.bind(this, sP)}
                            startIcon={<AssignmentReturned />} >
                            Mengajukan Pendaftaran
                          </Button>
                        : sP.status === 'approved' ?
                          <Button
                            variant="contained"
                            color="success"
                            size="small"
                            onClick={handleStatusClick.bind(this, sP)}
                            startIcon={<AssignmentTurnedIn />} >
                            Disetujui
                          </Button>
                        : sP.status === 'rejected' ?
                          <Button
                            variant="contained"
                            color="error"
                            size="small"
                            onClick={handleStatusClick.bind(this, sP)}
                            startIcon={<AssignmentLate />} >
                            Ditolak
                          </Button>
                        : sP.status === 'accepted' ?
                          <Button
                            variant="contained"
                            color="success"
                            size="small"
                            onClick={handleStatusClick.bind(this, sP)}
                            startIcon={<AssignmentTurnedIn />} >
                            Diterima
                          </Button>
                        : <>Anu</>
                      }
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    )
  }else return ( <>Empty</> )
}

export default ProgramTable