import { bookingsService } from "../dependencies/booking.dependency.js";
import { servicesService } from "../dependencies/services.dependency.js"
import { sendError } from "../utils/sendError.js"

export const servicesView = async (req, res) => {
    try {
        const services = await servicesService.getServices(req.query)

        res.render('services', {
            services
        })

    } catch (error) {
      return sendError(res, error, 'Error al cargar la vista')
    }
};

export const serviceDetailView = async (req, res) => {
    try {
        const service = await servicesService.getServiceById(req.params.sid)
        if (!service) {
            return res.status(404).render('error', { message: 'Servicio no encontrado' })
        }
        res.render('service-detail', { service })
    } catch (error) {
        return sendError(res, error, 'Error al cargar la vista')
    }
}

export const bookingsView = async (req, res) => {
    try {
        const bookings = await bookingsService.getAllBookings()
        res.render('bookings', { bookings })
    } catch (error) {
        return sendError(res, error, 'Error al cargar la vista')
    }
}

export const bookingDetailView = async (req, res) => {
    try {
      const booking = await bookingsService.getBookingById(req.params.bid)
      if (!booking) {
          return res.status(404).render('error', { message: 'Reserva no encontrada' })
      }
      res.render('booking-detail', { booking })
    } catch (error) {
        return sendError(res, error, 'Error al cargar la vista')
    }
};
