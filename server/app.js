import express from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import passport from './utils/passport-config'
import { populateUsers } from './utils/populate-db'
import routes from './routes'

dotenv.config()

const RedisStore = require('connect-redis')(session);

mongoose.connect(process.env.MONGO_URI)
const db = mongoose.connection

// eslint-disable-next-line no-console
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => {
  const modelsNames = Object.keys(mongoose.models)

  modelsNames.map(modelName => {
    const model = mongoose.model(modelName)
    model.count((err, count) => {
      // eslint-disable-next-line no-console
      console.log(`${model.collection.collectionName}: ${count}`)
      if (modelName === 'User' && count === 0) {
        // eslint-disable-next-line no-console
        console.log('Populating Users')
        populateUsers()
      }
      if (modelName === 'Device' && count === 0) {
        // eslint-disable-next-line no-console
        console.log('Populating Devices')
        // populateDevices()
      }
    })
  })
})

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(session({
  store: new RedisStore({ url: process.env.REDIS_URI }),
  secret: process.env.COOKIE_SECRET,
  maxAge: 30 * 24 * 60 * 1000
}))

app.use(passport.initialize());
app.use(passport.session());

app.use('/', routes)
app.listen(3000)

export default app
