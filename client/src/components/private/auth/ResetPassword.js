import React, {useState} from 'react';
import axios from 'axios';
import { useParams } from "react-router";
import ErrorMessage from '../../../utils/errorMessage';
import PopUpMessage from '../../../utils/popUpMessage';

const ResetPassword = () =>{
    const [formData, setFormData] = useState({password: '', password2: ''});
    const [error, setError] = useState('');
    const [popMessage, setPopMessage] = useState('');
    
    let params = useParams("/reset/:token");
    const {token} = params;


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
                    'x-auth-token': token,
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
            setTimeout(() => { window.location.href = '/login';}, 3500);
        } catch (err) {
            setError(err.response.data.toString());
        }
    }
}
    return(
        <div>{ popMessage ? <PopUpMessage text={popMessage}/> :
            <div className="outside-container">
                <div className="container-form">
                    <div className="form">
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
        </div>
        }
    </div>
    )
}


export default ResetPassword;
