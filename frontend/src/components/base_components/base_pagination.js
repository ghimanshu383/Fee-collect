import { Pagination, Typography } from "@mui/material";
import React, { useState } from "react";

export default function BasePagination({totalEntries, pageLimit, page, pageChangeHandler}) {
    const pageCount = Math.ceil(totalEntries/pageLimit) || 10;
    
    return (
        <React.Fragment>
            <div style={{
                display:"flex",
                alignItems:"center",
                justifyContent:"space-between",
                padding:"5px",
            }}>
                <Typography fontWeight='bold'>Showing {pageLimit > totalEntries ? totalEntries: pageLimit} of {totalEntries} entries</Typography>
                <Pagination 
                shape="rounded"
                color="primary"
                count={pageCount} 
                page={page} 
                onChange={pageChangeHandler}></Pagination>
            </div>
        </React.Fragment>
    )
}