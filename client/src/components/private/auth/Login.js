import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import '../../../CSS/Signup.css';

const Login = () => {
	const [formData, setFormData] = useState({email:'', password:''});
	const [error, setError] = useState('');

    const {email, password} = formData;
    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value});
    
    const onSubmit = async e => {
        e.preventDefault();
        const loginInfo = {
            email,
            password
		}

        try {
            const config = {
                headers:{
                    'Content-Type': 'application/json'
                }
            }
            const body = JSON.stringify(loginInfo);
            await axios.post('/api/auth', body, config)
            //this shows the returned value either token or error message
            .then(res=>{
                const myToken = res.data.token;
                const myUserID = res.data.userID;
                localStorage.setItem('myToken', myToken);
                localStorage.setItem('myGifmeUserID', myUserID);
                window.location.href = '/';
            })
        } catch (err) {
			if (err){
				setError('your email or password do not match our records, try it again');
			}
		}
    }
    return <div>
        <div className="outside-container">
        <div className="container-form">
        <div className="form">
            <form onSubmit={e => onSubmit(e)} className="form-box">
                <input name="email"
                type="text"
                value={email}
                onChange={e => onChange(e)}
                placeholder="Your email"
                required="required"
                className="input"/>

                <input name="password"
                type="password"
                value={password}
                onChange={e => onChange(e)}
                maxLength="6"
                placeholder="Your
                password"
                required="required" className="input"/>

				<ErrorMessage text={error}/>

                <input
                type="submit"
                value="Sign in"
                className="sign-bottom"/>
            </form>
            <p>
                Don't have an account? <Link to='/Signup'>Sign Up</Link>
            </p>
            <div className="links">
                <img className="google" src="https://www.freepnglogos.com/uploads/google-logo-png/google-logo-png-webinar-optimizing-for-success-google-business-webinar-13.png" alt="Google link" />
                <p className="google_text">Sign in with Google account</p>
            </div>
        </div>
        </div>
    </div>
    </div>;
};

const ErrorMessage = ({text}) =>{
	return (
		<div>
			<div className="error_message">{text}</div>
		</div>
		);
	}

export default Login;