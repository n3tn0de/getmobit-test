import {
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

export default store => next => (action) => {
  switch (action.type) {
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
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.log(error)
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
