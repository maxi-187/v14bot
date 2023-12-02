const { EmbedBuilder, ApplicationCommandOptionType, PermissionFlagsBits } = require("discord.js");

module.exports = {
    name: 'tkick',
    description: 'Kickt ein Teammitglied',
    options: [
        {
            name: 'benutzer',
            description: 'Welches Teammitglied möchtest du aus dem Team kicken?',
            type: ApplicationCommandOptionType.Mentionable,
            required: true,
        },
    ],
    permissionsRequired: [PermissionFlagsBits.ManageRoles],
    botPermissions: [PermissionFlagsBits.ManageRoles],
    callback: async (client, interaction) => {
        let role = interaction.guild.roles.cache.find(r => r.id == '1169715609878138997'); // Staff
        let role1 = interaction.guild.roles.cache.find(r => r.id == '1169715609878138995'); // Serverteam
        let benutzer = interaction.options.get('benutzer').member;

        if (!benutzer) {
            await interaction.reply({ content: 'Bitte ping das Teammitglied!', ephemeral: true });
            return;
        }
        await benutzer.roles.remove(role); 
        await benutzer.roles.remove(role1); 
        await interaction.reply({ embeds: [new EmbedBuilder()
            .setDescription(`Erfolgreich ${benutzer} aus dem Team gekickt!`)
            .setColor('Red')
            .setFooter({ text: '© RG System' })
            .setTimestamp()
        ], ephemeral: true });

        client.guilds.cache.get('1169715609446141974').channels.cache.get('1179175845487706112').send(

            {
                embeds: [
                    new EmbedBuilder()
                        .setTitle(`**Team System**`)
                        .setDescription(`<@${interaction.user.id}> Hat Erfolgreich das Teammitglied ${benutzer} aus dem Team gekickt!`)
                        .setColor(`#ED4245`)
                        .setFooter({ text: '© RG System' })
                        .setTimestamp(Date.now())
                ]
            }
        )  
    }
};
