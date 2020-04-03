import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Error from "../../error/PageNotFound(404)";
import PopUpMessage from "../../../utils/popUpMessage";

const Confirmation = () => {
  const [popMessage, setPopMessage] = useState("");
  const E_Token = localStorage.getItem("eToken");

  const deleteToken = () => {
    try {
      const config = {
        headers: {
          "x-auth-token": E_Token
        }
      };
      axios.get("/api/auth/confirmation", config).catch(err => {
        console.error(err.response);
      });
      //this shows the returned value either token or error message
      setPopMessage("Your account has been confirmed");
      setTimeout(() => {
        window.location.href = "/login";
        localStorage.removeItem("eToken");
      }, 3500);
    } catch (err) {
      console.log(err.response.data);
      return;
    }
  };

  if (!E_Token) {
    return (
      <div>
        <Error />
      </div>
    );
  } else {
    return (
      <div>
        <PopUpMessage text={popMessage} />
        <div className="confirm_box">
          <Link className="confirm_button" onClick={deleteToken}>
            Confirm your account
          </Link>
        </div>
      </div>
    );
  }
};

export default Confirmation;
