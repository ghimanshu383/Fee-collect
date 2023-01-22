import { Divider, Typography } from "@mui/material";
import { Container } from "@mui/system";
import React, { useEffect, useRef, useState } from "react";
import { BaseButton, BaseTextField } from "../../../base_components";

export default function UpdateMerchantForm ({ register, errors, isLoading}) {
    // const [merchant, setMerchant] = useState({...merchantDetails});

    return(
        <Container
        sx={{
            height:"100%",
            backgroundColor:"white",
            borderRadius:"20px",
            p:5,
            display:"flex",
            flexDirection:"column",
            justifyContent:"space-between"
        }}
        >   
            <Container>
                <Typography variant="h8" fontWeight="bold">Merchant Name</Typography>
                <BaseTextField 
                size="small"
                id="name"
                name="name"
                errors={errors}
                validate={register("name", {
                    required:"Merchant Name is required",
                })}
                />
                <Typography variant="h8" fontWeight="bold">Merchant Id</Typography>
                <BaseTextField
                disabled
                size="small" 
                id="merchantId"
                name="merchantId"
                errors={errors}
                validate={register("merchantId", {
                    required:"Merchant Id is reuqired"
                })}
                />
                <Typography variant="h8" fontWeight="bold">Address</Typography>
                <BaseTextField 
                size="small"
                id="merchantAddress"
                name="address"
                errors={errors}
                validate={register("address", {
                    required:"Merchant address is required"
                })}
                />
                <Divider/>
                <Typography variant="h6" fontWeight="bold" mt={2}>Bussiness Details</Typography>
                <Container
                sx={{
                    display:"flex",
                    alignItems:"center",
                    justifyContent:"space-around",
                    gap:"10px",
                    mt:2
                }}>
                    <div style={{flex:1}}>
                        <Typography>Phone Number</Typography>
                        <BaseTextField 
                        size="small"
                        id="merchantPhoneNumber"
                        name="phoneNumber"
                        errors={errors}
                        validate={register("phoneNumber", {
                            required:"Merchant phone number is required"
                        })}
                        />
                    </div>
                    <div style={{flex:1}}>
                        <Typography>Email</Typography>
                        <BaseTextField 
                        size="small"
                        id="merchantEmail"
                        name="email"
                        errors={errors}
                        validate={register("email", {
                            required:"Merchant Email is required",
                            pattern:{
                                value:/^\S+@\S+\.\S+$/,
                                message:"Email is not valid"
                            }
                        })}
                        />
                    </div>
                </Container>
            </Container>
            <Container>
                <BaseButton
                isLoading={isLoading}
                fullWidth={false}
                type='submit'
                variant='contained'
                sx={{
                    backgroundColor:"secondary.contrastText",
                    borderRadius:"30px",
                    width:100,
                    ":hover":{
                        backgroundColor:"secondary.contrastText"
                    }
                }}
                >Submit</BaseButton>
            </Container>
        </Container>
    )
}