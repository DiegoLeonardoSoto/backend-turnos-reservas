import { serviceModel } from '../../models/service.model.js'

export default class ServicesMongoDAO {
    async getAll() {
        return serviceModel.find().lean()
    }

    async getById(id) {
        return serviceModel.findById(id).lean()
    }

    async create(data) {
        return serviceModel.create(data)
    }

    async update(id,data) {
        return serviceModel.findByIdAndUpdate(id, data, { returnDocument: 'after' })
    }

    async delete(id) {
        return serviceModel.findByIdAndDelete(id)
    }

    async toggleAvailability(id) {
      return serviceModel.findByIdAndUpdate(
        id,
        [{ $set: { available: { $not: ['$available'] } } }],
        { returnDocument: 'after', updatePipeline:true }
      )
    }


}
