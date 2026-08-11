import fs from 'node:fs/promises'
import { generateId } from '../../utils/generateId.js'

export class ServicesFsDao {
    #filePath
    constructor(filePath) {
      this.#filePath = filePath
    }

    async #readAll() {
      try {
        const data = await fs.readFile(this.#filePath, 'utf-8')
        return JSON.parse(data)
      } catch(error) {
          if (error.code === "ENOENT") {
            await this.#writeAll([])
            return []
        }
      }
    }

    async #writeAll(services) {
       await fs.writeFile(this.#filePath, JSON.stringify(services, null, 2))
    }

    async getAll() { return this.#readAll() }

    async create(data) {
        const services = await this.#readAll()

        const newService = {
          id: generateId(services),
          ...data
        }

        await this.#writeAll([...services, newService])
        return newService
    }

    async getById(id) {
      const services = await this.#readAll()
      const service = services.find(s => s.id === Number(id))
      return service ?? null
    }

    async update(id, data) {
      const services = await this.#readAll()
      const index = services.findIndex(s => s.id === Number(id))
      if (index === -1) return null

        const { name, description, duration, price, category, available } = data

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
      await this.#writeAll(services)

      return updatedService
    }

    async delete(id) {
        const services = await this.#readAll()
        const index = services.findIndex(s => s.id === Number(id))

        if (index === -1) return null

        const [deleted] = services.splice(index, 1)
        await this.#writeAll(services)
        return deleted
    }

}
