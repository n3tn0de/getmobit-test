import { Router } from 'express'
import User from '../models/User'
import paginate from '../utils/paginate'

const users = Router()

const sendErrorMessage = (res, message, error) => {
  res.status(400).send({
    success: false,
    message,
    ...error,
  })
}

const fields = 'email firstName lastName canEdit'

users.get('/', (req, res) => {
  const { page, limit, search } = req.query
  if (
    page && isNaN(Number(page)) ||
    limit && isNaN(Number(limit))
  ) {
    return sendErrorMessage(res, 'Page and limit must be a number')
  }
  if (search && typeof(search) !== 'string') {
    return sendErrorMessage(res, 'Search must be a string')
  }

  const queryString = new RegExp(search, 'i')
  const queryObject = {
    $or: [
      { email: queryString },
      { firstName: queryString },
      { lastName: queryString },
    ]
  }

  paginate(
    User, page, limit, {
      query: queryObject,
      fields,
    },
    (err, data, pg) => {
      if (err) {
        return res.status(500).send()
      }

      const filteredData = data;

      res.send({
        ...pg,
        users: filteredData,
      })
    }
  )
})

users.get('/current', (req, res) => {
  const { _id, email, firstName, lastName, canEdit } = req.user
  res.send({
    success: true,
    user: { _id, email, firstName, lastName, canEdit }
  })
})

users.get('/:id', (req, res) => {
  User
    .findById(req.params.id)
    .select(fields)
    .exec((err, data) => {
      if (!data) {
        return res.status(404).send()
      }
      res.send(data)
    })
})


export default users
