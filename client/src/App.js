import React, { Fragment } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
// import setAuthToken from './utils/setAuthToken';

import Test from './Test';

import './App.css';

// if (localStorage.token) {
//   setAuthToken(localStorage.token);
// }

const deleteToken = () => {
  localStorage.removeItem('myToken');
}

const Check = () => {
  const myToken = localStorage.getItem('myToken');
  console.log(myToken);
  return <input value={myToken} type="button" onClick={deleteToken}></input>
};


const App = () =>
  <Router>
    <Navbar/>
    <Route exact path='/' component={ Home }/>
    <section className="container">
      <Switch>
        <Route exact path="/login" component={Login}/>
        <Route exact path="/register" component={Register}/>
        <Route exact path="/test" component={Test}/>
      </Switch>
    </section>
    <Check/>
  </Router>

export default App;
