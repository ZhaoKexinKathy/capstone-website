import React from "react";
import styled from "styled-components";

import xmark from "../asset/x-solid.svg";
import { AUTH } from "../config";

import { CloseIcon, PageMask } from "./CommonComponent";
import PopupCard from "./PopupCard";

const InputText = styled.input`
  width: 370px;
  margin-top: 30px;
  padding-left: 15px;
  background-color: #ffffff;
  height: 45px;
  border-radius: 16px;
  font-size: 16px;
  border: 1px solid #a0a0a0;
`;

const Button = styled.button`
  font-family: "Poppins", cursive;
  width: 387px;
  height: 58px;
  border-radius: 16px;
  background-color: #18204a;
  color: #ffffff;
  font-size: 25px;
  font-weight: 600;
  margin-top: 30px;
  margin-bottom: 40px;
  cursor: pointer;
  &:hover {
    background-color: #304094;
  }
`;

const Title = styled.div`
  margin-top: 60px;
  font-weight: 700;
  font-size: 24px;
  margin-bottom: 20px;
`;

const Text = styled.div`
  width: 232px;
  font-weight: normal;
  font-size: 15px;
  color: #a0a0a0;
  margin: auto;
  cursor: pointer;
`;

const ErrorMessage = styled.div`
  color: red;
`;

export const SignIn = (props) => {
  const close = props.close;
  const handleChangeSignInState = props.handleChangeToSignInState;
  const changeToSignUp = props.changeToSignUp;

  const [errorMessage, setErrorMessage] = React.useState("");

  const handleSignIn = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const usernameInput = data.get("username");

    const obj = {
      password: data.get("password"),
      username: data.get("username"),
    };

    const response = await fetch(AUTH.LOGIN_URL, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(obj),
    });
    if (response.status === 200) {
      const user = await response.json();

      handleChangeSignInState();
      close();
      window.location.reload();
      handleChangeSignInState();
      sessionStorage.setItem("uid", user.id);
      sessionStorage.setItem("username", usernameInput);
      close();
    } else {
      const re = await response.json();
      setErrorMessage(re.message);
    }
  };

  return (
    <>
      <PageMask />
      <PopupCard>
        <CloseIcon src={xmark} onClick={close} />
        <Title>Log in or create an account</Title>
        <Text>Log in below or create a new ScrumLegends account</Text>
        <form onSubmit={handleSignIn}>
          <InputText name="username" placeholder="Username" />
          <InputText type="password" name="password" placeholder="Password" />
          {errorMessage ? <ErrorMessage>{errorMessage}</ErrorMessage> : <></>}
          <Button type="submit">Sign In</Button>
        </form>
        <Text onClick={changeToSignUp} style={{ textDecoration: "underline", cursor: "pointer" }}>
          Do not have an account?
          <br />
          Sign Up Here
        </Text>
        <Text style={{ fontSize: "12px", width: "360px", marginTop: "50px" }}>
          This site is protected by the Google Privacy Policy and Terms of Service apply.
        </Text>
      </PopupCard>
    </>
  );
};

export const SignUp = (props) => {
  const close = props.close;
  const changeToSignUp = props.changeToSignUp;
  const handleChangeSignInState = props.handleChangeToSignInState;

  const [errorMessage, setErrorMessage] = React.useState("");

  const handleSignUp = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const username = data.get("username");
    const email = data.get("email");
    const password = data.get("password");
    const cpassword = data.get("confirmpassword");

    if (password !== cpassword) {
      setErrorMessage("The two entered passwords do not match");
      return;
    }

    const obj = {
      username,
      email,
      password,
    };

    const response = await fetch(AUTH.SIGNUP_URL, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(obj),
    });
    if (response.status === 201) {
      handleChangeSignInState();
      close();
    } else {
      const re = await response.json();
      setErrorMessage(re.message);
    }
  };

  return (
    <>
      <PageMask />
      <PopupCard style={{ height: "680px" }}>
        <CloseIcon src={xmark} onClick={close} />
        <Title>Create an account</Title>
        <form onSubmit={handleSignUp}>
          <InputText name="username" placeholder={"Username"} />
          <InputText name="email" placeholder={"Email"} />
          <InputText name="password" type="password" placeholder={"Password"} />
          <InputText name="confirmpassword" type="password" placeholder={"Confirm Password"} />
          {errorMessage ? <ErrorMessage>{errorMessage}</ErrorMessage> : <></>}
          <Button type="submit">Sign Up</Button>
        </form>
        <Text onClick={changeToSignUp} style={{ textDecoration: "underline", cursor: "pointer" }}>
          Already have an account?
          <br />
          Log In Here
        </Text>
        <Text style={{ fontSize: "12px", width: "360px", marginTop: "35px" }}>
          This site is protected by the Google Privacy Policy and Terms of Service apply.
        </Text>
      </PopupCard>
    </>
  );
};
