import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import { generateRequestOptions } from "../../actions/action_helper";
import { SERVER_URL } from "../../lib/constants";

const authApi = createApi({
    reducerPath:"authApi",
    baseQuery:fetchBaseQuery({baseUrl:process.env.REACT_APP_HOSTNAME}),
    endpoints:(builder) => ({
        loginAction:builder.mutation({
            query:(userDetails)=>({
                ...generateRequestOptions({
                    url:`${SERVER_URL}/auth/login`,
                    method:"POST",
                    data:userDetails,
                })
            }),
        }),
        logoutAction:builder.mutation({
            query:(token) =>({
                ...generateRequestOptions({
                    url:`${SERVER_URL}/auth/logout`,
                    method:"POST",
                    data:{
                        token,
                    },
                    header:{
                        "Authorization":`Bearer ${token}`,
                    }
                })
            })
        })
    })
})

export const {useLoginActionMutation, useLogoutActionMutation} = authApi;
export default authApi;