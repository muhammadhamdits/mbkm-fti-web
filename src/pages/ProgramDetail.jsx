import { Box, Typography } from "@mui/material"

const ProgramDetailPage = () => {
  return (
    <Box sx={{
      bgcolor: 'teal',
      height: '100vh',
      padding: 2
    }}>
      <Typography variant="h5">
        Detail program
      </Typography>
      <Box sx={{ paddingTop: 2 }}>
        <Typography variant="h6">
          Nama program
        </Typography>
        <Typography variant="body1">
          Magang di perusahaan teknologi
        </Typography>
      </Box>
      <Box sx={{ paddingTop: 2 }}>
        <Typography variant="h6">
          Deskripsi
        </Typography>
        <Typography variant="body1">
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Itaque, eum! Est, cupiditate blanditiis cumque optio corrupti corporis nesciunt maxime doloribus neque dolore error iste laboriosam?
        </Typography>
      </Box>
    </Box>
  )
}

export default ProgramDetailPage