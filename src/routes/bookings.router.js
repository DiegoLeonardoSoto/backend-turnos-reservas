import { Router } from 'express'
import { addService, createBooking, getBooking } from '../controllers/booking.controller.js'


const router = Router()

router.post('/', createBooking)
router.get('/:bid', getBooking)
router.put('/:bid/services/:sid', addService)

export default router
