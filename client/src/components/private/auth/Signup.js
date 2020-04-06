import React, { useState } from "react";
import { Link } from "react-router-dom";
import ErrorMessage from "../../../utils/errorMessage";
import PopUpMessage from "../../../utils/popUpMessage";
//import LinkRegistration from '../../../utils/linkRegistration';
import axios from "axios";

const Signup = () => {
  /*
    useState is the 'state' from a class
    formData is just an initialized object with all the props
    set[FormData] is this.setState in a class
    */

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password2: ""
  });
  const [error, setError] = useState("");
  const [popMessage, setPopMessage] = useState("");

  let Token = '';

  

  //   const [link, setLink] = useState('');

  //here we destructure the props of formData,
  //instead of accessing them as formData.name, we just say name

  const { name, email, password, password2 } = formData;

  /*
    onChange updates the prop's state,
    [e.target.name] updates the prop by the 'name' value
     e.target.value is the new value 
    */

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  //onSubmit is called in the form and just checks if passwords match
  //preventDefault() method protects infinit loops

  //const onLinkRegistration = e => {setLink([e.target.name])}

  const onSubmit = async e => {
    e.preventDefault();
    if (password !== password2) {
      setError("Passwords do not match");
    } else {
      //here the props of newUser come from the state/form event
      const newUser = { name, email, password };
      try {
        //this sets the header properties
        const config = {
          headers: {
            "Content-Type": "application/json"
          }
        };
        //this sets what to send as the 'body' of the request
        const body = JSON.stringify(newUser);
        //here we set the type of request, where to send it and the data
        await axios.post("/api/users", body, config).then(res => {
          Token = res.data.token;
          const myUserID = res.data.userID;
          localStorage.setItem("Token", Token);
          localStorage.setItem("myGifmeUserID", myUserID);
        });
        setPopMessage(
          "We have sent you an email, please confirm your account (check your spam folder)"
        );
        setTimeout(() => {
          window.location.href = "/login";
        }, 10000);
      } catch (err) {
        setError(err.response.data.toString());
      }
    }
  };

  return (
    <div>
      <div className="outside-container">
        <div className="container-form">
          <div className="form">
            <PopUpMessage text={popMessage} />
            <form onSubmit={e => onSubmit(e)} className="form-box">
              <ErrorMessage text={error} />

              <input
                name="name"
                type="text"
                value={name}
                onChange={e => onChange(e)}
                placeholder="Your name"
                className="input"
              />

              <input
                name="email"
                type="email"
                value={email}
                onChange={e => onChange(e)}
                placeholder="Your email"
                className="input"
              />

              <input
                name="password"
                type="password"
                value={password}
                onChange={e => onChange(e)}
                placeholder="Your password"
                className="input"
              />

              <input
                name="password2"
                value={password2}
                onChange={e => onChange(e)}
                type="password"
                placeholder="Confirm your password"
                className="input"
              />

              <input type="submit" value="Sign up" className="sign-bottom" />
            </form>
            <p>
              Have an account? <Link to="/Login">Log In</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

/*
<div className="links">
                <img className="google" name="google API" onClick={e => onLinkRegistration(e)} src="https://www.freepnglogos.com/uploads/google-logo-png/google-logo-png-webinar-optimizing-for-success-google-business-webinar-13.png" alt="Google link" />
                <p className="google_text">Sign in with Google account</p>
                <LinkRegistration name={link}/>
            </div>
*/

export default Signup;
