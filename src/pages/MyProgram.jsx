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

const MyProgram = () => {  
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
            Program Saya - Backend Developer Intern
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
              <Chip label="Disetujui" color="success" size="small" sx={{ marginTop: 1 }}/>
              <Typography variant='caption' align="center">
                Menunggu upload bukti penerimaan dari instansi terkait oleh mahasiswa
              </Typography>

              <Typography variant='subtitle2' sx={{ marginTop: 2 }}>
                Dokumen Rekomendasi PA
              </Typography>
              <Button variant='outlined' color='primary' size="small" startIcon={<Download />}>
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
}

export default MyProgram