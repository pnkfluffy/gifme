import React, {useState} from 'react';
import Error400 from '../public/ErrorPages/NotValidUser(400)';
import Profile from'./Profile.js';
import Account from './Account.js';
import Uploads from './Uploads.js';

import '../../../CSS/TabBar.css';

const TabBar = () => {
    const [ displayName, setDisplay ] = useState('');
    const V_Token = localStorage.getItem('myToken');

    //IMPROVE THIS!!! 
    const displayProfile = e => {
        e.preventDefault();
        setDisplay('Profile');
    }

    const displayAccount = e => {
        e.preventDefault();
        setDisplay('Account');
    }

    const displayUploads = e => {
        e.preventDefault();
        setDisplay('Uploads');
    }

    const Display = () => {
        switch (displayName) {
            case 'Profile':
                return <Profile/>;
            case 'Account':
                return <Account/>;
            case 'Uploads':
                return <Uploads/>;
            default:
                return <Profile/>;
        }
    }
    if(V_Token){
    return(
    <div>
        <div className="box_TabBar">
        <button className="Tabs" onClick={displayProfile}>Profile</button>
        <button className="Tabs" onClick={displayAccount}>Account</button>
        <button className="Tabs" onClick={displayUploads}>Uploads</button>
        <Display/>
        </div>
    </div>
    )} else {return(<Error400/>)}
}

export default TabBar;