import { Router } from 'express';
import { bookingsView, bookingDetailView, servicesView, serviceDetailView } from '../controllers/views.controller.js';
const router = Router();

router.get('/services', servicesView);
router.get('/services/:sid', serviceDetailView);
router.get('/bookings', bookingsView);
router.get('/bookings/:bid', bookingDetailView);

export default router;
