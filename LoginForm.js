import React, { useState } from "react";
import { Button, FormControl, FormHelperText } from "@material-ui/core";
import { InputLabel } from "@material-ui/core";
import { Input } from "@material-ui/core";
import "../../common/header/Form.css";

export default function LoginForm(props) {
  //store variables for later use in api calls
  const loginURL = `${props.baseUrl}auth/login`;
  const [loginDetails, setLoginDetails] = useState({
    username: "",
    password: "",
  });

  const [reqUsername, setReqUserName] = React.useState("dispNone");
  const [reqPassword, setReqPassword] = React.useState("dispNone");

  //handle input change
  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setLoginDetails((state) => ({ ...state, [name]: value }));
  };
  //validate login information
  const validateLoginForm = () => {
    loginDetails.username === ""
      ? setReqUserName("dispBlock")
      : setReqUserName("dispNone");
    loginDetails.password === ""
      ? setReqPassword("dispBlock")
      : setReqPassword("dispNone");
    if (loginDetails.username === "" || loginDetails.password === "") {
      return false;
    } else {
      return true;
    }
  };
  //handle submit action
  const handleSubmit = (event) => {
    event.preventDefault();
    const validationFlag = validateLoginForm();
    if (validationFlag) {
      try {
        loginUser();
      } catch (e) {}
    }
  };
  //call login api
  async function loginUser() {
    const authParam = window.btoa(
      `${loginDetails.username}:${loginDetails.password}`
    );

    try {
      const rawResponse = await fetch(loginURL, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
          authorization: `Basic ${authParam}`,
        },
      });
      const response = await rawResponse.json();
      if (rawResponse.ok) {
        window.sessionStorage.setItem("user-details", JSON.stringify(response));
        window.sessionStorage.setItem(
          "access-token",
          rawResponse.headers.get("access-token")
        );

        props.saveSessionDetails(window.sessionStorage.getItem("access-token"));
        props.closeAuthFun();
      }
    } catch (e) {
      alert(e.message);
    }
  }

  return (
    <div className="app-form-container">
      <form className="app-form" onSubmit={handleSubmit}>
        <FormControl className="app-form-element">
          <InputLabel htmlFor="userName" required>
            Username
          </InputLabel>
          <Input
            id="userName"
            variant="standard"
            name="username"
            value={loginDetails.username}
            onChange={handleChange}
          />
          <FormHelperText className={reqUsername}>
            <span className="red">required</span>
          </FormHelperText>
        </FormControl>
        <FormControl className="app-form-element">
          <InputLabel htmlFor="password" required>
            Password
          </InputLabel>
          <Input
            id="password"
            variant="standard"
            name="password"
            value={loginDetails.password}
            onChange={handleChange}
          />
          <FormHelperText className={reqPassword}>
            <span className="red">required</span>
          </FormHelperText>
        </FormControl>
        <Button
          variant="contained"
          color="primary"
          className="app-form-element"
          type="submit"
        >
          LOGIN
        </Button>
      </form>
    </div>
  );
}
