import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useParams } from "react-router";
import PopUpMessage from "../../../utils/popUpMessage";

const Confirmation = () => {
  const [popMessage, setPopMessage] = useState("");

  let params = useParams("/confirm/:token");
  const { token } = params;

  const confirmAcc = () => {
    const config = {
      headers: {
        "x-auth-token": token,
      },
    };
    const body = null;
    axios.put("/api/auth/confirm/", body, config).catch((err) => {
      console.error(err.response);
    });
    setPopMessage(
      "Your account has been confirmed, you will be redirected shortly"
    );
    setTimeout(() => {
      window.location.href = "/login";
    }, 3500);
  };

  const ConfirmAccount = () => (
    <div className="confirm_box">
      <Link className="confirm_button" onClick={confirmAcc}>
        click here to confirm your account
      </Link>
    </div>
  );

  return (
    <div>
      {popMessage ? <PopUpMessage text={popMessage} /> : <ConfirmAccount />}
    </div>
  );
};

export default Confirmation;
