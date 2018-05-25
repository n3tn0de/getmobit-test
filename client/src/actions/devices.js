import {
  FETCH_DEVICES_REQUEST,
} from '../action-types'

export function paginate(page, limit, search) {
  return {
    type: FETCH_DEVICES_REQUEST,
    page, limit, search,
  }
}
