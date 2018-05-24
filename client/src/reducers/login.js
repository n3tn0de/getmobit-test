import {
  FETCH_LOGIN_SUCCESS,
  FETCH_LOGIN_ERROR,
} from '../action-types'

export default (state = {}, action) => {
  switch (action.type) {
    case FETCH_LOGIN_SUCCESS:
      return { ...state, user: action.user };

    case FETCH_LOGIN_ERROR:
      return { ...state, error: action.error };

    default:
      return state;
  }
};
