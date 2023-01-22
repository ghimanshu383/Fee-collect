import { 
    Grid, 
    Typography, 
    Container, 
    Select, 
    MenuItem, 
    FormControl, 
    InputLabel, 
    ListItem, 
    ListItemText, 
    List, 
    Card, 
    CardContent, 
    CardActions,
    IconButton,
    } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';

import { FORM_TYPES } from "../../../js/lib/constants";
import {BaseModal, BaseButton} from "../../base_components/index";
import ModifyPaymentFormOne from "./modify_payment_formOne";
import ModifyPaymentFormTwo from "./modify_payment_formTwo";
import ModifyPaymentFormThree from "./modify_payment_formThree";
import useSnackbarNotification from "../../../js/hooks/snack_notification_hook";
import {useGetpaymentsQuery, useDeletePaymentMutation} from "../../../js/slices/api_slices/merchant_api"

export default function ModifyPayment() {
    const token = localStorage.getItem("token");
    const {id} = useParams();
    const [payments, setPayments] = useState([]);
    //using this payment name to pass on to base modal
    const [paymentName, setPaymentName] = useState("");
    const [formType, setFormType] = useState('');
    const [enableEdit, setEnableEdit] = useState(false);
    const [editingComponent, setEditingComponent] = useState('');
    const {errorSnackBar, successSnackBar} = useSnackbarNotification();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [paymentType, setPaymentType] = useState("all");
    const {
        data,
        isSuccess,  
        isError, 
        error,
    } = useGetpaymentsQuery({merchantId: id, authToken: token}, {refetchOnMountOrArgChange: true}); 
    const [deletePayment, {
        data:deleteData,
        isSuccess: deleteIsSuccess,
        isError: deleteIsError, 
        error: deleteError,
        isLoading,
    }] = useDeletePaymentMutation();
    
    useEffect(()=>{
        if(isSuccess && data) {
            setPayments([...data?.data?.paymentTypes]);
        }
        if(isError && error) {
            errorSnackBar({message:error?.data?.errorMessage});
        }
    }, [data, isSuccess, error, isError])

    useEffect(()=>{
        if(deleteIsSuccess && deleteData) {
            setPayments([...deleteData?.data?.paymentTypes]);
            successSnackBar({message:"payment Type deleted successfully"});
            setShowDeleteModal(false);
        }if(deleteError && deleteIsError) {
            errorSnackBar({message: deleteError?.data?.errorMessage});
        }
    }, [deleteData, deleteIsSuccess, deleteIsError, deleteError])

    const paymentEditHandler = (formType, paymentDetails) =>{
        switch(formType) {
            case FORM_TYPES.FORM_ONE :
                return <ModifyPaymentFormOne 
                        formType={formType}
                        merchantId={id}
                        paymentDetails={paymentDetails}
                        disableEditingHandler={()=> setEnableEdit(false)}/>
            case FORM_TYPES.FORM_TWO : 
                return <ModifyPaymentFormTwo
                        formType={formType} 
                        merchantId={id} 
                        paymentDetails={paymentDetails} 
                        disableEditingHandler= {()=> setEnableEdit(false)}/>
            case FORM_TYPES.FORM_THREE :
                return <ModifyPaymentFormThree
                        formType={formType}
                        merchantId={id}
                        paymentDetails={paymentDetails}
                        disableEditingHandler= {()=> setEnableEdit(false)} />
        }
    }
    const displayPaymentTypes = payments.map(payment => (
        <ListItem key={payment?.name}>
            <ListItemText>
                <Card sx={{display:'flex', justifyContent:"space-between", backgroundColor:"secondary.100"}}>
                    <CardContent>
                        <Typography fontSize={18} fontStyle='italic'>{payment?.name}</Typography>
                    </CardContent>
                    <CardActions>
                        <IconButton 
                        onClick={()=>{
                            setEnableEdit(true);
                            const editComponent = paymentEditHandler(payment?.formType, payment);
                            setEditingComponent(editComponent);
                        }}
                        sx={{color:"green"}}  >
                            <ModeEditOutlineOutlinedIcon />
                        </IconButton>
                        <IconButton sx={{color:"secondary.contrastText"}} onClick={()=>{
                            setPaymentName(payment?.name);
                            setFormType(payment?.formType);
                            setShowDeleteModal(true);
                        }}>
                            <DeleteOutlineOutlinedIcon />
                        </IconButton>
                    </CardActions>
                </Card>
            </ListItemText>
        </ListItem>
    ))
    return (
        <React.Fragment>
            <Grid
            container
            direction='column'
            sx={{               
                height:"100%",
                width:"100%",
                borderRadius:5,
                bgcolor:"secondary.light"
            }}
            >
                <Grid
                 item
                 bgcolor="secondary.light"
                 p={1}
                 xs={2}
                 >
                    <Container 
                    disableGutters
                    >
                        <Typography variant="h6" fontWeight='bold'>Modify Payments</Typography>
                        <Typography fontSize={12}>All the payment for a particular merchant are shown here, can be filtered on basis of form type by default every payment is shown - Select the payment you want to modify </Typography>
                    <Container
                    disableGutters
                    sx={{
                        display:'flex',
                        alignitems:"center",
                        justifyContent:"space-around",
                        pt:1
                    }}
                    >  
                        <Container
                        disableGutters
                        sx={{
                            display:"flex",
                            alignItems:"center",
                            mt:1,
                            pt:1
                        }}
                        >
                                <Typography color="secondary.contrastText" variant="h6" fontWeight='bold'>Merchant Id:</Typography>
                                <Typography>&nbsp; {id}</Typography>
                            </Container> 
                            {!enableEdit &&   
                            <Container
                            disableGutters
                            sx={{
                                display:"flex",
                                alignItems:"center",
                            }}
                            >
                                <Typography color="secondary.contrastText" variant="h6" fontWeight='bold'>Select Payment Type: </Typography>
                                <FormControl sx={{ m: 1, minWidth: 150 }} size="small">
                                    <InputLabel id="paymentType">Payment Type</InputLabel>
                                    <Select
                                        labelId="paymentType"
                                        id="paymentType"
                                        label="Payment Type"
                                        value={paymentType}
                                        onChange={(event)=>setPaymentType(event?.target?.value)}
                                    >
                                        <MenuItem value="all"> All </MenuItem>
                                        <MenuItem value='formOne'>Form One</MenuItem>
                                        <MenuItem value='formTwo'>Form Two</MenuItem>
                                        <MenuItem value='formThree'>Form Three</MenuItem>
                                        <MenuItem value="formFour">Form Four</MenuItem>
                                    </Select>
                                </FormControl>
                            </Container>     
                            }     
                        </Container>
                    </Container>
                </Grid>
                 <Grid
                 item
                 bgcolor="secondary.light"
                 sx={{
                    overflowY:"scroll"
                 }}
                 pb={2}
                 xs={9}>
                        <Container
                        disableGutters
                        sx={{
                            width:"95%",
                            height:"100%",
                            backgroundColor:"white",
                        }}>
                          {
                            enableEdit ? editingComponent : 
                                <List sx={{
                                    display:"grid",
                                    gridTemplateColumns:"repeat(2, 1fr)",
                                }}>
                                    {displayPaymentTypes}
                                </List> 
                           }
                            <BaseModal 
                            open={showDeleteModal}
                            handleClose={()=> setShowDeleteModal(false)}
                            actionText="Are you sure ?"
                            actionButtons={[
                            <BaseButton 
                                key={paymentName}
                                isLoading= {isLoading}
                                onClickHandler={()=> deletePayment({
                                    merchantId: id, 
                                    paymentName,formType, 
                                    authToken: token})}    
                                sx={{
                                backgroundColor:"white",
                                mb:2,
                                fontWeight:"bold",
                                color:"primary.main",
                                ":hover":{
                                    backgroundColor:"secondary.main",
                                }
                            }}>Delete</BaseButton>]}
                        />
                        </Container> 
                 </Grid>
            </Grid>
        </React.Fragment>
    )
}