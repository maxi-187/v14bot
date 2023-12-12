const { PermissionFlagsBits, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, EmbedBuilder, InteractionCollector, ApplicationCommandOptionType } = require("discord.js");

module.exports = {
    name: 'protokoll',
    description: 'Erstellt ein Ban Protokoll',
    options: [],

    callback: async (client, interaction) => {
    try {
    let channel = interaction.channel; 

    let protokollModal = new ModalBuilder()
      .setCustomId("protokoll")
      .setTitle("Schreibe dein Ban Protokoll");

    let steamid = new TextInputBuilder()
      .setCustomId("steam")
      .setLabel("Seine Steam-ID")
      .setPlaceholder("Steam-ID...")
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    let banid = new TextInputBuilder()
      .setCustomId('ban')
      .setLabel("Seine Ban-ID")
      .setPlaceholder("Ban-ID...")
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    let grundid = new TextInputBuilder()
      .setCustomId('grund')
      .setLabel("Grund für den Ban")
      .setPlaceholder("Grund...")
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    let dauerid = new TextInputBuilder()
      .setCustomId('dauer')
      .setLabel("Wie lange wurde der User gebannt?")
      .setPlaceholder("Dauer...")
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    let beweisid = new TextInputBuilder()
      .setCustomId('beweis')
      .setLabel("Füge dein Beweis hinzu (streamable.com)")
      .setPlaceholder("Beweis...")
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    let steamActionRow = new ActionRowBuilder().addComponents(steamid);
    let banActionRow = new ActionRowBuilder().addComponents(banid);
    let grundActionRow = new ActionRowBuilder().addComponents(grundid);
    let dauerActionRow = new ActionRowBuilder().addComponents(dauerid);
    let beweisActionRow = new ActionRowBuilder().addComponents(beweisid);

    protokollModal.addComponents(steamActionRow, banActionRow, grundActionRow, dauerActionRow, beweisActionRow);

    await interaction.showModal(protokollModal);
     } catch (error) {
      console.error(error);
      return;
     }
    },
};
