import * as React from 'react'
import ListItem from './ListItem'
import HomeIcon from '@mui/icons-material/Home'
import { Collections } from '@mui/icons-material'

const ListItems = () => {
  return (
    <React.Fragment>
      <ListItem icon={ <HomeIcon /> } path='/' name='Home'/>
      <ListItem icon={ <Collections /> } path='/programs' name='Program'/>
    </React.Fragment>
  )
}

export default ListItems
