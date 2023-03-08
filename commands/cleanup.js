const Command = require("./Command.js")

class Cleanup extends Command {
    constructor(executor, logger, serviceSchema) {
        super(executor, logger, serviceSchema)
        this.name = "cleanup"
        this.description = "Removes all log files"
        this.category = "utility"
    }

    setCommandStatus() {
        return new Promise((resolve, reject) => {
            this.serviceSchema.findOne({ uuid: this.executor }).then((service) => {
                if(!service) reject("Service not found")

                const fs = require("fs")
                const path = require("path")

                const logPath = path.join(__dirname, "../../logs")

                fs.rmSync(logPath, { recursive: true, force: true })

                service.command = "EXECUTED"
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
        }).catch((err) => { this.logger.error(err) })
    }
}

module.exports = Cleanup