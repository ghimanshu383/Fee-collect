import Close from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';
import {useSnackbar} from 'notistack';

export default function useSnackbarNotification () {
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const action = (snackbarKey)=>{
        return (
            <IconButton onClick={()=>closeSnackbar(snackbarKey)}>
                <Close style={{color:"#fff", fontSize:"18px"}} />
            </IconButton>
        )
    }
    const getDefaultOptions = (variant, key=Date.now(), autoHideDuration=1500, moreOptions= {}) =>{
        return {
            variant, 
            key, 
            autoHideDuration,
            action,
            ...moreOptions
        }
    }
    const successSnackBar = ({message, key, autoHideDuration, moreOptions})=>{
        enqueueSnackbar(message, getDefaultOptions('success', key, autoHideDuration, moreOptions));
    }
    const errorSnackBar = ({message="Internal Server Error", key, autoHideDuration, moreOptions})=>{
        enqueueSnackbar(message, getDefaultOptions("error", key, autoHideDuration, moreOptions));
    }
    const warnSnackbar = ({message, key, autoHideDuration, moreOptions})=>{
        enqueueSnackbar(message, getDefaultOptions("warn", key, autoHideDuration, moreOptions));
    }

    return {
        successSnackBar,
        errorSnackBar,
        warnSnackbar,
    }
}