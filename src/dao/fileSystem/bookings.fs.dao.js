import fs from 'node:fs/promises'
import { generateId } from '../../utils/generateId.js'

export class BookingsFsDao {
  #filePath
  constructor(filePath) {
    this.#filePath = filePath
  }

    async #readAll() {
        try {
            const data = await fs.readFile(this.#filePath, 'utf-8')
            return JSON.parse(data)
        } catch (error) {
            if (error.code === "ENOENT") {
                await this.#writeAll([])
                return []
            }
        }
    }

    async #writeAll(bookings) {
      await fs.writeFile(this.#filePath, JSON.stringify(bookings, null, 2))
    }


    async create(data) {
       const bookings = await this.#readAll()

        const newBooking = {
            ...data,
            id: generateId(bookings)
        }

        await this.#writeAll([...bookings, newBooking])

        return newBooking
    }

    async getById(id) {
        const bookings = await this.#readAll()
        const index = bookings.findIndex(booking => booking.id === Number(id) )
        if (index === -1) return null
        return bookings[index]
    }

    async update(booking) {
        const bookings = await this.#readAll()
        const index = bookings.findIndex(b => b.id === Number(booking.id) )
        if (index === -1) return null

        bookings[index] = booking
        await this.#writeAll(bookings)
        return booking
    }

}
