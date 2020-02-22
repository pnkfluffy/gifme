import React, { Fragment } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/public/Navbar';
import Home from './components/public/Home';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/private/account/Dashboard';
import PhotoBooth from './components/private/photobooth/Capture';
// import setAuthToken from './utils/setAuthToken';

import Test from './Test';

import './App.css';

const App = () =>
  <Router>
    <Navbar/>
    <Route exact path='/' component={ Home }/>
    <section className="container">
      <Switch>
        <Route exact path="/login" component={Login}/>
        <Route exact path="/register" component={Register}/>
        <Route exact path="/profile" component={Dashboard}/>
        <Route exact path="/test" component={Test}/>
        <Route exact path="/photobooth" component={PhotoBooth}/>
      </Switch>
    </section>
  </Router>

export default App;
