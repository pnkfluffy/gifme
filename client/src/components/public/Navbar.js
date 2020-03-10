import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import logo1 from '../../resources/gifme_logo_1.png';
import logo2 from '../../resources/gifme_logo_2.png';
import logo3 from '../../resources/gifme_logo_3.png';
import camera_icon from '../../resources/camera_icon_white.png'
import fetchAuth from '../../utils/FetchAuth';

const Navbar = () =>{
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        fetchAuth().then(res => {
          if (res) {
            setLoggedIn(true);
          }
        });
      }, []);

    //  scroll to top does not work
    const scrollToTop = () => {
            window.scrollTo({
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
                    	<NavbarLogin loggedIn={loggedIn}/>
                    </div>
            </div>
        <div className="header_relative">
            <div className="container_camera_icon">
                {loggedIn ? 
                <Link className="photobooth_link" to="/photobooth">
                    <img className="camera_icon" src={camera_icon} alt="photobooth"></img>
                </Link>
                : null}
            </div>
            <div className="container-r-relative">
            </div>
        </div>
        </div>
    );
}


const NavbarLogin = ({loggedIn}) => {

    const deleteToken = () =>{
        localStorage.removeItem('myToken');
        localStorage.removeItem('myGifmeUserID');
        window.location.href = '/';
    }
    if(!loggedIn) {
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