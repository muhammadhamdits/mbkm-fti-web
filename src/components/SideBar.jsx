import {
  Box,
  List
} from '@mui/material'
import {
  Home,
  Backpack,
  Wysiwyg
} from '@mui/icons-material'
import SideBarItemComponent from './SideBarItem'

const SideBarComponent = () => {
  return (
    <Box>
      <List>
        <SideBarItemComponent text='Home' icon={<Home />} />
        <SideBarItemComponent text='Program' icon={<Backpack />} />
        <SideBarItemComponent text='Logbook' icon={<Wysiwyg />} />
      </List>
    </Box>
  )
}

export default SideBarComponent