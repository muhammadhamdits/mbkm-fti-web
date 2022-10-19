import {
  Paper,
  Grid,
  Typography,
  Button
} from '@mui/material'
import ListItem from '../components/ListItem'
import { useParams, useOutletContext } from 'react-router-dom'
import axios from 'axios'
import { useState, useEffect } from 'react'
import secureLocalStorage from 'react-secure-storage'
import { formatDate, countMonthsDays, countDays, isInRange, isLater } from '../assets/utils'

const Program = () => {
  const user = useOutletContext()
  const { id } = useParams()
  const baseUrl = process.env.REACT_APP_API_URL
  const token = secureLocalStorage.getItem('token')
  const [program, setProgram] = useState({})

  const fetchProgram = async () => {
    setProgram({ loading: true })
    try {
      const response = await axios.get(`${baseUrl}/programs/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setProgram(response.data.program)
    } catch (e) {
      setProgram({ empty: true })
      console.log(e)
    }
  }

  useEffect(() => { if (!Object.keys(program).length) fetchProgram() })

  return (
    <>
    {
      program.id &&
      <Grid container spacing={2}>
        <Grid item xs={12} md={7} lg={8}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Typography variant='h6'>
              Detail Program - {program.name}
            </Typography>

            <ListItem program={program} />

            <Typography variant='subtitle2'>
              Periode Pendaftaran
            </Typography>
            <Typography variant='body2' sx={{ marginBottom: 2 }}>
              {`
                ${formatDate(program.openAt)} - 
                ${formatDate(program.closeAt)} 
                (${countMonthsDays(program.openAt, program.closeAt)})
              `}
            </Typography>

            <Typography variant='subtitle2'>
              Periode Kegiatan
            </Typography>
            <Typography variant='body2' sx={{ marginBottom: 2 }}>
              {`
                ${formatDate(program.startsAt)} - 
                ${formatDate(program.endsAt)} 
                (${countMonthsDays(program.startsAt, program.endsAt)})
              `}
            </Typography>

            <Typography variant='subtitle2'>
              Deskripsi Program
            </Typography>
            <Typography variant='body2' sx={{ marginBottom: 2 }}>
              {program.description}
            </Typography>

          </Paper>
        </Grid>
        <Grid item xs={12} md={5} lg={4}>
          <Grid container spacing={2}>
            { user.role === 'student' &&
              <Grid item xs={12}>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <Button variant='contained' size="large" disabled={
                    !isInRange(new Date(), program.openAt, program.closeAt)
                  }>
                    Daftar Pada Program Ini
                  </Button>
                  <Typography variant='body2' sx={{ marginTop: 2, alignSelf: 'center' }}>
                    { isLater(program.openAt) ?
                      `Pendaftaran akan dibuka pada ${formatDate(program.openAt)}` :
                      isInRange(new Date(), program.openAt, program.closeAt) ?
                        `Pendaftaran ditutup pada ${formatDate(program.closeAt)}` :
                      `Pendaftaran telah ditutup pada ${formatDate(program.closeAt)}`
                    }
                  </Typography>
                </Paper>
              </Grid>
            }
            <Grid item xs={12}>
              <Paper
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <Typography variant='h6'>
                  Tentang {program.programType.name}
                </Typography>
                <Typography variant='body2' sx={{ marginTop: 2 }}>
                  {program.programType.description}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <Typography variant='h6'>
                  Tentang {program.agency.name}
                </Typography>
                <Typography variant='caption'>
                  {program.agency.address}
                </Typography>
                <Typography variant='body2' sx={{ marginTop: 2 }}>
                  {program.agency.description}
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    }
    </>
  )
}

export default Program