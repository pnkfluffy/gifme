import React, {useState} from 'react';
import axios from 'axios';
import ErrorMessage from '../../../utils/errorMessage';
import PopUpMessage from '../../../utils/popUpMessage';


const SendEmail = () =>{
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [popMessage, setPopMessage] = useState('');

    const onChange = async e => setEmail(e.target.value)

    const onSubmit = e => {
        e.preventDefault();
        try {
            const config = {
                headers:{
                    'Content-Type': 'application/json'
                }}
            const emailData = {email};
            const body = JSON.stringify(emailData);
            axios.post('/api/auth/sendEmail', body, config)
            setPopMessage('We have sent you an email, please confirm your account');
            setTimeout(() => { window.location.href = '/login';}, 4000);

        } catch (err) {
            setError(err.response.data.toString());
        }
    }

return(
    <div>
        <div className="form">
        <PopUpMessage text={popMessage}/>
        <form onSubmit={e => onSubmit(e)} className="form-box">
            <ErrorMessage text={error}/>

            <input name="email"
            type="email"
            value={email}
            onChange={e => onChange(e)}
            placeholder="email"
            className="input"/>

            <input type="submit"
            value="send email"
            className="sign-bottom"/>
            </form>
        </div>
    </div>
    )
}


export default SendEmail;