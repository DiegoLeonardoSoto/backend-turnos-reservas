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

    async update(id, data) {
        return bookingModel.findByIdAndUpdate(id, data, { returnDocument: 'after' })
    }

    async addService(id, service) {

        const result = await bookingModel.updateOne({
            _id: id, "services.service": service.sid
        },
        { $inc: { "services.$.quantity": service.quantity } }
        )

        if (result.matchedCount === 0) {
            await bookingModel.updateOne(
                { _id: id },
                { $push: { services: { service: service.sid, quantity: service.quantity } } }
            )
        }

        return bookingModel.findById(id).populate("services.service").lean()
    }

}
