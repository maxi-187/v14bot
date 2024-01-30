const {
  PermissionFlagsBits,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder
} = require("discord.js");

module.exports = {
  name: "ticket",
  description: "Erstelle ein Ticket",
  options: [],

  callback: async (client, interaction) => {
    try {
      let channel = interaction.channel; // Direkt den ausgewählten Kanal erhalten

      let ticketModal = new ModalBuilder()
        .setCustomId("ticket")
        .setTitle("Ticket erstellen");

      let problemInput = new TextInputBuilder()
        .setCustomId("text")
        .setLabel("Problem")
        .setPlaceholder("Beschreibe dein Problem")
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true);

      let banIdInput = new TextInputBuilder()
        .setCustomId("banId")
        .setLabel("Ban-Id (Nur bei UNBAN)!")
        .setPlaceholder("Wie lautet deine Ban-ID?")
        .setStyle(TextInputStyle.Short)
        .setRequired(false);

      let categoryInput = new TextInputBuilder()
        .setCustomId("category")
        .setLabel("In welche Kategorie fällt dein Problem?")
        .setPlaceholder("allgemein/report/bewerbung/unban/booster")
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

      let problemActionRow = new ActionRowBuilder().addComponents(problemInput);
      let banIdActionRow = new ActionRowBuilder().addComponents(banIdInput);
      let categoryActionRow = new ActionRowBuilder().addComponents(
        categoryInput
      );

      ticketModal.addComponents(problemActionRow, banIdActionRow, categoryActionRow);
      await interaction.showModal(ticketModal);
    } catch (error) {
      console.error(error);
      return;
    }
  },
};
