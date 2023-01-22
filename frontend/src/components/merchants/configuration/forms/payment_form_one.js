import React, { useEffect, useState } from "react";
import { List, ListItem, ListItemText, Typography, Container,IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import {useForm} from "react-hook-form";
import DeleteOutlineOutlined from "@mui/icons-material/DeleteOutlineOutlined";

import { BaseButton, BaseTextField } from "../../../base_components";
import useSnackbarNotification from "../../../../js/hooks/snack_notification_hook";
import { useConfigureNewPaymentMutation } from "../../../../js/slices/api_slices/merchant_api";

export default function PaymentconfigurationFormOne ({formType, merchantId}){
    const token = localStorage.getItem("token");
    const [userDetailsField, setUserDetailsField] = useState('');
    const [payContentField, setPayContentField] = useState('');
    const [userDetails, setUserDetails] = useState([]);
    const [payContent, setPayContent] = useState([]);
    const {register, handleSubmit, formState:{errors}} = useForm();
    const navigate = useNavigate();
    const {errorSnackBar, successSnackBar} = useSnackbarNotification();
    const [configureNewPayment, {
        data,
        isSuccess, 
        error, 
        isError,
        isLoading
    }] = useConfigureNewPaymentMutation();
    useEffect(()=>{
        if(isSuccess && data) {
            successSnackBar({message:"Fee Details Updated Successfully!"});
            navigate("/home/merchants")
        }
        if(error && isError) {
            errorSnackBar({message:error?.data?.errorMessage});
        }
    }, [error, isError, isSuccess, data])
    return (
        <React.Fragment>
            <Container
            component='form'
            onSubmit={handleSubmit(({idToDisplay, paymentName})=>{
                if(payContent.length < 1) {
                    errorSnackBar({message:"Add one pay Content"})
                    return;
                }
                const configDetails = {
                    merchantId,
                    paymentType :{
                        name: paymentName,
                        idToDisplay,
                        formType,
                        userDetails, 
                        payContent,
                    }
                }
                configureNewPayment({configDetails, authToken:token})
            })}
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
                            setUserDetailsField("");
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
                                <ListItem 
                                key={detail}
                                disableGutters
                                divider
                                sx={{
                                    maxHeight:"40px",
                                    backgroundColor:"secondary.100"
                                }}>
                                    <ListItemText sx={{
                                        paddingLeft:2
                                    }}>{detail}</ListItemText>
                                    <IconButton sx={{color:"secondary.contrastText"}} onClick={()=>{
                                        setUserDetails(prevState =>{
                                            return prevState.filter(item => item !==detail)
                                        })
                                    }}>
                                        <DeleteOutlineOutlined/>
                                    </IconButton>                   
                                </ListItem>
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
                                    <ListItem
                                    key={content}
                                    disableGutters
                                    sx={{
                                        maxHeight:"40px",
                                        backgroundColor:"secondary.100",
                                    }}
                                    >
                                        <ListItemText sx={{pl:2,}} primary={content}/>
                                        <IconButton sx={{color:"secondary.contrastText"}} onClick={()=>{
                                            setPayContent(prevState=>{
                                                return prevState.filter(item => item !==content)
                                            })
                                        }}>
                                            <DeleteOutlineOutlined/>
                                        </IconButton>
                                    </ListItem>
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
               sx={{
                   borderRadius:"30px",
                   width:100,
                   
               }}
               >
               Cancel
               </BaseButton>
                    <BaseButton
                    isLoading={isLoading}
                    variant='contained'
                    fullWidth={false}
                    type='submit'
                    sx={{
                        backgroundColor:"secondary.contrastText",
                        borderRadius:"30px",
                        width:100,
                        ":hover":{
                            backgroundColor:"secondary.contrastText"
                        }
                    }}
                    >
                    Submit
                    </BaseButton>
               </Container>
            </Container>
        </React.Fragment>
    )
}