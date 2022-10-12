import NavBarComponent from "../components/NavBar"
import SideBarComponent from "../components/SideBar"
import { Grid } from "@mui/material"
import { Outlet } from "react-router-dom"

const DefaultLayout = () => {
  return (
    <>
      <Grid container>
        <Grid item xs={12}>
          <NavBarComponent title='MBKM' />
        </Grid>
        <Grid item xs={2}>
          <SideBarComponent />
        </Grid>
        <Grid item xs={10}>
          <Outlet />
        </Grid>
      </Grid>
    </>
  )
}

export default DefaultLayout