import React, { useEffect, useState } from "react";
import {useForm} from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import AddTaskRoundedIcon from '@mui/icons-material/AddTaskRounded';  
import { Grid, Container, Typography, ListItem, ListItemText, List, IconButton, Checkbox } from "@mui/material";

import { BaseButton, BaseModal, BaseTextField } from "../../base_components";
import useSnackbarNotification from "../../../js/hooks/snack_notification_hook";
import { useModifyPaymentMutation } from "../../../js/slices/api_slices/merchant_api";

export default function ModifyPaymentFormTwo({formType, merchantId,  paymentDetails, disableEditingHandler}) {
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    const [inputField, setInputField] = useState('');
    const [inputList, setInputList] = useState({...paymentDetails?.inputFields});
    const [populateField, setPopulateField] = useState('');
    const [selectionListField, setSelectionListField] = useState('');
    const [selectionList, setSelectionList] = useState([...paymentDetails?.selectionList]);
    const [displayPopulateTextField, setDisplayPopulateTextField] = useState('');
    //editing states 
    const [editField, setEditField] = useState('');
    const [displayEditField, setDisplayEditField] = useState('');
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);

    const {register, handleSubmit, formState:{errors}} = useForm({
        defaultValues: {paymentName: paymentDetails.name}
    });
    const [modifyPayment, {
        data, 
        isSuccess, 
        error, 
        isError, 
        isLoading
    }] = useModifyPaymentMutation();
    const {errorSnackBar, successSnackBar} = useSnackbarNotification();

    useEffect(()=>{
        if(isSuccess && data) {
            successSnackBar({message:data?.data?.message});
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
    const inputFieldEditsHandler = (key) =>{
        let itemIndex = 0;
        const inputListArray = Object.entries(inputList);
        itemIndex = inputListArray.findIndex(item => key === item[0]);
        const filteredInputListArray = inputListArray.filter(item => key !==item[0])
        filteredInputListArray.splice(itemIndex, 0, [editField, inputList[key]]);
        const updatedInputList = Object.fromEntries(filteredInputListArray);
        setInputList({...updatedInputList});
        setEditField("");
        setDisplayEditField('');
    }
    const editListHandler = (listName)=>{
        const selectionListCopy = [...selectionList];
        const editedList = selectionListCopy.map(item => {
            if(item.name === listName) {
                return {...item, name: editField}
            }
            return item;
        })
        setEditField("");
        setSelectionList([...editedList]);
    }
    const editSelectionListItemHandler = (listName, selectionListItem) =>{
        let itemIndex = 0;
        const selectionListCopy = [...selectionList];
        const editedList = selectionListCopy.map(item =>{
            if(item?.name === listName) {
                const filteredList = item?.list.filter((value, index)=>{
                    if(value === selectionListItem) {
                        itemIndex = index
                    }
                    return value !== selectionListItem;
                })
                filteredList.splice(itemIndex, 0, editField);
                return {name: item?.name, list:[...filteredList]};
            }
            return item
        })
        setSelectionList([...editedList]);
        setEditField('');
    }
    const InputListDisplay = Object.keys(inputList).map(key => (
        <Container disableGutters
        key={key}
        sx={{
            display:"flex",
            flexDirection:"column",
        }}>
            <ListItem
            disableGutters
            divider
            sx={{
                maxHeight:"40px",
                backgroundColor:"secondary.100",
            }}
            >   <Checkbox  
                checked= {inputList[key]}
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
                onClick={()=> setDisplayEditField(key)}
                sx={{
                    color:"secondary.200",
                    p:.5,
                }}>
                    <EditOutlinedIcon />
                </IconButton>
                <IconButton
                onClick={()=> deleteInputFieldHandler(key)}
                sx={{
                    color:"secondary.contrastText",
                    p:.5,
                }}
                ><DeleteOutlineOutlinedIcon /></IconButton>
            </ListItem>
            {displayEditField === key ?
                <Container disableGutters
                sx={{
                    display:"flex",
                }}
                >
                <BaseTextField 
                size='small'
                value={editField}
                onChange = {(event)=> setEditField(event?.target?.value)}
                sx={{
                    mt:1,
                    mb:1,
                }}
                />
                <IconButton disableRipple
                onClick= {()=> inputFieldEditsHandler(key)}
                disabled= {!editField}
                sx={{
                    color:"green",
                    p:0,
                    pl:1,
                }}>
                  <AddTaskRoundedIcon />
                </IconButton> 
                <IconButton disableRipple 
                onClick={()=> {
                    setDisplayEditField('');
                    setEditField('');
                }}
                sx={{
                    color:"secondary.contrastText",
                    p:0,
                    pl:1,
                }}>
                    <CloseOutlinedIcon />
                </IconButton>
                </Container> : ''
            }

        </Container>

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
                 sx={{color:"secondary.200", p:0, mr:1}}
                 onClick={()=> setDisplayEditField(item?.name)}
                 >
                    <EditOutlinedIcon />
                </IconButton>
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
            {displayEditField === item?.name && 
                <Container disableGutters
                sx={{
                    display:"flex",

                }}
                >
                    <BaseTextField size='small' 
                    sx={{mt:1}}
                    value={editField}
                    onChange={(event)=> setEditField(event.target.value)}
                    />
                    <IconButton 
                    disabled={!editField} 
                    onClick={()=> editListHandler(item?.name)}
                    sx={{pr:0, color:"green"}}><AddTaskRoundedIcon/> </IconButton>
                    <IconButton 
                    onClick={()=> {
                        setEditField('');
                        setDisplayEditField('')}}
                    sx={{pr:0, color:"secondary.contrastText"} 
                    }><CloseOutlinedIcon/></IconButton>
                </Container>                
            }
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
                        <Container disableGutters key={selectionListItem}>
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
                            <IconButton sx={{color:"secondary.200", p:0}} onClick={()=>setDisplayEditField(selectionListItem)}>
                                <EditOutlinedIcon/>
                            </IconButton>
                            <IconButton 
                            onClick={()=> dePopulateListHandler(item, selectionListItem)}
                            sx={{color:"secondary.contrastText"}}><DeleteOutlineOutlinedIcon/></IconButton>
                        </ListItem>
                        {displayEditField === selectionListItem && 
                        <Container disableGutters
                        sx={{
                            display:"flex",

                        }}
                        >
                            <BaseTextField size='small' 
                            sx={{mt:1}}
                            value={editField}
                            onChange={(event)=> setEditField(event.target.value)}
                            />
                            <IconButton 
                            disabled={!editField} 
                            onClick={()=> editSelectionListItemHandler(item?.name, selectionListItem)}
                            sx={{pr:0, color:"green"}}><AddTaskRoundedIcon/> </IconButton>
                            <IconButton 
                            onClick={()=> {
                                setEditField('');
                                setDisplayEditField('')}}
                            sx={{pr:0, color:"secondary.contrastText"} 
                            }><CloseOutlinedIcon/></IconButton>
                        </Container> }                    
                        </Container>
                    ))}
                </List>}
        </Container>
        
    ))
    return (
        <Grid
        container
        height="100%"
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
                        onClickHandler={disableEditingHandler}
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
                        onClickHandler={()=> setShowConfirmationModal(true)}
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
                            Modify
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
                    gap:2,
                    overflow:"hidden"
                }}
                >
                    {selectionListDisplay}
                </List>
            </Grid>
            <BaseModal
            open={showConfirmationModal}
            handleClose={()=> setShowConfirmationModal(false)}
            actionText = "Are you Sure?"
            actionButtons={[
                <BaseButton
                isLoading= {isLoading}
                onClickHandler={handleSubmit(({paymentName})=>{
                    const modifyDetails = {
                        name: paymentName,
                        formType, 
                        inputFields: inputList,
                        selectionList,
                    }
                    modifyPayment({modifyDetails, merchantId,paymentName:paymentDetails?.name, authToken: token});
                })}
                sx={{
                    backgroundColor:"white",
                    color:"primary.main",
                    fontWeight:"bold",
                    mb:2,
                    ":hover":{
                        backgroundColor:"secondary.main"
                    }
                }}
                >Modify</BaseButton>
            ]}
            />
        </Grid>
    )
}