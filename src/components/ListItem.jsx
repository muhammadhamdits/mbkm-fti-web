import * as React from 'react'
import { List, ListItem, ListItemText, ListItemIcon } from '@mui/material'
import { Apartment, Assessment, Filter1, Filter2, Filter3, Filter4, Filter5, Filter6, RemoveCircle, WorkspacePremium, Filter7, Filter8, MapsHomeWork } from '@mui/icons-material'
import BroadcastOnPersonalIcon from '@mui/icons-material/BroadcastOnPersonal'
import { capitalize } from '../assets/utils'

const ListFolder = ({ program }) => {
  return (
    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
      <ListItem>
        <ListItemIcon sx={{ color: 'primary.main' }}>
          { program.isCertified ? <WorkspacePremium /> : <RemoveCircle /> }
        </ListItemIcon>
        {
          <ListItemText
            primary={`${!program.isCertified ? 'Tidak ' : ''}Bersertifikat`}
            secondary={`Kamu${!program.isCertified ? ' tidak' : ''} akan menerima sertifikat setelah menyelesaikan program ini.`}
          />
        }
      </ListItem>
      <ListItem>
        <ListItemIcon sx={{ color: 'primary.main' }}>
          {
            program.placement === 'remote' ? <BroadcastOnPersonalIcon /> :
            program.placement === 'hybrid' ? <MapsHomeWork /> :
            <Apartment />
          }
        </ListItemIcon>
        <ListItemText 
          primary={capitalize(program.placement)}
          secondary={`Kamu akan melaksanakan kegiatan secara ${program.placement}.`} />
      </ListItem>
      <ListItem>
        <ListItemIcon sx={{ color: 'primary.main' }}>
          {
            program.minTerms === 1 ? <Filter1 /> : 
            program.minTerms === 2 ? <Filter2 /> :
            program.minTerms === 3 ? <Filter3 /> :
            program.minTerms === 4 ? <Filter4 /> :
            program.minTerms === 5 ? <Filter5 /> :
            program.minTerms === 6 ? <Filter6 /> :
            program.minTerms === 7 ? <Filter7 /> :
            <Filter8 />
          }
        </ListItemIcon>
        <ListItemText 
          primary={`Semester ${program.minTerms}`} 
          secondary={`Setidaknya kamu harus berada pada semester ${program.minTerms} untuk mengikuti program ini.`} />
      </ListItem>
      <ListItem>
        <ListItemIcon>
          <Assessment sx={{ color: 'primary.main' }} />
        </ListItemIcon>
        <ListItemText 
          primary={`${program.sksCount} SKS`} 
          secondary={`Kamu dapat mengkonversi hingga paling banyak ${program.sksCount} SKS`} />
      </ListItem>
    </List>
  )
}

export default ListFolder