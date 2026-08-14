import { Router } from 'express'
import { addServiceToBooking, createBooking, getAllBookings, getBookingById } from '../controllers/bookings.controller.js'


const router = Router()

router.get('/', getAllBookings)
router.post('/', createBooking)
router.get('/:bid', getBookingById)
router.post('/:bid/services/:sid', addServiceToBooking)

export default router
