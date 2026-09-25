import { Router } from 'express'
import { addServiceToBooking, createBooking, getAllBookings, getBookingById, getBookingsReport, removeServiceFromBooking } from '../controllers/bookings.controller.js'
import { validateBody, validateParams, validateQuery } from '../middlewares/validate.middleware.js'
import { serviceParamSchema, bookingParamsSchema, createBookingSchema, reportQuerySchema,addServiceSchema, removeServiceSchema } from '../schemas/booking.schema.js'




const router = Router()

router.get('/', getAllBookings)
router.get('/report', validateQuery(reportQuerySchema) , getBookingsReport)
router.post('/', validateBody(createBookingSchema) , createBooking)
router.get('/:bid', validateParams(bookingParamsSchema) , getBookingById)
router.post('/:bid/services/:sid', validateParams(serviceParamSchema), validateBody(addServiceSchema), addServiceToBooking)
router.patch('/:bid/services/:sid', validateParams(serviceParamSchema), validateBody(removeServiceSchema), removeServiceFromBooking)

export default router
