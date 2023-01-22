import React, { useEffect, useMemo, useState } from "react";
import { Container, Grid } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import {useForm} from "react-hook-form";

import useSnackbarNotification from "../../../js/hooks/snack_notification_hook";
import {useMerchantQuery, useMerchantUpdateMutation} from "../../../js/slices/api_slices/merchant_api";
import UpdateMerchantForm from "./merchant_forms/update_merchant_form";
import UpdateMerchantDocs from "./merchant_forms/update_merchant_docs";

export default function MerchantDetailsConfigure () {
    const {id} = useParams();
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    const {errorSnackBar, successSnackBar} = useSnackbarNotification();
    const [merchantDetails, setMerchantDetails] = useState({});
    const [docs, setUploadedDocs] = useState([]);
    const {register, handleSubmit, reset, formState:{errors}} = useForm({defaultValues: useMemo(()=> {
        const {email, address, phoneNumber, name, merchantId} = merchantDetails;
        return {name, address, email, phoneNumber, merchantId}
    }, [merchantDetails])});
    const {
        data, 
        isSuccess, 
        error,
        isError
    } = useMerchantQuery({merchantId: id, authToken: token}, {refetchOnMountOrArgChange: true})
    const [updateMerchantMutation, {
        data: updateData,
        error: updateError,
        isError:updateIsError,
        isSuccess: updateIsSuccess,
        isLoading,
    }] = useMerchantUpdateMutation();
    
    useEffect(()=>{
        if(isSuccess && data) {
            setMerchantDetails(data?.SUCCESS.data?.merchant);
            setUploadedDocs([data?.SUCCESS?.data?.merchant?.logo]);
            reset(merchantDetails);
        }if(isError && error) {
            errorSnackBar({message: error?.data?.errorMessage});
        }
    }, [isSuccess, data, isError, error, merchantDetails])
    useEffect(()=>{
        if(updateIsSuccess && updateData) {
            successSnackBar({message:"Details updated successfully"});
            navigate("/home/merchants")
        }
        if(updateIsError && updateError) {
            errorSnackBar({message:updateError?.data?.errorMessage});
        }
    }, [updateData, updateError, updateIsError, updateIsSuccess,])
    return (
        <React.Fragment>
            <Grid 
            component='form'
            container 
            height="100%" 
            bgcolor="secondary.light"
            borderRadius={5}
            onSubmit={handleSubmit(merchantInput=>{
                delete merchantInput['merchantId']
                const formData = new FormData();
                for(const key in merchantInput) {
                    formData.append(key, merchantInput[key]);
                }
                if(docs.length > 0) {
                    formData.append("logo", docs[0]);
                }
                updateMerchantMutation({authToken:token, merchantDetails: formData, merchantId: id});
            })}
            >
                <Grid 
                item 
                p={1}
                xs={8}
                height="99%" 
                >
                    <UpdateMerchantForm 
                    isLoading={isLoading}
                    errors={errors}
                    register={register}
                    />
                </Grid>
                <Grid 
                item 
                p={1}
                xs={4}  
                >   
                    <UpdateMerchantDocs 
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