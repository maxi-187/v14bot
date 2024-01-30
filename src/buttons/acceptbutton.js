const aufnahmepflicht = require("../commands/team/aufnahmepflicht");

module.exports = {
  customId: "acceptButton",
  permissionsRequired: [],
  botPermissions: [],
  handleButtonInteraction: async (interaction) => {
    if (interaction.customId === "acceptButton") {
      await aufnahmepflicht.handleButtonInteraction(
        interaction,
        (error, result) => {
          if (error) {
            console.error(error);
            return interaction.reply({
              content:
                "Es ist ein Fehler aufgetreten. Bitte versuche es später erneut.",
              ephemeral: true,
            });
          }

          const member = interaction.guild.members.cache.get(
            interaction.user.id
          );
          const role = interaction.guild.roles.cache.get("1169715609446141980");
          member.roles.add(role);

          interaction.reply({
            content: `Du hast die Aufnahmepflicht akzeptiert! Die Rolle wurde hinzugefügt.`,
          });
        }
      );
    }
  },
};
