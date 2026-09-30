import ServicesMongoDAO from '../dao/mongoDB/services.mongo.dao.js'
import { ServicesRepository } from '../repositories/services.repository.js'
import { ServicesService } from '../services/services.service.js'

// services.dependency.js
import { BookingsRepository } from '../repositories/bookings.repository.js'
import { BookingsMongoDAO } from '../dao/mongoDB/bookings.mongo.dao.js'

const bookingsRepository = new BookingsRepository(new BookingsMongoDAO())

const servicesDao = new ServicesMongoDAO()
const servicesRepository = new ServicesRepository(servicesDao)
export const servicesService = new ServicesService(servicesRepository, bookingsRepository)
