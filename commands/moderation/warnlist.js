const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const warnSchema = require('../../models/warningLog');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('warnlist')
        .setDescription('list the warning of an user ')
        .addUserOption(option =>
            option
                .setName('target')
                .setDescription('members warnings to be listed')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
        .setDMPermission(false),
    async execute(interaction) {
        const target = interaction.options.getUser('target');
        const member = interaction.guild.members.cache.get(target.id);

        const warnings = await warnSchema.find({
            Guild: interaction.guildId,
            userId: member,
        })

        let description = `**Warnings for ${target}**: \n\n`

        for (const warn of warnings) {
            description += `**ID:** ${warn._id}\n`
            description += `**Date:** ${warn.createdAt.toLocaleString()}\n`
            description += `**Staff:** ${warn.Staff}\n`
            description += `**Reason:** ${warn.reason}\n\n`
        }

        const embed = new EmbedBuilder().setDescription(description).setColor('Random').setThumbnail(member.displayAvatarURL())

        await interaction.reply({embeds: [embed]})
    }
} 