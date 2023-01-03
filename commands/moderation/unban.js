const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { unban, unbandm } = require('../../messages.json');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription('unban a member')
        .addUserOption(option =>
            option
                .setName('target')
                .setDescription('The member to unban')
                .setRequired(true))
        .addStringOption(option =>
            option
                .setName('info')
                .setDescription('Something to tell the member')
            )
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .setDMPermission(false),
    async execute(interaction) {
        const target = interaction.options.getUser('target');
        const member = interaction.guild.members.cache.get(target.id);
        const note = interaction.options.getString('info') ?? 'No extra info has been given';
        
        const FailEmbed = new EmbedBuilder()
        .setTitle("❌ Could not unban target!")
        .setDescription(note)
        .setColor('#9048e2')
        
        const embed = new EmbedBuilder()
        .setDescription(`✅<@${target.id}> ${unban}`) // don't forget to add <@${target.id}> where it fits 
        .setColor('#9048e2')

        const unBanEmbed = new EmbedBuilder()
        .setTitle(`${unbandm} ${interaction.guild.name}`)
        .setColor('#9048e2')
        .setTimestamp(Date.now())

        if (!member) {
            return interaction.reply({ embeds: [FailEmbed], ephemeral: true })
        } else {
            interaction.guild.bans.remove(member)
        }

        await interaction.reply({ embeds: [embed], ephemeral: true })
        try {
            await target.send({ embeds: [unBanEmbed] })
        } catch (exception) {
            console.log("I was unable to DM " + target.id);
        }
    }
}