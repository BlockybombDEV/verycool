const { Client, Collection, Events, ActivityType, EmbedBuilder } = require('discord.js');
const {loadCommands} = require('./Handlers/commandHandler')
const mongoose = require('mongoose');
const { token, MONGO } = require('./config.json');

const client = new Client({
    intents: [
        'Guilds',
        'GuildBans',
        'GuildMembers',
        'GuildMessages',
        'DirectMessages',
        'MessageContent',
        'GuildEmojisAndStickers'
    ]
})

client.commands = new Collection();

client.once('ready', () => {
    console.log('Ready!')
})

client.once(Events.ClientReady, c => {
    client.user.setActivity(`on Cirellium | /help `, { type: ActivityType.Playing});
    console.log(`Bot is Online. Logged in as ${c.user.tag}`);
});

client.on('interactionCreate', interaction => {
    if (!interaction.isButton()) return;
    console.log(interaction)
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    const ErrorEmbed = new EmbedBuilder()
        .setTitle('Failed to execute command')
        .setColor('Red')

    if(!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error)
        await interaction.reply({ embeds: [ErrorEmbed], ephemeral: true })
    }
})

client.login(token).then(() => mongoose.connect(MONGO)).then(() => {
    loadCommands(client);
});