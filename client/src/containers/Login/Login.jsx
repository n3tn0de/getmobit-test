import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { push } from 'react-router-redux'

import { store } from '../../index'

import * as actions from '../../actions/login';

import styles from './Login.scss'

class Login extends Component {
  constructor(props) {
    super(props)

    this.state ={
      email: '',
      password: '',
    }
  }

  UNSAFE_componentWillMount() {
    this.redirectLoggedUser()
  }

  componentDidMount() {
    document.title = 'Login'
  }

  componentDidUpdate() {
    this.redirectLoggedUser()
  }

  updateEmail = (event) => {
    this.setState({
      ...this.state,
      email: event.target.value,
    })
  }

  updatePassword = (event) => {
    this.setState({
      ...this.state,
      password: event.target.value,
    })
  }

  redirectLoggedUser = () => {
    if (this.props.user._id) {
      return store.dispatch(push('/'))
    }
  }

  handleSubmit = event => {
    event.preventDefault();
    if (this.state.email || this.state.password) {
      this.props.actions.login.submit(this.state.email, this.state.password)
    }
  }

  render() {
    return(
      <div className={styles.main}>
        <div className={styles.wrapper}>
          <h1 className={styles.heading}>Login</h1>
          <form onSubmit={this.handleSubmit}>
            <input
              className={
                this.props.user.error &&
                this.props.user.error.badLogin ?
                  styles.invalidInput : styles.input
              }
              type="text"
              name="email"
              placeholder="Email"
              autoFocus
              value={this.state.email}
              onChange={this.updateEmail}
            />
            <div className={styles.sameline}>
              <input
                className={
                  this.props.user.error &&
                  this.props.user.error.badLogin ?
                    styles.invalidInput : styles.input
                }
                type="password"
                name="password"
                placeholder="Password"
                value={this.state.password}
                onChange={this.updatePassword}
              />
              <input
                className={styles.button}
                type="submit"
                value="↵"
                disabled={!this.state.email || !this.state.password}
              />
            </div>
          </form>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  user: state.user,
});

const mapDispatchToProps = dispatch => ({
  actions: {
    login: bindActionCreators(actions, dispatch),
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
