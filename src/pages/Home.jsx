import { useEffect, useState } from 'react'
import {
  Paper,
  Grid
} from '@mui/material'
import Card from '../components/Card'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import secureLocalStorage from 'react-secure-storage'

const Home = () => {
  const baseUrl = process.env.REACT_APP_API_URL
  const navigate = useNavigate()
  const token = secureLocalStorage.getItem('token')
  const [programs, setPrograms] = useState([])

  const fetchPrograms = async () => {
    setPrograms(['loading'])
    try {
      const response = await axios.get(`${baseUrl}/programs`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setPrograms(response.data.programs)
    } catch (e) {
      setPrograms(['empty'])
      console.log(e)
    }
  }
  
  useEffect(() => { if (!programs.length) fetchPrograms() })

  return (
    <Paper
      sx={{
        p: 2,
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Grid container spacing={2} alignItems="stretch">
        { programs.map((program, index) => (
          <Grid item xs={12} md={6} lg={4} key={index}>
            <Card program={program} />
          </Grid>
        )) }
      </Grid>
    </Paper>
  )
}

export default Home