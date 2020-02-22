import React, { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        password_verify: ''
    });

    const { username, email, password, password_verify } = formData;
    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        if (password !== password_verify) {
            console.log('Passwords do not match')
        } else {
            const newUser = {
                name: username,
                email,
                password
            }
            try {
                const config = {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
                const body = JSON.stringify(newUser);
                axios.post('/api/users', body, config)
                .then(res=>{
                    const myToken = res.data.token;
                    localStorage.setItem('myToken', myToken);
                    window.location.href = '/';
                })
                .catch(err=>{
                    console.log("error: ", err.response.data);
                })
            } catch(err) {
                //  MAKE LEGIBLE
                console.error(err.response.data);
            }
        }
    }

return (
<body>
	<div id="main">
        <form id="signin" method="post" onSubmit={e => onSubmit(e)}>
            <div className="signin_box">
                <input
                    type="text"
                    name="username"
                    maxLength="255"
                    className="username"
                    placeholder="username"
                    value={username}
                    onChange={e => onChange(e)}
                    required/>
                <input 
                    type="text"
                    name="email"
                    maxLength="255"
                    className="email"
                    placeholder="email"
                    vlaue ={email}
                    onChange={e => onChange(e)}
                    required/>
                <input
                    type="password"
                    name="password"
                    maxLength="255"
                    className="password"
                    placeholder="password"
                    value={password}
                    onChange={e => onChange(e)}
                    required/>
                <input
                    type="password"
                    name="password_verify"
                    maxLength="255"
                    className="password_verify"
                    placeholder="verify password"
                    value={password_verify}
                    onChange={e => onChange(e)}
                    required/>
                <input type="submit" className="submit" value="create account"/>
                <Link to='./login' className="forgot_pw">
                    <p>Already have an account?</p>
                </Link>
            </div>
        </form>
	</div>
	<footer id="footer">
  </footer>
</body>
)};

export default Register;