import React, { useState } from "react";
import { Fragment } from "react";
import "./Header.css";
import logo from "../../assets/logo.svg";
import { Button } from "@material-ui/core";
import BasicTabs from "../header/TabPanel";
import ReactModal from "react-modal";
import Modal from "react-modal";

export default function Header(props) {
  const [authModalFlag, setAuthModal] = useState(false);
  const [session, setSessionDetails] = React.useState(
    window.sessionStorage.getItem("access-token")
  );
  const handleLogin = () => {
    setAuthModal(true);
  };

  Modal.setAppElement("#root");

  //handle logout event
  const handleLogout = async () => {
    try {
      const authToken = window.sessionStorage.getItem("access-token");
      const rawResponse = await fetch(props.baseUrl + "/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + authToken,
          Accept: "*/*",
        },
      });
      if (rawResponse.status === 200) {
        window.sessionStorage.removeItem("access-token");
        window.sessionStorage.removeItem("user-details");
        setSessionDetails("");
      }
    } catch (exception) {
      console.log("Logout failed due to " + exception);
    }
  };

  //handle bookshow event
  const handleBookShow = () => {
    if (session) {
      window.location.href = `/bookshow/${props.movieID}`;
    } else {
      setAuthModal(true);
    }
  };

  const closeAuthModal = (props) => {
    setAuthModal(false);
  };

  // Maintain flag to determine if the BookShow button can be displayed or not
  let bookShowButton = "";
  if (props.showBookShow) {
    bookShowButton = (
      <Button
        variant="contained"
        color="primary"
        style={{ marginLeft: "10px" }}
        onClick={handleBookShow}
      >
        Book Show
      </Button>
    );
  }

  return (
    <Fragment>
      <div className="app-header">
        <img src={logo} className="app-logo" alt="Movie logo" />
        <div className="user-auth-actions">
          {session ? (
            <Button
              variant="contained"
              color="default"
              style={{ marginLeft: "10px" }}
              onClick={handleLogout}
            >
              Logout
            </Button>
          ) : (
            <Button
              variant="contained"
              color="default"
              style={{ marginLeft: "10px" }}
              onClick={handleLogin}
            >
              Login
            </Button>
          )}

          {bookShowButton}
        </div>
      </div>

      <Modal
        isOpen={authModalFlag}
        contentLabel="Auth modal"
        style={{
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            transform: "translate(-50%,-50%)",
          },
        }}
        {...props}
      >
        <BasicTabs
          {...props}
          closeAuthFun={closeAuthModal}
          saveSessionDetails={setSessionDetails}
        />
      </Modal>
    </Fragment>
  );
}
