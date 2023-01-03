const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { kick, kickdm, higherRole } = require('../../messages.json');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kicks a member')
        .addUserOption(option =>
            option
                .setName('target')
                .setDescription('The member to kick')
                .setRequired(true))
        .addStringOption(option =>
            option
             .setName('reason')
                .setDescription('The reason for the kick'))
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
        .setDMPermission(false),
    async execute(interaction) {
        const target = interaction.options.getUser('target');
        const member = await interaction.guild.members.fetch(target.id);
        const reason = interaction.options.getString('reason') ?? 'No reason provided';

        const FailEmbed = new EmbedBuilder()
        .setTitle("❌ Could not kick target!")
        .setColor('Red')

        const RoleEmbed = new EmbedBuilder()
        .setDescription(higherRole)
        .setColor('Red')

        const embed = new EmbedBuilder()
        .setDescription(`✅<@${target.id}> ${kick}\n Reason: **${reason}**`) // don't forget to add <@${target.id}> where it fits 
        .setColor('Green')
        .setTimestamp(Date.now())

        const KickEmbed = new EmbedBuilder()
        .setTitle(`${kickdm} ${interaction.guild.name}`)
        .setColor('Green')
        .addFields(
            { name: "Reason", value: reason },
            { name: "Kicked by", value: `${interaction.user.tag}` }
        )
        .setTimestamp(Date.now())

        if (member.roles.highest > interaction.member.roles.highest)
            return interaction.reply({embeds: [RoleEmbed], ephemeral: true })

        try {
            await member.kick(reason)

            await interaction.reply({ embeds: [embed], ephemeral: true })
        } catch(err) {
            console.log(err);
            interaction.reply({embeds: [FailEmbed]})
        }

        await interaction.reply({ embeds: [embed], ephemeral: true })
        try {
            await target.send({ embeds: [KickEmbed] })
        } catch (exception) {
            console.log("I was unable to DM " + target.id);
        }
    }
}