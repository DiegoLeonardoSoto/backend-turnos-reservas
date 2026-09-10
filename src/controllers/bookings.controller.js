
import { bookingsService } from "../dependencies/booking.dependency.js"
import { sendError } from '../utils/sendError.js'

export const getAllBookings = async (_, res) => {
    try {
        const bookings = await bookingsService.getAllBookings()
        return res.status(200).json({
            status: 'success',
            payload: bookings
        })
    } catch (error) {
        return sendError(res, error, 'Error al obtener reservas')
    }
}

export const createBooking = async (req, res) => {

  try {
        const newBooking = await bookingsService.createBooking(req.body)

        return res.status(201).json({
            status: 'success',
            payload: newBooking
        })

    } catch (error) {
       return sendError(res, error, 'Error al agregar reserva')
  }

}

export const getBookingById = async (req, res) => {
  const { bid } = req.params

    try {
        const booking = await bookingsService.getBookingById(bid)

          if (!booking) {
              return sendError(res, { statusCode: 404, message: 'Booking not found' })
          }

          return res.status(200).json({
              status: 'success',
              payload: booking
          })
      } catch (error) {
          return sendError(res, error, 'Error al obtener reserva')
    }
  }

  export const addServiceToBooking = async (req, res) => {

      const { bid, sid } = req.params
      const { quantity } = req.body

      try {
        const updatedBooking = await bookingsService.addServiceToBooking(bid, sid, quantity)
          return res.status(201).json({
              status: 'success',
              payload: updatedBooking
          })

    } catch (error) {
        return sendError(res, error, 'Error al agregar servicio')
    }

}
