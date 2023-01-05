const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const warnSchema = require('../../models/warningLog');
const {Warnremove} = require('../../messages.json')


module.exports = {
    data: new SlashCommandBuilder()
        .setName('warnremove')
        .setDescription('Removes a warning by id')
        .addStringOption(option =>
            option
                .setName('id')
                .setDescription('members warnings to be listed')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
        .setDMPermission(false),
    async execute(interaction) {
        const id = interaction.options.getString('id');

        // delete's warning from database
        const warning = await warnSchema.findByIdAndDelete(id)

        const embed = new EmbedBuilder().setDescription(`Warning ${id} ${Warnremove} from ${warning.userId}`).setColor('Green')

        await interaction.reply({embeds: [embed]})
    }
} 