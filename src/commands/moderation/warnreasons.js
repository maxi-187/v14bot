const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require('discord.js');
const WarnHistory = require('../../models/WarnHistory');
const AutoModSchema = require('../../models/AutoMod');

module.exports = {
    name: 'warnhistory',
    description: 'Zeigt dir die Warn History von dem Benutzer',

    callback: async (client, interaction) => {
        const guild = interaction.guild;
        const guildMembers = await guild.members.fetch();

        const benutzerOptions = guildMembers.map(member => ({
            label: member.user.tag,
            value: member.id
        }));

        const hilfemenü = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId("menu")
                    .setPlaceholder("Wähle einen Benutzer")
                    .addOptions(benutzerOptions),
            );

        const allgemeinebefehle = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("back")
                    .setLabel("Zurück")
                    .setStyle(ButtonStyle.Primary)
            );

        const einbettung = new EmbedBuilder()
            .setColor("Red")
            .setDescription("Hier kannst du dir die Warn History anzeigen lassen")
            .setTimestamp()
            .setFooter({ text: '© RG System' });

        const history = new EmbedBuilder()
            .setColor("Red")
            .setTimestamp()
            .setFooter({ text: '© RG System' });

        const nachricht = await interaction.reply({ embeds: [einbettung], components: [hilfemenü], ephemeral: true });

        const collect = await nachricht.createMessageComponentCollector();

        collect.on('collect', async (i) => {
            if (i.customId === 'menu') {
                const selectedUserId = i.values[0];
                const selectedUser = guild.members.cache.get(selectedUserId);

                if (i.user.id !== interaction.user.id) {
                    return await i.reply({ content: `Nur ${interaction.user.tag} kann mit dem Auswahlmenü interagieren!`, ephemeral: true });
                }

                if (selectedUser) {
                    let userWarnHistory = await getWarnHistory(guild.id, selectedUser.id);
                    
                    const userAutoModData = await AutoModSchema.findOne({ guildId: guild.id, memberId: selectedUser.id });
                    if (userAutoModData) {
                        const allWarns = userWarnHistory.match(/Warn für: .+/g) || [];
                        const totalWarns = allWarns.length;

                        userWarnHistory += `\n\nGesamtanzahl der Warnungen: ${totalWarns}`;
                    }

                    history.setDescription(userWarnHistory);

                    await i.update({ embeds: [history], components: [hilfemenü] });
                }
            }

            if (i.customId === "history") {
                if (i.user.id !== interaction.user.id) {
                    return await i.reply({ content: `Nur ${interaction.user.tag} kann mit den Schaltflächen interagieren!`, ephemeral: true });
                }
                await i.update({ embeds: [history], components: [hilfemenü, allgemeinebefehle] });
            }

            if (i.customId === "back") {
                if (i.user.id !== interaction.user.id) {
                    return await i.reply({ content: `Nur ${interaction.user.tag} kann mit den Schaltflächen interagieren!`, ephemeral: true });
                }
                await i.update({ embeds: [history], components: [hilfemenü] });
            }
        });
    }
};

async function getWarnHistory(guildId, memberId) {
    try {
        const warnHistoryEntry = await WarnHistory.findOne({ guildId, memberId });

        if (warnHistoryEntry) {
            return warnHistoryEntry.history;
        } else {
            return "Keine Warnungen gefunden.";
        }
    } catch (error) {
        console.error("Fehler beim Abrufen der Warn-Historie:", error);
        return "Ein Fehler ist aufgetreten.";
    }
}
