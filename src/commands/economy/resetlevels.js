const { EmbedBuilder, ApplicationCommandOptionType, PermissionFlagsBits } = require("discord.js");
const Level = require('../../models/Level');

module.exports = {
    name: 'resetlvl',
    description: 'Löscht alle Level!',
    options: [],
    permissionsRequired: [PermissionFlagsBits.ManageRoles],
    botPermissions: [PermissionFlagsBits.ManageRoles],
    callback: async (client, interaction) => {
        if (!interaction.inGuild()) {
            interaction.reply({ content: 'Du kannst den Befehl nur auf dem Server ausführen.', ephemeral: true });
            return;
        }

        try {
            let allLevels = await Level.find({ guildId: interaction.guild.id });

            for (const levelEntry of allLevels) {
                levelEntry.level = 0;
                levelEntry.xp = 0;
                await levelEntry.save();
            }

            interaction.reply({ embeds: [new EmbedBuilder()
            .setDescription(`Alle Level wurden erfolgreich auf **0** zurückgesetzt!`)
            .setColor('#57F287')
            .setFooter({ text: '© RG System' })
            .setTimestamp()
        ], ephemeral: true });
        } catch (error) {
            console.error(error);
            interaction.reply({ embeds: [new EmbedBuilder()
            .setDescription(`Ein Fehler ist aufgetreten. Bitte versuche es später erneut.`)
            .setColor('Red')
            .setFooter({ text: '© RG System' })
            .setTimestamp()
        ], ephemeral: true });
        }
    }
};
