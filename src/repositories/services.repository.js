export class ServicesRepository {
    #dao
    constructor(dao) {
        this.#dao = dao
    }

    getAll(filters) {
        return this.#dao.getAll(filters)
    }

    create(data) {
        return this.#dao.create(data)
    }

    getById(id) {
        return this.#dao.getById(id)
    }

    update(id, data) {
        return this.#dao.update(id, data)
    }

    delete(id) {
        return this.#dao.delete(id)
    }

    toggleAvailability(id) {
        return this.#dao.toggleAvailability(id)
    }

    reserveService(id, quantity) {
        return this.#dao.reserveService(id, quantity)
    }
}
