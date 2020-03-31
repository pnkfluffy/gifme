import React, {useState} from 'react';
import axios from 'axios';
import ErrorMessage from '../../../utils/errorMessage';
import PopUpMessage from '../../../utils/popUpMessage';
import Error from '../../error/PageNotFound(404)';


const ResetPassword = () =>{
    const [formData, setFormData] = useState({password: '', password2: ''});
    const [error, setError] = useState('');
    const [popMessage, setPopMessage] = useState('');
    const E_Token = localStorage.getItem('eToken');


    const {password, password2} = formData;
    const onChange = e => setFormData({...formData, [e.target.name]: e.target.value})

    const onSubmit = async e => {
        e.preventDefault();
        if(password !== password2) {
			setError('Passwords do not match');
        } else {
        try {
            const config = {
                headers:{
                    'x-auth-token': E_Token,
                    'Content-Type': 'application/json'
                }}
            const newPassword = {password};
            const body = JSON.stringify(newPassword);
            axios.put('/api/auth/resetpass', body, config)
            .catch(err=>{
                setError(err.response.data.toString());
                return;
            })
            setPopMessage('Your password has been updated succesfully');
            setTimeout(() => { window.location.href = '/login'; localStorage.removeItem('eToken');}, 3500);
        } catch (err) {
            console.log(err.response.data);
            setError(err.response.data.toString());
        }
    }
}
if (!E_Token){
    return (<div><Error/></div>)
} else {
    return(
        <div>
            <div className="form">
            <PopUpMessage text={popMessage}/>
            <form onSubmit={e => onSubmit(e)} className="form-box">
                <ErrorMessage text={error}/>

                <input name="password"
                type="password"
                value={password}
                onChange={e => onChange(e)}
                placeholder="New Password"
                className="input"/>

                <input name="password2"
                type="password"
                value={password2}
                onChange={e => onChange(e)}
                placeholder="Confirm Password"
                className="input"/>

                <input type="submit"
                value="Reset Password"
                className="sign-bottom"/>
                </form>
            </div>
        </div>
        )
    }
}

export default ResetPassword;