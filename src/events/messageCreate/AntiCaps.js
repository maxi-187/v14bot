const { Client, PermissionFlagsBits, Collection, EmbedBuilder } = require("discord.js");
const automod = require('../../models/AutoMod');

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
    const uppercaseChars = q.replace(/[^A-Z]/g, '');
    
    if (uppercaseChars.length > 6 && uppercaseChars === q) {
        try {
            await message.delete();
        } catch (err) {
            console.error("Error deleting message:", err);
            return;
        }

        client.capsCountMap = new Collection();
        const capsCount = (client.capsCountMap.get(message.author.id) || 0) + 1;
        client.capsCountMap.set(message.author.id, capsCount);

        const capsLimit = 3;
        const timeoutDuration = 2 * 60 * 60 * 1000; // 2 hours

        if (capsCount >= capsLimit && !timeoutUsers.has(message.author.id)) {
            timeoutUsers.add(message.author.id);

            setTimeout(() => {
                timeoutUsers.delete(message.author.id);
            }, timeoutDuration);

            const logChannelId = '1180155996639862834';
            const logChannel = message.guild.channels.cache.get(logChannelId);

            const embed = new EmbedBuilder()
                .setColor('Red')
                .setDescription(`:warning: | <@${message.author.id}> has been timed out for 2 hours for excessive use of caps.`)
                .setFooter('© RG System')
                .setTimestamp(Date.now());

            logChannel.send({ embeds: [embed] });
        } else {
            const embed = new EmbedBuilder()
                .setColor('Red')
                .setDescription(`:warning: | <@${message.author.id}> Keine Caps erlaubt! (${capsCount}/${capsLimit})`)
                .setFooter('© RG System')
                .setTimestamp(Date.now());

            const msg = await message.channel.send({ embeds: [embed] });
        }
    }
};
