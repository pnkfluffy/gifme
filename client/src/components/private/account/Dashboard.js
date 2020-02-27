import React, {useState} from 'react';
import Error400 from '../../error/NotValidUser(400)';
import Account from './Account.js';
import Uploads from './Uploads.js';

const TabBar = () => {
    const [ displayName, setDisplay ] = useState('');
    const V_Token = localStorage.getItem('myToken');

    //IMPROVE THIS!!! 
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
                return <Account/>;
            case 'Account':
                return <Account/>;
            case 'Uploads':
                return <Uploads/>;
            default:
                return <Account/>;
        }
    }
    if(V_Token){
    return(
    <div>
        <div className="box_TabBar">
        <button className="Tabs" onClick={displayAccount}>Account</button>
        <button className="Tabs" onClick={displayUploads}>Uploads</button>
        </div>
        <Display/>
    </div>
    )} else {return(<Error400/>)}
}

export default TabBar;