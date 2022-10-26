import {
  Paper,
  Grid,
  Typography,
  Button,
  ListItemAvatar,
  ListItemText,
  ListItem,
  ListItemIcon,
  List,
  Avatar,
  Box,
  Chip,
  ListItemButton,
  InputBase,
  IconButton,
  Divider,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  DialogActions
} from '@mui/material'
import { CheckCircle, DangerousRounded, Download, Lock, Upload, RemoveCircle, Send } from '@mui/icons-material'
import Accordion from '../components/Accordion'
import MenuIcon from '@mui/icons-material/Menu'
import SearchIcon from '@mui/icons-material/Search'
import DirectionsIcon from '@mui/icons-material/Directions'
import axios from 'axios'
import { useEffect, useState, useRef } from 'react'
import secureLocalStorage from 'react-secure-storage'
import { useParams } from 'react-router-dom'
import Modal from '../components/Modal'
import { DateTimePicker } from '@mui/x-date-pickers'
import moment from 'moment'

const CreateLogbookForm = (props) => {
  const [startsAt, setStartsAt] = useState(new Date())
  const [endsAt, setEndsAt] = useState(new Date())
  const [courseId, setCourseId] = useState(1)
  const [cpmkCode, setCpmkCode] = useState(1)

  const handleFormValueChange = (value, setter) => {
    setter(value)
  }

  const handleSave = () => {
  }

  return(
    <>
      <TextField
        sx={{ mt: 1 }}
        variant="standard"
        margin="normal"
        label="Judul kegiatan"
        required
        fullWidth />
      <TextField
        sx={{ mt: 1 }}
        variant="standard"
        margin="normal"
        label="Deskripsi kegiatan"
        required
        multiline
        rows={2}
        fullWidth />
      <DateTimePicker
        sx={{ mt: 1, mb: 1 }}
        fullWidth
        label="Tanggal dan waktu mulai kegiatan"
        value={startsAt}
        onChange={(date) => handleFormValueChange(date, setStartsAt)}
        renderInput={(params) => <TextField
          sx={{ mt: 1, mb: 1 }}
          variant='standard' 
          fullWidth
          {...params} />
        } />
      <DateTimePicker
        sx={{ mt: 1, mb: 1 }}
        fullWidth
        label="Tanggal dan waktu selesai kegiatan"
        value={endsAt}
        onChange={(date) => handleFormValueChange(date, setEndsAt)}
        renderInput={(params) => <TextField
          sx={{ mt: 1, mb: 1 }}
          variant='standard'
          fullWidth
          {...params} />
        } />
      <FormControl
        sx={{ mt: 1, mb: 1 }}
        fullWidth
        margin="normal"
        variant="standard" >
        <InputLabel>Mata kuliah yang dituju</InputLabel>
        <Select
          sx={{ mt: 1, mb: 1 }}
          fullWidth
          value={courseId}
          onChange={(event) => handleFormValueChange(event.target.value, setCourseId)} >
          <MenuItem value={1}>Pemrograman Berorientasi Objek</MenuItem>
          <MenuItem value={2}>Pemrograman Web</MenuItem>
          <MenuItem value={3}>Pemrograman Mobile</MenuItem>
        </Select>
      </FormControl>
      <FormControl
        sx={{ mt: 1, mb: 1 }}
        fullWidth
        margin="normal"
        variant="standard" >
        <InputLabel>CPMK yang dituju</InputLabel>
        <Select
          sx={{ mt: 1, mb: 1 }}
          fullWidth
          value={cpmkCode}
          onChange={(event) => handleFormValueChange(event.target.value, setCpmkCode)} >
          <MenuItem value={1}>Pemrograman Berorientasi Objek</MenuItem>
          <MenuItem value={2}>Pemrograman Web</MenuItem>
          <MenuItem value={3}>Pemrograman Mobile</MenuItem>
        </Select>
      </FormControl>
      <DialogActions>
        <Button
          onClick={handleSave}>
          Simpan
        </Button>
      </DialogActions>
    </>
  )
}

