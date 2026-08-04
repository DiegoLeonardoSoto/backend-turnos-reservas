import { bookingManager } from '../managers/BookingManager.js'

export const createBooking = async (req, res) => {
    try {

        const newBooking = await bookingManager.addBooking(req.body)

        if (!newBooking) {
            return res.status(400).json({
                status: 'error',
                message: 'Error al crear la reserva'
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

}

export const addService = async (req, res) => {

}
