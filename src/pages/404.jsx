import { Box, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'

const NotFoundPage = () => {
  const navigate = useNavigate()

  return (
    <Box
      sx={{
        display: 'grid',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '50vh',
        backgroundColor: 'secondary.main',
        borderRadius: 4
      }}
    >
      <Typography variant="h1" style={{
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold' }}>
        404
      </Typography>
      <Typography variant="h4" style={{
        color: 'white',
        textAlign: 'center' }}>
        The page you are looking for does not exist.
      </Typography>
      <Typography variant="h5" style={{
        color: 'white',
        textAlign: 'center' }}>
        Back to <a href="/"
        onClick={(e) => {
          e.preventDefault()
          navigate('/')
        }}
        style={{
          textDecoration: 'none',
          color: 'white',
          fontWeight: 'bold' }}>
          Home
        </a>
      </Typography>
    </Box>
  )
}

export default NotFoundPage