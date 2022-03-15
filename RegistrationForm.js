import React, { useState } from "react";
import { Button, FormControl, FormHelperText } from "@material-ui/core";
import { InputLabel } from "@material-ui/core";
import { Input } from "@material-ui/core";
import "../../common/header/Form.css";
import "./Registration.css";

export default function RegistrationForm(props) {
  const [reqEmail, setReqEmail] = React.useState("dispNone");
  const [reqFirstname, setReqFirstName] = React.useState("dispNone");
  const [reqLastname, setReqLastName] = React.useState("dispNone");
  const [reqPhoneNumber, setReqPhoneNumber] = React.useState("dispNone");
  const [reqPassword, setReqPassword] = React.useState("dispNone");
  const [showRegistrationSuccess, setShowRegistrationSuccess] =
    React.useState("dispNone");

  const signUpURL = `${props.baseUrl}signup`;

  const [registrationDetails, setRegistrationDetails] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: "",
  });

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setRegistrationDetails((state) => ({ ...state, [name]: value }));
  };

  const validateRegisterForm = () => {
    registrationDetails.email === ""
      ? setReqEmail("dispBlock")
      : setReqEmail("dispNone");
    registrationDetails.firstName === ""
      ? setReqFirstName("dispBlock")
      : setReqFirstName("dispNone");
    registrationDetails.lastName === ""
      ? setReqLastName("dispBlock")
      : setReqLastName("dispNone");
    registrationDetails.phoneNumber === ""
      ? setReqPhoneNumber("dispBlock")
      : setReqPhoneNumber("dispNone");
    registrationDetails.password === ""
      ? setReqPassword("dispBlock")
      : setReqPassword("dispNone");

    if (
      registrationDetails.email === "" ||
      registrationDetails.firstName === "" ||
      registrationDetails.lastName === "" ||
      registrationDetails.phoneNumber === "" ||
      registrationDetails.password === ""
    ) {
      return false;
    } else {
      return true;
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const validationFlag = validateRegisterForm();

    if (validationFlag) {
      registerUser();
    } else {
    }
  };

  async function registerUser() {
    const userDetails = {
      first_name: registrationDetails.firstName,
      last_name: registrationDetails.lastName,
      email_address: registrationDetails.email,
      mobile_number: registrationDetails.phoneNumber,
      password: registrationDetails.password,
    };

    try {
      const rawResponse = await fetch(signUpURL, {
        body: JSON.stringify(userDetails),
        method: "POST",
        headers: {
          Accept: "application/json;charset=UTF-8",
          "Content-Type": "application/json;charset=UTF-8",
        },
      });

      const response = await rawResponse.json();
      if (response.status === "ACTIVE") {
        setShowRegistrationSuccess("dispBlock");
        setTimeout(() => {
          props.closeAuthFun();
        }, 3000);
      }
      if (rawResponse.ok) {
        console.log("registration response is " + JSON.stringify(response));
      } else {
        const error = new Error();
        error.message =
          response.message || "Something is wrong , please try again";
        throw error;
      }
    } catch (e) {
      alert(`Error : ${e.message}`);
    }
  }

  return (
    <div className="app-form-container">
      <form onSubmit={handleSubmit} className="app-form">
        <FormControl className="app-form-element">
          <InputLabel htmlFor="firstName" required>
            First Name
          </InputLabel>
          <Input
            id="firstName"
            variant="standard"
            name="firstName"
            onChange={handleChange}
            value={registrationDetails.firstName}
          />
          <FormHelperText className={reqFirstname}>
            <span className="red">required</span>
          </FormHelperText>
        </FormControl>

        <FormControl className="app-form-element">
          <InputLabel htmlFor="lastName" required>
            Last Name
          </InputLabel>
          <Input
            id="lastName"
            variant="standard"
            name="lastName"
            onChange={handleChange}
            value={registrationDetails.lastName}
          />
          <FormHelperText className={reqLastname}>
            <span className="red">required</span>
          </FormHelperText>
        </FormControl>

        <FormControl className="app-form-element">
          <InputLabel htmlFor="email" required>
            Email
          </InputLabel>
          <Input
            id="email"
            variant="standard"
            type="email"
            name="email"
            onChange={handleChange}
            value={registrationDetails.email}
          />
          <FormHelperText className={reqEmail}>
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
            type="password"
            name="password"
            onChange={handleChange}
            value={registrationDetails.password}
          />
          <FormHelperText className={reqPassword}>
            <span className="red">required</span>
          </FormHelperText>
        </FormControl>

        <FormControl className="app-form-element">
          <InputLabel htmlFor="contactNo" required>
            Contact No.
          </InputLabel>
          <Input
            id="ContactNo"
            variant="standard"
            type="phonenumber"
            name="phoneNumber"
            onChange={handleChange}
            value={registrationDetails.phoneNumber}
          />
          <FormHelperText className={reqPhoneNumber}>
            <span className="red">required</span>
          </FormHelperText>
        </FormControl>

        <FormHelperText
          className={showRegistrationSuccess}
          style={{ fontSize: "14px", color: "black" }}
        >
          Registration Successful. Please Login!
        </FormHelperText>

        <Button
          variant="contained"
          color="primary"
          className="app-form-element"
          type="submit"
        >
          REGISTER
        </Button>
      </form>
    </div>
  );
}
