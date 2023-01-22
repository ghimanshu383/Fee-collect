import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {useForm} from "react-hook-form";
import { Grid, Container, Typography, ListItem, ListItemText, IconButton, List, Checkbox } from "@mui/material";
import EditOutlined from "@mui/icons-material/EditOutlined";
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import AddTaskRoundedIcon from '@mui/icons-material/AddTaskRounded';  

import { useModifyPaymentMutation } from "../../../js/slices/api_slices/merchant_api";
import useSnackbarNotification from "../../../js/hooks/snack_notification_hook";
import DeleteOutlineOutlined from "@mui/icons-material/DeleteOutlineOutlined";
import { BaseButton, BaseTextField, BaseModal } from "../../base_components";

export default function ModifyPaymentFormThree ({formType, merchantId, paymentDetails, disableEditingHandler}) {
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    const [inputListField, setInputListField] = useState('');
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [inputList, setinputList] = useState({...paymentDetails?.inputFields});
    const [editField, setEditField] = useState("");
    const [displayEditField, setDisplayEditField] = useState('');
    const {register, handleSubmit, formState:{errors}} = useForm({
        defaultValues: useMemo(()=>({
            paymentName: paymentDetails?.name,
            collectionName: paymentDetails?.collectionName,
        }), [paymentDetails])
    });
    const [modifyPayment, {
        data,
        isSuccess, 
        error, 
        isError,  
        isLoading
    }] = useModifyPaymentMutation();
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
    const inputFieldsEditHandler = (key)=>{
        let itemIndex = 0;
        const inputListArray = Object.entries(inputList);
        itemIndex = inputListArray.findIndex(item=> key === item[0]);
        const filtererdInputList = inputListArray.filter(item => key !== item[0]);
        filtererdInputList.splice(itemIndex, 0, [editField, inputList[key]]);
        const updatedInputList = Object.fromEntries(filtererdInputList);
        setinputList({...updatedInputList});
        setEditField("");
        setDisplayEditField("");
    }

    const displayInputListItems = Object.keys(inputList).map(key =>(
        <Container disableGutters key={key}>
            <ListItem
            disableGutters
            sx={{
                maxHeight:"40px",
                backgroundColor:"secondary.100",
                pl:2,
            }}>
                <Checkbox 
                checked={inputList[key]}
                onChange={(event)=>setinputList(prevState=>({...prevState, [key]:event.target.checked}))}
                sx={{
                        p:0,
                        mr:1,
                        "&.Mui-checked":{
                            color:"secondary.contrastText",
                        }
                }}></Checkbox>
                <ListItemText>{key}</ListItemText>
                <IconButton disableRipple onClick={()=> setDisplayEditField(key)} sx={{color:"secondary.200", p:0}}>
                    <EditOutlined />
                </IconButton>
                <IconButton onClick={()=> deleteInputListHandler(key)} sx={{color:"secondary.contrastText",}}><DeleteOutlineOutlined />
                </IconButton>
            </ListItem>
            {displayEditField === key && 
                <Container disableGutters
                sx={{
                    display:"flex",
                }}
                >
                <BaseTextField 
                size='small'
                value={editField}
                onChange = {(event)=> setEditField(event?.target?.value)}
                sx={{
                    mt:1,
                    mb:1,
                }}
                />
                <IconButton disableRipple
                onClick= {()=> inputFieldsEditHandler(key)}
                disabled= {!editField}
                sx={{
                    color:"green",
                    p:0,
                    pl:1,
                }}>
                    <AddTaskRoundedIcon />
                </IconButton> 
                <IconButton disableRipple 
                onClick={()=> {
                    setDisplayEditField('');
                    setEditField('');
                }}
                sx={{
                    color:"secondary.contrastText",
                    p:0,
                    pl:1,
                }}>
                    <CloseOutlinedIcon />
                </IconButton>
                </Container>}
        </Container>

    ))
    return (
        <Grid container 
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
                <Container
                    sx={{
                        display:"flex",
                        gap:1,
                        pb:2,
                    }}
                    >
                        <BaseButton
                        variant='outlined'
                        onClickHandler={disableEditingHandler}
                        fullWidth={false}
                        sx={{
                            borderRadius:"20px",
                            width:"100px",
                        }}
                        >
                            Cancel
                        </BaseButton>
                        <BaseButton
                        variant='contained'
                        onClickHandler={()=> setShowConfirmationModal(true)}
                        fullWidth={false}
                        type='submit'
                        sx={{
                           backgroundColor:"secondary.contrastText",
                            width:"100px",
                            borderRadius:"20px",
                            ":hover":{
                                backgroundColor:"secondary.contrastText",
                            }
                        }}
                        >
                            Modify
                        </BaseButton>
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
                <BaseModal
                open={showConfirmationModal}
                handleClose={()=> setShowConfirmationModal(false)}
                actionText = "Are you Sure?"
                actionButtons={[
                    <BaseButton
                    isLoading={isLoading}
                    onClickHandler={handleSubmit(({paymentName, collectionName})=>{
                        const modifyDetails = {
                            name: paymentName,
                            collectionName,
                            formType, 
                            inputFields: inputList,
                        }
                        modifyPayment({modifyDetails, merchantId, paymentName:paymentDetails?.name, authToken: token});
                    })}
                    sx={{
                        backgroundColor:"white",
                        color:"primary.main",
                        fontWeight:"bold",
                        mb:2,
                        ":hover":{
                            backgroundColor:"secondary.main"
                        }
                    }}
                    >Modify</BaseButton>
                ]}
                />
            </Grid>
        </Grid>
    )
}