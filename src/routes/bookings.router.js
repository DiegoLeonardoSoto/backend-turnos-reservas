import { Router } from 'express'
import { addServiceToBooking, createBooking, getAllBookings, getBookingById, getBookingsReport } from '../controllers/bookings.controller.js'
import { validateBody, validateParams, validateQuery } from '../middlewares/validate.middleware.js'
import { addServiceParamSchema, bookingParamsSchema, createBookingSchema, reportQuerySchema } from '../schemas/booking.schema.js'



const router = Router()

router.get('/', getAllBookings)
router.get('/report', validateQuery(reportQuerySchema) , getBookingsReport)
router.post('/', validateBody(createBookingSchema) , createBooking)
router.get('/:bid', validateParams(bookingParamsSchema) , getBookingById)
router.post('/:bid/services/:sid', validateParams(addServiceParamSchema) , addServiceToBooking)

export default router
