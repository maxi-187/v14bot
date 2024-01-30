const {
  PermissionFlagsBits,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

module.exports = {
  name: "aufnahmepflicht",
  description: "Gibt einem User Aufnahmepflicht",
  permissionsRequired: [PermissionFlagsBits.ManageRoles],
  botPermissions: [PermissionFlagsBits.ManageRoles],
  callback: async (client, interaction) => {
    const aufnahmepflichtButtons = new ActionRowBuilder().setComponents(
      new ButtonBuilder()
        .setCustomId("acceptButton")
        .setLabel("Akzeptieren")
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId("declineButton")
        .setLabel("Ablehnen")
        .setStyle(ButtonStyle.Danger)
    );
    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setDescription(
            `Mit einer Permanenten Aufnahme Pflicht einverstanden?\n\nPermanente Aufnahmepflicht bedeutet:\n\n- Du hast die letzten 10 Minuten deines Gameplays vorzuweisen, wenn du von einem Teamler gekickt oder gebannt wirst.\n- Du hast dich umgehend im TS³ Support zu melden! (IP: rw-gangwar)\n- Du kannst deinen Clip nach 24 Stunden löschen, wenn keiner danach fragt.\n- Solltest du keinen Clip vorweisen können, egal welche Gründe es hat, wirst du permanent gebannt.\n\nHast du das verstanden und/oder noch weitere Fragen dazu?\nWenn du dem zustimmst, wirst du in den nächsten Minuten entbannt.`
          )
          .setColor("Red")
          .setFooter({ text: "© RG System" })
          .setTimestamp(),
      ],

      components: [aufnahmepflichtButtons],
    });
  },
};
