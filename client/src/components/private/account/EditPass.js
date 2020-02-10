import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PasswordReset = () => {
    const [formData, setFormData] = useState({
      old_pw: '',
      new_pw: '',
      new_pw_verify: ''
    });
  
    const { old_pw, new_pw, new_pw_verify } = formData;
    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
    
    const onSubmit = async e => {
      e.preventDefault();
      if (new_pw !== new_pw_verify) {
        console.log('Passwords do not match')
      } else {
        const newPass = {
          new_pw
        }
        const myToken = localStorage.getItem('myToken');
        try {
          const config = {
            headers: {
              'x-auth-token': myToken,
              'Content-Type': 'application/json'
            }
          }
          console.log(config);
          const body = JSON.stringify(newPass);
          axios.put('api/update/pass', body, config)
          .then(res=>{
            console.log('Successful password update');
          })
          .catch(err=>{
            console.log("error with pass update: ", err.response.data);
          })
        } catch(err) {
          console.error(err.response.data);
        }
      }
    }
  
    return (
    <form id="pwreset" method="post" onSubmit={e => onSubmit(e)}>
      <div>
      <input
        type="password"
        name="old_pw"
        maxLength="255"
        className="old_pw"
        placeholder="old password"
        value={old_pw}
        onChange={e => onChange(e)}
        required/>
      </div>
      <input
        type="password"
        name="new_pw"
        maxLength="255"
        className="new_pw"
        placeholder="new password"
        value={new_pw}
        onChange={e => onChange(e)}
        required/>
      <input
        type="password"
        name="new_pw_verify"
        maxLength="255"
        className="new_pw_verify"
        placeholder="verify new password"
        value={new_pw_verify}
        onChange={e => onChange(e)}
        required/>
      <input type="submit" className="submit" value="change password"/>
    </form>
    )
  }
  
  const EditPass = () => {
    const [ displayForm, setDisplayForm ] = useState(false);
  
    function changeDisplay(e) {
      e.preventDefault();
      setDisplayForm(true);
    }
  
    if (displayForm === false) {
    return (
      <button
        className="editpass"
        onClick={changeDisplay}
      >
        Edit Password
      </button>
    )}
    return (
      <PasswordReset/>
    )
  }

  export default EditPass;