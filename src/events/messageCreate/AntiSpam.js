const { Client, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const automod = require('../../models/AutoMod');

// Define a Map to keep track of caps counts for each user
const capsCountMap = new Map();

// Define a Set to keep track of users on timeout
const timeoutUsers = new Set();

module.exports = async (client, message) => {
    if (!message.guild) return;
    if (message.author.bot) return;
    if (message.member.permissions.has(PermissionFlagsBits.ManageMessages))
        return;

    const guild = message.guild;

    let requireDB = await automod.findOne({ guildId: guild.id });
    if (!requireDB) return;
    if (requireDB.AntiCaps == false) return;

    let q = message.content;
    if (q.length > 6 && q == q.toUpperCase()) {
        try {
            await message.delete();
        } catch (err) {
            return;
        }

        const capsCount = (capsCountMap.get(message.author.id) || 0) + 1;
        capsCountMap.set(message.author.id, capsCount);

        const capsLimit = 3;
        const timeoutDuration = 2 * 60 * 60 * 1000; // 2 hours

        if (capsCount >= capsLimit && !timeoutUsers.has(message.author.id)) {
            // User reached caps limit and not already on timeout
            timeoutUsers.add(message.author.id);

            setTimeout(() => {
                timeoutUsers.delete(message.author.id); // Remove the user from the timeout set after the timeout duration
            }, timeoutDuration);

            // Log to the specified channel
            const logChannelId = '1180155996639862834'; // Replace with the actual channel ID
            const logChannel = message.guild.channels.cache.get(logChannelId);

            if (logChannel) {
                const logEmbed = new EmbedBuilder()
                    .setColor('Red')
                    .setTitle('Timeout durch Anti-Caps')
                    .setDescription(`:alarm_clock: <@${message.author.id}> wurde für Caps getimeoutet.`)
                    .addFields(
                        { name: 'Dauer', value: '2 Stunden', inline: true },
                        { name: 'Grund', value: 'Caps', inline: true },
                    );

                await logChannel.send({ embeds: [logEmbed] });
            }
        } else {
            // User has not reached caps limit or already on timeout, show warning
            const embed = new EmbedBuilder()
                .setColor('Red')
                .setDescription(`:warning: | <@${message.author.id}> Keine Caps erlaubt! (${capsCount}/${capsLimit})`)
                .setFooter({ text: '© RG System' })
                .setTimestamp(Date.now());

            const msg = await message.channel.send({ embeds: [embed] });
        }
    }
};
