export class ServicesService {
    #repository
    constructor(repository) {
      this.#repository = repository
    }

    async getServices(filters = {}) {
        let services = await this.#repository.getAll(filters)

        return services
    }

    async getServiceById(id) {
        const service = await this.#repository.getById(id)
        if (!service) return null
        return service
    }

    async createService(serviceData) {

        const { name, description, duration, price, category, available } = serviceData

        if (!name || !description || !duration || !price || !category || available === undefined) {
          return null
        }

        return this.#repository.create(serviceData)
    }

    async updateService(id, data) {
        return this.#repository.update(id, data)
    }

    async deleteService(id) {
        return this.#repository.delete(id)
    }

    async toggleAvailability(id) {
        return this.#repository.toggleAvailability(id)
    }

}
