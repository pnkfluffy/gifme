import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Signup = () => {
    /*
    useState is the 'state' from a class
    formData is just an initialized object with all the props
    set[FormData] is this.setState in a class
    */

   const [formData, setFormData] = useState({
       name:'', email: '', password: '', password2: ''});
	   const [error, setError] = useState('');
    
       //here we destructure the props of formData,
    //instead of accessing them as formData.name, we just say name
    
    const {name, email, password, password2} = formData;
    
    /*
    onChange updates the prop's state,
    [e.target.name] updates the prop by the 'name' value
     e.target.value is the new value 
    */

   const onChange = e => setFormData({...formData, [e.target.name]: e.target.value})
    //onSubmit is called in the form and just checks if passwords match
    //preventDefault() method protects infinit loops

    const onSubmit = async e => {
        e.preventDefault();
        if(password !== password2) {
			setError('Passwords do not match');
        } else {
        //here the props of newUser come from the state/form event
			const newUser = {name, email, password};
            try {
                //this sets the header properties
                const config = {
                    headers:{
						'Content-Type': 'application/json',
						
                    }
                }
                //this sets what to send as the 'body' of the request
                const body = JSON.stringify(newUser);
				//here we set the type of request, where to send it and the data 
				await axios.post('/api/users', body, config)
				.then(res=>{
					const myToken = res.data.token;
					localStorage.setItem('myToken', myToken);
					window.location.href = '/';
				})
                //this shows the returned value either token or error message
            } catch (err) {
                console.error('myerror:', err.response);
            }
        }
    }

    return <div>
        <div className="outside-container">
        <div className="container-form">
        <div className="form">
            <form onSubmit={e => onSubmit(e)} className="form-box">
                <input name="name"
                type="text"
                value={name}
                onChange={e => onChange(e)}
                placeholder="Your name"
                className="input"/>

                <input name="email"
                type="email"
                value={email}
                onChange={e => onChange(e)}
                placeholder="Your email"
                className="input"/>

                <input name="password"
                type="password"
                value={password}
                onChange={e => onChange(e)}
                maxLength="6"
                placeholder="Your password"
                className="input"/>

                <input name="password2"
                value={password2}
                onChange={e => onChange(e)}
                maxLength="6"
                type="password"
                placeholder="Confirm your password"
                className="input"/>

                <input type="submit"
                value="Sign up"
                className="sign-bottom"/>
            </form>
            <ErrorMessage text={error}/>
            <p>
                Have an account? <Link to='/Login'>Log In</Link>
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

export default Signup;