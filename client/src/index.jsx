import React from 'react'
import ReactDOM from 'react-dom'

import { AppContainer } from 'react-hot-loader';

import { attach as attachFastClick } from 'fastclick'
import 'normalize.css'

import Root from './containers/Root/Root'

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
  module.hot.accept('./containers/Root/Root.jsx', () => {
    const NextRootContainer = require('./containers/Root/Root').default;
    render(NextRootContainer);
  });
}
