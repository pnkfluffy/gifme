import React, { useState } from "react";
import axios from "axios";
import ErrorMessage from "../../../utils/errorMessage";

const Account = () => {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [trace, setTrace] = useState("");

  const V_Token = localStorage.getItem("myToken");
  const onChange = e => {
    setTrace([e.target.name]);
  };
  const config = {
    headers: {
      "x-auth-token": V_Token
    }
  };
  axios
    .get("api/auth", config)
    .then(res => {
      setUserName(res.data.name);
      setUserEmail(res.data.email);
    })
    .catch(err => {
      console.error(err.response);
      window.location.href = "/profile";
    });
  return (
    <div>
      <div className="account_body">
        <div className="Title">Account</div>
        <div className="Container">
          <div className="Content">
            <h5>Name:</h5> {userName}{" "}
          </div>
          <div className="Content">
            <h5>Email:</h5> {userEmail}{" "}
          </div>
          <div className="Content">
            <h5>Password:</h5> ********{" "}
          </div>
        </div>
        <div className="Container">
          <button name="name" onClick={e => onChange(e)} className="Change">
            Edit your Name
          </button>
          <button name="email" onClick={e => onChange(e)} className="Change">
            Change Email
          </button>
          <button name="password" onClick={e => onChange(e)} className="Change">
            Change Password
          </button>
          <button
            className="delete_btn"
            name="delete"
            onClick={e => onChange(e)}
          >
            Delete Account
          </button>
        </div>
        <ToSwitch data={trace} />
      </div>
    </div>
  );
};

const ToSwitch = ({ data }) => {
  const [newData, setNewData] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
    password_account: ""
  });
  const [error, setError] = useState("");
  const { name, email, password, password2, password_account } = newData;
  const V_Token = localStorage.getItem("myToken");

  const onChange = e => {
    setNewData({ ...newData, [e.target.name]: e.target.value });
  };

  const onSubmit = async e => {
    e.preventDefault();
    if (password !== password2) {
      setError("Passwords do not match");
    } else if (password_account) {
      try {
        const config = {
          headers: {
            "x-auth-token": V_Token,
            "Content-Type": "application/json"
          }
        };
        const deleteAccount = { password_account };
        const body = JSON.stringify(deleteAccount);
        await axios
          .put("/api/users/delete", body, config)
          .then(
            localStorage.removeItem("myToken"),
            (window.location.href = "/")
          );
      } catch (err) {
        setError(err.response.data.toString());
      }
    } else {
      try {
        const config = {
          headers: {
            "x-auth-token": V_Token,
            "Content-Type": "application/json"
          }
        };
        const newUser = { name, email, password };
        const body = JSON.stringify(newUser);
        await axios.put("/api/users", body, config);
        window.location.href = "/Profile";
      } catch (err) {
        setError(err.response.data.toString());
      }
    }
  };

  switch (data.toString()) {
    case "password":
      return (
        <div>
          <div className="Cont_edit">
            <ErrorMessage text={error} />

            <form onSubmit={e => onSubmit(e)} className="edit_form">
              <input
                name="password"
                type="password"
                value={password}
                onChange={e => onChange(e)}
                placeholder="Your password"
                required="required"
                className="edit_button"
              />

              <input
                name="password2"
                value={password2}
                onChange={e => onChange(e)}
                type="password"
                placeholder="Confirm your password"
                required="required"
                className="edit_button"
              />

              <button type="submit" className="edit_sign_button">
                Change password
              </button>
            </form>
          </div>
        </div>
      );
    case "name":
      return (
        <div>
          <div className="Cont_edit">
            <ErrorMessage text={error} />

            <form onSubmit={e => onSubmit(e)} className="edit_form">
              <input
                name="name"
                type="text"
                value={name}
                onChange={e => onChange(e)}
                placeholder="New name"
                required="required"
                className="edit_button"
              />

              <button type="submit" className="edit_sign_button">
                Edit name
              </button>
            </form>
          </div>
        </div>
      );
    case "email":
      return (
        <div>
          <div className="Cont_edit">
            <ErrorMessage text={error} />

            <form onSubmit={e => onSubmit(e)} className="edit_form">
              <input
                name="email"
                type="text"
                value={email}
                onChange={e => onChange(e)}
                placeholder="New email"
                required="required"
                className="edit_button"
              />

              <button type="submit" className="edit_sign_button">
                Change email
              </button>
            </form>
          </div>
        </div>
      );
    case "delete":
      return (
        <div>
          <div className="Cont_edit">
            <ErrorMessage text={error} />

            <form onSubmit={e => onSubmit(e)} className="edit_form">
              <input
                name="password_account"
                type="password"
                value={password_account}
                onChange={e => onChange(e)}
                placeholder="Confirm your password"
                required="required"
                className="edit_button"
              />

              <button type="submit" className="edit_sign_button">
                Delete Account
              </button>
            </form>
          </div>
        </div>
      );
    default:
      return <div></div>;
  }
};

export default Account;