const MyProgram = () => {  
  const { id } = useParams()
  const token = secureLocalStorage.getItem('token')
  const baseUrl = process.env.REACT_APP_API_URL
  const [logbooks, setLogbooks] = useState([])
  const [loaded, setLoaded] = useState(false)
  const [Loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)

  const setModalOpen = () => {
    setOpen(!open)
  }

  const handleAddLogbook = () => {
    setModalOpen()
  }
  
  if(!loaded && !Loading){
    setLoading(true)
    axios.get(`${baseUrl}/student-programs/${id}/logbooks`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      setLogbooks(res.data.logbooks)
      console.log(res.data.logbooks)
      setLoaded(true)
      setLoading(false)
    })
  }

  if(loaded){
    return (
      <Grid container spacing={2}>
        <Modal
          open={open}
          setOpen={setModalOpen}
          title={'Tambah logbook'}
          children={<CreateLogbookForm />} />
        <Grid item xs={12} md={6} lg={7}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Typography variant='h6'>
              Logbook - Backend Developer Intern
            </Typography>
  
            <Box sx={{ mt: 2, justifyContent: 'flex-end', display: 'flex' }}>
              <Button
                onClick={handleAddLogbook}
                variant='contained'
                color='primary'
                size='small'>
                Tambah Logbook
              </Button>
            </Box>
  
            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
              {logbooks.map((logbook) => (
                <ListItemButton key={logbook.id}>
                  <ListItemAvatar>
                    {logbook.id}
                  </ListItemAvatar>
                  <ListItemText
                    primary={logbook.title}
                    secondary={logbook.description} />
                  <ListItemIcon>
                    <CheckCircle color='success' />
                  </ListItemIcon>
                </ListItemButton>
              ))}
              <ListItemButton>
                <ListItemAvatar>
                  <Avatar>
                    15
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="Pengenalan Kegiatan"
                  secondary="Dasar-dasar Pemrograman - Membuat aplikasi sederhana" />
                <ListItemIcon>
                  <CheckCircle color='success' />
                </ListItemIcon>
              </ListItemButton>
              <ListItemButton>
                <ListItemAvatar>
                  <Avatar>
                    14
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="Memahami Konsep"
                  secondary="Dasar-dasar Pemrograman - Membuat aplikasi sederhana" />
                <ListItemIcon>
                  <DangerousRounded color='error' />
                </ListItemIcon>
              </ListItemButton>
              <ListItemButton>
                <ListItemAvatar>
                  <Avatar>
                    13
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="Melihat-lihat"
                  secondary="Data Mining - Menggali data" />
                <ListItemIcon>
                  <RemoveCircle color='disable' />
                </ListItemIcon>
              </ListItemButton>
            </List>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6} lg={5}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Paper
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <Typography variant='h6'>
                  Detail
                </Typography>
  
                <Chip label="Ditolak" color="error" size="small" sx={{ marginTop: 2 }}/>
                <Typography variant='caption' align="center">
                  Kegiatan tidak sesuai dengan CPMK yang dituju
                </Typography>
  
                <Typography variant='subtitle2' sx={{ marginTop: 2 }}>
                  Tanggal Kegiatan
                </Typography>
                <Typography variant='body2'>
                  15 September 2022
                </Typography>
  
                <Typography variant='subtitle2' sx={{ marginTop: 2 }}>
                  Jam Kegiatan
                </Typography>
                <Typography variant='body2'>
                  08.00 - 12.00 (4 Jam)
                </Typography>
  
                <Typography variant='subtitle2' sx={{ marginTop: 2 }}>
                  Feedback
                </Typography>
                <Box sx={{ maxHeight: 160, overflowY: 'scroll' }} >
                  <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                    <ListItem sx={{
                      width: '67%',
                      marginLeft: '30%',
                      bgcolor: '#ddd',
                      paddingTop: 0,
                      paddingBottom: 0,
                      marginBottom: 1 }}>
                      <ListItemText
                        primary='Ini salah tarok ini, seharusnya di CPMK Data Mining, perbaiki lagi ya' />
                    </ListItem>
                    <ListItem sx={{ 
                      width: '67%',
                      bgcolor: '#ddd',
                      paddingTop: 0,
                      paddingBottom: 0,
                      paddingLeft: 1,
                      marginBottom: 1 }}>
                      <ListItemText
                        primary="Halo pak, saya sudah menyelesaikan tugasnya" />
                    </ListItem>
                    <ListItem sx={{
                      width: '67%',
                      marginLeft: '30%',
                      bgcolor: '#ddd',
                      paddingTop: 0,
                      paddingBottom: 0,
                      marginBottom: 1 }}>
                      <ListItemText
                        primary='Ok, terimakasih' />
                    </ListItem>
                    <ListItem sx={{
                      width: '67%',
                      bgcolor: '#ddd',
                      paddingTop: 0,
                      paddingBottom: 0,
                      marginBottom: 1 }}>
                      <ListItemText
                        primary='Sama-sama Pak' />
                    </ListItem>
                  </List>
                </Box>
                <Paper
                  component="form"
                  sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: '100%' }}
                >
                  <InputBase
                    sx={{ ml: 1, flex: 1 }}
                    placeholder="Berikan tanggapan"
                    inputProps={{ 'aria-label': 'search google maps' }}
                  />
                  <IconButton color="primary" sx={{ p: '10px' }} aria-label="send">
                    <Send />
                  </IconButton>
                </Paper>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    )
  }else return <>Loading</>
}

export default MyProgram