import {
  FETCH_LOGIN_REQUEST,
} from '../action-types'

export function submit(email, password) {
  return {
    type: FETCH_LOGIN_REQUEST,
    email, password,
  }
}
