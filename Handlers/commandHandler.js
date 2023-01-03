function loadCommands(client) {
    const fs = require('fs');

    let commandsArray = [];

    const commandsFolder = fs.readdirSync('./commands');
    for (const folder of commandsFolder) {
        const commandFiles = fs.readdirSync(`./commands/${folder}`).filter((file) => file.endsWith('.js'));

        for (const file of commandFiles) {
            const commandFile = require(`../commands/${folder}/${file}`);

            const properties = { folder, ...commandFile };
            client.commands.set(commandFile.data.name, properties);

            commandsArray.push(commandFile.data.toJSON());

            continue;
        }
    }

    client.application.commands.set(commandsArray);

    return console.log("Successfully loaded commands");
}

module.exports = {loadCommands};