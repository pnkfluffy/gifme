import React, {useState} from 'react';
import axios from 'axios';
import '../../../CSS/Profile.css';

const Profile = () => {
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');

    const V_Token = localStorage.getItem('myToken');

    const config = {
        headers:{
            'x-auth-token': V_Token,
        }}
    axios.get('api/auth', config)
    .then(res=>{
        setUserName(res.data.name);
        setUserEmail(res.data.email);
    })
    .catch(err=>{
        console.error("myerror: ", err.response);
      })
    return(
        <div>
            <div>Profile
                <h1>Username:</h1>
                <p>{userName}</p>
 
                <h1>Useremail:</h1>
                <p>{userEmail}</p>
            </div>
        </div>
    )
 }

 export default Profile;