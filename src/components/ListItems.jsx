import * as React from 'react'
import ListItemButton from './ListItemButton'
import HomeIcon from '@mui/icons-material/Home'
import { Assignment, Collections, School } from '@mui/icons-material'

const ListItems = () => {
  return (
    <React.Fragment>
      <ListItemButton icon={ <HomeIcon /> } path='/' name='Home'/>
      <ListItemButton icon={ <School /> } path='/my-programs/1' name='Program'/>
      <ListItemButton icon={ <Assignment /> } path='/logbooks/1' name='Logbook'/>
      <ListItemButton icon={ <School /> } path='/programs' name='Program'/>
    </React.Fragment>
  )
}

export default ListItems
