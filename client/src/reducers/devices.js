import {
  FETCH_DEVICES_SUCCESS,
  FETCH_DEVICES_ERROR,
} from '../action-types'

export default (state = {}, action) => {
  switch (action.type) {
    case FETCH_DEVICES_SUCCESS:
      return {
          ...state,
          ...action.data,
          error: null
      };

    case FETCH_DEVICES_ERROR:
      return { ...state, error: action.error };

    default:
      return state;
  }
};
