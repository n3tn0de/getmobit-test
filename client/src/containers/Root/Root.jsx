import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { Route, Link, withRouter } from 'react-router-dom'
import InlineSVG from 'svg-inline-react';

import logo from '../../assets/logo.svg'

import * as actions from '../../actions/init';

import styles from './Root.scss'

import Login from '../Login/Login'

import DevicesList from '../DevicesList/DevicesList'

class Root extends Component {
  UNSAFE_componentWillMount() {
    this.props.actions.init.getCurrentUser()
  }

  render() {
    return(
      <div>
        { this.props.user._id &&
          <div>
            <InlineSVG className={styles.logo} src={logo} />
            <Route
              exact
              path="/"
              component={DevicesList}
            />
            <Route
              path="/:page"
              component={DevicesList}
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
