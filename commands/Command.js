class Command {
    constructor(executor, logger, serviceSchema) {
        this.executor = executor
        this.serviceSchema = serviceSchema
        this.name = null
        this.description = null
        this.category = null

        this.logger = logger
    }

    getName() {
        return this.name
    }

    getDescription() {
        return this.description
    }

    getCategory() {
        return this.category
    }

    execute() { }
}

module.exports = Command