import React, {useMemo} from "react";
import { useDropzone } from "react-dropzone";
import BaseTextField from "./base_text_field"
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';import { Container, Typography } from "@mui/material";
;

const baseStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    borderWidth: 2,
    borderColor: ' #bdbdbd',
    borderStyle: 'dashed',
    borderRadius:"20px",
    backgroundColor: '#fafafa',
    color: '#bdbdbd',
    outline: 'none',
    transition: 'border .24s ease-in-out'
  };
  const acceptStyle = {
    borderColor: '#00e676'
  };
  
  const rejectStyle = {
    borderColor: '#ff1744'
  };
export default function BaseDropzone({files, setSelectedFiles, uploadLimit=1}) {
    const {
        getRootProps,
        getInputProps,
        isFocused,
        isDragAccept,
        isDragReject} = useDropzone({
        accept:{
            "image/*":[]
        },
        disabled: files.length >= uploadLimit,
        onDrop: (acceptedFiles) =>{
            const newFileArray = acceptedFiles.map(file => Object.assign(file, {
                preview: URL.createObjectURL(file)
            }) )
            setSelectedFiles(prevState => [
                ...prevState,
                ...newFileArray
            ])
        }
    });
    const style = useMemo(() => ({
        ...baseStyle,
        ...(isDragAccept ? acceptStyle : {}),
        ...(isDragReject ? rejectStyle : {})
      }), [
        isFocused,
        isDragAccept,
        isDragReject
      ]);
    return (
        <div style={{marginTop:"10px"}}>
            <div {...getRootProps({style})}>
                <BaseTextField
                {...getInputProps()}
                />
                <Container 
                sx={{
                    display:"flex",
                    flexDirection:"column",
                    justifyContent:"center",
                    alignItems:"center"
                }}
                > 
                    <CloudUploadOutlinedIcon/>
                    <Typography>Drop your files here or..</Typography>
                    <Typography>Click! Browser</Typography>
                 </Container>
            </div>
        </div>

    )
}