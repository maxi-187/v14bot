const { ApplicationCommandOptionType, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const Level = require('../../models/Level');

module.exports = {
    name: 'setlvl',
    description: 'Setze das Level eines Benutzers',
    options: [
        {
            name: 'benutzer',
            description: 'Benutzer',
            type: ApplicationCommandOptionType.Mentionable,
            required: true,
        },
        {
            name: 'level',
            description: 'Das gewünschte Level',
            type: ApplicationCommandOptionType.Integer,
            required: true,
        },
    ],
    permissionsRequired: [PermissionFlagsBits.ManageRoles],
    botPermissions: [PermissionFlagsBits.ManageRoles],
    callback: async (client, interaction) => {
        if (!interaction.inGuild()) {
            interaction.reply({ content: 'Du kannst den Befehl nur auf dem Server ausführen.', ephemeral: true });
            return;
        }

        const targetUser = interaction.options.getUser('benutzer');
        const targetLevel = interaction.options.getInteger('level');

        if (!targetUser) {
            interaction.reply({ embeds: [new EmbedBuilder()
            .setDescription(`Ungültiger Benutzer.`)
            .setColor('Red')
            .setFooter({ text: '© RG System' })
            .setTimestamp() 
        ], ephemeral: true });
            return;
        }

        if (targetLevel <= 0) {
            interaction.reply({ embeds: [new EmbedBuilder()
            .setDescription(`Das Level muss größer als 0 sein.`)
            .setColor('Red')
            .setFooter({ text: '© RG System' })
            .setTimestamp() 
        ], ephemeral: true });
            return;
        }

        try {
            let userLevel = await Level.findOne({ userId: targetUser.id, guildId: interaction.guild.id });

            if (!userLevel) {
                userLevel = new Level({
                    userId: targetUser.id,
                    guildId: interaction.guild.id,
                });
            }

            userLevel.level = targetLevel;

            await userLevel.save();
            interaction.reply({ embeds: [new EmbedBuilder()
            .setDescription(`Erfolgreich das Level von <@${targetUser.id}> auf **${targetLevel}** gesetzt.`)
            .setColor('#57F287')
            .setFooter({ text: '© RG System' })
            .setTimestamp() 
        ], ephemeral: true });
        } catch (error) {
            console.error(error);
            interaction.reply({ embeds: [new EmbedBuilder()
            .setDescription(`Ein Fehler ist aufgetreten.`)
            .setColor('Red')
            .setFooter({ text: '© RG System' })
            .setTimestamp() 
        ], ephemeral: true });
        }
    },
};