import React from "react";
import { useTheme } from "@emotion/react";
import {Box, Button, Typography, Modal} from "@mui/material";


import BaseButton from "./base_button";
import Logo from "../../assets/images/DareDevilsBarLogo.jpg";

export default function BaseModal({open, handleClose, actionText, actionButtons = []}) {
    const theme = useTheme();
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 300,
        color:"white",
        bgcolor: theme.palette.primary.main,
        border: '2px solid #000',
        boxShadow: 24,
        display:"flex",
        flexDirection:"column",
        alignItems:"center",
        justifycontent:"center",
        p: 4,
      };
    return (
        <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
            <img src={Logo} width="50%" /> 
          <Typography id="modal-modal-title" variant="h6" component="h2" sx={{mt: 3, mb:3}}>
            {actionText}
          </Typography>
          {actionButtons.length>0 && actionButtons.map(button => button)}
          <BaseButton 
          onClickHandler={handleClose} 
          variant = "outlined" 
          sx = {{color:theme.palette.secondary.main, border:"1px solid", ":hover":{ border:"1px solid"}}}
          >Cancel</BaseButton>
        </Box>
      </Modal>
    )
}