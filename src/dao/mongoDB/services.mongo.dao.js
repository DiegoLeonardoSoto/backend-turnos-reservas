import serviceModel from '../../models/service.model.js'

export default class ServicesMongoDAO {
    async getAll() {
        return serviceModel.find()
    }

    async getById(id) {
        return serviceModel.findById(id)
    }

    async create(data) {
        return serviceModel.create(data)
    }

    async update(id,data) {
        return serviceModel.findByIdAndUpdate(id, data, { new: true })
    }

    async delete(id) {
        return serviceModel.findByIdAndDelete(id)
    }
}
