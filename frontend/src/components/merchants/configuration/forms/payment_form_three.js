import React, { useEffect, useState } from "react";
import { Grid, Container, Typography, Button, ListItem, ListItemText, IconButton, List, Checkbox } from "@mui/material";
import {useForm} from "react-hook-form";
import { useConfigureNewPaymentMutation } from "../../../../js/slices/api_slices/merchant_api";
import useSnackbarNotification from "../../../../js/hooks/snack_notification_hook";
import DeleteOutlineOutlined from "@mui/icons-material/DeleteOutlineOutlined";
import { BaseButton, BaseTextField } from "../../../base_components";
import { useNavigate } from "react-router-dom";

export default function PaymentConfigurationFormThree ({formType, merchantId}) {
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    const [inputListField, setInputListField] = useState('');
    const [inputList, setinputList] = useState({});
    const {register, handleSubmit, formState:{errors}} = useForm();
    const [configurePayment, {
        data,
        isSuccess, 
        error, 
        isError,  
        isLoading
    }] = useConfigureNewPaymentMutation();
    const {errorSnackBar, successSnackBar} = useSnackbarNotification();

    useEffect(()=>{
        if(data && isSuccess) {
            successSnackBar({message:"Payment type Created Successfully"})
            navigate("/home/merchants");
        }
        if(isError && error) {
            errorSnackBar({message:error?.data?.errorMessage})
        }
    }, [data, isSuccess, error, isError])
    const addinputListHandler = ()=>{
        setinputList(prevState=> ({...prevState, [inputListField]:false}));
        setInputListField('');
    }
    const deleteInputListHandler= (key)=>{
        setinputList(prevState=>{
            let listCopy = {...prevState};
            delete listCopy[key];
            return {...listCopy};
        })
    }
    const displayInputListItems = Object.keys(inputList).map(key =>(
        <ListItem
        key={key}
        disableGutters
        sx={{
            maxHeight:"40px",
            backgroundColor:"secondary.100",
            pl:2,
        }}>
            <Checkbox 
            checked
           onChange={(event)=>setinputList(prevState=>({...prevState, [key]:event.target.checked}))}
           sx={{
                p:0,
                mr:1,
                "&.Mui-checked":{
                    color:"secondary.contrastText",
                }
            }}></Checkbox>
            <ListItemText>{key}</ListItemText>
            <IconButton onClick={()=> deleteInputListHandler(key)} sx={{color:"secondary.contrastText",}}><DeleteOutlineOutlined /></IconButton>
        </ListItem>
    ))
    return (
        <Grid container 
        component='form'
        onSubmit={handleSubmit(({paymentName, collectionName})=>{
            const configDetails = {
                merchantId,
                paymentType:{
                    name:paymentName,
                    formType, 
                    inputFields:inputList,
                    collectionName
                }
                
            }
            configurePayment({configDetails, authToken: token})
        })}
        sx={{height:"100%"}}>
            <Grid item xs={6} sx={{
                display:"flex",
                flexDirection:"column",
                justifyContent:"space-between",
            }}>
                <Container disableGutters>
                <Container>
                    <Typography variant="h6" color='secondary.main'>Payment Name*</Typography>
                    <BaseTextField 
                    size='small'
                    name='paymentName'
                    errors={errors}
                    validate={register('paymentName', {
                        required:'Payment Type is required'
                    })}
                    />
                </Container>
                <Container>
                    <Typography variant="h6" color='secondary.main'>Payment Collection Name*</Typography>
                    <BaseTextField 
                    size='small'
                    name="collectionName"
                    errors={errors}
                    validate={register("collectionName", {
                       required:"Payment Collection Name is required"
                    })}
                        />
                </Container>
                </Container>
                <Container sx={{
                    pb:2,
                    display:"flex",
                    gap:1
                }}>
                    <BaseButton
                    variant='outlined'
                    fullWidth={false}
                    sx={{
                        width:"100px",
                        borderRadius:"20px",
                    }}
                    >
                    Cancel
                    </BaseButton>
                    <BaseButton
                    variant='contained'
                    isLoading={isLoading}
                    type='submit'
                    sx={{
                        width:"100px",
                        backgroundColor:"secondary.contrastText",
                        borderRadius:"20px",
                        ":hover":{
                            backgroundColor:"secondary.contrastText"
                        }
                    }}
                    >Submit</BaseButton>
                </Container>               
            </Grid>

            <Grid item xs={6}>
                    <Container>
                    <Typography variant="h6" color='secondary.main'>User-Data Fields</Typography>
                    <BaseTextField 
                    size='small'
                    value={inputListField}
                    onChange= {(event)=> setInputListField(event.target.value)}
                    sx={{
                        mt:1,
                    }}
                    />
                    <Container disableGutters sx={{
                        display:"flex",
                        justifyContent:"flex-end",
                    }}>
                        <BaseButton
                        variant='contained'
                        fullWidth={false}
                        disabled={!inputListField}
                        onClickHandler={addinputListHandler}
                        sx={{
                            backgroundColor:"secondary.contrastText",
                            borderRadius:"15px",
                            ":hover":{
                                backgroundColor:"secondary.contrastText",
                            }
                        }}
                        >
                            Add
                        </BaseButton>
                    </Container>
                    <List
                    sx={{
                        display:"grid",
                        gridTemplateColumns:"repeat(2, 1fr)",
                        gap:1,
                    }}>
                        {displayInputListItems}
                    </List>
                </Container>
            </Grid>
        </Grid>
    )
}