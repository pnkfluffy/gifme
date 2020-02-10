import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EmailReset = () => {
    const [formData, setFormData] = useState({
      new_name: ''
    });
  
    const { new_name } = formData;
    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
    
    const onSubmit = async e => {
        e.preventDefault();
      const newUsername = {
        new_name
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
        const body = JSON.stringify(newUsername);
        axios.put('api/update/user', body, config)
        .then(res=>{
          console.log('Successful username');
        })
        .catch(err=>{
          console.log("error with username update: ", err.response.data);
        })
      } catch(err) {
        console.error(err.response.data);
      }
    }
  
    return (
    <form id="usernamereset" method="post" onSubmit={e => onSubmit(e)}>
      <input
        type="text"
        name="new_name"
        maxLength="255"
        className="new_name"
        placeholder="new username"
        value={new_name}
        onChange={e => onChange(e)}
        required/>
      <input type="submit" className="submit" value="send"/>
    </form>
    )
  }
  
  const EditUsername = () => {
    const [ displayForm, setDisplayForm ] = useState(false);
  
    function changeDisplay(e) {
      e.preventDefault();
      setDisplayForm(true);
    }
  
    if (displayForm === false) {
    return (
      <button
        className="editusername"
        onClick={changeDisplay}
      >
        Edit Username
      </button>
    )}
    return (
      <EmailReset/>
    )
  }

  export default EditUsername;