const { PermissionFlagsBits, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, EmbedBuilder, InteractionCollector, ApplicationCommandOptionType } = require("discord.js");

module.exports = {
  name: 'sagen',
  description: 'Sagt etwas über den Bot',
  options: [
    {
      name: 'channel',
      description: 'Der Kanal, in dem du die Nachricht senden möchtest',
      type: ApplicationCommandOptionType.Channel,
      required: false,
    },
  ],
  permissionsRequired: [PermissionFlagsBits.ModerateMembers],
  botPermissions: [PermissionFlagsBits.ModerateMembers],

  callback: async (client, interaction) => {
    let channel = interaction.channel; 

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
      .setRequired(true);

    let sagenActionRow = new ActionRowBuilder().addComponents(sagenFrage);
    let sagenEmbedActionRow = new ActionRowBuilder().addComponents(sagenEmbed);

    sagenModal.addComponents(sagenActionRow, sagenEmbedActionRow);

    await interaction.showModal(sagenModal);
  }
};
