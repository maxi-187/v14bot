const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, ApplicationCommandOptionType } = require(`discord.js`);

module.exports = {
    name: 'avatar',
    description: 'Hole das Profilbild oder Banner von jedem Benutzer.',
    options: [
        {
            name: 'user',
            description: 'Erhalte das Avatar eines Benutzers.',
            type: ApplicationCommandOptionType.Mentionable,
            required: false,
        },
    ],

    callback: async (client, interaction) => {
        const usermention = interaction.options.getUser('user') || interaction.user;
        const avatar = usermention.displayAvatarURL({ size: 1024, format: "png" });
        const banner = await (await client.users.fetch(usermention.id, { force: true })).bannerURL({ size: 4096 });
        await interaction.channel.sendTyping();
        const cmp = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel(`Avatar`)
                    .setCustomId(`avatar`)
                    .setDisabled(false)
                    .setStyle(ButtonStyle.Secondary),

                new ButtonBuilder()
                    .setLabel(`Banner`)
                    .setCustomId(`banner`)
                    .setStyle(ButtonStyle.Secondary),
            )

        const cmp2 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel(`Avatar`)
                    .setCustomId(`avatar`)
                    .setStyle(ButtonStyle.Secondary),

                new ButtonBuilder()
                    .setLabel(`Banner`)
                    .setCustomId(`banner`)
                    .setDisabled(false)
                    .setStyle(ButtonStyle.Secondary),
            )

        const cmp3 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel(`Avatar`)
                    .setCustomId(`avatar`)
                    .setDisabled(false)
                    .setStyle(ButtonStyle.Secondary),
            )

        const embed = new EmbedBuilder()
            .setColor('Red') // ändere dies auf deine Farbe.
            .setAuthor({ name: `${usermention.tag}, Avatar`, iconURL: `${usermention.displayAvatarURL()}` })
            .setTitle(`Download`)
            .setURL(avatar)
            .setImage(avatar)
            .setFooter({ text: '© RG System' })
            .setTimestamp();   

        const embed2 = new EmbedBuilder()
            .setColor('Red') // mache dasselbe hier.
            .setAuthor({ name: `${usermention.tag}, Banner`, iconURL: `${usermention.displayAvatarURL()}` })
            .setTitle(`Download`)
            .setURL(banner)
            .setImage(banner)
            .setFooter({ text: '© RG System' })
            .setTimestamp();   

        if (!banner) {
            // Überprüfen, ob der Benutzer keinen Banner hat, dann wird nur das Profilbild gesendet.
            const message2 = await interaction.reply({ embeds: [embed], components: [cmp3] });
            const collector = await message2.createMessageComponentCollector();
            collector.on(`collect`, async c => {
                if (c.customId === 'delete') {
                    if (c.user.id !== interaction.user.id) {
                        return await c.reply({ content: `${error} Nur ${interaction.user.tag} kann mit den Buttons interagieren!`, ephemeral: true })
                    }
                    interaction.deleteReply();
                }
            })
            return;
        }

        // Embed mit beiden Profilbildern, Banner und Avatar senden.
        const message = await interaction.reply({ embeds: [embed], components: [cmp] });
        const collector = await message.createMessageComponentCollector();

        collector.on(`collect`, async c => {
            if (c.customId === 'avatar') {
                if (c.user.id !== interaction.user.id) {
                    return await c.reply({ content: `${error} Nur ${interaction.user.tag} kann mit den Buttons interagieren!`, ephemeral: true })
                }
                await c.update({ embeds: [embed], components: [cmp] })
            }

            if (c.customId === 'banner') {
                if (c.user.id !== interaction.user.id) {
                    return await c.reply({ content: `${error} Nur ${interaction.user.tag} kann mit den Buttons interagieren!`, ephemeral: true })
                }
                await c.update({ embeds: [embed2], components: [cmp2] })
            }

            if (c.customId === 'delete') {
                if (c.user.id !== interaction.user.id) {
                    return await c.reply({ content: `${error} Nur ${interaction.user.tag} kann mit den Buttons interagieren!`, ephemeral: true })
                }
                interaction.deleteReply();
            }
        })
    }
};
