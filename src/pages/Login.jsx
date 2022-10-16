import * as React from 'react'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Box,
  Typography,
  Container
} from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import Copyright from '../components/Copyright'
import axios from 'axios'
import secureLocalStorage from 'react-secure-storage'
import { useNavigate } from 'react-router-dom'

const theme = createTheme()

const LoginPage = () => {
  const baseUrl = process.env.REACT_APP_API_URL
  const navigate = useNavigate()
  const token = secureLocalStorage.getItem('token')
  const [error, setError] = React.useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)

    try {
      const response = await axios.post(`${baseUrl}/login`, {
        username: data.get('username'),
        password: data.get('password')
      })
      secureLocalStorage.setItem('token', response.data.token)
      navigate('/')
    } catch (e) {
      setError(true)
    }
  }

  React.useEffect(() => {
    if (token) navigate('/')
  })

  if (token) return (<></>)

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            {error &&
              <Typography variant='body2' color='error' >
                Username/Password is incorrect
              </Typography>
            }
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  )
}

export default LoginPage