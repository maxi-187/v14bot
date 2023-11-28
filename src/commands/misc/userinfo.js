const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");

module.exports = {
    name: 'userinfo',
    description: 'User-Info',
    options: [
        {
            name: 'user',
            description: 'Bekomme seine User info.',
            type: ApplicationCommandOptionType.Mentionable,
            required: false,
        },
    ],
    callback: async (client, interaction) => {
        const targetUser = interaction.options.getUser('user') || interaction.user;
        const userFlags = targetUser.flags.toArray();
        const member = interaction.guild.members.cache.get(targetUser.id);
        const highestRole = member.roles.highest;
        const otherRoles = member.roles.cache
            .filter(role => role.id !== interaction.guild.id)
            .map(role => role.name)
            .join('\n'); // Separate other roles with a new line

        
        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor('#ED4245')
                    .setTitle(targetUser.username)
                    .setThumbnail(targetUser.displayAvatarURL({ dynamic: true }))
                    .addFields(
                        { name: 'ID', value: `\`\`\`ID = ${targetUser.id}\`\`\``, inline: false },
                        { name: 'Abzeichen', value: `${userFlags.length ? userFlags.map(flag => `\`${flag}\``).join(', ') : 'Keine Abzeichen'}`, inline: true },
                        { name: 'Avatar', value: `[Avatar URL](${targetUser.displayAvatarURL({ dynamic: true })})`, inline: true },
                        { name: 'Höchste Rolle', value: `${highestRole ? `<@&${highestRole.id}>` : 'Keine Rolle'}`, inline: true },
                        { name: 'Andere Rollen', value: `\`\`\`${otherRoles || 'Keine anderen Rollen'}\`\`\``, inline: false },
                        { name: ':clock6: Konto erstellt:', value:  `${targetUser.createdAt.toLocaleString()}`, inline: false },
                        { name: ':clock6: Server beigetreten:', value: `${member.joinedAt.toLocaleString()}`, inline: false },
                    )
                    .setFooter({ text: '© RG System' })
                    .setTimestamp()
            ]
        });
    },
};