const aufnahmepflicht = require("../commands/team/aufnahmepflicht");

module.exports = {
  customId: "declineButton",
  permissionsRequired: [],
  botPermissions: [],
  handleButtonInteraction: async (interaction, role) => {
    if (interaction.customId === "declineButton") {
      await interaction.reply({
        content: `Du hast die Aufnahmepflicht Abgelehnt! Du wirst nicht entbannt.`,
      });
    }
  },
};
