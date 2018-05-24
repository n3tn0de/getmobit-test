import React from 'react'
import ReactDOM from 'react-dom'

import { AppContainer } from 'react-hot-loader';

import { Route, Link } from 'react-router-dom'
import createHistory from 'history/createBrowserHistory'

import { createStore, combineReducers, applyMiddleware } from 'redux'
import { Provider } from 'react-redux';
import {
  ConnectedRouter,
  routerReducer,
  routerMiddleware,
} from 'react-router-redux';

import * as reducers from './reducers';

import apiMiddleware from './middleware/api'

import { attach as attachFastClick } from 'fastclick'
import 'normalize.css'

import Root from './containers/Root/Root'

const reducer = combineReducers({
  ...reducers,
  router: routerReducer,
});

const history = createHistory()

const middleware = [
  apiMiddleware,
  routerMiddleware(history),
];

const store = createStore(
  reducer,
  applyMiddleware(...middleware)
);

attachFastClick(document.body)

const render = Component => {
  ReactDOM.render(
    <AppContainer>
    <Provider store={store}>
        <ConnectedRouter history={history}>
          <Component />
        </ConnectedRouter>
      </Provider>
    </AppContainer>,
    document.getElementById(`getmobit`)
  )
}

render(Root)

if (module.hot) {
  module.hot.accept('./containers/Root/Root', () => {
    const NextRootContainer = require('./containers/Root/Root').default;
    render(NextRootContainer);
  });
  module.hot.accept('./reducers/index', () => {
    const nextRootReducer = require('./reducers/index');
    const reducer = combineReducers({
      ...nextRootReducer,
      router: routerReducer,
    });
    store.replaceReducer(reducer);
  });
}
