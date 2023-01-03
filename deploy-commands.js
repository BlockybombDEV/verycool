const fs = require('node:fs');
const { REST, Routes, Client  } = require('discord.js');
const {token, client_id} = require('./config.json')

const client = new Client({ intents: ['Guilds','GuildMembers'] });

const commands = [];
//Grabs all command files from the directory
const commandFiles = fs.readdirSync('./commands/moderation').filter(file => file.endsWith('.js'));

//Grabs the SlashcommandbuildertoJSon output of each command's data for deployment
for (const file of commandFiles) {
    const command = require(`./commands/moderation/${file}`);
    commands.push(command.data.toJSON());
}

//Contruct and prepare an instance of the rest module
const rest = new REST({ version: '10' }).setToken(token);

(async () => {
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);
        
        // Deploy to specific guild
        // const data = await rest.put(
        //    Routes.applicationGuildCommands(Client id here, Guild id here),
        //    { body: commands },
        // );

        // Globally deploys commands
        const data = await rest.put(
            Routes.applicationCommands(client_id),
            { body: commands },
        );

        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        console.error(error);
    }
})();