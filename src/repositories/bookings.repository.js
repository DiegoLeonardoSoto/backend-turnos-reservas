export class BookingsRepository {
    #dao
    constructor(dao) {
        this.#dao = dao
    }

    async getAll() {
        return this.#dao.getAll()
    }

    async getReport(filters) {
        return this.#dao.getReport(filters)
    }

    async create(data) {
        return this.#dao.create(data)
    }

    async update(id, data) {
        return this.#dao.update(id, data)
    }

    async getById(id) {
        return this.#dao.getById(id)
    }

    async delete(id) {
        return this.#dao.delete(id)
    }

    async addService(id, service) {
        return this.#dao.addService(id, service)
    }

    async removeService(id, service) {
        return this.#dao.removeService(id, service)
    }
}
