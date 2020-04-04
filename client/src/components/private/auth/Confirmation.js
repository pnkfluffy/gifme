<<<<<<< HEAD
import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useParams } from "react-router";
import PopUpMessage from '../../../utils/popUpMessage';


const Confirmation = () => {
    const [popMessage, setPopMessage] = useState('');

    let params = useParams("/confirm/:token");
    const {token} = params;
    
    const confirmAcc = async () =>{
        try {
            const config = {
                headers:{
                    'x-auth-token': token,
                }
            }
            await axios.get('/api/auth/confirm/', config)
            .catch(err=>{
                console.error(err.response);
            })
            setPopMessage('Your account has been confirmed');
        //    setTimeout(() => { window.location.href = '/login';}, 3500);
        } catch (err) {
            console.log(err.response.data);
            return;
=======
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
>>>>>>> 4344524a0487e52290282a7826e462e613ef422f
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

<<<<<<< HEAD
    return (
        <div>
            <PopUpMessage text={popMessage}/>
            <div className="confirm_box">
                <Link
                className="confirm_button"
                onClick={confirmAcc}>Confirm your account</Link>
            </div>
        </div>
        )
}
=======
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
>>>>>>> 4344524a0487e52290282a7826e462e613ef422f

export default Confirmation;
