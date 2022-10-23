import * as React from 'react'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import Typography from '@mui/material/Typography'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Box, Chip, LinearProgress, List, ListItem, ListItemIcon, ListItemText } from '@mui/material'
import { ArrowRight } from '@mui/icons-material'

const ControlledAccordions = () => {
  const [expanded, setExpanded] = React.useState(false)

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false)
  }

  return (
    <Box>
      <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <Typography sx={{ width: '33%', flexShrink: 0 }}>
            Dasar-dasar Pemrograman
          </Typography>
          <Chip label="4 SKS" color="primary" size="small" sx={{ marginLeft: 2 }}/>
          <Chip label="Disetujui" color="success" size="small" sx={{ marginLeft: 1 }}/>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant='body2'>
            Total jam konversi: <b>24 jam 17 menit</b> dari <b>48 jam</b>
          </Typography>
          <LinearProgress 
            variant="determinate" 
            value={ ((24/48)+((17/60)/48))*100 } 
            sx={{ width: '100%', marginTop: 1 }} />
          <Typography variant='body1' sx={{ marginTop: 3 }}>
            Daftar CPMK:
          </Typography>
          <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
            <ListItem sx={{ padding: 0}}>
              <ListItemIcon>
                <ArrowRight sx={{ padding: 0 }} />
              </ListItemIcon>
              <ListItemText>
                <Typography variant='overline'>
                  Membuat program sederhana
                </Typography>
              </ListItemText>
            </ListItem>
            <ListItem sx={{ padding: 0}}>
              <ListItemIcon>
                <ArrowRight sx={{ padding: 0 }} />
              </ListItemIcon>
              <ListItemText>
                <Typography variant='overline'>
                  Merancang Struktur Data
                </Typography>
              </ListItemText>
            </ListItem>
            <ListItem sx={{ padding: 0}}>
              <ListItemIcon>
                <ArrowRight sx={{ padding: 0 }} />
              </ListItemIcon>
              <ListItemText>
                <Typography variant='overline'>
                  Melakukan komputasi cloud
                </Typography>
              </ListItemText>
            </ListItem>
          </List>
        </AccordionDetails>
      </Accordion>
      <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2bh-content"
          id="panel2bh-header"
        >
          <Typography sx={{ width: '33%', flexShrink: 0 }}>
            Data Mining
          </Typography>
          <Chip label="3 SKS" color="primary" size="small" sx={{ marginLeft: 2 }}/>
          <Chip label="Ditolak" color="error" size="small" sx={{ marginLeft: 1 }}/>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Donec placerat, lectus sed mattis semper, neque lectus feugiat lectus,
            varius pulvinar diam eros in elit. Pellentesque convallis laoreet
            laoreet.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3bh-content"
          id="panel3bh-header"
        >
          <Typography sx={{ width: '33%', flexShrink: 0 }}>
            Praktikum Pemrograman Web
          </Typography>
          <Chip label="1 SKS" color="primary" size="small" sx={{ marginLeft: 2 }}/>
          <Chip label="Diajukan" color="secondary" size="small" sx={{ marginLeft: 1 }}/>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Nunc vitae orci ultricies, auctor nunc in, volutpat nisl. Integer sit
            amet egestas eros, vitae egestas augue. Duis vel est augue.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion expanded={expanded === 'panel4'} onChange={handleChange('panel4')}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel4bh-content"
          id="panel4bh-header"
        >
          <Typography sx={{ width: '33%', flexShrink: 0 }}>
            Pemrograman Web
          </Typography>
          <Chip label="2 SKS" color="primary" size="small" sx={{ marginLeft: 2 }}/>
          <Chip label="Disetujui" color="success" size="small" sx={{ marginLeft: 1 }}/>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Nunc vitae orci ultricies, auctor nunc in, volutpat nisl. Integer sit
            amet egestas eros, vitae egestas augue. Duis vel est augue.
          </Typography>
        </AccordionDetails>
      </Accordion>
    </Box>
  )
}

export default ControlledAccordions