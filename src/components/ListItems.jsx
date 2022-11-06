import * as React from 'react'
import ListItemButton from './ListItemButton'
import HomeIcon from '@mui/icons-material/Home'
import axios from 'axios'
import secureLocalStorage from 'react-secure-storage'
import { Apartment, Assignment, Ballot, LocalLibrary, Person, School } from '@mui/icons-material'

const ListItems = (props) => {
  const baseUrl = process.env.REACT_APP_API_URL
  const token = secureLocalStorage.getItem('token')
  const [studentPrograms, setStudentPrograms] = React.useState([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [isLoaded, setIsLoaded] = React.useState(false)

  const fetchStudentPrograms = async () => {
    setIsLoading(true)
    try {
      const response = await axios.get(`${baseUrl}/student-programs`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setStudentPrograms(response.data.studentPrograms)
    } catch (e) {
      console.log(e)
    }
    setIsLoading(false)
    setIsLoaded(true)
  }

  React.useEffect(() => {
    if (!isLoaded && !isLoading && props.user.role === 'student') fetchStudentPrograms()
  })
  
  if (isLoading) {
    return (
      <>Loading...</>
    )
  }else{
    return (
      <React.Fragment>
        <ListItemButton icon={ <HomeIcon /> } path='/' name='Home'/>
        { props.user.role === 'student' &&
          studentPrograms.map((program) => {
            return (
              <ListItemButton
                key={ program.programId }
                icon={ <School /> }
                path={`/my-programs/${program.programId}`}
                name={program.program.name}/>
            )
          })
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
}

export default ListItems
