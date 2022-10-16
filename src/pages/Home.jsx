import {
  Paper,
  Grid
} from '@mui/material'
import Card from '../components/Card'

const Home = (props) => {
  const { user } = props
  const datas = [
    {
      programType: 'Magang Bersertifikat',
      programTitle: 'Backend Developer Intern',
      agencyName: 'Bukalapak',
      description: 'lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.',
      agencyImage: 'https://res.cloudinary.com/crunchbase-production/image/upload/c_lpad,h_256,w_256,f_auto,q_auto:eco,dpr_1/wgwdrf8fsk9fnc2wngdf'
    },
    {
      programType: 'Studi Independen',
      programTitle: 'Teknik Sipil',
      agencyName: 'Universitas Indonesia',
      description: 'lorem ipsum dolor sit amet',
      agencyImage: 'https://upload.wikimedia.org/wikipedia/id/thumb/0/0f/Makara_of_Universitas_Indonesia.svg/1200px-Makara_of_Universitas_Indonesia.svg.png'
    },
    {
      programType: 'Magang Bersertifikat',
      programTitle: 'Digital Marketing Intern',
      agencyName: 'Tokopedia',
      description: 'lorem ipsum dolor sit amet',
      agencyImage: 'https://play-lh.googleusercontent.com/KFde1iTB5pC3jKwYhuvOKbxyfbnjxqY6V6_HBOkJMOzPQ7j0qo7HnfOrYA-TuBv-iYoj'
    },
    {
      programType: 'Student Exchange',
      programTitle: 'Pertukaran Pelajar',
      agencyName: 'Harvard University',
      description: 'lorem ipsum dolor sit amet',
      agencyImage: 'https://upload.wikimedia.org/wikipedia/en/thumb/2/29/Harvard_shield_wreath.svg/1200px-Harvard_shield_wreath.svg.png'
    }
  ]

  return (
    <Paper
      sx={{
        p: 2,
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Grid container spacing={2} alignItems="stretch">
        { datas.map((data, index) => (
          <Grid item xs={12} md={6} lg={4} key={index}>
            <Card params={data} />
          </Grid>
        )) }
      </Grid>
    </Paper>
  )
}

export default Home