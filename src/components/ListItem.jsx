import {
  ListItemButton,
  ListItemIcon,
  ListItemText
} from "@mui/material"
import { useLocation, useNavigate } from "react-router-dom"

const ListItem = ({ icon, path, name }) => {
  const { pathname } = useLocation()
  const navigate = useNavigate()

  return (
    <ListItemButton
      selected={ pathname == path }
      onClick={ () => navigate(path) }
    >
      <ListItemIcon>
        { icon }
      </ListItemIcon>
      <ListItemText primary={ name } />
    </ListItemButton>
  )
}

export default ListItem