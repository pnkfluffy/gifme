import React from 'react';
import { Link } from 'react-router-dom';
import logo1 from '../../resources/gifme_logo_1.png';
import logo2 from '../../resources/gifme_logo_2.png';
import logo3 from '../../resources/gifme_logo_3.png';


const Navbar = () =>{

    const scrollToTop = () => {
            window.scroll({
                top: 0,
                left: 0,
                behavior: 'smooth',
              });
        }

    return(
        <div>
        <div className="header_absolute">
                	<div className="container-l">
                    	<Link className="navbar_logo" to="/" onClick={scrollToTop()}>
                            <img src={logo3} className="gifme_logo" alt="logo"/>
                        </Link>
                	</div>
                	<div className="container-m">
                	</div>
                	<div className="container-r">
                    	<NavbarLogin/>
                </div>
        </div>
        <div className="header_relative">
            <div className="container-r-relative">

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
        <div className="login_box">
            <Link to="/Signup" className="signup_button">Sign up</Link>
            <Link to="/Login" className="login_button">Log In</Link>
        </div>
    )} else {
        return (
            <div className="login_box">
                <Link to="/"
                className="logout_button"
                onClick={deleteToken}>Log out</Link>
                <Link to="/Profile"
                className="profile_button">Profile</Link>
            </div>
            )
        }
}

export default Navbar;