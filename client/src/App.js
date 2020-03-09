import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/public/Navbar';
import Home from './components/public/Home';
import Signup from './components/private/auth/Signup';
import Login from './components/private/auth/Login';
import Confirmation from './components/private/auth/Confirmation';
import RecoveryEmail from './components/private/auth/RecoveryEmail';
import ResetPassword from './components/private/auth/ResetPassword';
import Account from './components/private/account/Dashboard';
import PhotoBooth from './components/private/photobooth/Capture';


import './CSS/old_jackson.css';
import './CSS/App.css';
import './CSS/Home.css';
import './CSS/Dashboard.css';
import './CSS/Signup.css';

const App =() => (
  <Router>
        <Navbar/>
        <Route exact path='/' component={ Home } />
          <Switch>
            <Route exact path="/signup" component={Signup} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/profile" component={Account} />
            <Route exact path="/confirmation" component={Confirmation} />
            <Route exact path="/recovery-email" component={RecoveryEmail} />
            <Route exact path="/reset-password" component={ResetPassword} />
            <Route exact path="/photobooth" component={PhotoBooth}/>
          </Switch>
  </Router>
);

export default App;