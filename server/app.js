import express from 'express'
import mongoose from 'mongoose'

mongoose.connect('mongodb://db:27017/getmobit')
const db = mongoose.connection

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  // we're connected!
});

const app = express()

app.get('/', (req, res) => {
  res.send('Yo')
})

app.listen(3000)
