import {
  Grid,
  Paper,
  Typography,
  Chip,
  Box,
  List,
  ListItem,
  ListItemText,
  InputBase,
  IconButton
} from '@mui/material'
import {
  Send
} from '@mui/icons-material'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import secureLocalStorage from 'react-secure-storage'
import { useRef, useState } from 'react'
import { formatDate, getHourMinute, getHourMinuteDiff } from '../assets/utils'

const RightChat = ({ text }) => {
  return(
    <ListItem sx={{
      width: '67%',
      marginLeft: '30%',
      bgcolor: '#ddd',
      paddingTop: 0,
      paddingBottom: 0,
      marginBottom: 1 }}>
      <ListItemText
        primary={text} />
    </ListItem>
  )
}

const LeftChat = ({ text }) => {
  return(
    <ListItem sx={{ 
      width: '67%',
      bgcolor: '#ddd',
      paddingTop: 0,
      paddingBottom: 0,
      paddingLeft: 1,
      marginBottom: 1 }}>
      <ListItemText
        primary={text} />
    </ListItem>
  )
}

const LogbookDetail = () => {
  const { logbookId } = useParams()
  const baseUrl = process.env.REACT_APP_API_URL
  const token = secureLocalStorage.getItem('token')
  const feedbackInput = useRef(null)
  const [logbook, setLogbook] = useState({})
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(false)
  const [loaded, setLoaded] = useState(false)
  
  const fetchLogbook = async () => {
    setLoading(true)
    try{
      const response = await axios.get(`${baseUrl}/logbooks/${logbookId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setLogbook(response.data.logbook)
      setComments(response.data.logbook.comments)
      setLoaded(true)
      setLoading(false)
    }catch(e) { console.log(e) }
  }

  const handleSendFeedback = async () => {
    if(feedbackInput.current.firstChild.value === '') return

    const payload = { text: feedbackInput.current.firstChild.value }
    try{
      const response = await axios.post(`${baseUrl}/logbooks/${logbookId}/comments`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      const newComments = [...comments, response.data.comment]
      setComments(newComments)
    }catch(e) { console.log(e) }

    feedbackInput.current.firstChild.value = ''
  }

  if(!loaded && !loading) fetchLogbook()

  if(loaded && parseInt(logbook.id) === parseInt(logbookId)){
    return(
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Typography variant='h6'>
              Detail
            </Typography>
            
            { logbook.status === 'proposed' ?
                <Chip label="Diajukan" color="secondary" size="small" sx={{ marginTop: 2 }}/>
              : logbook.status === 'accepted' ?
                <Chip label="Disetujui" color="success" size="small" sx={{ marginTop: 2 }}/>
              : <Chip label="Ditolak" color="error" size="small" sx={{ marginTop: 2 }}/>
            }
            <Typography variant='caption' align="center">
              Kegiatan tidak sesuai dengan CPMK yang dituju
            </Typography>
  
            <Typography variant='subtitle2' sx={{ marginTop: 2 }}>
              Tanggal Kegiatan
            </Typography>
            <Typography variant='body2'>
              {formatDate(logbook.startsAt)}
            </Typography>
  
            <Typography variant='subtitle2' sx={{ marginTop: 2 }}>
              Jam Kegiatan
            </Typography>
            <Typography variant='body2'>
              {getHourMinute(logbook.startsAt)} - {getHourMinute(logbook.endsAt)} ({getHourMinuteDiff(logbook.startsAt, logbook.endsAt)})
            </Typography>
  
            <Typography variant='subtitle2' sx={{ marginTop: 2 }}>
              Feedback
            </Typography>
            <Box sx={{ maxHeight: 160, overflowY: 'scroll' }} >
              <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                { comments.map(comment => {
                  if(comment.isLecturer){
                    return(<RightChat key={comment.id} text={comment.text} />)
                  }else{
                    return(<LeftChat key={comment.id} text={comment.text} />)
                  }
                })}
              </List>
            </Box>
            <Paper
              component="form"
              sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: '100%' }}
            >
              <InputBase
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSendFeedback()
                }}
                ref={feedbackInput}
                sx={{ ml: 1, flex: 1 }}
                placeholder="Berikan tanggapan"
                inputProps={{ 'aria-label': 'search google maps' }}
              />
              <IconButton
                onClick={handleSendFeedback}
                color="primary"
                sx={{ p: '10px' }}
                aria-label="send" >
                <Send />
              </IconButton>
            </Paper>
          </Paper>
        </Grid>
      </Grid>
    )
  } else if (loaded && parseInt(logbook.id) !== parseInt(logbookId)) setLoaded(false)
  else return <>Loading</>
}

export default LogbookDetail