import {
  FETCH_CURRENT_USER_REQUEST,
} from '../action-types'

export function getCurrentUser() {
  return {
    type: FETCH_CURRENT_USER_REQUEST,
  }
}
