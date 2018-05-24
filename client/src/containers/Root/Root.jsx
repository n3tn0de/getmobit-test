import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { Route, Link, withRouter } from 'react-router-dom'

import * as actions from '../../actions/init';

import styles from './Root.css'

import Login from '../Login/Login'

class Root extends Component {
  UNSAFE_componentWillMount() {
    this.props.actions.init.getCurrentUser()
  }
  render() {
    return(
      <div>
        { this.props.user._id &&
          <div>
            <Route
              exact
              path="/"
              component={() => <nav><Link to="/hello">Hello</Link></nav>}
            />
            <Route
              path="/hello"
              component={() => <h1 className={styles.test}>Getmobit</h1>}
            />
          </div>
        }
        <Route
          exact
          path="/login"
          component={Login}
        />
      </div>
    )
  }
}

const mapStateToProps = state => ({
  user: state.user,
});

const mapDispatchToProps = dispatch => ({
  actions: {
    init: bindActionCreators(actions, dispatch),
  },
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Root))
