import { bookingsService } from "../dependencies/booking.dependency.js";
import { servicesService } from "../dependencies/services.dependency.js"
import { sendError } from "../utils/sendError.js"

export const servicesView = async (req, res) => {
    try {
        const {docs} = await servicesService.getServices(req.query)

        res.render('services', {
            services: docs
        })

    } catch (error) {
      return sendError(res, error, 'Error al cargar la vista')
    }
};

export const serviceDetailView = async (req, res) => {
    try {
        const service = await servicesService.getServiceById(req.params.sid)
        if (!service) {
            return sendError(res, { statusCode: 404, message: 'Servicio no encontrado' })
        }
        res.render('service-detail', { service })
    } catch (error) {
        return sendError(res, error, 'Error al cargar la vista')
    }
}

export const bookingsView = async (req, res) => {

  const filters = {
      minDate: req.query.minDate,
      maxDate: req.query.maxDate,
      minTotalSpent: req.query.minTotalSpent,
  }

    try {
        const bookings = await bookingsService.getBookingsReport(filters)
        res.render('bookings', { bookings })
    } catch (error) {
        return sendError(res, error, 'Error al cargar la vista')
    }
}

export const bookingDetailView = async (req, res) => {
    try {
      const booking = await bookingsService.getBookingById(req.params.bid)
      if (!booking) {
          return sendError(res, { statusCode: 404, message: 'Reserva no encontrada' })
      }
      res.render('booking-detail', { booking })
    } catch (error) {
        return sendError(res, error, 'Error al cargar la vista')
    }
};
