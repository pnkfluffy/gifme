import React, { Fragment, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import EditPass from './EditPass';
import EditUsername from './EditUsername';
import EditEmail from './EditEmail';

const Dashboard = () => {
  const [ username, setusername ] = useState('');
  const [ useremail, setuseremail ] = useState('');
  const [ authError, setAuthError ] = useState(false);

  const authtoken = localStorage.getItem('myToken');
  const config = {
    headers: {
        'x-auth-token': authtoken
    }}

    axios.get('api/auth', config)
    .then(res=>{
      setusername(res.data.name);
      setuseremail(res.data.email);
      console.log("response: ", res.data);
    })
    .catch(err=>{
      setAuthError(true);
      console.error("myerror: ", err.response);
    })

  return authError === true ? (
    <div>
      auth error
    </div>
  ) : (
    <body>
      <h1>Dashboard</h1>
      <div id="main">
          <div className="user_profile">
            <h2>
              Username:
            </h2>
            <p>{username}</p>
            <EditUsername/>
            <h2>
              Email:
            </h2>
            <p>{useremail}</p>
            <EditEmail/>
            <br/>
            <EditPass/>
          </div>
      </div>
      <footer id="footer">
      </footer>
    </body>
    )
}

export default Dashboard;