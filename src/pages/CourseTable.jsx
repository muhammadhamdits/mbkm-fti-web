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

const ProgramTable = () => {
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
                <TableCell>Dasar dasar pemrograman</TableCell>
                <TableCell>3 SKS</TableCell>
                <TableCell>
                  <Button variant="outlined" color="primary" size="small" startIcon={<RemoveRedEye />}>
                    CPMK
                  </Button>
                  <Button variant="outlined" color="primary" size="small" startIcon={<Edit />} sx={{ marginLeft: 1 }}>
                    Edit
                  </Button>
                  <Button variant="outlined" color="error" size="small" startIcon={<Delete />} sx={{ marginLeft: 1 }}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  )
}

export default ProgramTable