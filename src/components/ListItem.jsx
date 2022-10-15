import * as React from 'react'
import { List, ListItem, ListItemText, ListItemIcon } from '@mui/material'
import { Apartment, Assessment, Filter5, WorkspacePremium } from '@mui/icons-material'

export default function FolderList() {
  return (
    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
      <ListItem>
        <ListItemIcon sx={{ color: 'primary.main' }}>
          <WorkspacePremium />
        </ListItemIcon>
        <ListItemText
          primary="Bersertifikat"
          secondary="Kamu akan menerima sertifikat setelah menyelesaikan program ini." />
      </ListItem>
      <ListItem>
        <ListItemIcon sx={{ color: 'primary.main' }}>
          <Apartment />
        </ListItemIcon>
        <ListItemText primary="On-Site" secondary="Kamu akan melaksanakan kegiatan secara on-site." />
      </ListItem>
      <ListItem>
        <ListItemIcon>
          <Filter5 sx={{ color: 'primary.main' }} />
        </ListItemIcon>
        <ListItemText primary="Semester 5" secondary="Setidaknya kamu harus berada pada semester 5 untuk mengikuti program ini." />
      </ListItem>
      <ListItem>
        <ListItemIcon>
          <Assessment sx={{ color: 'primary.main' }} />
        </ListItemIcon>
        <ListItemText primary="20 SKS" secondary="Kamu dapat mengkonversi hingga paling banyak 20 SKS" />
      </ListItem>
    </List>
  )
}