import { Router } from 'express'
import { addServiceToBooking, createBooking, deleteBooking, getAllBookings, getBookingById, getBookingsReport, removeServiceFromBooking, updateBooking } from '../controllers/bookings.controller.js'
import { validateBody, validateParams, validateQuery } from '../middlewares/validate.middleware.js'
import { serviceParamSchema, bookingParamsSchema, createBookingSchema, reportQuerySchema,addServiceSchema, removeServiceSchema, updateBookingSchema } from '../schemas/booking.schema.js'


const router = Router()

router.get('/', getAllBookings)
router.get('/report', validateQuery(reportQuerySchema) , getBookingsReport)
router.post('/', validateBody(createBookingSchema), createBooking)
router.put('/:bid', validateParams(bookingParamsSchema), validateBody(updateBookingSchema), updateBooking)
router.delete('/:bid', validateParams(bookingParamsSchema), deleteBooking)
router.get('/:bid', validateParams(bookingParamsSchema) , getBookingById)
router.post('/:bid/services/:sid', validateParams(serviceParamSchema), validateBody(addServiceSchema), addServiceToBooking)
router.patch('/:bid/services/:sid', validateParams(serviceParamSchema), validateBody(removeServiceSchema), removeServiceFromBooking)

export default router
