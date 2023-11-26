const { ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");

module.exports = {
    name: 'bug',
    description: 'Schreibt ein Bug in den Channel',
    options: [
        {
            name: 'beschreiben',
            description: 'beschreibe den bug',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
    ],
    callback: async (bot, interaction) => {
        const beschreibenValue = interaction.options.getString('beschreiben');


        if (!beschreibenValue) {
            return interaction.reply({ content: 'Bitte gebe dein Bug an!', ephemeral: true });
        }

        const embed = new EmbedBuilder()
                .setTitle('**Neuer Bug!**')
                .setDescription(`<@${interaction.user.id}> **hat einen Bug gefunden**\n\n__**Bug**__:\n${beschreibenValue}`)
                .setColor('#ED4245')
                .setFooter({ text: '© RG System' })
                .setTimestamp(Date.now())

        const guild = bot.guilds.cache.get('1169715609446141974');
        const channel = guild.channels.cache.get('1169715611409076305');

        if (channel) {
            await guild.channels.cache.get(channel.id).send({ embeds: [embed] });
        } else {
            console.error("Channel nicht gefunden!");
        }

        return interaction.reply({ embeds: [new EmbedBuilder().setDescription('Erfolgreich den Bug abgeschickt!').setColor('Green')], ephemeral: true});
    }
};