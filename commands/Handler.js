class CommandHandler {
    constructor(config, logger, dbc, serviceSchema) {
        this.fs = null
        this.path = null
        this.commandPath = null

        this.config = config
        this.logger = logger
        this.dbc = dbc
        this.serviceSchema = serviceSchema
    }

    init() {
        this.fs = require("fs")
        this.path = require("path");
        this.commandPath = this.path.join(__dirname, this.config.getConfig("command_path"))

        this.logger.log("Initializing command handler...")
        this.logger.log(`Command path: ${this.commandPath}`)
        this.logger.log(`Commands: ${this.getCommands()}`)
        this.commandEventListener()
    }

    getCommands() {
        // get all files in the commands folder
        const commandFiles = this.fs.readdirSync(this.commandPath).filter(file => file.endsWith(".js"));

        // remove Command.js and Handler.js from the list
        commandFiles.splice(commandFiles.indexOf("Command.js"), 1)
        commandFiles.splice(commandFiles.indexOf("Handler.js"), 1)

        // remove the .js extension from the file name
        const commandNames = commandFiles.map(file => file.replace(".js", ""));
        return commandNames
    }

    commandEventListener() {
        setInterval(() => {
            this.logger.log("Listening for commands (10sek)...")
            this.serviceSchema.findOne({ uuid: this.config.getConfig("uuid") }).then((service) => {
                if (!service.command) { return; }
                const command = service.command

                if (command == "EXECUTED") { service.command = null; service.save(); return; }
                
                // check if the command exists
                if (!this.getCommands().includes(command)) {
                    this.logger.warn(`Command ${command} does not exist`)
                    return;
                }

                this.logger.log(`Command received: ${command}`)
                this.logger.log(`Executing command...`)

                // load the command and execute it
                const Command = require(`${this.commandPath}/${command}.js`)
                console.log(this.config.getConfig("uuid"));
                const commandInstance = new Command(this.config, this.logger, this.serviceSchema)
                commandInstance.execute()
            }).catch((err) => {
                this.logger.error(err)
            })
        }, 10000)
    }
}

module.exports = CommandHandler