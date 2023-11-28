const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle, Collector, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'help',
    description: 'Zeigt eine Liste der Befehle und Informationen über den Bot',

    callback: async (client, interaction) => {
        const hilfemenü = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId("menu")
                    .setPlaceholder("Wähle ein Thema")
                    .addOptions(
                        {
                            label: "Öffentliche Befehle",
                            description: "Zeigt alle öffentlichen Befehle",
                            value: "menu1"
                        },

                        {
                            label: "Economy",
                            description: "Zeigt alle Economybefehle",
                            value: "menu2"
                        },

                        {
                            label: "Moderationsbefehle",
                            description: "Zeigt alle Moderationsbefehle",
                            value: "menu3"
                        },

                        {
                            label: "Adminbefehle",
                            description: "Zeigt alle Adminbefehle",
                            value: "menu4"
                        },
                    ),
            );

        const allgemeinebefehle = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("back")
                    .setLabel("Zurück")
                    .setStyle(ButtonStyle.Primary)
            )


        const einbettung = new EmbedBuilder()
            .setColor("Blue")
            .setDescription("RG | System ist ein Bot mit allgemeinen Befehlen, Economy Befehlen, Moderationsbefehlen")
            .setTimestamp()
            .setFooter({ text: '© RG System' })

        const öffentlichem = new EmbedBuilder()
            .setColor("Green")
            .setDescription("`/hilfe`: Zeigt das Hilfemenü\n`/avatar`: Zeigt den Avatar\n")
            .setTimestamp()
            .setFooter({ text: '© RG System' })

        const ecom = new EmbedBuilder()
            .setColor("Purple")
            .setDescription("`/level`: Zeigt dein Aktuelles Level!")
            .setTimestamp()
            .setFooter({ text: '© RG System' })
        
        const modem = new EmbedBuilder()
            .setColor("Red")
            .setDescription("`/ban`: Sperrt einen Benutzer\n`/unban`: Entsperrt einen Benutzer\n")
            .setTimestamp()
            .setFooter({ text: '© RG System' })

        const am = new EmbedBuilder()
            .setColor("Red")
            .setDescription("`/autorole-an`: Setup für die Auto-Role\n`/autorole-aus`: Schaltet das autorole System aus\n`/createverify`: Erstellt das Verify Embed\n`/invite`: Lädt ein User ins Team ein.\n`/nuke`: Löscht und Erstellt den Channel neu\n`/sagen`: Sagt etwas über den Bot")
            .setTimestamp()
            .setFooter({ text: '© RG System' })

        const nachricht = await interaction.reply({ embeds: [einbettung], components: [hilfemenü], ephemeral: true })

        const collect = await nachricht.createMessageComponentCollector();

        collect.on('collect', async (i) => {
            if (i.customId === 'menu') {
                const value = i.values[0];
                if (i.user.id !== interaction.user.id) {
                    return await i.reply({ content: `Nur ${interaction.user.tag} kann mit dem Auswahlmenü interagieren!`, ephemeral: true })
                }
                if (value === "menu1") {
                    await i.update({ embeds: [öffentlichem], components: [hilfemenü] })
                }

                if (value === "menu2") {
                    await i.update({ embeds: [ecom], components: [hilfemenü] })
                }

                if (value === "menu3" && i.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
                    await i.update({ embeds: [modem], components: [hilfemenü] });
                } else if (value === "menu3") {
                    await i.reply({ embeds: [new EmbedBuilder().setDescription('Du hast keine Rechte Dir das anzeigen zu lassen!').setColor('Red').setFooter({ text: '© RG System' }).setTimestamp(),
                ],
                ephemeral: true, 
                });
                }

                if (value === "menu4" && i.member.permissions.has(PermissionFlagsBits.BanMembers)) {
                    await i.update({ embeds: [am], components: [hilfemenü] });
                } else if (value === "menu4") {
                    await i.reply({ embeds: [new EmbedBuilder().setDescription('Du hast keine Rechte Dir das anzeigen zu lassen!').setColor('Red').setFooter({ text: '© RG System' }).setTimestamp(),
                ],
                ephemeral: true, 
                });
                }

            }

            if (i.customId === "economy") {
                if (i.user.id !== interaction.user.id) {
                    return await i.reply({ content: `Nur ${interaction.user.tag} kann mit den Schaltflächen interagieren!`, ephemeral: true })
                }
                await i.update({ embeds: [ecom], components: [hilfemenü, allgemeinebefehle] })
            }

            if (i.customId === "back") {
                if (i.user.id !== interaction.user.id) {
                    return await i.reply({ content: `Nur ${interaction.user.tag} kann mit den Schaltflächen interagieren!`, ephemeral: true })
                }
                await i.update({ embeds: [öffentlichem], components: [hilfemenü] })
            }
        });
    }
}