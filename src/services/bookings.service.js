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

        const serviceData = await this.#servicesService.getServiceById(service.sid)

        if ( !serviceData ) throw {statusCode: 404, message: 'Service not found'}

        const isReserved = await this.#servicesService.reserveService(service.sid, service.quantity)

        if (!isReserved) throw {statusCode: 409, message: 'Service not available'}

        return this.#repository.create({ clientName, clientEmail, date, time, status, services:[ {service: service.sid, quantity: service.quantity} ] })
    }

    async getBookingById(id) {
        const booking = await this.#repository.getById(id)
        if (!booking) return null
        return booking
    }

    async addServiceToBooking(bid, sid, quantity = 1) {

        const bookingData = await this.#repository.getById(bid)
        if (!bookingData) return null

        const serviceData = await this.#servicesService.getServiceById(sid)
        if (!serviceData) return null

        const isReserved = await this.#servicesService.reserveService(sid, quantity)
        if (!isReserved) throw {statusCode: 409, message: 'Service not available'}

        return this.#repository.addService(bid, { sid, quantity })
    }
}
