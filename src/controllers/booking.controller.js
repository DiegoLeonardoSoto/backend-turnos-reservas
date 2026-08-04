import { bookingManager } from '../managers/BookingManager.js'
import { serviceManager } from '../managers/ServiceManager.js'

export const addBooking = async (req, res) => {
    try {
        const newBooking = await bookingManager.createBooking(req.body)
        if (!newBooking) {
            return res.status(400).json({
                status: 'error',
                message: 'Missing required fields: clientName, clientEmail, date, time, status'
            })
        }

        res.status(201).json({
            status: 'success',
            payload: newBooking
        })

    } catch (error) {

        res.status(500).json({
            status: 'error',
            message: 'Error al agregar reserva'
        })

    }

}

export const getBooking = async (req, res) => {
  const { bid } = req.params

    try {
        const booking = await bookingManager.getBookingById(bid)

        if (!booking) {
            return res.status(404).json({
                status: 'error',
                message: 'Booking not found'
            })
        }

        res.status(200).json({
            status: 'success',
            payload: booking
        })
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error al obtener reserva'
        })
  }



}

export const addService = async (req, res) => {

    const { bid, sid } = req.params

    try {

        const booking = await bookingManager.getBookingById(bid)

        if (!booking) {
            return res.status(404).json({
                status: 'error',
                message: 'Booking doesn\'t exist'
            })
        }

        const service = await serviceManager.getServiceById(sid)

        if (!service) {
            return res.status(404).json({
                status: 'error',
                message: 'Service doesn\'t exist'
            })
        }

        const updatedBooking = await bookingManager.addServiceToBooking(bid, sid)

        res.status(201).json({
            status: 'success',
            payload: updatedBooking
        })

    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error al agregar servicio'
        })
    }

}
