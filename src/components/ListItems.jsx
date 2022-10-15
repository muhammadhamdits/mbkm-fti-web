import * as React from 'react'
import ListItemButton from './ListItemButton'
import HomeIcon from '@mui/icons-material/Home'
import { Collections } from '@mui/icons-material'

const ListItems = () => {
  return (
    <React.Fragment>
      <ListItemButton icon={ <HomeIcon /> } path='/' name='Home'/>
      <ListItemButton icon={ <Collections /> } path='/my-programs/1' name='Program'/>
    </React.Fragment>
  )
}

export default ListItems
