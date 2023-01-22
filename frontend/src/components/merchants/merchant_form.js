import { Divider, Typography } from "@mui/material";
import { Container } from "@mui/system";
import React from "react";
import { BaseButton, BaseTextField } from "../base_components";

export default function AddMerchantForm ({ register, errors}) {
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
                <BaseTextField 
                size="small"
                id="name"
                name="name"
                label="Merchant Name"
                errors={errors}
                validate={register("name", {
                    required:"Merchant Name is required"
                })}
                />
                <BaseTextField
                size="small" 
                id="merchantId"
                name="merchantId"
                label="Unique Merchant ID"
                errors={errors}
                validate={register("merchantId", {
                    required:"Merchant Id is reuqired"
                })}
                />
                <BaseTextField 
                size="small"
                id="merchantAddress"
                name="address"
                label="Primary Address"
                errors={errors}
                validate={register("address", {
                    required:"Merchant address is required"
                })}
                sx={{
                    mt:1, 
                    mb:1,
                }}
                />
                <Container
                sx={{
                    display:"flex",
                    alignItems:"center",
                    justifyContent:"space-between",
                    gap:2,
                }}
                >
                    <BaseTextField 
                    size='small'
                    name='city'
                    id='city'
                    label="City"
                    errors={errors}
                    validate={register("city", {
                        required:"City name is required"
                    })}
                    sx={{
                        mt:1,
                        mb:2,
                    }}
                    />
                    <BaseTextField 
                    size='small'
                    id='state'
                    name='state'
                    label='State'
                    errors={errors}
                    validate={register("state", {
                        required:"State name is required"
                    })}
                    sx={{
                        mt:1,
                        mb:2
                    }}
                    />
                </Container>
                
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
                        <BaseTextField 
                        size="small"
                        id="merchantPhoneNumber"
                        name="phoneNumber"
                        label="Phone Number"
                        errors={errors}
                        validate={register("phoneNumber", {
                            required:"Merchant phone number is required"
                        })}
                        />
                    </div>
                    <div style={{flex:1}}>
                        <BaseTextField 
                        size="small"
                        id="merchantEmail"
                        name="email"
                        label="Email"
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