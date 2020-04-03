import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { slide as Menu } from "react-burger-menu";
import logo3 from "../../resources/gifme_logo_3.png";
import camera_icon from "../../resources/camera_icon_white.png";
import fetchAuth from "../../utils/FetchAuth";

const Navbar = () => {
  const [menuState, setMenuState] = useState(true);
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);

  if (user) {
    //get user ID and destructer it
    console.log(user);
    user.then(res => {
      if (res) {
        setUserId(res._id);
      }
    });
  }

  const openMenu = () => {
    setMenuState(false);
  };

  useEffect(() => {
    setUser(fetchAuth());
  }, []);

  //  scroll to top does not work
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth"
    });
  };

  return (
    <div>
      <div className="header_relative"></div>
      <div className="header_absolute">
        <Link className="navbar_logo" to="/" onClick={scrollToTop()}>
          <img src={logo3} className="gifme_logo" alt="logo" />
        </Link>
        {/* if userId, then user is logged in */}
        {userId ? (
          <div className="feature_container">
            <div className="container_camera_icon">
              <Link className="photobooth_link" to="/photobooth">
                <img
                  className="camera_icon"
                  src={camera_icon}
                  alt="photobooth"
                ></img>
              </Link>
              <Menu noOverlay isOpen={menuState} onStateChange={openMenu}>
                <Link to={`/profile/${userId}`} onClick={openMenu}>
                  Profile
                </Link>
                <Link to={`/favorites/${userId}`} onClick={openMenu}>
                  Favorite posts
                </Link>
                <Link to="/Settings" onClick={openMenu}>
                  Settings
                </Link>
                <SwitchPrivacy />
              </Menu>
            </div>
          </div>
        ) : (
          <div className="feature_container">
            <Link to="/Signup" className="signup_button">
              Sign up
            </Link>
            <Link to="/Login" className="login_button">
              Log In
            </Link>
          </div>
        )}
      </div>
      <div className="container-r-relative"></div>
    </div>
  );
};

const SwitchPrivacy = () => {
  const V_Token = localStorage.getItem("myToken");

  const deleteToken = () => {
    localStorage.removeItem("myToken");
    localStorage.removeItem("myGifmeUserID");
    window.location.href = "/";
  };
  if (V_Token) {
    return (
      <div>
        <div className="bm-item" onClick={deleteToken}>
          Log out
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <Link to="/Login" className="bm-item">
          Log in
        </Link>
      </div>
    );
  }
};

export default Navbar;
