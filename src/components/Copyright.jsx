import {
  Typography,
  Link
} from '@mui/material'

const Copyright = (props) => {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="http://si.fti.unand.ac.id">
        Sistem Informasi - Universitas Andalas
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  )
}

export default Copyright