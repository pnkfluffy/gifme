import React, { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const { email, password } = formData;
    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        const loginInfo = {
            email,
            password
        }
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
            const body = JSON.stringify(loginInfo);
            axios.post('/api/auth', body, config)
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
    };
    return (
    <body>
    	<div id="main">
            <form id="signin" method="post" onSubmit={e => onSubmit(e)}>
                <div className="signin_box">
                    <input 
                        type="text"
                        name="email"
                        maxLength="255"
                        className="email"
                        placeholder="email"
                        onChange={e => onChange(e)}
                        value={email}
                        required/>
                    <input
                        type="text"
                        name="password"
                        maxLength="255"
                        className="password"
                        placeholder="password"
                        onChange={e => onChange(e)}
                        value={password}
                        required/>
                    <input type="submit" className="submit" value="login"/>
                    <a href="#" className="forgot_pw">
                        Forgot your password?
                        {/* <!--use javascript, bring up email form and send reset pw email--> */}
                    </a>
                </div>
            </form>
    	</div>
    	<footer id="footer">
            <wr/>
            &copy Jack&Jon all rights reserved.
        </footer>
        <script src="test.js"></script>
    </body>
)};

export default Login;