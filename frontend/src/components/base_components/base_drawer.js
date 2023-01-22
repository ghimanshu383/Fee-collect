import { Divider, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar } from "@mui/material";
import { Container } from "@mui/system";
import logo from "../../assets/images/DareDevilsBarLogo.jpg";
import React from "react";
import PermIdentityOutlinedIcon from '@mui/icons-material/PermIdentityOutlined';
import AddCardOutlinedIcon from '@mui/icons-material/AddCardOutlined';
import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined';
import CurrencyExchangeOutlinedIcon from '@mui/icons-material/CurrencyExchangeOutlined';
import { useNavigate } from "react-router-dom";

export default function BaseDrawer ({open, setClose, merchantId}) {
    const navigate = useNavigate();
    const merchantDrawerActions = [
        {
          name:"Modify Details",
          icon: <PermIdentityOutlinedIcon />,
          path: `${merchantId}/update-details`,
        },
        {
            name:"Add Payment-Type",
            icon: <AddCardOutlinedIcon />,
            path: `${merchantId}/add-payment`,
        },
        {
            name:"Modify Payment-Type",
            icon: <CurrencyExchangeOutlinedIcon />,
            path: `${merchantId}/modify-payment`,
        },
        {
            name:"Add Payment-Gateway",
            icon:<AccountBalanceOutlinedIcon />,
            path:`${merchantId}/add-payment-gateway`
        }
      ]
    return (
        <Drawer 
        anchor="right"
        open={open}
        onClose={()=> setClose(false)}>
            <Container 
            disableGutters
            sx={{
                pt:4,
                width:240,
                display:"flex",
                flexDirection:"column",
                alignItems:"center",
            }}>
                <Container
                sx={{
                    pb:4,
                    display:'flex',
                    justifyContent:"center"
                    }}>
                    <img src={logo} width="80%" />
                </Container>
                <List>
                    <Divider/>
                    {merchantDrawerActions.map(action=>(
                        <ListItem disableGutters key={action.name} sx={{color:"primary.main", p:1}}>
                            <ListItemButton
                             disableGutters 
                             onClick={()=>{
                                navigate(action.path)
                             }}
                             >
                                <ListItemIcon sx={{
                                    display:"flex",
                                    alignItems:"center",
                                    justifyContent:"center",
                                }}>{action.icon}</ListItemIcon>
                                <ListItemText sx={{fontSize:18}} primary={action.name} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Container>
        </Drawer>
    )
}