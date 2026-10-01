
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

export const getBookingsReport = async (req, res) => {

    const filters = {
        minDate: req.query.minDate,
        maxDate: req.query.maxDate,
        minTotalSpent: req.query.minTotalSpent,
    }

    try {
        const report = await bookingsService.getBookingsReport(filters)
        return res.status(200).json({
            status: 'success',
            payload: report
        })
    } catch (error) {
        return sendError(res, error, 'Error al obtener reporte de reservas')
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

export const updateBooking = async (req, res) => {
  const { bid } = req.params

  try {
    const updatedBooking = await bookingsService.updateBooking(bid, req.body)

    return res.status(200).json({
      status: 'success',
      payload: updatedBooking
    })
  } catch (error) {
    return sendError(res, error, 'Error al actualizar reserva')
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

export const deleteBooking = async (req, res) => {
  const { bid } = req.params

  try {
    const deletedBooking = await bookingsService.deleteBooking(bid)

    if (!deletedBooking) {
      return sendError(res, { statusCode: 404, message: 'Booking not found' })
    }

    return res.status(200).json({
      status: 'success',
      payload: deletedBooking
    })
  } catch (error) {
    return sendError(res, error, 'Error al eliminar reserva')
  }
}

export const addServiceToBooking = async (req, res) => {

      const { bid, sid } = req.params
      const { quantity } = req.body

      try {
          const updatedBooking = await bookingsService.addServiceToBooking(bid, sid, quantity)

          if (!updatedBooking) {
              return sendError(res, { statusCode: 404, message: 'Booking or Service not found' })
          }

          return res.status(201).json({
              status: 'success',
              payload: updatedBooking
          })

    } catch (error) {
        return sendError(res, error, 'Error al agregar servicio')
    }

}

export const removeServiceFromBooking = async (req, res) => {
  const { bid, sid } = req.params
  const { quantity } = req.body
    try {
        const serviceRemoved = await bookingsService.removeServiceFromBooking(bid, sid, quantity)

        if (!serviceRemoved) {
            return sendError(res, { statusCode: 404, message: 'Booking or Service not found' })
        }

        return res.status(200).json({
            status: 'success',
            payload: serviceRemoved
        })

  } catch (error) {
      return sendError(res, error, 'Error al quitar servicio')
  }
}
