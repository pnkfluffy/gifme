import React from 'react';
import {Link} from 'react-router-dom';

const Navbar = () =>{
    return(
        <div>
            <div className="box"></div>
            <div className="header">
                <div className="container">
                    <Link className="logo" to="/">logo</Link>
                </div>
                <div className="container-m"></div>
                <div className="container">
                    <NavbarLogin/>
                </div>
            </div>
        </div>
    );
}


const NavbarLogin = () => {
    const V_Token = localStorage.getItem('myToken');
    
    const deleteToken = () =>{
        localStorage.removeItem('myToken');
        window.location.href = '/';
    }
    if(!V_Token) {
    return (
        <div>
            <Link to="/Signup" className="login">Sign up</Link>
            <Link to="/Login" className="login">Log In</Link>
           </div>
    )} else {
        return (
            <div>
                <Link to="/"
                className="login"
                onClick={deleteToken}>Log out</Link>
                <Link to="/Profile"
                className="login">Profile</Link>
            </div>
            )
        }
}

export default Navbar;