const {
  EmbedBuilder,
  ApplicationCommandOptionType,
  PermissionFlagsBits,
} = require("discord.js");
const AutoMod = require("../../models/AutoMod");

async function getUserWarns(memberId) {
  try {
    const userWarnings = await AutoMod.findOne({ memberId });
    return userWarnings ? userWarnings.warnings : 0;
  } catch (error) {
    console.error("Fehler beim Abrufen der Warnungen des Benutzers:", error);
    throw error;
  }
}

module.exports = {
  name: "warns",
  description: "Zeigt wie viele Warns ein Benutzer hat",
  options: [
    {
      name: "benutzer",
      description: "Von wem möchtest du dir die Warns anzeigen lassen?",
      type: ApplicationCommandOptionType.Mentionable,
      required: true,
    },
  ],
  permissionsRequired: [PermissionFlagsBits.ManageMessages],
  botPermissions: [PermissionFlagsBits.SendMessages],
  callback: async (client, interaction) => {
    const targetUserId = interaction.options.get("benutzer").value;

    try {
      const maxWarnings = 3;
      const userWarns = await getUserWarns(targetUserId);

      const embed = new EmbedBuilder()
        .setColor("Red")
        .setTitle("Auto Mod")
        .setDescription(`Warns von <@${targetUserId}>`)
        .addFields({
          name: "Warns",
          value: `${userWarns}/${maxWarnings}`,
          inline: true,
        })
        .setFooter({ text: "© RG System" })
        .setTimestamp();

      try {
        await interaction.reply({ embeds: [embed], ephemeral: true });
      } catch (error) {
        if (error.code === 10062) {
          console.warn("Interaktion bereits gelöscht oder nicht zugänglich.");
        } else {
          throw error;
        }
      }
    } catch (error) {
      console.error(error);
      interaction.reply(
        "Beim Abrufen der Warnungen des Benutzers ist ein Fehler aufgetreten."
      );
    }
  },
};
