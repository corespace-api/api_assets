class Command {
    constructor(config, logger, serviceSchema) {
        this.config = config
        this.executor = this.config.getConfig("uuid")
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