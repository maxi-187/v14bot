const {
  ApplicationCommandOptionType,
  PermissionFlagsBits,
} = require("discord.js");
const WarnHistory = require("../../models/WarnHistory");

module.exports = {
  name: "clearhistory",
  description: "Löscht die Warn History",
  options: [
    {
      name: "benutzer",
      description: "Von wem möchtest du die History löschen?",
      type: ApplicationCommandOptionType.Mentionable,
      required: true,
    },
  ],
  permissionsRequired: [PermissionFlagsBits.ManageRoles],
  botPermissions: [PermissionFlagsBits.ManageRoles],
  callback: async (client, interaction) => {
    const targetUserId = interaction.options.get("benutzer").value;
    const guildId = interaction.guild.id;

    if (!interaction.inGuild()) {
      interaction.reply("Du kannst den Befehl nur auf dem Server ausführen.");
      return;
    }

    try {
      const warnHistoryEntry = await WarnHistory.findOne({
        guildId,
        memberId: targetUserId,
      });

      if (warnHistoryEntry) {
        warnHistoryEntry.history = " ";
        warnHistoryEntry.Warnsins = "0";
        await warnHistoryEntry.save();
        interaction.reply("Die Warn-Historie wurde erfolgreich gelöscht.");
      } else {
        interaction.reply(
          "Es existiert keine Warn-Historie für diesen Benutzer."
        );
      }
    } catch (error) {
      console.error("Fehler beim Abrufen der Warn-Historie:", error);
      interaction.reply("Ein Fehler ist aufgetreten.");
    }
  },
};
