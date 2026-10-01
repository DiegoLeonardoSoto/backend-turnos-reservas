import { runInTransaction } from "../utils/transactions.js"

export class BookingsService {
    #repository
    #servicesService
    constructor(repository, servicesService) {
        this.#repository = repository
        this.#servicesService = servicesService
    }


    async getAllBookings() {
        return this.#repository.getAll()
    }

    async getBookingsReport(filters) {
        return this.#repository.getReport(filters)
    }

    async createBooking({ clientName, clientEmail, date, time, status, service }) {
        return runInTransaction(async (session) => {
            const serviceData = await this.#servicesService.getServiceById(service.sid)
            if (!serviceData) throw {statusCode: 404, message: 'Service not found'}

            const isReserved = await this.#servicesService.reserveService(service.sid, service.quantity, session)
            if (!isReserved) throw {statusCode: 409, message: 'Service not available'}

            try {
                return this.#repository.create({ clientName, clientEmail, date, time, status, services:[ {service: service.sid, quantity: service.quantity} ] }, session)
            } catch (error) {
                if (error?.code === 11000) throw {statusCode: 409, message: 'Booking already exists'}
                throw error
            }
        })
    }

    async updateBooking(id, data) {
        return this.#repository.update(id, data)
    }

    async deleteBooking(id) {
        return runInTransaction(async (session) => {
          const bookingData = await this.#repository.getById(id)
          if (!bookingData) return null

            for (const service of bookingData.services) {
             const released = await this.#servicesService.releaseService(service.service._id.toString(), service.quantity, session)
             if(!released) throw new Error('Failed to release service')
            }


          return this.#repository.delete(id, session)
      } )
    }

    async getBookingById(id) {
        const booking = await this.#repository.getById(id)
        if (!booking) return null
        return booking
    }

    async addServiceToBooking(bid, sid, quantity = 1) {
        return runInTransaction(async (session) => {
            const bookingData = await this.#repository.getById(bid)
            if (!bookingData) return null

            const serviceData = await this.#servicesService.getServiceById(sid)
            if (!serviceData) return null

            const isReserved = await this.#servicesService.reserveService(sid, quantity, session)
            if (!isReserved) throw {statusCode: 409, message: 'Service not available'}

            return this.#repository.addService(bid, { sid, quantity }, session)
        })
    }

    async removeServiceFromBooking(bid, sid, quantity) {
        return runInTransaction(async (session) => {
            const bookingData = await this.#repository.getById(bid)
            if (!bookingData) return null

            const serviceData = await this.#servicesService.getServiceById(sid)
            if (!serviceData) return null

            const service = bookingData.services.find(s => s.service._id.toString() === sid)
            if (!service) throw { statusCode: 404, message: 'Service not found' }

            const serviceQuantity = service.quantity

            if (quantity >= serviceQuantity) throw { statusCode: 409, message: 'Quantity to remove cannot be greater or equal than service quantity' }

            const toRelease = serviceQuantity - quantity

            const isReleased = await this.#servicesService.releaseService(sid, toRelease, session)
            if (!isReleased) throw { statusCode: 409, message: 'Service not released' }

            return this.#repository.removeService(bid, {sid, quantity}, session)
        })
    }
}
