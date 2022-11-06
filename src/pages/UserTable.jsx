import { useState }from 'react'
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Toolbar,
  Typography,
  Paper,
  IconButton,
  Tooltip
} from '@mui/material'
import { Sync } from '@mui/icons-material'
import { useOutletContext } from 'react-router-dom'
import secureLocalStorage from 'react-secure-storage'
import axios from 'axios'
import NotFoundPage from './404'

const EnhancedTableHead = () => {
  return (
    <TableHead>
      <TableRow>
        <TableCell >
          #
        </TableCell>
        <TableCell>
          Nama
        </TableCell>
        <TableCell >
          Username
        </TableCell>
        <TableCell >
          Role
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
        Daftar User
      </Typography>
      <Tooltip title="Tampah Program">
        <IconButton color="primary">
          <Sync />
          <Typography variant="button" sx={{ ml: 1 }}>
            Sync Users
          </Typography>
        </IconButton>
      </Tooltip>
    </Toolbar>
  )
}

const UsersTable = () => {
  const user = useOutletContext()
  const token = secureLocalStorage.getItem('token')
  const baseUrl = process.env.REACT_APP_API_URL
  const [users, setUsers] = useState(null)

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${baseUrl}/users`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setUsers(response.data.users)
    } catch (error) {
      console.log(error)
    }
  }

  if(users === null) fetchUsers()

  if(user?.role !== 'admin') return <NotFoundPage />
  else{
    return (
      <Box sx={{ width: '100%' }}>
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
                {users?.map((user, index) => (
                  <TableRow hover key={user.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>
                      {user.username}
                    </TableCell>
                    <TableCell>
                      {user.role}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    )
  }
}

export default UsersTable