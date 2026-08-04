import { Router } from 'express'
import { addService, addBooking, getBooking } from '../controllers/booking.controller.js'


const router = Router()

router.post('/', addBooking)
router.get('/:bid', getBooking)
router.post('/:bid/services/:sid', addService)

export default router
