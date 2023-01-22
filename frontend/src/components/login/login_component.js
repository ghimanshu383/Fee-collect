import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { CssBaseline, Container, Link, Typography } from "@mui/material";

import { BaseButton, BaseTextField } from "../base_components/index";
import Logo from "../../assets/images/DareDevilsBarLogo.jpg";
import { useLoginActionMutation } from '../../js/slices/api_slices/auth_api';
import useSnackbarNotification from '../../js/hooks/snack_notification_hook';
import { login } from '../../js/slices/user_slice';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://www.turmitech.com/" target='_blank'>
        GoTech
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const LoginComponent = function () {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { errorSnackBar } = useSnackbarNotification();
  const [loginAction, {
    data,
    isSuccess,
    isLoading,
    error,
    isError,
  }] = useLoginActionMutation();

  useEffect(() => {
    if (isSuccess && data) {
      dispatch(login(data.data));
      localStorage.setItem("token", data.data.token)
      navigate("/home/merchants", {replace: true, state:{displayAdd:true}});
    } else if (isError && error) {
      errorSnackBar({ message: error?.data?.errorMessage });
    }
  }, [data, isSuccess, dispatch, isError, error])

  return (
    <Container component="main" maxWidth="xs">
      <Container maxWidth='lg' sx={{ display: 'flex', alignItems: "center", justifyContent: "center", padding: 2 }} >
        <img src={Logo} alt='DareDevilsBar Logo' />
      </Container>
      <CssBaseline />
      <Container
        component="form"
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
        noValidate
        onSubmit={handleSubmit(loginAction)}
      >
        <Typography component="h1" variant="h5">
          Welcome Back
        </Typography>
        <Typography variant='h8'>
          Login to continue
        </Typography>
        <BaseTextField
          id="email"
          name="email"
          label="Email Address"
          errors={errors}
          validate={register("email", {
            required: "Email is required",
            pattern: {
              value: /^\S+@\S+\.\S+$/,
              message: "Email must be valid"
            },
          })}
        />
        <BaseTextField 
          id="password"
          name="password"
          label="Password"
          type="password"
          errors={errors}
          validate={register("password", { 
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be greater then 6 characters"
            } })}
          
        />
        <BaseButton
          type='submit'
          variant='contained'
          isLoading={isLoading}
          color="primary"
        >
          Login
        </BaseButton>
      </Container>
      <Copyright sx={{ mt: 10, mb: 4 }} />
    </Container>
  );
}

export default LoginComponent;