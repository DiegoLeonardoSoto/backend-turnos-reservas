export class BookingsService {
    #repository
    constructor(repository) {
        this.#repository = repository
    }


    async getAllBookings() {
        return this.#repository.getAll()
    }

    async createBooking(bookingData) {
        const { clientName, clientEmail, date, time, status, services } = bookingData

        if (!clientName || !clientEmail || !date || !time || !status) {
          return null
        }

        return this.#repository.create({...bookingData, services: services || []})
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
