import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { ServicesFsDao } from '../dao/fileSystem/services.fs.dao.js'
import { ServicesRepository } from '../repositories/services.repository.js'
import { ServicesService } from '../services/services.service.js'

const currentDirectory = path.dirname(fileURLToPath(import.meta.url))
const servicesPath = path.join(currentDirectory, '..', 'data', 'services.json')

const servicesDao = new ServicesFsDao(servicesPath)
const servicesRepository = new ServicesRepository(servicesDao)
export const servicesService = new ServicesService(servicesRepository)
