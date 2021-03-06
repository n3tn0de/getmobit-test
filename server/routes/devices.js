import { Router } from 'express'
import events from 'events'
import Device from '../models/Device'
import paginate from '../utils/paginate'
import ensureCanEdit from '../utils/ensure-can-edit'

const devices = Router()

const eventEmitter = new events.EventEmitter();

const sendErrorMessage = (res, message, error) => {
  res.status(400).send({
    success: false,
    message,
    ...error,
  })
}

devices.get('/', (req, res) => {
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
      { name: queryString },
      { group: queryString },
      { ipv4: queryString },
      { ipv6: queryString },
      { mac: queryString }
    ]
  }

  paginate(
    Device, page, limit, {
      query: queryObject,
      fields: 'ipv4 ipv6 mac name group users',
      populate: 'users',
      populateFields: 'email firstName lastName',
    },
    (err, data, pg) => {
      if (err === 404) {
        return res.status(err).send()
      }

      if (err) {
        return res.status(500).send()
      }

      const filteredData = data;

      res.send({
        ...pg,
        devices: filteredData,
      })
    }
  )
})

devices.get('/:id', (req, res) => {
  Device
    .findById(req.params.id)
    .populate('users', 'email firstName lastName')
    .exec((err, data) => {
      if (!data) {
        return res.status(404).send()
      }
      res.send(data)
    })
})

const create = (req, res) => {
  Device.create(req.body, (err, data) => {
    if (err) {
      return sendErrorMessage(res, null, err)
    }
    eventEmitter.emit('create', data)
    res.status(201).send({ success: true, data })
  })
}

devices.post('/', ensureCanEdit, create)

const modify = (req, res) => {
  if (Object.keys(req.body).length === 0) {
    res.status(204).send()
  }
  Device.update({ _id: req.params.id }, { $set: req.body}, (err, data) => {
    if (err && err.kind === "ObjectId") {
      return res.status(404).send()
    }
    if (err) {
      return sendErrorMessage(res, null, err)
    }
    eventEmitter.emit('update', data)
    res.status(200).send({ success: true, data })
  })
}

devices.patch('/:id', ensureCanEdit, modify)

devices.put('/:id', ensureCanEdit, (req, res) => {
  Device
    .findById(req.params.id)
    .exec((err, data) => {
      if (!data) {
        return create(req, res)
      }
      modify(req, res)
    })
})

devices.delete('/:id', ensureCanEdit, (req, res) => {
  Device.deleteOne({ _id: req.params.id }, (err, data) => {
    if (err && err.kind === "ObjectId") {
      return res.status(404).send()
    }
    if (err) {
      return sendErrorMessage(res, null, err)
    }
    eventEmitter.emit('delete', data)
    res.status(200).send({ success: true, data })
  })
})

export { eventEmitter }
export default devices
