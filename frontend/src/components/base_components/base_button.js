import React from "react";
import LoadingButton from "@mui/lab/LoadingButton";
import PropTypes from 'prop-types';

export default function BaseButton ({
  children, 
  type,
  fullWidth=true, 
  variant, 
  color = "primary",
  onClickHandler, 
  isLoading = false,
  ...rest
}) {
    return (
       <LoadingButton
        type={type}
        fullWidth={fullWidth}
        loading={isLoading}
        variant= {variant}
        onClick={onClickHandler}
        sx={{
            backgroundColor:color,
            borderRadius:"10px",
            margin:1,
            ":hover" :{
              backgroundColor: `${color}.light`,
            }
        }}
        {...rest}
      >
        {children}
      </LoadingButton>
    )
}

BaseButton.propTypes = {
  isLoading: PropTypes.bool,
}