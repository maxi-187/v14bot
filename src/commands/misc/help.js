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
            .setDescription(" ")
            .setTimestamp()
            .setFooter({ text: '© RG System' })

        const öffentlichem = new EmbedBuilder()
            .setColor("Green")
            .setDescription("`/hilfe`: Zeigt das Hilfemenü\n`/ticket`: Erstelle ein Ticket, um dein Problem dem Team mitzuteilen.\n`/avatar`: Zeigt den Avatar / Oder von einem User\n`/bug`: Damit kannst du Bugs direkt ans Team melden!\n`/feedback`: Gib einem Teammitglied Feedback\n`/ip`: Hier erhältst du die IP vom Server oder ein Direct Link\n`/serverinfo`: Informationen über den Discord Server\n`/userinfo`: Informationen über dich oder einem anderen User\n`Es ist mehr in Arbeit!`\n")
            .setTimestamp()
            .setFooter({ text: '© RG System' })

        const ecom = new EmbedBuilder()
            .setColor("Purple")
            .setDescription("`/level`: Zeigt dein Aktuelles Level oder von einem anderen User!\n`/leaderboard`: Zeigt die Top 10 mit den Höchsten Leveln\n`Es ist mehr in Arbeit!`\n")
            .setTimestamp()
            .setFooter({ text: '© RG System' })
        
        const modem = new EmbedBuilder()
            .setColor("Red")
            .setDescription("`/ban`: Sperrt einen Benutzer\n`/unban`: Entsperrt einen Benutzer\n`/kick`: Kickt ein User vom Server\n`/timeout`: Timeoutet ein User\n`/clear`: Cleart ein Channel / Nachrichten vom bestimmten User\n`/lock`: Sperrt ein Channel\n`/unlock`: Entsperrt ein Channel\n`/slowmode`: Verringert die Geschwindigkeit, mit der Nachrichten gesendet werden können.\n`/protkoll`: Erstelle dein Ban Protokoll.\n`/warns`: Zeig den Warnstand von einem User.\n`/warnhistory`: Zeigt wo für der User alles schon einen Warn bekommen hat.\n`Es ist mehr in Arbeit!`\n")
            .setTimestamp()
            .setFooter({ text: '© RG System' })

        const am = new EmbedBuilder()
            .setColor("Red")
            .setDescription("`/autorole-an`: Setup für die Auto-Role\n`/autorole-aus`: Schaltet das autorole System aus\n`/createverify`: Erstellt das Verify Embed\n`/invite`: Lädt ein User ins Team ein.\n`/tkick`: Kickt ein Teammitglied aus dem Team\n`/adono`: Gibt einem User den Donator Rang\n`/nuke`: Löscht und erstellt den Channel neu\n`/sagen`: Sagt etwas über den Bot\n`/resetlvl`: Löscht alle level & xp und setzt alle auf 0!\n`/clearhistory`: Löscht die Warn History von einem User\n`/setlvl`: Gibt einem User ein bestimmes Level\n`/givelvl`: Gibt einem User Level oder XP\n`Es ist mehr in Arbeit!`\n")
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