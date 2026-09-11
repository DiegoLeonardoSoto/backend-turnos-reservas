import { Router } from 'express';
import { bookingsView, bookingDetailView, servicesView, serviceDetailView, } from '../controllers/views.controller.js';
import { validateQuery } from '../middlewares/validate.middleware.js';
import { reportQuerySchema } from '../schemas/booking.schema.js';
const router = Router();

router.get('/services', servicesView);
router.get('/services/:sid', serviceDetailView);
router.get('/bookings', validateQuery(reportQuerySchema), bookingsView);
router.get('/bookings/:bid', bookingDetailView);

export default router;
