const { EmbedBuilder } = require("discord.js");
const Config = require("../../models/maintenance");

module.exports = {
  name: "wartung",
  description: "Setzt den Bot in Wartungsmodus",
  devOnly: true,
  callback: async (client, interaction) => {
    if (!interaction.inGuild()) {
      interaction.reply({
        content: "Du kannst den Befehl nur auf dem Server ausführen.",
        ephemeral: true,
      });
      return;
    }

    try {
      let config = await Config.findOne();

      if (!config) {
        config = new Config();
      }

      config.maintenanceMode = !config.maintenanceMode;
      await config.save();

      const maintenanceEmbed = new EmbedBuilder()
        .setTitle("Wartungsmodus")
        .setDescription(
          `Der Bot befindet sich ${
            config.maintenanceMode ? "im" : "nicht mehr im"
          } Wartungsmodus.`
        )
        .setColor("Red");

      interaction.reply({ embeds: [maintenanceEmbed], ephemeral: true });
    } catch (error) {
      console.error("Fehler beim Maintrance Mode:", error);
      interaction.reply({
        content: "Ein Fehler ist aufgetreten.",
        ephemeral: true,
      });
    }
  },
};
