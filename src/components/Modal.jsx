import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from "@mui/material"
import { useState } from "react"

const Modal = (props) => {
  return (
    <Dialog open={props.open} onClose={props.setOpen}>
      <DialogTitle>
        {props.title}
      </DialogTitle>
      <DialogContent>
        {props.children}
      </DialogContent>
    </Dialog>
  )
}

export default Modal