import React, { useEffect, useState } from "react";
import {useForm} from "react-hook-form";
import { Grid, Container, Typography, ListItem, ListItemText, List, IconButton, Checkbox } from "@mui/material";
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import AddTaskRoundedIcon from '@mui/icons-material/AddTaskRounded';
import { BaseButton, BaseTextField } from "../../../base_components";
import { useConfigureNewPaymentMutation } from "../../../../js/slices/api_slices/merchant_api";
import useSnackbarNotification from "../../../../js/hooks/snack_notification_hook";
import { useNavigate } from "react-router-dom";

export default function PaymentConfigurationFormTwo({formType, merchantId}) {
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    const [inputField, setInputField] = useState('');
    const [inputList, setInputList] = useState({});
    const [populateField, setPopulateField] = useState('');
    const [selectionListField, setSelectionListField] = useState('');
    const [selectionList, setSelectionList] = useState([]);
    const [displayPopulateTextField, setDisplayPopulateTextField] = useState('');
    const {register, handleSubmit, formState:{errors}} = useForm();
    const [configureNewPayment, {
        data, 
        isSuccess, 
        error, 
        isError, 
        isLoading
    }] = useConfigureNewPaymentMutation();
    const {errorSnackBar, successSnackBar} = useSnackbarNotification();

    useEffect(()=>{
        if(isSuccess && data) {
            successSnackBar({message:"Payment type Created Successfully"});
            navigate("/home/merchants");
        }
        if(isError && error) {
            errorSnackBar({message:error?.data?.errorMessage})
        }
    }, [isSuccess, data, isError, error])
    const inputFieldAddHandler = ()=> {
        setInputList(prevState=>{
            return {...prevState, [inputField]:false}
        })
        setInputField('');
    }
    const deleteInputFieldHandler = (key)=>{
        setInputList(prevState =>{
            let listCopy = {...prevState};
            delete listCopy[key]
            return {...listCopy};
        })
    }
    const selectionListAddHandler = () =>{
        setSelectionList(prevState=> [...prevState, {name:selectionListField, list:[]}]);
        setSelectionListField('');
    }
    const deleteSelectionListHandler = (listItemName) =>{
        setDisplayPopulateTextField('');
        setSelectionList(prevState => {
            return prevState.filter(item => item?.name!==listItemName)
        })
    }
    const populateListHandler = (listItem, newField)=>{
        setSelectionList(prevState=>{
            let itemIndex=0;
            const filterListCopy= prevState.filter((item, index) => {
                if(listItem?.name === item?.name) itemIndex = index; 
                return listItem?.name !== item?.name;
            });
            const populatedListItem = {name:listItem.name, list:[...listItem.list, newField]}
            filterListCopy.splice(itemIndex,0,populatedListItem);
            return [...filterListCopy];
        })
        setPopulateField('');
        setDisplayPopulateTextField('');
    }
    const dePopulateListHandler = (listItem, itemToRemove) =>{
        setSelectionList(prevState=>{
            let itemIndex = 0;
            const filterListCopy = prevState.filter((item,index)=>{
                if(listItem?.name===item?.name) itemIndex = index;
                return listItem?.name !== item?.name; 
            })
            const depopulatedList = listItem.list.filter(item => item!==itemToRemove);
            const depopulatedListItem = {name:listItem.name, list:[...depopulatedList]}
            filterListCopy.splice(itemIndex, 0, depopulatedListItem);
            return [...filterListCopy];
        })
    } 
    const InputListDisplay = Object.keys(inputList).map(key => (
        <ListItem
        key={key}
        disableGutters
        divider
        sx={{
            maxHeight:"40px",
            backgroundColor:"secondary.100",
        }}
        >   <Checkbox  
            onChange={(event)=> setInputList(prevState=> ({...prevState, [key]: event.target.checked}))}
            value={inputList[key]}
            sx={{
                "&.Mui-checked":{
                    color:"secondary.contrastText"
                }
            }} 
            />
            <ListItemText>{key}</ListItemText>
            <IconButton
            onClick={()=> deleteInputFieldHandler(key)}
            sx={{
                color:"secondary.contrastText",
            }}
            ><DeleteOutlineOutlinedIcon /></IconButton>
        </ListItem>
    ))
    const selectionListDisplay = selectionList.map(item=> (
        <Container key={item?.name} disableGutters sx={{maxWidth:"100%", overflow:"hidden"}}>
            <ListItem
            disableGutters
            divider
            sx={{
                maxHeight:"40px",
                backgroundColor:"secondary.100",
            }}
            >
                <ListItemText sx={{pl:1}} primary={item?.name} />
                <IconButton 
                sx={{color:"green", p:0,}}
                onClick= {()=> setDisplayPopulateTextField(item?.name)}
                >
                    <AddCircleOutlineRoundedIcon />
                </IconButton>
                <IconButton 
                sx={{color:"secondary.contrastText"}}
                onClick={()=> deleteSelectionListHandler(item?.name)}
                >
                    <DeleteOutlineOutlinedIcon/>
                </IconButton>           
            </ListItem>
            {displayPopulateTextField === item?.name && 
                <Container disableGutters
                sx={{
                    display:"flex",

                }}
                >
                    <BaseTextField size='small' 
                    sx={{mt:1}}
                    value={populateField}
                    onChange={(event)=> setPopulateField(event.target.value)}
                    />
                    <IconButton 
                    disabled={!populateField} 
                    onClick={()=> populateListHandler(item, populateField)}
                    sx={{pr:0, color:"green"}}><AddTaskRoundedIcon/> </IconButton>
                    <IconButton 
                    onClick={()=> {
                        setPopulateField('');
                        setDisplayPopulateTextField('')}}
                    sx={{pr:0, color:"secondary.contrastText"} 
                    }><CloseOutlinedIcon/></IconButton>
                </Container>}
                {/* For displaying the items in the selection list  */}
                {item?.list.length>0 &&
                 <List sx={{maxWidth:"100%"}}>
                    {item?.list.map(selectionListItem=> (
                        <ListItem
                         key={selectionListItem} 
                         divider 
                         sx={{
                            maxHeight:"30px",
                            backgroundColor:"secondary.A100",
                            pr:0,
                        }}>
                            <ListItemText 
                            disableTypography 
                            primary={<Typography noWrap textOverflow='ellipsis' sx={{maxWidth:"100%"}}>{selectionListItem}</Typography>} />
                            <IconButton 
                            onClick={()=> dePopulateListHandler(item, selectionListItem)}
                            sx={{color:"secondary.contrastText"}}><DeleteOutlineOutlinedIcon/></IconButton>
                        </ListItem>
                    ))}
                </List>}
        </Container>
        
    ))
    return (
        <Grid
        container
        component='form'
        height="100%"
        onSubmit={handleSubmit(({paymentName})=>{
            const configDetails = {
                merchantId,
                paymentType:{
                    name:paymentName,
                    formType,
                    inputFields: inputList,
                    selectionList
                }
            }
            configureNewPayment({configDetails, authToken:token})
        })}
        >
            <Grid
            item
            xs={6}
            height="100%"
            sx={{
                display:"flex",
                flexDirection:"column",
                justifyContent:"space-between",
            }}
            >
                <Container disableGutters>
                    <Container>
                        <Typography variant="h6" color="secondary.main">Payment Name*</Typography>
                        <BaseTextField 
                        size='small'
                        id='paymentName'
                        name="paymentName"
                        errors={errors}
                        validate={register("paymentName", {
                            required:"Payment Name is required"
                        })}
                        />
                    </Container>
                    <Container>
                        <Typography variant="h6" color="secondary.main">User Inputs*</Typography>
                        <BaseTextField 
                        size='small'
                        value={inputField}
                        onChange={(event)=>setInputField(event.target.value)}
                        sx={{
                            mt:1,
                            mb:1,
                        }}
                        />
                        <Container
                        disableGutters
                        sx={{
                            width:"100%",
                            display:"flex",
                            flexDirection:"column",
                            alignItems:"flex-end",
                        }}
                        >
                            <BaseButton 
                            variant='contained'
                            fullWidth={false}
                            disabled={!inputField}
                            sx={{
                                m:0,
                                borderRadius:"20px",
                                backgroundColor:"secondary.contrastText",
                                ":hover":{
                                    backgroundColor:"secondary.contrastText",
                                }
                            }}
                            onClickHandler={inputFieldAddHandler}
                            >Add</BaseButton>
                        </Container>
                        </Container>
                        <Container 
                        sx={{pt:1}}>
                            <List
                            disablePadding
                            sx={{
                                display:"grid",
                                gridTemplateColumns:"repeat(2, 1fr)",
                                gap:1,
                            }}
                            >
                                {InputListDisplay}
                            </List>
                        </Container>
                    </Container>
                    <Container
                    sx={{
                        display:"flex",
                        gap:1,
                        pb:2,
                    }}
                    >
                        <BaseButton
                        variant='outlined'
                        fullWidth={false}
                        sx={{
                            borderRadius:"20px",
                            width:"100px",
                        }}
                        >
                            Cancel
                        </BaseButton>
                        <BaseButton
                        variant='contained'
                        isLoading={isLoading}
                        fullWidth={false}
                        type='submit'
                        sx={{
                           backgroundColor:"secondary.contrastText",
                            width:"100px",
                            borderRadius:"20px",
                            ":hover":{
                                backgroundColor:"secondary.contrastText",
                            }
                        }}
                        >
                            Submit
                        </BaseButton>
                    </Container>        
            </Grid>
            <Grid
            item
            xs={6}
            >
                <Container>
                    <Typography variant="h6" color='secondary.main'>Selection List*</Typography>
                    <BaseTextField 
                    size='small'
                    value={selectionListField}
                    sx={{
                        mt:1,
                    }}
                    onChange={(event)=> setSelectionListField(event.target.value)}
                    />
                    <Container disableGutters
                    sx={{
                        display:"flex",
                        justifyContent:"flex-end",
                    }}>
                        <BaseButton
                        variant='contained'
                        fullWidth={false}
                        disabled={!selectionListField}
                        onClickHandler={selectionListAddHandler}
                        sx={{
                            backgroundColor:"secondary.contrastText",
                            borderRadius:"20px",
                            ":hover":{
                                backgroundColor:"secondary.contrastText"
                            }
                        }}>
                        Add</BaseButton>
                    </Container>
                </Container>
                <List   
                sx={{
                    p:2,
                    display:"grid",
                    gridTemplateColumns:"repeat(2, 1fr)",
                    gap:1,
                    overflow:"hidden"
                }}
                >
                    {selectionListDisplay}
                </List>
            </Grid>
        </Grid>
    )
}