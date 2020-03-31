import React, {useState} from 'react';
import axios from 'axios';
import ErrorMessage from '../../utils/errorMessage';
import PopUpMessage from '../../utils/popUpMessage';

const RecoveryEmail = () =>{
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [popMessage, setPopMessage] = useState('');

    const onChange = e => setEmail(e.target.value);
    const recoveryEmail = {email};

    const onSubmit = async e => {
        e.preventDefault();
        try {
            const config = {
                headers:{
                    'Content-Type': 'application/json',
                }
            }
            const body = JSON.stringify(recoveryEmail);

            await axios.post('/api/auth/recoveryemail', body, config)
            //this shows the returned value either token or error message
            .then(res=>{
                const eToken = res.data.etoken;
                console.log('here eToken:', eToken)
                localStorage.setItem('eToken', eToken);
                setPopMessage('We have sent you an email to reset your password');
                setTimeout(() => { window.location.href = '/login';}, 3500);
            })

        } catch (err) {
            console.log(err.response.data);
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
                placeholder="Your email"
                className="input"/>

                <input type="submit"
                value="Confirm email"
                className="sign-bottom"/>
                </form>
            </div>
        </div>
    )
}

export default RecoveryEmail;