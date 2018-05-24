import React from 'react'
import ReactDOM from 'react-dom'

import { AppContainer } from 'react-hot-loader'

import createHistory from 'history/createBrowserHistory'

import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import { Provider } from 'react-redux'
import {
  ConnectedRouter,
  routerReducer,
  routerMiddleware,
} from 'react-router-redux'

import * as reducers from './reducers'

import apiMiddleware from './middleware/api'

import { attach as attachFastClick } from 'fastclick'
import 'normalize.css'
import 'whatwg-fetch'

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

let store, DevTools = null

if (IS_DEVELOPMENT) {
  const ReduxDevtools = require('redux-devtools');
  const LogMonitor = require('redux-devtools-log-monitor').default;
  const DockMonitor = require('redux-devtools-dock-monitor').default;

  DevTools = ReduxDevtools.createDevTools(
    <DockMonitor
      toggleVisibilityKey="ctrl-h"
      changePositionKey="ctrl-q"
      defaultIsVisible={localStorage.getItem(`devtool`) === 'true' || false}
    >
      <LogMonitor theme="solarized" preserveScrollTop={false} />
    </DockMonitor>
  );

  store = createStore(
    reducer,
    {},
    compose(
      applyMiddleware(...middleware),
      DevTools.instrument(),
    ),
  );
} else {
  store = createStore(
    reducer,
    {},
    compose(applyMiddleware(...middleware))
  );
}

attachFastClick(document.body)

const render = Component => {
  ReactDOM.render(
    <AppContainer>
      <Provider store={store}>
        <div>
          <ConnectedRouter history={history}>
            <Component />
          </ConnectedRouter>
          {DevTools && <DevTools />}
        </div>
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

export {store}
