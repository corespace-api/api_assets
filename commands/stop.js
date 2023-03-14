const Command = require("./Command.js")

class Stop extends Command {
    constructor(config, logger, serviceSchema) {
        super(config, logger, serviceSchema)
        this.name = "stop"
        this.description = "Gracefully stops the service"
        this.category = "system"
    }

    setCommandStatus() {
        return new Promise((resolve, reject) => {
            this.serviceSchema.findOne({ uuid: this.executor }).then((service) => {
                if(!service) reject("Service not found")

                service.command = "EXECUTED"
                service.status = "await_removal"
                service.save().then(() => {
                    resolve()
                }).catch((err) => {
                    reject(err)
                })
            }).catch((err) => {
                reject(err)
            })
        })
    }

    execute() {
        super.execute()
        this.setCommandStatus().then(() => {
            this.logger.success("Command executed successfully")
            process.exit(1);
        }).catch((err) => { this.logger.error(err) })
    }
}

module.exports = Stop