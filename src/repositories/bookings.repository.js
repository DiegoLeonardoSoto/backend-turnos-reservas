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

    async create(data, session) {
        return this.#dao.create(data, session)
    }

    async update(id, data) {
        return this.#dao.update(id, data)
    }

    async getById(id) {
        return this.#dao.getById(id)
    }

    async delete(id, session) {
        return this.#dao.delete(id, session)
    }

    async addService(id, service, session) {
        return this.#dao.addService(id, service, session)
    }

    async removeService(id, service, session) {
        return this.#dao.removeService(id, service, session)
    }

    async isServiceReserved(sid) {
        return this.#dao.isServiceReserved(sid)
    }
}
