import { Box, Typography } from "@mui/material"
import ProgramCard from "../components/ProgramCard"

const HomePage = () => {
  return (
    <Box sx={{
      bgcolor: 'teal',
      height: '100vh',
      padding: 2
    }}>
      <Typography variant="h5">
        Daftar program yang tersedia
      </Typography>
      <Box sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 2,
        paddingTop: 2
      }}>
        <ProgramCard />
        <ProgramCard />
        <ProgramCard />
        <ProgramCard />
        <ProgramCard />
        <ProgramCard />
      </Box>
    </Box>
  )
}

export default HomePage