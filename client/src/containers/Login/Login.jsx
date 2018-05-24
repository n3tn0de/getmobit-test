import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';

import * as actions from '../../actions/login';

import styles from './Login.css'

class Login extends Component {
  componentDidMount() {
    document.title = 'Login'
  }

  handleSubmit = event => {
    event.preventDefault();
    this.props.actions.login.submit(this.email.value, this.password.value)
  }

  render() {
    return(
      <div className={styles.main}>
        <div className={styles.wrapper}>
          <h1 className={styles.heading}>Login</h1>
          <form onSubmit={this.handleSubmit}>
            <input
              className={styles.input}
              type="text"
              name="email"
              placeholder="Email"
              ref={node => this.email = node}
            />
            <div className={styles.sameline}>
              <input
                className={styles.input}
                type="password"
                name="password"
                placeholder="Password"
                ref={node => this.password = node}
              />
              <input
                className={styles.button}
                type="submit"
                value="↵"
                disabled={this.email && this.email.value === 'test'}
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
