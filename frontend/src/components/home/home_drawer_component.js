import React from "react";
import { List, ListItem, ListItemIcon, ListItemButton, ListItemText, Divider, Toolbar, Typography } from "@mui/material";
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import SettingsIcon from '@mui/icons-material/Settings';
import Drawer from '@mui/material/Drawer';
import { NavLink } from "react-router-dom"

import Logo from "../../assets/images/DareDevilsBarLogo.jpg";
import LogoutComponent from "../login/logout_component";
import { HOME_DRAWER_PATHS } from "../../js/lib/constants";
import { useTheme } from "@emotion/react";

export const drawerNavLocations = [
  {
    path: HOME_DRAWER_PATHS.MERCHANTS,
    icon: <PeopleAltIcon />,
    name: "Merchants",
  },
  {
    path: HOME_DRAWER_PATHS.MENUITEMS,
    icon: <FastfoodIcon />,
    name: "Menu Items"
  },
  {
    path: HOME_DRAWER_PATHS.SETTINGS,
    icon: <SettingsIcon />,
    name: "Settings"
  }
];

export default function HomePageDrawerNav() {
  const appTheme = useTheme();

  const drawer = (
    <div>
      <Toolbar>
        <Typography>LOGO</Typography>
      </Toolbar>
      <Divider />
      <List>
        {drawerNavLocations.map(({ path, name, icon }) => (
          <ListItem key={name} disablePadding>
            <NavLink 
            to={`/home/${path}`}
            style={
              ({isActive})=>isActive ? 
              {color: "white", textDecoration:'none'} : 
              {color:appTheme.palette.secondary.main, textDecoration: "none"}}
            >            
            <ListItemButton
            sx={{
              color:"inherit"
            }}>
              <ListItemIcon sx={{ color: "inherit" , display:"flex", justifyContent:"center"}}>
                {icon}
              </ListItemIcon>
              <ListItemText primary={name} />
            </ListItemButton>
            </NavLink>
          </ListItem>
        ))}
      </List>
      <List style={{
        position: "fixed",
        bottom: 0,
        textAlign: "center",
        paddingBottom: 10,
      }} >
        <ListItemButton>
          <LogoutComponent />
        </ListItemButton>
      </List>
    </div>
  );

  return (
    <Drawer
      PaperProps={{
        sx: {
          backgroundColor: "primary.main",
          color: "white",
        }
      }}
      anchor="left"
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        display: { xs: 'none', sm: 'block' },
        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
      }}
      open
    >
      {drawer}
    </Drawer>
  )
}