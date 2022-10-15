import * as React from 'react'
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography
} from '@mui/material'
import { Link } from 'react-router-dom'

const BasicCard = ({ params: { programType, programTitle, agencyName, agencyImage, description } }) => {
  return (
    <Card sx={{ bgcolor: '#eee', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex'}}>
        <CardMedia
          component="img"
          sx={{ width: 80, height: 80, objectFit: 'cover', marginLeft: 1, marginTop: 2 }}
          image={ agencyImage }
          alt="Live from space album cover"
        />
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <CardContent sx={{ flex: '1 0 auto' }}>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
              { programType }
            </Typography>
            <Typography component="div" variant="h6">
              <Link to="/programs/1" style={{ textDecoration: 'none', color: '#005FFF' }}>
              { programTitle }
              </Link>
            </Typography>
            <Typography variant="subtitle2" color="text.secondary">
              { agencyName }
            </Typography>
          </CardContent>
        </Box>
      </Box>
      <Box sx={{ display: 'block' }}>
        <CardContent sx={{ paddingTop: 0 }}>
          <Typography variant="subtitle1" color="text.secondary" component="div">
            {description.length > 80 ?
              `${description.substring(0, 80)}...` : description
            }
          </Typography>
        </CardContent>
      </Box>
    </Card>
  )
}

export default BasicCard