import { Router } from 'express'
import passport from '../utils/passport-config'

const auth = Router()

auth.post('/login',
  passport.authenticate('local', {
  }),
  (req, res) => res.send({ success: true })
)

auth.post('/logout',
  (req, res) => {
    req.session.destroy()
    res.send({ success: true })
  }
)

export default auth
