import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader';
import Root from './containers/Root'
import { Router, Route, browserHistory } from 'react-router';
import { attach as attachFastClick } from 'fastclick'
import 'normalize.css'

attachFastClick(document.body)

const render = Component => {
  ReactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>,
    document.getElementById(`getmobit`)
  )
}

render(Root)

if (module.hot) {
  module.hot.accept('./containers/Root.jsx', () => {
    const NextRootContainer = require('./containers/Root').default;
    render(NextRootContainer);
  });
}
