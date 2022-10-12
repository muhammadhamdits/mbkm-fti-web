import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography
} from "@mui/material"

const ProgramCardComponent = () => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" component="div">
          Magang Backend Developer
        </Typography>
        <Typography variant="subtitle2" component="div">
          PT. Semen Padang
        </Typography>
        <Typography variant="body2">
          Magang Bersertifikat
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Learn More</Button>
      </CardActions>
    </Card>
  )
}

export default ProgramCardComponent