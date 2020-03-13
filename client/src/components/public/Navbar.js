import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {slide as Menu} from "react-burger-menu";
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
                	<div className="container-m"></div>
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
    const [menuState, setMenuState] = useState(true)
    
    const openMenu = () =>{setMenuState(false)}
    return(
        <div>
            <Link to='/PhotoBooth' className="temporal_link">Take a Photo</Link>
            <Menu noOverlay isOpen={menuState} onStateChange={openMenu}>
                <Link to='/Account' onClick={openMenu}>Account</Link>
                <Link to='/MyPosts' onClick={openMenu}>My posts</Link>
                <Link to='/likes' onClick={openMenu}>Favorite posts</Link>
                <Link to='/settings' onClick={openMenu}>Settings</Link>
                <SwitchPrivacy/>       
            </Menu>
        </div>
    )
}

const SwitchPrivacy= () =>{
    const V_Token = localStorage.getItem('myToken');

    const deleteToken = () =>{
        localStorage.removeItem('myToken');
        localStorage.removeItem('myGifmeUserID');
        window.location.href = '/';
    }
    if (V_Token){ 
        return(
        <div>
            <Link className="bm-item" onClick={deleteToken}>Log out</Link>
        </div>
    )} 
    else {
        return (
        <div>
            <Link to='/Login' className="bm-item">Log in</Link>
        </div>
    )}
}

export default Navbar;