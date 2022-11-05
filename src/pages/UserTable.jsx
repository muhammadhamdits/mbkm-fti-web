import * as React from 'react'
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
import { Delete, Edit, Sync } from '@mui/icons-material'
import { useOutletContext } from 'react-router-dom'
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
                <TableRow hover >
                  <TableCell>1</TableCell>
                  <TableCell>Husnil Kamil</TableCell>
                  <TableCell>
                    199607302010121001
                  </TableCell>
                  <TableCell>
                    Lecturer
                  </TableCell>
                  <TableCell sx={{ width: '120px' }}>
                    <IconButton color='warning'>
                      <Edit />
                    </IconButton>
                    <IconButton color='error'>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    )
  }
}

export default UsersTable