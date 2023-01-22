import { Grid, Typography, Container, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { FORM_TYPES } from "../../../js/lib/constants";
import PaymentconfigurationFormOne from "./forms/payment_form_one";
import PaymentConfigurationFormThree from "./forms/payment_form_three";
import PaymentConfigurationFormTwo from "./forms/payment_form_two";

export default function PaymentConfiguration() {
    const params = useParams();
    const [paymentType, setPaymentType] = useState('');
    const displayPaymentForm = (formType)=>{
        switch(formType){
            case FORM_TYPES.FORM_ONE: return <PaymentconfigurationFormOne formType={formType} merchantId={params.id} />
            case FORM_TYPES.FORM_TWO: return <PaymentConfigurationFormTwo formType={formType} merchantId={params.id} />
            case FORM_TYPES.FORM_THREE: return <PaymentConfigurationFormThree formType={formType} merchantId={params.id} />
        }
    }
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
                        <Typography variant="h6" fontWeight='bold'>Configure Payments</Typography>
                        <Typography fontSize={12}>Configure the payment types for the merchants - select the payment type, the mandatory feilds and add the  configurable fields and click on submit </Typography>
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
                            pt:1
                        }}
                        >
                                <Typography color="secondary.contrastText" variant="h6" fontWeight='bold'>Merchant Id:</Typography>
                                <Typography>&nbsp; {params.id}</Typography>
                            </Container>   
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
                                        <MenuItem value="">
                                        <em>None</em>
                                        </MenuItem>
                                        <MenuItem value='formOne'>Form One</MenuItem>
                                        <MenuItem value='formTwo'>Form Two</MenuItem>
                                        <MenuItem value='formThree'>Form Three</MenuItem>
                                        <MenuItem value="formFour">Form Four</MenuItem>
                                    </Select>
                                </FormControl>
                            </Container>          
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
                    {displayPaymentForm(paymentType)}
                    </Container>
                 </Grid>
            </Grid>
        </React.Fragment>
    )
}