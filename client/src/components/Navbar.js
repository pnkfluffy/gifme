import React from 'react';
import { Link } from 'react-router-dom';

const Navbarlogin = () => {
return (
	<div id="login" >
		<Link to='/login' className="Login"> Log In </Link>
		<Link to='/register' className="Signup"> Sign Up </Link>
	</div>
)};

const Navbarlogout = () => {
	const deleteToken = () => {
		localStorage.removeItem('myToken');
	}
	return (
	<div id="logout" >
		<input value="Logout" type="button" className="Logout" onClick={deleteToken}/>
		<Link to='/register' className="Profile"> Profile </Link>
	</div>
)};

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