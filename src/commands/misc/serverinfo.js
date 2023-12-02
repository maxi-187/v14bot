const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: 'serverinfo',
    description: 'Server-Info',
    devOnly: false,
    callback: async (client, interaction) => {
        const guild = interaction.guild;
        const owner = guild.ownerId ? client.users.cache.get(guild.ownerId).toString() : 'Unbekannt';

        const voiceChannels = guild.channels.cache.filter(channel => channel.type === 2);
        const textChannels = guild.channels.cache.filter(channel => channel.type === 0);
        const serverIcon = guild.iconURL({ dynamic: true }) || 'Kein Server-Symbol';
        const invlink = new URL('https://discord.gg/gangwar');

        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor('#ED4245')
                    .setTitle(`Info für ${guild.name}`)
                    .setThumbnail(serverIcon)
                    .addFields(
                        { name: 'Eigentümer', value: owner || 'Unbekannt', inline: true },
                        { name: 'Funktionen', value: guild.features.join(', ') || 'Keine Funktionen', inline: true },
                        { name: 'Boost-Level', value: guild.premiumTier || '0', inline: true },
                        { name: 'Einladungslink', value: `[discord.gg](${invlink})` || ' ', inline: true },
                        { name: 'Kanäle', value: `Text: ${textChannels.size}\nSprach: ${voiceChannels.size}`, inline: true },
                        { name: 'Server-Symbol', value: `[Server URL](${serverIcon})` || 'Kein Server-Symbol', inline: true },
                        { name: 'Bot-Präfix', value: '/', inline: true },
                        { name: 'Mitglieder', value: `Gesamt: ${guild.memberCount}\nMenschen: ${guild.members.cache.filter(member => !member.user.bot).size}\nBots: ${guild.members.cache.filter(member => member.user.bot).size}`, inline: true },
                        { name: 'Rollen', value: guild.roles.cache.size.toString() || '0', inline: true }
                    .setFooter({ text: '© RG System' })
                    .setTimestamp()   
                    )
            ]
        });
    },
};