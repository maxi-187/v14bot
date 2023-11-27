const { PermissionFlagsBits, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, EmbedBuilder, InteractionCollector, ApplicationCommandOptionType } = require("discord.js");

module.exports = {
  name: 'sagen',
  description: 'Sagt etwas über den Bot',
  options: [
    {
      name: 'channel',
      description: 'Der Kanal, in dem du die Nachricht senden möchtest',
      type: ApplicationCommandOptionType.Channel,
      required: true,
    },
  ],
  permissionsRequired: [PermissionFlagsBits.ModerateMembers],
  botPermissions: [PermissionFlagsBits.ModerateMembers],

  callback: async (client, interaction) => {
    let channel = interaction.channel; // Get the selected channel directly

    let sagenModal = new ModalBuilder()
      .setCustomId("sagen")
      .setTitle("Sage etwas über den Bot");

    let sagenFrage = new TextInputBuilder()
      .setCustomId("text")
      .setLabel("Sage etwas")
      .setPlaceholder("Tippe etwas...")
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true);

    let sagenEmbed = new TextInputBuilder()
      .setCustomId('embed')
      .setLabel("Embed-Modus ein/aus?")
      .setPlaceholder("ein/aus")
      .setStyle(TextInputStyle.Short)
      .setRequired(false);

    let sagenActionRow = new ActionRowBuilder().addComponents(sagenFrage);
    let sagenEmbedActionRow = new ActionRowBuilder().addComponents(sagenEmbed);

    sagenModal.addComponents(sagenActionRow, sagenEmbedActionRow);

    console.log("1. Vor der Interaktionsmodal-Anzeige");
    await interaction.showModal(sagenModal);
    console.log("2. Nach der Interaktionsmodal-Anzeige")

    try {
      const collector = new InteractionCollector(interaction.client, { componentType: 'BUTTON', time: 300000 });

      collector.on('collect', async (buttonInteraction) => {
        if (buttonInteraction.user.id === interaction.user.id && buttonInteraction.customId === 'text') {
          let response = await buttonInteraction.reply({ content: 'Button clicked!', ephemeral: true });
          let nachricht = buttonInteraction.values[0];
          let embedSagen = buttonInteraction.values[1];


          const embed = new EmbedBuilder()
              .setDescription(nachricht)
              .setColor('Blue');


          if (embedSagen === "ein" || embedSagen === "Ein") {
            await channel.send({ embeds: [embed] });
          } else {
            await channel.send(nachricht);
          }
          await response.reply({ content: "Deine Nachricht wurde erfolgreich gesendet", ephemeral: true });
        }
      });

      collector.on('end', (collected, reason) => {
        if (reason === 'time') {
          interaction.followUp({ content: 'Collector timed out.', ephemeral: true });
        }
      });
      
      console.log("3. Vor dem Ende des Collectors");
      await collector.end;
      console.log("4. Nach dem Ende des Collectors");
    } catch (error) {
      console.error(error);
      return;
    }
  }
};