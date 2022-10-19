import * as React from 'react'
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography
} from '@mui/material'
import { Link } from 'react-router-dom'

const BasicCard = (props) => {
  const { program } = props

  return (
    <Card sx={{ bgcolor: '#eee', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex'}}>
        <CardMedia
          component="img"
          sx={{ width: 80, height: 80, objectFit: 'cover', marginLeft: 1, marginTop: 2 }}
          image={ program.agency.imageUrl }
          alt="Live from space album cover"
        />
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <CardContent sx={{ flex: '1 0 auto' }}>
            <Typography component="div" variant="h6">
              <Link 
                to={`/programs/${program.id}`} 
                style={{ textDecoration: 'none', 
                color: '#005FFF' }}>
              { program.name }
              </Link>
            </Typography>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
              { program.programType.name } - <b>{ program.agency.name }</b>
            </Typography>
          </CardContent>
        </Box>
      </Box>
      <Box sx={{ display: 'block' }}>
        <CardContent sx={{ paddingTop: 0 }}>
          <Typography variant="subtitle1" color="text.secondary" component="div">
            {program.description.length > 80 ?
              `${program.description.substring(0, 80)}...` : program.description
            }
          </Typography>
        </CardContent>
      </Box>
    </Card>
  )
}

export default BasicCard