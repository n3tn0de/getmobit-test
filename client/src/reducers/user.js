import {
  FETCH_CURRENT_USER_SUCCESS,
  FETCH_CURRENT_USER_ERROR,
  FETCH_LOGIN_SUCCESS,
  FETCH_LOGIN_ERROR,
} from '../action-types'

export default (state = {}, action) => {
  switch (action.type) {
    case FETCH_LOGIN_SUCCESS:
    case FETCH_CURRENT_USER_SUCCESS:
      return { ...state, ...action.user };

    case FETCH_LOGIN_ERROR:
    case FETCH_CURRENT_USER_ERROR:
      return { ...state, error: action.error };

    default:
      return state;
  }
};
