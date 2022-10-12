import { 
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText
} from "@mui/material"

const SideBarItemComponent = ({ text, icon }) => {
  return (
    <ListItem>
      <ListItemButton>
        <ListItemIcon>
          { icon }
        </ListItemIcon>
        <ListItemText>{ text }</ListItemText>
      </ListItemButton>
    </ListItem>
  )
}

export default SideBarItemComponent