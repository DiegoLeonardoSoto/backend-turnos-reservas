import { bookingModel } from "../../models/booking.model.js";

export class BookingsMongoDAO {

    async getAll() {
        return bookingModel.find()
    }

    async create(data) {
      return bookingModel.create(data)
    }

    async getById(id) {
      return bookingModel.findById(id)
    }

    async update(id,data) {
      return bookingModel.findByIdAndUpdate(id, data, { returnDocument: 'after' })
    }
}
