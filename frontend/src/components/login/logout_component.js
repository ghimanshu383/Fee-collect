import React, { useEffect, useState } from "react";
import LogoutIcon from '@mui/icons-material/Logout';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';

import { useLogoutActionMutation } from "../../js/slices/api_slices/auth_api";
import { BaseButton, BaseModal } from "../base_components";
import { logout } from "../../js/slices/user_slice";
import useSnackbarNotification from "../../js/hooks/snack_notification_hook";

export default function LogoutComponent() {
    const token = localStorage.getItem("token");
    const [displayModal, setDisplayModal] = useState(false);
    const { errorSnackBar } = useSnackbarNotification();
    const dispatch = useDispatch();
    const logoutClickHandler = () => {
        setDisplayModal(true);
    }
    const [logoutAction, {
        data,
        isSuccess,
        error,
        isError,
        isLoading
    }] = useLogoutActionMutation();
    const navigate = useNavigate();

    const logoutActionButtons = [
        <BaseButton
            key="logoutAction"
            isLoading={isLoading}
            onClickHandler={() => {
                logoutAction(token);
            }}
            sx={{
                backgroundColor: "white",
                mb: 2,
                color: "primary.main",
                ":hover": {
                    backgroundColor: "secondary.main",
                }
            }}
        >Logout
        </BaseButton>
    ]
    useEffect(() => {
        if (data && isSuccess) {
            dispatch(logout());
            navigate("/login",{replace:true});
            setDisplayModal(false);
        }
        if (error && isError) {
            errorSnackBar({ message:error?.data?.errorMessage });
            setDisplayModal(false);
        }
        
    }, [isSuccess, data, error, isError,isLoading])

    return (
        <React.Fragment>
            <BaseButton
                isLoading={isLoading}
                fullWidth={false}
                variant="contained"
                sx={{ 
                    color: "secondary.main",
                     }}
                startIcon={<LogoutIcon />}
                onClickHandler={logoutClickHandler}
            >
                Logout
            </BaseButton>
            <BaseModal open={displayModal}
                handleClose={() => setDisplayModal(false)}
                actionText="Are you sure you want to logout ?"
                actionButtons={logoutActionButtons}
            >
            </BaseModal>
        </React.Fragment>
    )
}