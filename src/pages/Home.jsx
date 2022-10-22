import { useEffect, useState } from 'react'
import {
  Paper,
  Grid
} from '@mui/material'
import Card from '../components/Card'
import axios from 'axios'
import secureLocalStorage from 'react-secure-storage'

const Home = () => {
  const baseUrl = process.env.REACT_APP_API_URL
  const token = secureLocalStorage.getItem('token')
  const [programs, setPrograms] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  const fetchPrograms = async () => {
    setIsLoading(true)
    try {
      const response = await axios.get(`${baseUrl}/programs`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setPrograms(response.data.programs)
    } catch (e) {
      console.log(e)
    }
    setIsLoading(false)
    setIsLoaded(true)
  }

  useEffect(() => {
    if (!isLoaded) fetchPrograms()
  })

  if(isLoading) return <div>Loading...</div>
  else if(programs.length){
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
  } else return <>Empty</>
}

export default Home