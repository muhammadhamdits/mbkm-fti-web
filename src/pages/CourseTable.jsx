import * as React from 'react'
import PropTypes from 'prop-types'
import { alpha } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import TableSortLabel from '@mui/material/TableSortLabel'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Checkbox from '@mui/material/Checkbox'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'
import DeleteIcon from '@mui/icons-material/Delete'
import FilterListIcon from '@mui/icons-material/FilterList'
import { visuallyHidden } from '@mui/utils'
import { AddOutlined, Delete, DeleteOutline, Edit, EditOutlined, RemoveRedEye, Sync } from '@mui/icons-material'
import { Button, Chip } from '@mui/material'
import axios from 'axios'
import secureLocalStorage from 'react-secure-storage'
import Modal from '../components/Modal'

const EnhancedTableHead = () => {
  return (
    <TableHead>
      <TableRow>
        <TableCell >
          #
        </TableCell>
        <TableCell>
          Mata Kuliah
        </TableCell>
        <TableCell >
          SKS
        </TableCell>
        <TableCell >
          Action
        </TableCell>
      </TableRow>
    </TableHead>
  )
}

const EnhancedTableToolbar = () => {
  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 }
      }}
    >
      <Typography
        sx={{ flex: '1 1 100%' }}
        variant="h6"
        id="tableTitle"
        component="div"
      >
        Daftar Mata Kuliah
      </Typography>
      <Tooltip title="Tampah Program">
        <IconButton color="primary">
          <Sync />
          <Typography variant="button" sx={{ ml: 1 }}>
            Sync Matkul
          </Typography>
        </IconButton>
      </Tooltip>
    </Toolbar>
  )
}

const CPMKList = (props) => {
  return (
    <>Test</>
  )
}

const CourseTable = () => {
  const baseUrl = process.env.REACT_APP_API_URL
  const token = secureLocalStorage.getItem('token')
  const [courses, setCourses] = React.useState([])
  const [course, setCourse] = React.useState({})
  const [isLoading, setIsLoading] = React.useState(false)
  const [isLoaded, setIsLoaded] = React.useState(false)
  const [open, setOpen] = React.useState(false)

  const fetchCourses = async () => {
    setIsLoading(true)
    try {
      const response = await axios.get(`${baseUrl}/courses`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setCourses(response.data.courses)
    } catch (error) {
      console.log(error)
    }
    setIsLoading(false)
    setIsLoaded(true)
  }

  const setModalOpen = () => {
    setOpen(!open)
  }

  const handleCPMKClick = (course) => {
    setCourse(course)
    setModalOpen()
  }

  const callback = () => {
  }

  React.useEffect(() => {
    if(!isLoaded && !isLoading) fetchCourses()
  }, [isLoaded, isLoading])

  if(isLoading) return <>Loading</>
  else if(isLoaded && courses) {
    return (
      <Box sx={{ width: '100%' }}>
        <Modal
          open={open}
          setOpen={setModalOpen}
          title="Daftar CPMK"
          children={
            <CPMKList
              data={course}
              baseUrl={baseUrl}
              token={token}
              callback={callback} />
          } />
        <Paper sx={{ width: '100%', mb: 2, paddingX: 2, paddingY: 1 }}>
          <EnhancedTableToolbar />
          <TableContainer>
            <Table
              sx={{ minWidth: 750 }}
              aria-labelledby="tableTitle"
              size="small"
            >
              <EnhancedTableHead />
              <TableBody>
                {courses.map((course, index) => (
                  <TableRow hover key={course.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{course.name}</TableCell>
                    <TableCell>{course.sks} SKS</TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        onClick={handleCPMKClick.bind(this, course)}
                        startIcon={<Edit />}>
                        CPMK
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    )
  } else  return <>Empty</>
}

export default CourseTable