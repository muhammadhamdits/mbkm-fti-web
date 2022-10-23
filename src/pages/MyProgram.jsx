import {
  Paper,
  Grid,
  Typography,
  Button,
  ListItemAvatar,
  ListItemText,
  ListItem,
  List,
  Avatar,
  Box,
  Chip
} from '@mui/material'
import { Download, Lock, Upload, WorkspacePremium } from '@mui/icons-material'
import Accordion from '../components/Accordion'
import { formatDate, isLater, isInRange } from '../assets/utils'
import { useParams, useOutletContext } from 'react-router-dom'
import { useState, useEffect } from 'react'
import secureLocalStorage from 'react-secure-storage'
import axios from 'axios'

const MyProgram = () => {  
  const { id } = useParams()
  const user = useOutletContext()
  const baseUrl = process.env.REACT_APP_API_URL
  const token = secureLocalStorage.getItem('token')
  const [isLoading, setIsLoading] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [studentProgram, setStudentProgram] = useState(null)

  const fetchStudentProgram = async () => {
    setIsLoading(true)
    setIsLoaded(false)
    try {
      const response = await axios.get(`${baseUrl}/student-programs/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setStudentProgram(response.data.studentProgram)
      console.log(response.data.studentProgram)
    } catch (e) {
      console.log(e)
    }
    setIsLoading(false)
    setIsLoaded(true)
  }

  const handleFileDownload = async (url) => {
    const newUrl = url + `?token=${token}`
    window.open(newUrl, '_blank')
  }

  useEffect(() => {
    if (!isLoaded && !isLoading) fetchStudentProgram()
    else if (isLoaded && studentProgram.programId != id) fetchStudentProgram()
  })

  if (isLoading) {
    return (
      <>Loading</>
    )
  } else if(isLoaded && studentProgram.programId == id) {
    return (
      <Grid container spacing={2}>
        <Grid item xs={12} md={7} lg={8}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Typography variant='h6'>
              Program Saya - { studentProgram.program.name }
            </Typography>
  
            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <WorkspacePremium />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="Dosen Pembimbing"
                  secondary="Husnil Kamil, M.T" />
              </ListItem>
            </List>
  
            <Typography variant='subtitle2'>
              Konversi Mata Kuliah
            </Typography>
            <Grid container spacing={2} sx={{ marginBottom: 1 }}>
              <Grid item xs={6}>
                <Typography variant='caption'>
                  Total SKS: 10 dari 20
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button variant='contained' color='primary' size="small" >
                    Tambah Matkul
                  </Button>
                </Box>
              </Grid>
            </Grid>
            <Accordion />
          </Paper>
        </Grid>
        <Grid item xs={12} md={5} lg={4}>
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
                  Status
                </Typography>
                { studentProgram.status == 'applied' &&
                  <>
                    <Chip label="Terdaftar" color="secondary" size="small" sx={{ marginTop: 1 }}/>
                    <Typography variant='caption' align="center">
                      Menunggu persetujuan dari jurusan
                    </Typography>
                  </>
                } { studentProgram.status == 'approved' &&
                  <>
                    <Chip label="Disetujui" color="success" size="small" sx={{ marginTop: 1 }}/>
                    <Typography variant='caption' align="center">
                      Menunggu upload dokumen penerimaan di instansi oleh mahasiswa
                    </Typography>
                  </>
                } { studentProgram.status == 'rejected' &&
                  <>
                    <Chip label="Ditolak" color="error" size="small" sx={{ marginTop: 1 }}/>
                    <Typography variant='caption' align="center">
                      Mohon maaf permohonan pendaftaran anda ditolak. Silakan hubungi jurusan untuk informasi lebih lanjut.
                    </Typography>
                  </>
                } { studentProgram.status == 'accepted' && isLater(studentProgram.program.startsAt) &&
                  <>
                    <Chip label="Diterima" color="success" size="small" sx={{ marginTop: 1 }}/>
                    <Typography variant='caption' align="center">
                      Selamat anda diterima di program ini. program ini akan dimulai pada tanggal `${formatDate(studentProgram.program.startsAt)}`
                    </Typography>
                  </>
                } { studentProgram.status == 'accepted' && isInRange(new Date(), studentProgram.program.openAt, studentProgram.program.closeAt) &&
                  <>
                    <Chip label="Sedang berlangsung" color="info" size="small" sx={{ marginTop: 1 }}/>
                    <Typography variant='caption' align="center">
                      Program sedang berlangsung.
                    </Typography>
                  </>
                } { studentProgram.status == 'accepted' && !isLater(studentProgram.program.closeAt) &&
                  <>
                    <Chip label="Selesai" color="primary" size="small" sx={{ marginTop: 1 }}/>
                    <Typography variant='caption' align="center">
                      Program telah berakhir.
                    </Typography>
                  </>
                }
  
                <Typography variant='subtitle2' sx={{ marginTop: 2 }}>
                  Dokumen Rekomendasi PA
                </Typography>
                <Button
                  variant='outlined'
                  color='primary'
                  size="small"
                  onClick={handleFileDownload.bind(this, studentProgram.advisorRecommendationFile)}
                  startIcon={<Download />}>
                  Unduh
                </Button>
  
                <Typography variant='subtitle2' sx={{ marginTop: 2 }}>
                  Dokumen Penerimaan Instansi
                </Typography>
                <Button variant='outlined' color='primary' size="small" startIcon={<Upload />}>
                  Unggah
                </Button>
  
                <Typography variant='subtitle2' sx={{ marginTop: 2 }}>
                  Dokumen Laporan Akhir
                </Typography>
                <Button disabled variant='outlined' color='primary' size="small" startIcon={<Lock />}>
                  Terkunci
                </Button>
  
                <Typography variant='subtitle2' sx={{ marginTop: 2 }}>
                  Dokumen Poster
                </Typography>
                <Button disabled variant='outlined' color='primary' size="small" startIcon={<Lock />}>
                  Terkunci
                </Button>
  
                <Typography variant='subtitle2' sx={{ marginTop: 2 }}>
                  Rekap Nilai
                </Typography>
                <Button disabled variant='outlined' color='primary' size="small" startIcon={<Lock />}>
                  Terkunci
                </Button>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    )
  } else return <></>
}

export default MyProgram