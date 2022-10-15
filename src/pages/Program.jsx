import {
  Paper,
  Grid,
  Typography,
  Button
} from '@mui/material'
import ListItem from '../components/ListItem'

const Program = () => {  
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
            Detail Program - Pertukaran Pelajar
          </Typography>

          <ListItem />

          <Typography variant='subtitle2'>
            Periode Pendaftaran
          </Typography>
          <Typography variant='body2' sx={{ marginBottom: 2 }}>
            15 Agustus 2022 - 15 September 2022 (1 bulan)
          </Typography>

          <Typography variant='subtitle2'>
            Periode Kegiatan
          </Typography>
          <Typography variant='body2' sx={{ marginBottom: 2 }}>
            20 September 2022 - 20 Januari 2023 (4 bulan)
          </Typography>

          <Typography variant='subtitle2'>
            Deskripsi Program
          </Typography>
          <Typography variant='body2' sx={{ marginBottom: 2 }}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae temporibus hic sapiente! Soluta possimus natus nam quas ad! Neque perspiciatis dolorem vitae enim? Laboriosam, recusandae. Quisquam, quod. Quisquam, quod.
          </Typography>

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

export default Program