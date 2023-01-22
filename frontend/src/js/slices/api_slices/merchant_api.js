import { createApi, fetchBaseQuery, } from "@reduxjs/toolkit/query/react";
import { generateRequestOptions } from "../../actions/action_helper";
import { SERVER_URL } from "../../lib/constants";

const merchantApi = createApi({
    reducerPath:"MerchantApi",
    baseQuery:fetchBaseQuery({baseUrl:process.env.REACT_APP_HOSTNAME}),
    endpoints:(builder) => ({
        newMerchant:builder.mutation({
            query:({token, newMerchantDetails})=>({
                ...generateRequestOptions({
                    url:`${SERVER_URL}/app/newMerchant`,
                    data: newMerchantDetails,
                    method:"POST",
                    header:{
                        "Authorization":`Bearer ${token}`,
                    }
                })
            })
        }),
        merchant: builder.query({
            query:({merchantId, authToken})=>({
                ...generateRequestOptions({
                    url:`${SERVER_URL}/app/merchant?merchantId=${merchantId}`,
                    method:"GET",
                    authToken,
                })
            })
        }),
        merchantUpdate: builder.mutation({
            query:({merchantId, merchantDetails, authToken})=>({
                ...generateRequestOptions({
                    url:`${SERVER_URL}/app/merchant?merchantId=${merchantId}`,
                    method:"POST",
                    data: merchantDetails,
                    authToken,
                })
            })
        }),
        allMerchants:builder.query({
            query:({authToken, page, limit})=>({
                ...generateRequestOptions({
                    url:`${SERVER_URL}/app/merchants?page=${page}&limit=${limit}`,
                    method:"GET",
                    authToken,
                }),
            })
        }),
        configureNewPayment: builder.mutation({
            query:({configDetails, authToken})=>({
                ...generateRequestOptions({
                    url:`${SERVER_URL}/app/newPaymentType`,
                    method:"POST",
                    data:configDetails,
                    authToken

                })
            })
        }),
        getpayments: builder.query({
            query: ({merchantId, authToken})=> ({
                ...generateRequestOptions({
                    url:`${SERVER_URL}/app/payments?merchantId=${merchantId}`,
                    method:"GET",
                    authToken,
                })
            })
        }),
        modifyPayment: builder.mutation({
            query:({modifyDetails, merchantId,paymentName, authToken})=>({
                ...generateRequestOptions({
                    url:`${SERVER_URL}/app/payment?merchantId=${merchantId}&paymentName=${paymentName}`,
                    method:"POST",
                    authToken,
                    data:modifyDetails,
                })
            })
        }),
        deletePayment: builder.mutation({
            query:({merchantId, paymentName, formType, authToken})=>({
                ...generateRequestOptions({
                    url:`${SERVER_URL}/app/payment?merchantId=${merchantId}&paymentName=${paymentName}&formType=${formType}`,
                    method:"DELETE",
                    authToken,
                })
            })
        })
    })
})
export const {
    useNewMerchantMutation, 
    useAllMerchantsQuery, 
    useMerchantQuery,
    useMerchantUpdateMutation,
    useGetpaymentsQuery,
    useModifyPaymentMutation,
    useDeletePaymentMutation,
    useConfigureNewPaymentMutation} = merchantApi;
export default merchantApi;