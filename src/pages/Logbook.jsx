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
  ListItemButton
} from '@mui/material'
import { CheckCircle, DangerousRounded, Download, Lock, Upload, RemoveCircle } from '@mui/icons-material'
import Accordion from '../components/Accordion'

const MyProgram = () => {  
  return (
    <Grid container spacing={2}>
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
            <Button variant='contained' color='primary' size='small'>
              Tambah Logbook
            </Button>
          </Box>

          <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
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
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default MyProgram