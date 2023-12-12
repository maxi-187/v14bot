const { EmbedBuilder, ApplicationCommandOptionType, PermissionFlagsBits } = require("discord.js");

module.exports = {
    name: 'adono',
    description: 'Gibt einem User den Donator Rang',
    options: [
        {
            name: 'benutzer',
            description: 'Welchem User möchtest du den Donator Rang geben?',
            type: ApplicationCommandOptionType.Mentionable,
            required: true,
        },
    ],
    permissionsRequired: [PermissionFlagsBits.ManageRoles],
    botPermissions: [PermissionFlagsBits.ManageRoles],
    callback: async (client, interaction) => {
        const role = interaction.guild.roles.cache.get('1169715609861365802'); // Donator
        let benutzer = interaction.options.get('benutzer').member;

        if (!benutzer) {
            await interaction.reply({ content: 'Bitte ping den User!', ephemeral: true });
            return;
        }
        await benutzer.roles.add(role);
        await interaction.reply({ embeds: [new EmbedBuilder()
            .setDescription(`Erfolgreich ${benutzer} zum Donator hinzugefügt!`)
            .setColor('Red')
            .setFooter({ text: '© RG System' })
            .setTimestamp()
        ], ephemeral: true });

        client.guilds.cache.get('1169715609446141974').channels.cache.get('1179175845487706112').send(

            {
                embeds: [
                    new EmbedBuilder()
                        .setTitle(`**Team System**`)
                        .setDescription(`<@${interaction.user.id}> Hat Erfolgreich dem User ${benutzer} den Donator Rang gegeben!`)
                        .setColor(`#ED4245`)
                        .setFooter({ text: '© RG System' })
                        .setTimestamp(Date.now())
                ]
            }
        )
    }
};
