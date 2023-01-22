import React from "react";
import { Container } from "@mui/system";
import { BaseDropzone } from "../base_components";
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { CssBaseline, Divider, IconButton, List, ListItem, Typography } from "@mui/material";

export default function MerchantDocs ({docs, setUploadedDocs, uploadText, uploadLimit}) {
    const uplaodedDocs = docs?.map(doc => {
        const deleteDoc = () =>{
            setUploadedDocs(prevState => prevState.filter(item=> item.name !==doc.name))
        }
        return (
            <>
            <ListItem 
            key={doc.name}
            sx={{
                p:2,
                width:"100%",
                display:"flex",
                alignItems:"center",
                justifyContent:"space-between",
            }}
            >
                <Typography variant='h6' fontSize={12} fontWeight="bold">{doc.name}</Typography>
                <IconButton onClick={deleteDoc}>
                    <DeleteOutlineOutlinedIcon sx={{
                        color:"secondary.contrastText"
                    }}/>
                </IconButton>
            </ListItem>
            <Divider />
            </>
            
            
        )
    })
    return (
        <React.Fragment>
            <Container 
                sx={{
                    
                    backgroundColor:"white",
                    borderRadius:5,
                }}
            >
            <Typography variant="h8" fontWeight="bold" sx={{
                display:"inline-block",
                m:2,
            }}>{uploadText} </Typography>
                <Container 
                    sx={{          
                        display:"flex",
                        alignItems:"center",
                        justifyContent:"center"}}
                        >  
                <Container
                >    
                <BaseDropzone 
                files={docs}
                uploadLimit={1}
                setSelectedFiles={setUploadedDocs} 
                />   
                <List>
                    {uplaodedDocs}
                </List>      
                </Container>
            </Container>
            </Container>

        </React.Fragment>
    )
}