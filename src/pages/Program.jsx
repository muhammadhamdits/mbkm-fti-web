import {
  Paper,
  Grid,
  Typography,
  Button,
  Divider,
  CircularProgress,
  Box,
  Alert,
  AlertTitle
} from '@mui/material'
import { Upload } from '@mui/icons-material'
import { useParams, useOutletContext, Link } from 'react-router-dom'
import secureLocalStorage from 'react-secure-storage'
import { useState, useEffect, useRef } from 'react'
import { formatDate, countMonthsDays, isInRange, isLater } from '../assets/utils'
import ListItem from '../components/ListItem'
import Modal from '../components/Modal'
import axios from 'axios'

const RegisterProgramForm = (props) => {
  const { token, baseUrl, callback, program } = props
  const inputFileRef = useRef(null)
  const [file, setFile] = useState(null)
  const [fileName, setFileName] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleUploadButton = () => {
    inputFileRef.current.click()
  }

  const handleFileChange = (e) => {
    setFile(e.target.files[0])
    setFileName(e.target.files[0].name)
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    const studentProgram = await axios.post(`${baseUrl}/programs/${program.id}/register`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    })

    const formData = new FormData()

    formData.append('file', file)
    const objectName = 'StudentProgram'
    const objectField = 'advisorRecommendationFile'
    const objectIdString = JSON.stringify({
      studentId: studentProgram.data.studentProgram.studentId,
      programId: studentProgram.data.studentProgram.programId
    })
    const query = `objectName=${objectName}&objectId=${objectIdString}&objectField=${objectField}`

    await axios.post(`${baseUrl}/upload?${query}`,
      formData,
      { headers: { Authorization: `Bearer ${token}` } }
    )
    setIsLoading(false)
    callback()
  }

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex' }}>
        <CircularProgress />
      </Box>
    )
  }else{
    return (
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="subtitle1" sx={{ fontWeight: 400 }}>
            Unggah dokumen rekomendasi dari Pembimbing Akademik
          </Typography>
          <Typography variant="caption" sx={{ mt: 1 }}>
            Pastikan kamu telah mendapatkan rekomendasi dari Pembimbing Akademik terlebih dahulu.
            Kamu bisa mendapatkannya dengan menghubungi Pembimbing Akademik kamu.
            Lalu unggah dokumen rekomendasi tersebut di sini dalam bentuk file PDF.
          </Typography>
          <input
            type="file"
            accept="application/pdf"
            ref={inputFileRef}
            onChangeCapture={ handleFileChange }
            style={{ display: 'none' }} />
          <Typography
            variant="subtitle2"
            visibility={ fileName ? 'visible' : 'hidden' }
            sx={{ mt: 2 }}>
            {fileName}
          </Typography>
          <Button
            variant='outlined'
            color='primary'
            size="small"
            fullWidth
            onClick={ handleUploadButton }
            startIcon={<Upload />}>
            Unggah
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Divider sx={{ mt: 1, mb: 3 }} />
          <Button
            size="large"
            disabled={!fileName}
            variant='contained'
            color='primary'
            fullWidth
            onClick={handleSubmit}>
            Daftar
          </Button>
        </Grid>
      </Grid>
    )
  }
}

const Program = () => {
  const user = useOutletContext()
  const { id } = useParams()
  const baseUrl = process.env.REACT_APP_API_URL
  const token = secureLocalStorage.getItem('token')
  const [program, setProgram] = useState({})
  const [open, setOpen] = useState(false)
  const [isRegistered, setIsRegistered] = useState(false)
  const [showAlert, setShowAlert] = useState(false)

  const setModalOpen = () => {
    setOpen(!open)
  }

  const fetchProgram = async () => {
    setProgram({ loading: true })
    try {
      const response = await axios.get(`${baseUrl}/programs/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setProgram(response.data.program)
      setIsRegistered(response.data.isRegistered)
    } catch (e) {
      setProgram({ empty: true })
      console.log(e)
    }
  }

  const callback = async () => {
    setModalOpen()
    setIsRegistered(true)
    setShowAlert(true)
  }

  useEffect(() => { if (!Object.keys(program).length) fetchProgram() })

  return (
    <>
    {
      program.id &&
      <Grid container spacing={2}>
        {showAlert &&
          <Alert severity="success">
            <AlertTitle>Sukses</AlertTitle>
            Kamu telah berhasil mengajukan pendaftaran program ini. Silahkan tunggu konfirmasi dari admin.
            Kamu bisa melihat status pendaftaran kamu di halaman <Link to={`/my-programs/${program.id}`} style={{ textDecoration: 'none', color: '#3f50b5' }}>Program Saya</Link>.
          </Alert>
        }
        <Modal
          open={open}
          setOpen={setModalOpen}
          title="Mendaftar Program"
          children={
            <RegisterProgramForm
              program={program}
              baseUrl={baseUrl}
              token={token}
              callback={callback} />
          } />
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
                  <Button
                    variant='contained'
                    size="large"
                    onClick={setModalOpen}
                    disabled={ !isInRange(new Date(), program.openAt, program.closeAt) || isRegistered } >
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