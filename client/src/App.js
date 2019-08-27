import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';

import PrivateRoute from './components/common/PrivateRoute';

import jwt_decode from 'jwt-decode';
import setAuthToken from './utils/setAuthToken'
import { setCurrentUser, logoutUser } from './actions/authActions';

import { clearSample } from './actions/sampleActions'
import { clearWriteoff } from './actions/writeoffActions'

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Landing from './components/layout/Landing';

// Auth
import Register from './components/auth/Register';
import Login from './components/auth/Login';

// Sample
import SampleTable from './components/dashboard/samples';
import SampleForm from './components/dashboard/sample-form';
import SampleEdit from './components/dashboard/sample-edit';

// Writeoff
import WriteoffTable from './components/dashboard/writeoff/writeoffs';
import WriteoffForm from './components/dashboard/writeoff/writeoff-form';
import WriteoffEdit from './components/dashboard/writeoff/writeoff-edit';

import './App.css';

// Check for token
if (localStorage.jwtToken) {
  // set auth token header auth
  setAuthToken(localStorage.jwtToken);
  // Decode token and get user info and exp
  const decoded = jwt_decode(localStorage.jwtToken);
  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));

  // Check for expired token
  const currentTime = Date.now() / 1000;
  if (decoded.exp < currentTime) {
    // Logout user
    store.dispatch(logoutUser());
    // Clear current sample
    store.dispatch(clearSample());
    // Clear current wrtieoff
    store.dispatch(clearWriteoff());
    // Redirect to login
    window.location.href = '/login';
  }
}

class App extends Component {
  render() {
    return (
      <Provider store={store} >
        <Router >
          <div>
            <Navbar />
            <Route exact path="/" component={Landing} /> <div className="container" >
              <Route exact path="/register" component={Register} />
              <Route exact path="/login" component={Login} />
              <Switch>
                <PrivateRoute exact path="/samples" component={SampleTable} />
                <PrivateRoute exact path="/samples/add" component={SampleForm} />
                <PrivateRoute exact path="/samples/edit/:sample_id" component={SampleEdit} />

                <PrivateRoute exact path="/writeoffs" component={WriteoffTable} />
                <PrivateRoute exact path="/writeoffs/add" component={WriteoffForm} />
                <PrivateRoute exact path="/writeoffs/edit/:writeoff_id" component={WriteoffEdit} />
              </Switch>
            </div>  <Footer />  </div>
        </Router>
      </Provider>
    );
  }
}

export default App;