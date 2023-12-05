const { Client, PermissionFlagsBits, EmbedBuilder } = require("discord.js");

const messageCount = new Map();
const timeoutUsers = new Set();
const maxMessageCount = 5;
const recentMessages = new Map();

module.exports = async (client, message) => {
    if (!message.guild || message.author.bot || message.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
        return;
    }

    const { member, author, guild, channel, content } = message;
    const channelId = '1180155996639862834';
    const timeoutDuration = 2 * 60 * 60 * 1000;

    if (recentMessages.has(author.id) && recentMessages.get(author.id).includes(content.toLowerCase())) {
        try {
            await message.delete();
        } catch (error) {
            console.error(`Fehler beim Löschen der Nachricht: ${error.message}`);
        }
    }

    if (!timeoutUsers.has(author.id)) {
        const userMessageCount = (messageCount.get(author.id) || 0) + 1;
        messageCount.set(author.id, userMessageCount);

        if (userMessageCount >= maxMessageCount) {
            member.timeout(timeoutDuration, 'Spam');
            timeoutUsers.add(author.id);

            setTimeout(() => {
                timeoutUsers.delete(author.id);
            }, timeoutDuration);

            const logChannel = guild.channels.cache.get(channelId);

            if (logChannel) {
                const logEmbed = new EmbedBuilder()
                    .setColor('Red')
                    .setTitle('Timeout durch Anti-Spam')
                    .setDescription(`:alarm_clock: <@${author.id}> wurde für Spam getimeoutet.`)
                    .addFields(
                        { name: 'Dauer', value: '2 Stunden', inline: true },
                        { name: 'Grund', value: 'Spam', inline: true },
                    );

                logChannel.send({ embeds: [logEmbed] });

                // Nachrichten des Benutzers löschen
                try {
                    const userMessages = await channel.messages.fetch({ limit: 100 });
                    for (const msg of userMessages) {
                        if (msg[1].author.id === author.id) {
                            try {
                                await msg[1].delete();
                            } catch (deleteError) {
                                console.error(`Fehler beim Löschen der Nachricht: ${deleteError.message}`);
                            }
                        }
                    }
                } catch (fetchError) {
                    console.error(`Fehler beim Abrufen der Nachrichten: ${fetchError.message}`);
                }

                messageCount.set(author.id, 0);
            } else {
                console.error('Log-Kanal wurde nicht gefunden!');
            }
        }
    }

    if (!recentMessages.has(author.id)) {
        recentMessages.set(author.id, [content.toLowerCase()]);
    } else {
        const userRecentMessages = recentMessages.get(author.id);
        userRecentMessages.push(content.toLowerCase());
        if (userRecentMessages.length > 10) {
            userRecentMessages.shift();
        }
        recentMessages.set(author.id, userRecentMessages);
    }
};
