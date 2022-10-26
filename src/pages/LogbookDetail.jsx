import {
  Grid,
  Paper,
  Typography,
  Chip,
  Box,
  List,
  ListItem,
  ListItemText,
  InputBase,
  IconButton
} from '@mui/material'

import {
  Send
} from '@mui/icons-material'

const LogbookDetail = () => {
  return(
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
  )
}

export default LogbookDetail