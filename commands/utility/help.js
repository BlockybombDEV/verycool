const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Events, ComponentType, SelectMenuBuilder, } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;

// Slash command
module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('See a list of commands'),
    async execute(interaction) {
        const emoijs = {
            utility: '📃',
            moderation: '⚒',
            economy: '💎',
        };
        
        const directories = [
            ...new Set(interaction.client.commands.map((cmd) => cmd.folder)),
        ];

        const formatString = (str) => 
            `${str[0].toUpperCase()}${str.slice(1).toLowerCase()}`;

        const categories = directories.map((dir) => {
            const getCommands = interaction.client.commands
                .filter((cmd) => cmd.folder === dir)
                .map((cmd) => {
                    return {
                        name: cmd.data.name,
                        description:
                            cmd.data.description ||
                            "There is no description for this command.",
                    }
                });
            return {
                directory: formatString(dir),
                commands: getCommands,
            };
        });

        const embed = new EmbedBuilder().setDescription('Please choose a category in the drowdown menu').setColor('Red');

        const components = (state) => [
            new ActionRowBuilder().addComponents(
                new SelectMenuBuilder()
                .setCustomId('help-menu')
                .setPlaceholder('Please select a category')
                .setDisabled(state)
                .addOptions(
                    categories.map((cmd) => {
                        return {
                            label: cmd.directory,
                            value: cmd.directory.toLowerCase(),
                            description: `commands from ${cmd.directory} category.`,
                            emoij: emoijs[cmd.directory.toLowerCase() || null],
                        };
                    })
                )
            ),
        ];

        const intialMessage = await interaction.reply({
            embeds: [embed],
            components: components(false),
        });

        const filter = (interaction) =>
            interaction.user.id === interaction.member.id;
        
        const collector = interaction.channel.createMessageComponentCollector({
            filter,
            ComponentType: ComponentType.StringSelect,
        });

        collector.on('collect', (interaction) => {
            const [directory] = interaction.values;
            const category = categories.find(
                (x) => x.directory.toLowerCase() === directory
            );

            const categoryEmbed = new EmbedBuilder()
            .setTitle(`${formatString(directory)} commands`)
            .setDescription(`A list of all the commands categorized under ${directory}`)
            .setColor('Random')
            .addFields(
                category.commands.map((cmd) => {
                    return {
                        name: `\`${cmd.name}\``,
                        value: `↳ ${cmd.description}`,
                        inline: true,
                    };
                })
            );

            interaction.update({ embeds: [categoryEmbed] });
        });

        collector.on('end', () => {
            intialMessage.edit({ components: components(true) });
        });
    },
};


