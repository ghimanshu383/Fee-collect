import { TextField } from "@mui/material";
import React from "react";
import Prototypes from "prop-types";

export default function BaseTextField({
    id,
    name,
    label,
    type,
    helperText,
    errors,
    validate, 
    ...rest }) {
    return (
            <TextField
                margin="normal"
                fullWidth
                id={id}
                type={type}               
                label={label}       
                error={!!errors?.[name]?.message}
                helperText={ errors?.[name]?.message || helperText}
                sx={{
                    mt:1, 
                    mb:3
                }}
                {...validate}
                {...rest}
            />
    )
}

BaseTextField.prototypes = {
    id: Prototypes.string.isRequired,
    label: Prototypes.string.isRequired,
    name: Prototypes.string.isRequired,
}