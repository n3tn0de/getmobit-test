import React, { Component } from 'react'

import { Route, Link } from 'react-router-dom';
import createHistory from 'history/createBrowserHistory'

import { createStore, combineReducers, applyMiddleware } from 'redux'
import { Provider } from 'react-redux';
import {
  ConnectedRouter,
  routerReducer,
  routerMiddleware,
} from 'react-router-redux';

// import * as reducers from '../reducers';

import styles from './Root.css'

const reducer = combineReducers({
  // ...reducers,
  router: routerReducer,
});

const history = createHistory()

const middleware = [
  routerMiddleware(history),
];

const store = createStore(
  reducer,
  applyMiddleware(...middleware)
);

class Root extends Component {
  render() {
    return(
      <Provider store={store}>
        <ConnectedRouter history={history}>
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
        </ConnectedRouter>
      </Provider>
    )
  }
}

export default Root;
