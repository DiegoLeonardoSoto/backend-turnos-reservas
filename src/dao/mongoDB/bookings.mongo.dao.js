import { bookingModel } from "../../models/booking.model.js";

export class BookingsMongoDAO {

    async getAll() {
        return bookingModel.find().lean()
    }

    async create(data) {
      return bookingModel.create(data)
    }

    async getById(id) {
      return bookingModel.findById(id).populate("services.service").lean()
    }

    async update(id,data) {
      return bookingModel.findByIdAndUpdate(id, data, { returnDocument: 'after' })
    }
}
