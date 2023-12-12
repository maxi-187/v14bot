const { EmbedBuilder } = require("discord.js");

module.exports = {
  customId: "protokoll",
  permissionsRequired: [],
  botPermissions: [],

  callback: async (client, interaction) => {
    let channel = interaction.channel;
    try {
      let steamValue = interaction.fields.getTextInputValue("steam");
      let banIdValue = interaction.fields.getTextInputValue('ban');
      let grundValue = interaction.fields.getTextInputValue('grund');
      let dauerValue = interaction.fields.getTextInputValue('dauer');
      let beweisValue = interaction.fields.getTextInputValue('beweis');

      if (interaction.guild) {
            const guild = interaction.guild;
            const channel = guild.channels.cache.get('1180267948305285190');

            if (channel) {
                const embed = new EmbedBuilder()
                    .setTitle(`:warning: Ban Protokoll :warning:`)
                    .setColor('Red')
                    .addFields(
                        { name: 'Steam-ID', value: steamValue, inline: true },
                        { name: 'Ban-ID', value: banIdValue, inline: true },
                        { name: ' ', value: ' ', inline: false },
                        { name: 'Grund', value: grundValue, inline: true },
                        { name: 'Dauer', value: dauerValue, inline: true },
                        { name: 'Beweis', value: beweisValue, inline: false },
                        { name: ' ', value: ' ', inline: false },
                    )
                    .setFooter({ text: ' © RG System' })
                    .setTimestamp();

                await channel.send({
                    content: `<@${interaction.user.id}>`,
                    embeds: [embed],
                });
            } else {
                console.error("Channel nicht gefunden!");
            }

            return interaction.reply({
                embeds: [new EmbedBuilder()
                    .setDescription('Erfolgreich dein Protokoll abgeschickt!')
                    .setColor('#57F287')
                    .setFooter({ text: '© RG System' })
                    .setTimestamp(),
                ],
                ephemeral: true,
            });
        }
    } catch {
        return;
    }
  }
};