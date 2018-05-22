import http from 'http'
import WebSocket from 'ws'
import express from 'express'
import cors from 'cors'
import expressSanitized from 'express-sanitized'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import cookie from 'cookie'
import session from 'express-session'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import passport from './utils/passport-config'
import { populateUsers, populateDevices } from './utils/populate-db'
import routes from './routes'
import { eventEmitter as devicesApi } from './routes/devices'

dotenv.config()

const RedisStore = require('connect-redis')(session);

mongoose.connect(process.env.MONGO_URI)
const db = mongoose.connection

// eslint-disable-next-line no-console
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', async () => {
  if (await mongoose.model('Device').count() === 0) {
    if (await mongoose.model('User').count() === 0) {
      // eslint-disable-next-line no-console
      console.log('Populating Users')
      await populateUsers()
    }
    // eslint-disable-next-line no-console
    console.log('Populating Devices')
    await populateDevices()
  }

  const modelsNames = Object.keys(mongoose.models)

  modelsNames.map(async modelName => {
    const model = mongoose.model(modelName)
    const count = await model.count()
    // eslint-disable-next-line no-console
    console.log(`${model.collection.collectionName}: ${count}`)
  })
})

const app = express()
const store = new RedisStore({ url: process.env.REDIS_URI })

app.use(cors({
  origin: process.env.ALLOW_ORIGIN,
  credentials: true,
  optionsSuccessStatus: 200
    // some legacy browsers (IE11, various SmartTVs) choke on 204
}))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(expressSanitized())
app.use(session({
  store,
  secret: process.env.COOKIE_SECRET,
  maxAge: 30 * 24 * 60 * 1000
}))

app.use(passport.initialize())
app.use(passport.session())

app.get('/test/ws', (req, res) =>
  res.sendFile('./test-ws.html', { root: __dirname }))

app.get('/test/login', (req, res) =>
  res.sendFile('./test-auth.html', { root: __dirname }))

app.use('/', routes)

const server = http.createServer(app);
const wss = new WebSocket.Server({
  server,
  path: '/ws',
  verifyClient: (info, done) => {
    const cook = cookie.parse(info.req.headers.cookie)
    const id =
      cookieParser.signedCookie(cook['connect.sid'], process.env.COOKIE_SECRET)
    store.get(id, (err, sess) => {
      if (sess && sess.passport) {
        info.req.userId = sess.passport.user;
        return done(info.req.userId)
      }
    })
  },
})

const events = ['create', 'update', 'delete']
let areEventsBinded = false

const bindEvents = (wss) => {
  if (areEventsBinded) {
    return
  }
  areEventsBinded = true
  events.map(event => {
    devicesApi.on(event, (data) => {
      wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ event: `device-${event}`, data}))
        }
      })
    })
  })
}

wss.on('connection', (ws) => {
  ws.send(JSON.stringify({ message: 'Welcome' }))
  bindEvents(wss)
});

server.listen(3000)

export default server
