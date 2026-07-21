import fs from 'node:fs/promises'
import { generateId } from '../utils/generateId.js'

const filePath = './src/data/services.json'

const readServices = async () => {
  try {
    const data = await fs.readFile(filePath, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    return []
  }
}

const writeServices = async (services) => {
  await fs.writeFile(filePath, JSON.stringify(services, null, 2))
}

export const getServices = async () => {
  return await readServices()
}

export const getServiceById = async (id) => {
  const services = await readServices()
  const service = services.find(service => service.id === Number(id))

  if (!service) return null
  return service
}

export const addService = async (serviceData) => {
  const { name, description, duration, price, category, available } = serviceData

  if (!name || !description || !duration || !price || !category || available === undefined) {
    return null
  }

  const services = await readServices()
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
  await writeServices(services)

  return newService
}

export const updateService = async (id, serviceData) => {
  const services = await readServices()
  const serviceIndex = services.findIndex(service => service.id === Number(id))

  if (serviceIndex === -1) return null

  const { name, description, duration, price, category, available } = serviceData

  if (!name || !description || !duration || !price || !category || available === undefined) {
    return null
  }

  const updatedService = {
    ...services[serviceIndex],
    name,
    description,
    duration,
    price,
    category,
    available,
    id: services[serviceIndex].id
  }

  services[serviceIndex] = updatedService
  await writeServices(services)

  return updatedService
}

export const deleteService = async (id) => {
  const services = await readServices()
  const serviceIndex = services.findIndex(service => service.id === Number(id))

  if (serviceIndex === -1) return null

  const [deletedService] = services.splice(serviceIndex, 1)
  await writeServices(services)

  return deletedService
}
