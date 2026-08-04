import fs from 'node:fs/promises'
import { generateId } from '../utils/generateId.js'

export class BookingManager {
    #filePath
  constructor(filePath) {
    this.#filePath = filePath
  }

  async #readBookings() {
    try {
      const data = await fs.readFile(this.#filePath, 'utf-8')
      return JSON.parse(data)
    } catch {
      return []
    }
  }

  async #writeBookings(bookings) {
    await fs.writeFile(this.#filePath, JSON.stringify(bookings, null, 2))
  }


  async createBooking(bookingData) {
  const { clientName, clientEmail, date, time, status, services } = bookingData

  if (!services) services = []

  if (!clientName || !clientEmail || !date || !time || !status) {
          return null
      }

      const bookings = await this.#readBookings()

      const newBookings = {
          id: generateId(bookings),
          clientName,
          clientEmail,
          date,
          time,
          status,
          services
      }

      await this.#writeBookings([...bookings, newBookings])
      return newBookings
  }

  async getBookingById(id) {
      const bookings = await this.#readBookings()
      const booking = bookings.find(b => b.id === Number(id))
      return booking ?? null
  }

  async addServiceToBooking( bookingId ,serviceId) {
      const bookings = await this.#readBookings()
      let booking = bookings.find(b => b.id === Number(bookingId))
      let service = booking.services.find(s => s.service === Number(serviceId))

      if (!service) {
          const newService = { service: Number(serviceId), quantity: 1 }
          booking.services.push(newService)
      } else {
        service.quantity += 1
      }

      await this.#writeBookings(bookings)
      return booking
  }



}
