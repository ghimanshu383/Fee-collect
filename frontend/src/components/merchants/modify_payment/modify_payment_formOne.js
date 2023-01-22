import React, { useEffect, useMemo, useState } from "react";
import { List, ListItem, ListItemText, Typography, Container,IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import {useForm} from "react-hook-form";
import EditOutlined from "@mui/icons-material/EditOutlined";
import AddTaskRoundedIcon from '@mui/icons-material/AddTaskRounded';  
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import DeleteOutlineOutlined from "@mui/icons-material/DeleteOutlineOutlined";

import { BaseButton, BaseTextField, BaseModal } from "../../base_components";
import useSnackbarNotification from "../../../js/hooks/snack_notification_hook";
import { useModifyPaymentMutation } from "../../../js/slices/api_slices/merchant_api";

export default function ModifyPaymentFormOne ({formType, merchantId, paymentDetails, disableEditingHandler}){
    const token = localStorage.getItem("token");
    const [userDetailsField, setUserDetailsField] = useState('');
    const [payContentField, setPayContentField] = useState('');
    const [editField, setEditField] = useState("");
    const [enableEditField, setEnableEditField] = useState('');
    const [userDetails, setUserDetails] = useState([...paymentDetails?.template_ref?.userDetails]);
    const [payContent, setPayContent] = useState([...paymentDetails?.template_ref?.payContent]);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const {register, handleSubmit, formState:{errors}} = useForm({
        defaultValues:useMemo(()=>{
            return {
                paymentName: paymentDetails?.name,
                idToDisplay: paymentDetails?.idToDisplay,
            }
    }, [paymentDetails])});
    const navigate = useNavigate();
    const {errorSnackBar, successSnackBar} = useSnackbarNotification();
    const [modifyPayment, {
        data,
        isSuccess, 
        error, 
        isError,
        isLoading
    }] = useModifyPaymentMutation();
    
    useEffect(()=>{
        if(isSuccess && data) {
            successSnackBar({message:"Fee Details Updated Successfully!"});
            navigate("/home/merchants")
        }
        if(error && isError) {
            errorSnackBar({message:error?.data?.errorMessage});
        }
    }, [error, isError, isSuccess, data])

    const modifyUserDetailsHandler = (detail)=>{
        const userDetailsCopy = [...userDetails];
        const itemIndex = userDetailsCopy.indexOf(detail);
        const filteredList = userDetailsCopy.filter(item => item !== detail);
        filteredList.splice(itemIndex, 0, editField );
        setUserDetails([...filteredList]);
        setEditField("");
    }
    const modifyPayContentHandler = (content) =>{
        const payContentCopy = [...payContent];
        const contentIndex = payContent.indexOf(content);
        const filteredList = payContentCopy.filter(item => item !== content);
        filteredList.splice(contentIndex, 0, editField);
        setPayContent([...filteredList]);
        setEditField("");
    }
    return (
        <React.Fragment>
            <Container
            sx={{
                display:"flex",
                flexDirection:"column",
                height:"100%",
                justifyContent:"space-between",
            }}
            >   
                <Container
                disableGutters
                sx={{
                    pt:2,
                    display:"flex",
                    alignItems:"flex-start",
                    justifyContent:"space-between",
                    gap:3,
                }}
                >                       
                <Container
                disableGutters
                sx={{
                    display:"flex",
                    flexDirection:"column",
                    alignItems:"flex-start"
                }}
                >   
                    <Container disableGutters>
                        <Typography color='secondary.main'>Id To Display*</Typography>
                        <BaseTextField 
                        size="small"
                        name="idToDisplay"
                        id="idToDisplay"
                        errors={errors}
                        validate={register("idToDisplay", {
                            required:"Id To Display is required"
                        })}
                        />
                    </Container>
                    <Container disableGutters sx={{display:"flex"}}>
                        <Container disableGutters>
                            <Typography color='secondary.main'>User Details</Typography>
                            <BaseTextField 
                            size="small"
                            value={userDetailsField}
                            sx={{mt:1}}
                            onChange={(event)=>setUserDetailsField(event?.target?.value)}
                            />
                        </Container>
                        <BaseButton
                        variant='contained'
                        fullWidth={false}
                        disabled={!userDetailsField}
                        onClickHandler={()=> {
                            setUserDetails(prevState=>[...prevState,userDetailsField])
                            setUserDetailsField('');
                        }}
                        sx={{
                            color:"white",
                            backgroundColor:"secondary.contrastText",
                            height:"40%",
                            alignSelf:"center",
                            mt:2,
                            ml:2,
                            borderRadius:"15px",
                            ":hover":{
                                backgroundColor:"secondary.contrastText",
                            }
                        }}
                        >
                        Add
                        </BaseButton>
                    </Container>
                    <Container
                    disableGutters                  
                    >
                        <List
                        sx={{
                            display:'grid',
                            gridTemplateColumns: "repeat(2, 1fr)",
                            gap:1
                        }}
                        >
                            {userDetails.map(detail => (
                                <Container key={detail} disableGutters>
                                <ListItem 
                                    disableGutters
                                    divider
                                    sx={{
                                        maxHeight:"40px",
                                        backgroundColor:"secondary.100"
                                    }}>
                                        <ListItemText sx={{
                                            paddingLeft:2
                                        }}>{detail}</ListItemText>
                                        <IconButton 
                                        disableRipple
                                        onClick={()=>setEnableEditField(detail)}
                                        sx={{
                                            color:"secondary.200",
                                            p:0,
                                        }}>
                                            <EditOutlined/>
                                        </IconButton>
                                        <IconButton sx={{color:"secondary.contrastText"}} onClick={()=>{
                                            setUserDetails(prevState =>{
                                                return prevState.filter(item => item !==detail)
                                            })
                                        }}>
                                            <DeleteOutlineOutlined/>
                                        </IconButton>                   
                                    </ListItem>
                                    {enableEditField===detail &&                
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
                                    onClick= {()=> modifyUserDetailsHandler(detail)}
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
                                        setEnableEditField('');
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
 
                            ))}
                        </List>
                    </Container>
                </Container> 

                    <Container
                    disableGutters
                    >
                        <Container
                        disableGutters
                        sx={{
                            display:"flex",
                            flexDirection:"column",
                            pr:2,
                        }}
                        >
                            <Typography color='secondary.main'>Payment Name*</Typography>
                            <BaseTextField
                            size='small'
                            name="paymentName"
                            id="paymentName"
                            errors={errors}
                            validate={register("paymentName", {
                                required:"Payment Name is required",
                            })}
                            />
                            </Container>
                            <Container
                            disableGutters
                            sx={{
                                display:"flex",
                                flexDirection:"column",
                                alignItems:"flex-start",
                                justifyContent:"center",
                            }}
                            >
                            <Container
                            disableGutters sx={{
                                display:"flex",

                            }}>
                                <Container disableGutters>
                                    <Typography color='secondary.main'>Pay Content</Typography>
                                        <BaseTextField 
                                        size="small"

                                        value={payContentField}
                                        sx={{
                                            p:0,
                                            mt:'5px',
                                        }}
                                        onChange={(event)=>setPayContentField(event?.target?.value)}
                                        /> 
                                </Container>
                                    <BaseButton
                                    variant="contained"
                                    fullWidth={false}
                                    disabled={!payContentField}
                                    onClickHandler={() => {
                                        setPayContent(prevState=> [...prevState, payContentField])
                                        setPayContentField('');
                                    }}
                                    sx={{
                                        color:"white",
                                        backgroundColor:"secondary.contrastText",
                                        borderRadius:"15px",
                                        alignSelf:"center",
                                        height:"40%",
                                        mt:2,
                                        ml:2,
                                        ":hover":{
                                            backgroundColor:"secondary.contrastText"
                                        }
                                    }}
                                    >
                                    Add</BaseButton> 
                            </Container>                                           
                        </Container>
                        <Container
                        disableGutters
                        >
                            <List sx={{
                                display:"grid",
                                gridTemplateColumns:"repeat(2, 1fr)",
                                gap:1,
                            }}>
                                {payContent.map(content=> (
                                    <Container key={content} disableGutters>
                                        <ListItem
                                        disableGutters
                                        sx={{
                                            maxHeight:"40px",
                                            backgroundColor:"secondary.100",
                                        }}
                                        >
                                            <ListItemText sx={{pl:2,}} primary={content}/>
                                            <IconButton 
                                            onClick={()=> setEnableEditField(content)}
                                            sx={{
                                                p:0,
                                                color:"secondary.200"
                                            }}>
                                                <EditOutlined/>
                                            </IconButton>
                                            <IconButton sx={{color:"secondary.contrastText"}} onClick={()=>{
                                                setPayContent(prevState=>{
                                                    return prevState.filter(item => item !==content)
                                                })
                                            }}>
                                                <DeleteOutlineOutlined/>
                                            </IconButton>
                                        </ListItem>
                                        {enableEditField === content &&
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
                                        onClick= {()=> modifyPayContentHandler(content)}
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
                                            setEnableEditField('');
                                            setEditField('');
                                        }}
                                        sx={{
                                            color:"secondary.contrastText",
                                            p:0,
                                            pl:1,
                                        }}>
                                            <CloseOutlinedIcon />
                                        </IconButton>
                                        </Container>                                        
                                        }
                                    </Container>
                                ))}
                            </List>
                        </Container>                              
                    </Container>         
                </Container>
               <Container
               disableGutters
               sx={{
                pb:3,
                display:"flex",
                gap:2
               }}
               >    
               <BaseButton
               variant='outlined'
               fullWidth={false}
               onClickHandler={disableEditingHandler}
               sx={{
                   borderRadius:"30px",
                   width:100,
                   
               }}
               >
               Cancel
               </BaseButton>
                    <BaseButton
                    variant='contained'
                    fullWidth={false}
                    onClickHandler={()=>setShowConfirmationModal(true)}
                    sx={{
                        backgroundColor:"secondary.contrastText",
                        borderRadius:"30px",
                        width:100,
                        ":hover":{
                            backgroundColor:"secondary.contrastText"
                        }
                    }}
                    >
                    Modify
                    </BaseButton>
               </Container>
               <BaseModal
                open={showConfirmationModal}
                handleClose={()=> setShowConfirmationModal(false)}
                actionText = "Are you Sure?"
                actionButtons={[
                    <BaseButton
                    variant="contained"
                    isLoading={isLoading}
                    onClickHandler={handleSubmit(({paymentName, idToDisplay})=>{
                        const modifyDetails = {
                            name: paymentName,
                            formType, 
                            idToDisplay,
                            templateRefType: paymentDetails?.template_ref_type,
                            templateRef:{
                                id: paymentDetails?.template_ref?._id,
                                userDetails,
                                payContent,
                            }
                        }
                        modifyPayment({modifyDetails, merchantId,paymentName:paymentDetails?.name, authToken: token});
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
            </Container>
        </React.Fragment>
    )
}