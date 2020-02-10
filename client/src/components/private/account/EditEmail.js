import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EmailReset = () => {
    const [formData, setFormData] = useState({
      new_email: ''
    });
  
    const { new_email } = formData;
    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
    
    const onSubmit = async e => {
        e.preventDefault();
      const newEmail = {
        new_email
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
        const body = JSON.stringify(newEmail);
        axios.put('api/update/email', body, config)
        .then(res=>{
          console.log('Successful email');
        })
        .catch(err=>{
          console.log("error with email update: ", err.response.data);
        })
      } catch(err) {
        console.error(err.response.data);
      }
    }
  
    return (
    <form id="emailreset" method="post" onSubmit={e => onSubmit(e)}>
      <input
        type="text"
        name="new_email"
        maxLength="255"
        className="new_email"
        placeholder="new email"
        value={new_email}
        onChange={e => onChange(e)}
        required/>
      <input type="submit" className="submit" value="send"/>
    </form>
    )
  }
  
  const EditEmail = () => {
    const [ displayForm, setDisplayForm ] = useState(false);
  
    function changeDisplay(e) {
      e.preventDefault();
      setDisplayForm(true);
    }
  
    if (displayForm === false) {
    return (
      <button
        className="editemail"
        onClick={changeDisplay}
      >
        Edit Email
      </button>
    )}
    return (
      <EmailReset/>
    )
  }

  export default EditEmail;