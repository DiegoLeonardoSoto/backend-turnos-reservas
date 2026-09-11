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

    async getById(id) {
        return this.#dao.getById(id)
    }

    async update(id,data) {
        return this.#dao.update(id,data)
    }

    async addService(id, service) {
        return this.#dao.addService(id, service)
    }
}
