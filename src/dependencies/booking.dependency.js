import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { BookingsFsDao } from '../dao/fileSystem/bookings.fs.dao.js'
import { BookingsRepository } from '../repositories/bookings.repository.js'
import { BookingsService } from '../services/bookings.service.js'

const currentDirectory = path.dirname(fileURLToPath(import.meta.url))
const bookingsPath = path.join(currentDirectory, '..', 'data', 'bookings.json')

const bookingsDao = new BookingsFsDao(bookingsPath)
const bookingsRepository = new BookingsRepository(bookingsDao)
export const bookingsService = new BookingsService(bookingsRepository)
