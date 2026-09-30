import { bookingModel } from "../../models/booking.model.js";

export class BookingsMongoDAO {

    async getAll() {
        return bookingModel.find().lean()
    }

    async getReport(filters) {

        const pipeline = []

        const dateMatch = {}
        if (filters.minDate) dateMatch.$gte = filters.minDate
        if (filters.maxDate) dateMatch.$lte = filters.maxDate
        if (Object.keys(dateMatch).length) pipeline.push({ $match: { date: dateMatch } })

        pipeline.push({ $unwind: "$services" })
        pipeline.push({
            $lookup: {
            from: "services",
            localField: "services.service",
            foreignField: "_id",
            as: "serviceData"
            }
        })
        pipeline.push({ $unwind: "$serviceData" })
        pipeline.push({
            $project: {
                _id: 1,
                clientName: 1,
                date: 1,
                time: 1,
                serviceName: "$serviceData.name",
                quantity: "$services.quantity",
                duration: "$serviceData.duration",
                unitPrice: "$serviceData.price",
                totalPrice: { $multiply: ["$serviceData.price", "$services.quantity"] }
            }
        })
        pipeline.push({
            $group: {
                _id: "$_id",
                clientName: { $first: "$clientName" },
                date: { $first: "$date" },
                time: { $first: "$time" },
                totalSpent: { $sum: "$totalPrice" },
                services: {
                    $push: {
                        name: "$serviceName",
                        quantity: "$quantity",
                        duration: "$duration",
                        unitPrice: "$unitPrice",
                        totalPrice: "$totalPrice"
                    }
                }
            }
        })

        if (filters.minTotalSpent !== undefined) {
            pipeline.push({ $match: { totalSpent: { $gte: filters.minTotalSpent} } })
        }

        pipeline.push({$sort: { date: 1 }})

        return bookingModel.aggregate(pipeline)
    }

    async create(data) {
        return bookingModel.create(data)
    }

    async delete(id, session) {
        return bookingModel.findByIdAndDelete(id, { session })
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

    async removeService(id, service) {

        if (service.quantity=== 0) {
          return bookingModel.findOneAndUpdate(
              {
                  _id: id,
                  "services.service": service.sid
              },
              { $pull: { services: { service: service.sid } } },
              { returnDocument: 'after' }
          )
        }

        return bookingModel.findOneAndUpdate(
            {
                _id: id
            },
            { $set: {"services.$[item].quantity": service.quantity}
            },
            {
                arrayFilters: [
                    {
                        "item.service": service.sid
                    }
                ],
                returnDocument: "after"
                }
          )
      }

}
