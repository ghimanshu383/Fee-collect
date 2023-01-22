
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Grid from '@mui/material/Grid';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';

import HomePageDrawerNav, { drawerNavLocations } from './home_drawer_component';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { BaseButton } from '../base_components';
import { Container } from '@mui/material';
import { HOME_DRAWER_PATHS } from '../../js/lib/constants';

const drawerWidth = 240;

function HomePageComponent() {
    const currentLocation = useLocation();
    const navigate = useNavigate();
    const selectedRouteParams = drawerNavLocations.find(item => item.path === currentLocation.pathname.split("/")[2]);
    const displayAdd = currentLocation.pathname.split("/").length === 3;
    const addButtonClickHandler = ()=>{
        switch (selectedRouteParams?.path) {
            case HOME_DRAWER_PATHS.MERCHANTS:
                navigate(`${selectedRouteParams?.path}/${HOME_DRAWER_PATHS.NEW_MERCHANT}`);
                break;
            case HOME_DRAWER_PATHS.MENUITEMS:
                navigate(`${selectedRouteParams?.path}/${HOME_DRAWER_PATHS.NEW_ITEM}`);
                break;
        }
    }
    return (
        <Grid sx={{ display: 'flex', backgroundColor: "primary.main", height: "100vh", }}>
            <CssBaseline />
            <AppBar
                position="fixed"
                sx={{
                    width: `calc(100% - ${drawerWidth}px)`,
                    ml: `${drawerWidth}px`,
                    backgroundColor: "primary.main",
                }}
            >
                <Toolbar
                disableGutters
                sx={{
                    display:"flex",
                    justifyContent:"space-between",
                    pr:2,
                }}>
                    <Container 
                    disableGutters
                    sx={{display:"flex", 
                    flexDirection:"row"}}>
                    {selectedRouteParams?.icon}
                    <Typography variant="h6" noWrap component="div" paddingLeft="8px">
                        {selectedRouteParams?.name}
                    </Typography>
                    </Container>
                    <div>
                        <BaseButton
                        startIcon={<AddIcon/>}
                        sx = {{
                            color:"white",
                            backgroundColor:"secondary.contrastText",
                            borderRadius:"30px",
                            width:100,
                            display: displayAdd ? "" : "none",
                            ":hover":{
                                backgroundColor:"secondary.contrastText",
                            }
                        }}
                        onClickHandler={addButtonClickHandler}
                        >Add</BaseButton>
                    </div>
                </Toolbar>
            </AppBar>
            <HomePageDrawerNav />
            <Grid
                component="main"
                sx={{
                    pt:8,
                    width: {
                        sm: `calc(100% - ${drawerWidth}px)`,
                        borderRadius: 10,
                        height: "99%",
                        backgroundColor: "white",
                        marginRight: "10px"
                    }
                }}
            >
                <Outlet />
            </Grid>
        </Grid>
    );
}

export default HomePageComponent;