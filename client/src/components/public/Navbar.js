import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { slide as Menu } from "react-burger-menu";
import logo3 from "../../resources/gifme_logo_3.png";
import camera_icon from "../../resources/camera_icon_white.png";
import fetchAuth from "../../utils/FetchAuth";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(true);
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);

  if (user) {
    //get user ID and destructer it
    user.then((res) => {
      if (res) {
        setUserId(res._id);
      }
    });
  }

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const stateChangeHandler = (newState) => {
    setMenuOpen(newState.isOpen);
  };

  useEffect(() => {
    setUser(fetchAuth());
  }, []);

  //  scroll to top does not work
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
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
            <div className="container_camera_icon_auth">
              <Link className="photobooth_link" to="/photobooth">
                <img
                  className="camera_icon"
                  src={camera_icon}
                  alt="photobooth"
                />
              </Link>
            </div>
            <Menu
              noOverlay
              isOpen={menuOpen}
              onStateChange={(state) => stateChangeHandler(state)}
            >
              <Link to={`/profile/${userId}`} onClick={toggleMenu}>
                Profile
              </Link>
              <Link to={`/favorites/${userId}`} onClick={toggleMenu}>
                Favorite posts
              </Link>
              <Link to="/Settings" onClick={toggleMenu}>
                Settings
              </Link>
              <SwitchPrivacy />
            </Menu>
          </div>
        ) : (
          <div className="feature_container">
            <div className="container_camera_icon_noauth">
              <Link className="photobooth_link" to="/photobooth">
                <img
                  className="camera_icon"
                  src={camera_icon}
                  alt="photobooth"
                />
              </Link>
            </div>
            <Link to="/signup" className="signup_button">
              Sign up
            </Link>
            <Link to="/login" className="login_button">
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
  const authToken = localStorage.getItem("myToken");

  const deleteToken = () => {
    localStorage.removeItem("myToken");
    localStorage.removeItem("myGifmeUserID");
    window.location.href = "/";
  };
  if (authToken) {
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
        <Link to="/login" className="bm-item">
          Log in
        </Link>
      </div>
    );
  }
};

export default Navbar;
