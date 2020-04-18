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
  </Router>
);

export default App;
