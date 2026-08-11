export class BookingsRepository {
    #dao
    constructor(dao) {
        this.#dao = dao
    }

    async create(data) {
        return this.#dao.create(data)
    }

    async getById(id) {
        return this.#dao.getById(id)
    }

    async update(booking) {
        return this.#dao.update(booking)
    }
}
