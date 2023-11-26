const { SlashCommandBuilder, StringSelectMenuBuilder, ActionRowBuilder, ComponentType, EmbedBuilder } = require("discord.js");

module.exports = {
    name: 'help',
    description: 'Gibt eine Liste der Befehle zurück',
  callback: async (client, interaction) => {

        // In diesem Emoji-Objekt stellen Sie sicher, dass alle Werte mit einem Großbuchstaben beginnen, also nicht 'example' oder 'EXAMPLE', sondern 'Beispiel', sonst funktioniert es nicht
        const emojis = {
            Public: '🌍',
            Wirtschaft: '💰',
            Ebenen: '🆙',
            Test: '🧪',
            Bot: '🤖'
        };

        const directories = [
            ...new Set(client.commands.map((cmd) => cmd.folder))
        ];

        const categories = directories.map((dir) => {
            const getCommands = client.commands.filter((cmd) => cmd.folder === dir).map((cmd) => {
                return {
                    name: cmd.data.name,
                    description: cmd.data.description || 'Keine Beschreibung für den Befehl ' + cmd.data.name
                };
            });

            return {
                directory: dir,
                commands: getCommands
            };
        });

        const embed = new EmbedBuilder()
            .setColor('Red')
            .setDescription(`🫧 | Wählen Sie eine Befehlskategorie über das folgende Menü aus`)
            .setAuthor({ name: interaction.user.username + ' | ' + interaction.user.id, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
            .setTimestamp();

        let array = [];
        let a = [...client.commands.values()].forEach(({ folder }) => {
            array.push(folder);
        });
        const array2 = Array.from(new Set(array));

        const component = (state) => [
            new ActionRowBuilder().addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('help-menu')
                    .setPlaceholder('Wählen Sie eine Kategorie...')
                    .setDisabled(state)
                    .addOptions(
                        array2.map((f) => {
                            return {
                                label: f,
                                value: f.toLowerCase(),
                                description: `Befehlskategorie: ${f}`,
                                emoji: emojis[f] ?? null
                            };
                        })
                    )
            )
        ];

        const initialMessage = await interaction.reply({
            embeds: [embed], components: component(false)
        });

        const filter = (interaction) => interaction.user.id === interaction.member.id;

        const collector = interaction.channel.createMessageComponentCollector({
            filter,
            componentType: ComponentType.StringSelect
        });

        collector.on('collect', async (interaction) => {
            const [directory] = interaction.values;
            const category = categories.find(
                (x) => x.directory.toLowerCase() === directory
            );

            const categoryEmbed = new EmbedBuilder()
                .setColor('Red')
                .setDescription(`🫧 | Liste der Befehle in der Kategorie ${directory}`)
                .setAuthor({ name: interaction.user.username + ' | ' + interaction.user.id, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                .setTimestamp()
                .addFields(
                    category.commands.map(({ name, description }) => {
                        return {
                            name: `\`/${name}\``,
                            value: `\`\`\`${description}\`\`\``,
                            inline: true
                        };
                    })
                );

            interaction.update({ embeds: [categoryEmbed] });
        });

        collector.on('end', () => {
            initialMessage.edit({ components: component(true) });
        });
    }
};