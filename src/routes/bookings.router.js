import { Router } from 'express'
import { addServiceToBooking, createBooking, getAllBookings, getBookingById } from '../controllers/bookings.controller.js'
import { validateBody, validateParams } from '../middlewares/validate.middleware.js'
import { addServiceParamSchema, bookingParamsSchema, createBookingSchema } from '../schemas/booking.schema.js'



const router = Router()

router.get('/', getAllBookings)
router.post('/', validateBody(createBookingSchema) , createBooking)
router.get('/:bid', validateParams(bookingParamsSchema) , getBookingById)
router.post('/:bid/services/:sid', validateParams(addServiceParamSchema) , addServiceToBooking)

export default router
