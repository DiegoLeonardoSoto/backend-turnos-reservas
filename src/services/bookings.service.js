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

    async addServiceToBooking(bid, sid) {

         let booking = await this.#repository.getById(bid)
        if (!booking) return null
        let service = booking.services.find(s => s.service.equals(sid))

        if (!service) {
            booking.services.push({
                service: sid,
                quantity: 1
            })
        } else {
            service.quantity += 1
        }

        return this.#repository.update(bid, {
            services: booking.services
        })
    }
}
