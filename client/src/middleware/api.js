import { push } from 'react-router-redux'

import {
  FETCH_CURRENT_USER_REQUEST,
  FETCH_CURRENT_USER_SUCCESS,
  FETCH_CURRENT_USER_ERROR,
  FETCH_LOGIN_REQUEST,
  FETCH_LOGIN_SUCCESS,
  FETCH_LOGIN_ERROR,
} from '../action-types'

const parseJSON = response => response.json();

const checkStatus = response => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const error = new Error(response.status);
  error.response = response;
  throw error;
};

const api = `${API}/v1`

export default store => next => action => {
  switch (action.type) {
    case FETCH_CURRENT_USER_REQUEST: {
      fetch(`${api}/users/current`, { credentials: 'include' })
        .then(checkStatus)
        .then(parseJSON)
        .then((data) => {
          store.dispatch({
            type: FETCH_CURRENT_USER_SUCCESS,
            user: data.user,
          });
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.log(error)
          store.dispatch({
            type: FETCH_CURRENT_USER_ERROR,
            error,
          })
          if (error.message === '401') {
            store.dispatch(push('/login'))
          }
        });
      break
    }
    case FETCH_LOGIN_REQUEST: {
      fetch(`${api}/login`, {
        credentials: 'include',
        method: 'post',
        headers: {
          Accept: `application/json`,
          'Content-Type': `application/json`,
        },
        body: JSON.stringify(action),
      })
        .then(checkStatus)
        .then(parseJSON)
        .then((data) => {
          store.dispatch({
            type: FETCH_LOGIN_SUCCESS,
            user: data.user,
          });
          store.dispatch(push('/'))
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.log(error)
          if (error.message === '401') {
            error.badLogin = true
          }
          store.dispatch({
            type: FETCH_LOGIN_ERROR,
            error,
          });
        });
      break
    }
  }
  return next(action)
}
