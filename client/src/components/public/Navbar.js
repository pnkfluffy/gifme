import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const Navbarlogin = () => {
	const hasValidToken = localStorage.getItem('myToken');

	console.log("token: ", hasValidToken);
	const deleteToken = () => {
		localStorage.removeItem('myToken');
		window.location.href = '/';
	}

	if (!hasValidToken) {
	return (
	<div id="login" >
		<Link to='/login' className="Login"> Log In </Link>
		<Link to='/register' className="Signup"> Sign Up </Link>
	</div>
	)} else {
		return (
		<div id="logout" >
			<Link to='/'>
			<input value="Logout" type="button" className="Logout" onClick={deleteToken}/>
			</Link>
			<Link to='/profile' className="Profile"> Profile </Link>
		</div>
		)
	}
};

const Navbar = () => {
return (
    <div id="header">
        <div id="left_logo">
			C
        </div>
        <div id="center_logo">
			<Link to='/'>Camagru</Link>
		</div>
		<Navbarlogin/>
    </div>
)};

export default Navbar;