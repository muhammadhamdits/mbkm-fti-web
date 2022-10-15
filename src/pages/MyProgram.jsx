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
  Box
} from '@mui/material'
import { WorkspacePremium } from '@mui/icons-material'
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
          <Typography variant='h5'>
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
          <Grid container spacing={2} alignItems="center" sx={{ marginBottom: 1 }}>
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
              <Button variant='contained'>
                Daftar Pada Program Ini
              </Button>
              <Typography variant='body2' sx={{ marginTop: 2, alignSelf: 'center' }}>
                Pendaftaran ditutup dalam: <b>2 Hari lagi</b>
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <Typography variant='h6'>
                Tentang Pertukaran Pelajar
              </Typography>
              <Typography variant='body2' sx={{ marginTop: 2 }}>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit, exercitationem doloribus.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <Typography variant='h6'>
                Tentang Harvard University
              </Typography>
              <Typography variant='caption'>
                Jl. Limau Manis No. 1, Kec. Kebayoran Baru, Kota Jakarta Selatan, Daerah Khusus Ibukota Jakarta 12160
              </Typography>
              <Typography variant='body2' sx={{ marginTop: 2 }}>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae temporibus hic sapiente! Soluta possimus natus nam quas ad! Neque perspiciatis dolorem vitae enim? Laboriosam, recusandae. Quisquam, quod. Quisquam, quod.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default MyProgram