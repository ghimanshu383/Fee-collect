import React, { useState } from "react";
import { Divider, IconButton, Typography } from "@mui/material";
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material"
import Paper from '@mui/material/Paper';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';

import { useAllMerchantsQuery } from "../../js/slices/api_slices"; 
import { BasePagination, BaseDrawer } from "../base_components";
import { PAGE_LIMIT } from "../../js/lib/constants";

export default function MerchantComponent () {
    const token = localStorage.getItem("token");
    const [page, setPage] = useState(1);
    const [openUpdateDrawer, setOpenUpdateDrawer] = useState(false);
    const [merchantId, setMerchantId] = useState();
    const {
      data, 
      isSuccess, 
      isError, 
      error} = useAllMerchantsQuery({
      authToken:token, page, limit:PAGE_LIMIT.ALL_MERCHANTS}, 
      {refetchOnMountOrArgChange: true});
    const totalMerchants = data?.SUCCESS.data.allMerchants;
    const merchantCount = data?.SUCCESS.data.merchantCount;
    const pageChangeHandler = (event, value)=>{
      setPage(value);
    }
    
    return (
        <div style={{
          height:"100%",
          display:"flex",
          flexDirection:"column",
          alignItems:"center",
          justifyContent:"space-between"
        }}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell><Typography variant="h6" fontWeight='bold'>Merchants</Typography></TableCell>
                  <TableCell align="center"><Typography variant="h6" fontWeight='bold'>Address</Typography></TableCell>
                  <TableCell align="center"><Typography variant="h6" fontWeight='bold'>Merchant Id</Typography></TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {totalMerchants?.map((merchant) => (
                  <TableRow
                    key={merchant.name}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell size="small" component="th" scope="row">
                      {merchant.name}
                    </TableCell>
                    <TableCell size="small" width="30%" align="center"><Typography>{merchant.address}</Typography></TableCell>
                    <TableCell size="small" align="center"><Typography>{merchant.merchantId}</Typography></TableCell>
                    <TableCell size="small" align="center">
                        <IconButton
                         sx={{backgroundColor:"secondary.light"}}
                         onClick={()=>{
                          setMerchantId(merchant.merchantId)
                          setOpenUpdateDrawer(true);
                         }}
                         >
                            <EditOutlinedIcon />
                        </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <BaseDrawer 
          open={openUpdateDrawer} 
          merchantId={merchantId}
          setClose={setOpenUpdateDrawer}/>
          <div style={{
            width:"100%",
            padding:"10px"
          }}>
            <Divider />
            <BasePagination
              totalEntries={merchantCount}
              pageLimit={PAGE_LIMIT.ALL_MERCHANTS}
              page={page}
              pageChangeHandler={pageChangeHandler}
            />
          </div>
        </div>

    )
}