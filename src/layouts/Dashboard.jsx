import * as React from 'react'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import {
  CssBaseline,
  Box,
  Toolbar,
  Container,
  List,
  Typography,
  Divider,
  IconButton,
  Badge,
  MenuItem,
  Menu,
  Grid
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import NotificationsIcon from '@mui/icons-material/Notifications'
import UserIcon from '@mui/icons-material/AccountCircle'
import ListItems from '../components/ListItems'
import AppBar from '../components/AppBar'
import Copyright from '../components/Copyright'
import Drawer from '../components/Drawer'
import { Outlet } from 'react-router-dom'
import secureLocalStorage from 'react-secure-storage'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { formatDate } from '../assets/utils'

const mdTheme = createTheme()

const BasicMenu = (props) => {
  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)

  const handleClick = (event) => { setAnchorEl(event.currentTarget) }
  const handleClose = () => { setAnchorEl(null) }

  return (
    <>
      <IconButton
        color="inherit"
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        { props.icon }
        <Typography sx={{ ml: 1 }} variant="button" noWrap component="div">
          { props.user?.username || '' }
        </Typography>
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        { props.menuItems }
      </Menu>
    </>
  )
}

const DashboardLayout = () => {
  const baseUrl = process.env.REACT_APP_API_URL
  const navigate = useNavigate()
  const token = secureLocalStorage.getItem('token')
  const [open, setOpen] = React.useState(false)
  const [user, setUser] = React.useState(null)
  const [notifications, setNotifications] = React.useState([])

  const toggleDrawer = () => { setOpen(!open) }

  const handleNavigate = async (path) => {
    if(path === '/login'){
      secureLocalStorage.removeItem('token')
      navigate(path)
    } else{
      await axios.put(`${baseUrl}/notifications/${path.id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      navigate(path.path)
    }
  }

  const decodeToken = async (token) => {
    setUser('loading')
    try {
      const response = await axios.post(`${baseUrl}/decode`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setUser(response.data.user)
      fetchNotifications()
    } catch (e) {
      setUser('error')
      secureLocalStorage.removeItem('token')
      return (<></>)
    }
  }

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(`${baseUrl}/notifications`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setNotifications(response.data.notifications)
    } catch (e) {
      console.log(e)
    }
  }

  React.useEffect(() => { if (!token || !user) navigate('/login') })

  if (!token) return (<></>)
  else if(!user) decodeToken(token)
  else if(user !== 'loading'){
    return (
      <ThemeProvider theme={mdTheme}>
        <Box sx={{ display: 'flex' }}>
          <CssBaseline />
          <AppBar position="absolute" open={open}>
            <Toolbar
              sx={{
                pr: '24px', // keep right padding when drawer closed
              }}
            >
              <IconButton
                edge="start"
                color="inherit"
                aria-label="open drawer"
                onClick={toggleDrawer}
                sx={{
                  marginRight: '36px',
                  ...(open && { display: 'none' }),
                }}
              >
                <MenuIcon />
              </IconButton>
              <Typography
                component="h1"
                variant="h6"
                color="inherit"
                noWrap
                sx={{ flexGrow: 1 }}
              >
                Home
              </Typography>
              <BasicMenu
                menuItems={
                  notifications.map((notification, index) => (
                    <MenuItem
                      sx={{
                        backgroundColor: notification.isRead ? 'inherit' : '#ccffcc',
                        '&:hover': {
                          backgroundColor: notification.isRead ? 'inherit' : '#ddffdd'
                        },
                        marginY: 0.5,
                        marginX: 1
                      }}
                      key={`${notification.id}-${index}`}
                      onClick={handleNavigate.bind(this, notification)}>
                      <Grid
                        container
                        spacing={0}
                        sx={{
                          maxWidth: '320px',
                          paddingRight: '20px',
                          overflowY: 'auto',
                          overflowX: 'hidden'
                        }}>
                        <Grid item xs={9}>
                          <Typography variant="body2" noWrap>
                            {notification.title}
                          </Typography>
                        </Grid>
                        <Grid item xs={3}>
                          <Typography
                            color="textSecondary"
                            variant="caption"
                            noWrap>
                            {formatDate(notification.createdAt)}
                          </Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="caption" noWrap>
                            {notification.message}
                          </Typography>
                        </Grid>
                      </Grid>
                    </MenuItem>
                  ))
                }
                icon={
                  <Badge badgeContent={
                    notifications.filter((notification) => !notification.isRead).length
                  } color="secondary">
                    <NotificationsIcon />
                  </Badge>
                } />
              <BasicMenu
                menuItems={
                  <MenuItem onClick={handleNavigate.bind(this, '/login')}>Logout</MenuItem>
                }
                icon={<UserIcon />}
                user={user} />
            </Toolbar>
          </AppBar>
          <Drawer variant="permanent" open={open}>
            <Toolbar
              sx={{
                display: 'flex',
                justifyContent: 'flex-start',
                px: [1],
              }}
            >
              <IconButton onClick={toggleDrawer}>
                <ChevronLeftIcon />
              </IconButton>
              <Typography
                component="h1"
                variant="h6"
                color="inherit"
                noWrap
                sx={{
                  flexGrow: 1,
                  ml: 2
                }}
              >
                MBKM-FTI
              </Typography>
            </Toolbar>
            <Divider />
            <List component="nav">
              <ListItems user={user} />
            </List>
          </Drawer>
          <Box
            component="main"
            sx={{
              backgroundColor: (theme) =>
                theme.palette.mode === 'light'
                  ? theme.palette.grey[100]
                  : theme.palette.grey[900],
              flexGrow: 1,
              height: '100vh',
              overflow: 'auto',
            }}
          >
            <Toolbar />
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
              <Outlet context={user} />
              <Copyright sx={{ pt: 4 }} />
            </Container>
          </Box>
        </Box>
      </ThemeProvider>
    )
  } else return(<>Loading</>)
}

export default DashboardLayout