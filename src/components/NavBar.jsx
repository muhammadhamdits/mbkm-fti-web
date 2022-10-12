import { Menu } from '@mui/icons-material'
import { Box,
  AppBar,
  Toolbar,
  IconButton,
  Button,
  Typography
} from '@mui/material'

const NavBarComponent = ({ title }) => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton color="inherit"><Menu /></IconButton>
          <Typography variant="h6" component="div" sx={{
            flexGrow: 1,
            paddingLeft: 2
          }}>
            { title }
          </Typography>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
    </Box>  
  )
}

export default NavBarComponent