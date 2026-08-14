import ServicesMongoDAO from '../dao/mongoDB/services.mongo.dao.js'
import { ServicesRepository } from '../repositories/services.repository.js'
import { ServicesService } from '../services/services.service.js'

const servicesDao = new ServicesMongoDAO()
const servicesRepository = new ServicesRepository(servicesDao)
export const servicesService = new ServicesService(servicesRepository)
