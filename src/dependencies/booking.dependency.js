import { BookingsRepository } from '../repositories/bookings.repository.js'
import { BookingsService } from '../services/bookings.service.js'
import { BookingsMongoDAO } from '../dao/mongoDB/bookings.mongo.dao.js'
import { servicesService } from "./services.dependency.js"

const bookingsDao = new BookingsMongoDAO()
const bookingsRepository = new BookingsRepository(bookingsDao)
export const bookingsService = new BookingsService(bookingsRepository, servicesService)
