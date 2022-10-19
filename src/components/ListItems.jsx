import * as React from 'react'
import ListItemButton from './ListItemButton'
import HomeIcon from '@mui/icons-material/Home'
import { Apartment, Assignment, Ballot, LocalLibrary, Person, School } from '@mui/icons-material'

const ListItems = (props) => {
  return (
    <React.Fragment>
      <ListItemButton icon={ <HomeIcon /> } path='/' name='Home'/>
      { props.user.role === 'student' &&
        <>
          <ListItemButton icon={ <School /> } path='/my-programs/1' name='Program'/>
          <ListItemButton icon={ <Assignment /> } path='/logbooks/1' name='Logbook'/>
        </>
      }
      { ['admin', 'lecturer'].includes(props.user.role) &&
        <ListItemButton icon={ <School /> } path='/student-programs' name='Student Program'/>
      }
      { props.user.role === 'admin' &&
        <>
          <ListItemButton icon={ <LocalLibrary /> } path='/programs' name='Program'/>
          <ListItemButton icon={ <Ballot /> } path='/program-types' name='Program Type'/>
          <ListItemButton icon={ <Apartment /> } path='/agencies' name='Agencies'/>
          <ListItemButton icon={ <Assignment /> } path='/courses' name='Courses'/>
          <ListItemButton icon={ <Person /> } path='/users' name='Users'/>
        </>
      }
    </React.Fragment>
  )
}

export default ListItems
