export class ServicesService {
    #repository
    #bookingsRepository
    constructor(repository, bookingsRepository) {
      this.#repository = repository
      this.#bookingsRepository = bookingsRepository
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
        return this.#repository.create(serviceData)
    }

    async updateService(id, data) {
        return this.#repository.update(id, data)
    }


    async deleteService(id) {
      const isServiceReserved = await this.#bookingsRepository.isServiceReserved(id)
      if (isServiceReserved) throw {statusCode: 409, message: 'Service is reserved'}
      return this.#repository.delete(id)
    }

    async toggleAvailability(id) {
        return this.#repository.toggleAvailability(id)
    }

    async reserveService(id, quantity) {
        return this.#repository.reserveService(id, quantity)
    }

    async releaseService(id, toRelease, session) {
        return this.#repository.releaseService(id, toRelease, session)
    }

}
