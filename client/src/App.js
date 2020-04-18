import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Redirect } from "react-router-dom";
import Navbar from "./components/public/Navbar";
import Home from "./components/public/Home";
import PhotoBooth from "./components/private/photobooth/Capture";
import Signup from "./components/private/auth/Signup";
import Login from "./components/private/auth/Login";

import Confirmation from "./components/private/auth/Confirmation";
import RecoveryEmail from "./components/private/auth/RecoveryEmail";
import ResetPassword from "./components/private/auth/ResetPassword";
import SendEmail from "./components/private/auth/SendEmail";

import Settings from "./components/private/account/Settings";
import Profile from "./components/private/account/Profile";
import FullImage from "./components/public/FullImage";
import Favorites from "./components/private/account/Favorites";

import NotFoundPage from "./components/error/PageNotFound(404)"

import "./CSS/App.css";
import "./CSS/Home.css";
import "./CSS/Dashboard.css";
import "./CSS/Signup.css";

import GitHubIcon from "@material-ui/icons/GitHub";
import { withStyles } from "@material-ui/core/styles";
const StyledGithub = withStyles({
  root: {
    background: "linear-gradient(45deg, #FE6B8B 30%, rgb(148, 115, 175) 90%)",
    borderRadius: 3,
    border: 0,
    color: "white",
    padding: "0",
    boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
    height: "14px",
    marginRight: "5px",
    marginTop: "2px",
  },
  label: {
    textTransform: "capitalize",
  },
})(GitHubIcon);

const App = () => (
  <Router>
    <Navbar />
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/signup" component={Signup} />
      <Route exact path="/login" component={Login} />
      <Route exact path="/settings" component={Settings} />
      <Route exact path="/profile/:userID" component={Profile} />
      <Route exact path="/favorites/:userID" component={Favorites} />
      <Route exact path="/image/:imageID" component={FullImage} />
      <Route exact path="/confirm/:token" component={Confirmation} />
      <Route exact path="/send-email" component={SendEmail} />
      <Route exact path="/recovery-email" component={RecoveryEmail} />
      <Route exact path="/reset/:token" component={ResetPassword} />
      <Route exact path="/photobooth" component={PhotoBooth} />
      <Route exact path="*" component={NotFoundPage} />
    </Switch>
    <footer id="footer">
      <a href="https://github.com/pnkfluffy/gifme">
        <StyledGithub />
      </a>{" "}
      Created by <a className="footer_github_link"href="https://github.com/pnkfluffy">Jackson</a>and
      <a className="footer_github_link" href="https://github.com/jsandleraol">Jon</a>
    </footer>
  </Router>
);

export default App;
