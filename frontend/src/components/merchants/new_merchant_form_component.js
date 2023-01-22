import React, { useEffect, useState } from "react";
import { Container, Grid } from "@mui/material";
import {useForm} from "react-hook-form";

import AddMerchantForm from "./merchant_form";
import { useNewMerchantMutation } from "../../js/slices/api_slices/merchant_api";
import useSnackbarNotification from "../../js/hooks/snack_notification_hook";
import MerchantDocs from "./merchant_docs";
import { useNavigate } from "react-router-dom";

export default function NewMerchantForm () {
    const {register, handleSubmit, formState:{errors}} = useForm();
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const {errorSnackBar} = useSnackbarNotification();
    const [docs, setUploadedDocs] = useState([]);
    const [newMerchantMutation, {
        isSuccess, 
        isError,
        error, 
        data, 
        isLoading
    }] = useNewMerchantMutation();
    useEffect(()=>{
        if(isSuccess || data) {
            navigate("/home/merchants", {replace:true});
        }
        if(isError || error) {
            errorSnackBar({message:error?.data?.errorMessage})
        }
    }, [isSuccess, isError, error, data, isLoading])
    return (
        <React.Fragment>
            <Grid 
            component='form'
            container 
            height="100%" 
            bgcolor="secondary.light"
            borderRadius={5}
            onSubmit={handleSubmit(merchantData=>{
                const formData = new FormData();
                for(const key in merchantData) {
                    formData.append(key, merchantData[key])
                }
                if(docs.length>0) formData.append('logo', docs[0]);
                newMerchantMutation({token, newMerchantDetails:formData});
            })}
            >
                <Grid 
                item 
                p={1}
                xs={8}
                height="99%" 
                >
                    <AddMerchantForm 
                    errors={errors}
                    register={register}
                    />
                </Grid>
                <Grid 
                item 
                p={1}
                xs={4}  
                
                >   
                    <MerchantDocs 
                        uploadLimit={1}
                        uploadText="Upload Logo"
                        docs={docs}
                        setUploadedDocs={setUploadedDocs}
                        />              
                </Grid>
            </Grid>
        </React.Fragment>
    )
}