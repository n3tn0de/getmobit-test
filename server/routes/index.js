import { Router } from 'express'
import ensureLoggedIn from '../utils/ensure-logged-in'
import auth from './auth'
// import devices from './devices'

const router = Router()

router.use('/v1', auth)
// router.use('/v1/devices', ensureLoggedIn, devices)

export default router
