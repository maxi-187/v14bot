const { EmbedBuilder, ApplicationCommandOptionType, PermissionFlagsBits } = require("discord.js");
const Level = require('../../models/Level');

module.exports = {
    name: 'givelvl',
    description: 'Gebe einem Benutzer Level oder XP',
    options: [
        {
            name: 'benutzer',
            description: 'Benutzer',
            type: ApplicationCommandOptionType.Mentionable,
            required: true,
        },
        {
            name: 'type',
            description: 'Möchtest du Level oder XP geben?',
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: [
                { name: 'Level', value: 'level' },
                { name: 'XP', value: 'xp' },
            ],
        },
        {
            name: 'anzahl',
            description: 'Wie viel möchtest du vergeben',
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
        const type = interaction.options.getString('type');
        const amount = interaction.options.getInteger('anzahl');

        if (!targetUser) {
            interaction.reply({ embeds: [new EmbedBuilder()
            .setDescription(`Ungültiger Benutzer.`)
            .setColor('Red')
            .setFooter({ text: '© RG System' })
            .setTimestamp()
        ], ephemeral: true });   
            return;
        }

        if (type !== 'level' && type !== 'xp') {
            interaction.reply({ embeds: [new EmbedBuilder()
            .setDescription(`Ungültiger Typ. Verwende **"level"** oder **"xp"**.`)
            .setColor('Red')
            .setFooter({ text: '© RG System' })
            .setTimestamp()
        ], ephemeral: true });   
            return;
        }

        if (amount <= 0) {
            interaction.reply({ embeds: [new EmbedBuilder()
            .setDescription(`Die Anzahl muss größer als **0** sein.`)
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
            if (type === 'level') {
                userLevel.level += amount;
            } else {
                userLevel.xp += amount;
            }

            await userLevel.save();
            interaction.reply({ embeds: [new EmbedBuilder()
            .setDescription(`Erfolgreich **${amount}** ${type === 'level' ? 'Level' : 'XP'} an <@${targetUser.id}> vergeben.`)
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
