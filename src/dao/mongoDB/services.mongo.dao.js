import { serviceModel } from '../../models/service.model.js'

export default class ServicesMongoDAO {
    async getAll(filters) {
        return serviceModel.paginate({
            ...(filters.category && {category: filters.category}),
            ...(filters.maxPrice && {price: {$lte: Number(filters.maxPrice)}}),
            ...(filters.available !== undefined && {available: filters.available})
        },{limit:filters.limit, page:filters.page, lean:true})
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

    async reserveService(id, quantity) {
      return serviceModel.findOneAndUpdate(
          {
              _id: id,
              available: true,
              $expr: {
                  $lte:[ {$add:["$reserved", quantity]}, "$capacity" ]
              }
          },
          { $inc: { reserved: quantity } },
          { returnDocument: 'after'}
      )
    }


}
