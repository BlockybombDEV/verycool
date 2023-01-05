const {joinMessage, leaveMessage} = require('../messages.json')
const { EmbedBuilder } = require('discord.js')

function joinLeave(client) {
    const channel = client.channels.cache.get('987774035121283084')
    const embed = new EmbedBuilder()
    client.on('guildMemberAdd', (member) => {
        embed.setTitle('A new user has appeared').setColor('Green')
        .setDescription(`${member.user} ${joinMessage}`)
        .setThumbnail(member.user.displayAvatarURL());
    return channel.send({embeds: [embed]});
    })

    client.on('guildMemberRemove', (member) => {
        embed.setTitle('Someone went missing').setColor('Red')
        .setDescription(`${member.user} ${leaveMessage}`)
        .setThumbnail(member.user.displayAvatarURL());
    return channel.send({embeds: [embed]});
    })

    return console.log('Succesfully loaded joinLeave')
}

module.exports = {joinLeave};