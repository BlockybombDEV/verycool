const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { Warn } = require('../../messages.json');
const warnSchema = require('../../models/warningLog');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('warn')
        .setDescription('Warn a member')
        .addUserOption(option =>
            option
                .setName('target')
                .setDescription('The member to warn')
                .setRequired(true))
        .addStringOption(option =>
            option
                .setName('reason')
                .setDescription('The reason for the warn'))
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
        .setDMPermission(false),
    async execute(interaction) {
        const target = interaction.options.getUser('target');
        const member = interaction.guild.members.cache.get(target.id);
        const Reason = interaction.options.getString('reason') ?? 'No reason provided';
        const DBfailembed = new EmbedBuilder()

        warnSchema.findOne({ Guild: interaction.guildId }, async (err, data) => {
            if (!data) {
                await warnSchema.create({
                    Guild: interaction.guildId,
                    Staff: interaction.user,
                    userId: member,
                    reason: Reason
                });

            } else if (data) {
                warnSchema.deleteOne({ Guild: interaction.guildId});
                await warnSchema.create({
                    Guild: interaction.guildId,
                    Staff: interaction.user,
                    userId: member,
                    reason: Reason
                });

            }

            if (err) {
                DBfailembed
                .setDescription('❌ Something went wrong. *\n Join the support server to ask for help')
                .setColor('Red')
                .setTimestamp(Date.now())
                interaction.reply({embeds: [DBfailembed]})
                
            }

        })
        

        
        //embeds
        const embed = new EmbedBuilder()
        .setTitle(`✅${target.tag} ${Warn}`)
        .setDescription(`Member: ${member} \n Reason: **${Reason}**`) // don't forget to add <@${member.name}> where it fits 
        .setColor('Green')

        const wrnEmbed = new EmbedBuilder()
        .setTitle(`you recieved a warning in ${interaction.guild.name}`)
        .setColor('#9048e2')
        .addFields(
            { name: "Reason", value: Reason },
            { name: "Staff member", value: `${interaction.user.tag}` }
        )
        .setTimestamp(Date.now())
        
        await interaction.reply({embeds: [embed], ephemeral: true})
        try {
            await target.send({ embeds:  [wrnEmbed] })
        } catch (exception) {
            console.log("I was unable to DM " + target.id);
        }
    }
}