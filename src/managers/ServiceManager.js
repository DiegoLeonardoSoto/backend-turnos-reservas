import fs from 'node:fs/promises'
import { generateId } from '../utils/generateId.js'

export class ServiceManager {
  constructor(path) {
    this._path = path
  }

  get path() {
    return this._path
  }

  async _readServices() {
    try {
      const data = await fs.readFile(this._path, 'utf-8')
      return JSON.parse(data)
    } catch {
      return []
    }
  }

  async _writeServices(services) {
    await fs.writeFile(this._path, JSON.stringify(services, null, 2))
  }

  async getServices() {
    return await this._readServices()
  }

  async getServiceById(id) {
    const services = await this._readServices()
    const service = services.find(s => s.id === Number(id))
    return service ?? null
  }

  async addService(serviceData) {
    const { name, description, duration, price, category, available } = serviceData

    if (!name || !description || !duration || !price || !category || available === undefined) {
      return null
    }

    const services = await this._readServices()
    const newService = {
      id: generateId(services),
      name,
      description,
      duration,
      price,
      category,
      available
    }

    services.push(newService)
    await this._writeServices(services)

    return newService
  }

  async updateService(id, serviceData) {
    const services = await this._readServices()
    const index = services.findIndex(s => s.id === Number(id))

    if (index === -1) return null

    const { name, description, duration, price, category, available } = serviceData

    if (!name || !description || !duration || !price || !category || available === undefined) {
      return null
    }

    const updatedService = {
      ...services[index],
      name,
      description,
      duration,
      price,
      category,
      available,
      id: services[index].id
    }

    services[index] = updatedService
    await this._writeServices(services)

    return updatedService
  }

  async deleteService(id) {
    const services = await this._readServices()
    const index = services.findIndex(s => s.id === Number(id))

    if (index === -1) return null

    const [deleted] = services.splice(index, 1)
    await this._writeServices(services)

    return deleted
  }
}

export const serviceManager = new ServiceManager('./src/data/services.json')
