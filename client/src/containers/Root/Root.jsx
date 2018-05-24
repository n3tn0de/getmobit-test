import React, { Component } from 'react'

import { Route, Link } from 'react-router-dom'

import styles from './Root.css'

import Login from '../Login/Login'

class Root extends Component {
  render() {
    return(
      <div>
        <Route
          exact
          path="/"
          component={() => <nav><Link to="/hello">Hello</Link></nav>}
        />
        <Route
          exact
          path="/login"
          component={Login}
        />
        <Route
          path="/hello"
          component={() => <h1 className={styles.test}>Getmobit</h1>}
        />
      </div>
    )
  }
}

export default Root;
