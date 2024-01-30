const {
  EmbedBuilder,
  ApplicationCommandOptionType,
  PermissionFlagsBits,
} = require("discord.js");
const AutoMod = require("../../models/AutoMod");

async function getUserWarns(memberId) {
  try {
    const userWarnings = await AutoMod.findOne({ memberId });
    return userWarnings ? userWarnings.warnings : [];
  } catch (error) {
    console.error("Fehler beim Abrufen der Warnungen des Benutzers:", error);
    throw error;
  }
}

module.exports = {
  name: "warns",
  description: "Zeigt wie viele Warns ein Benutzer Akutell hat",
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
      const userWarns = await getUserWarns(targetUserId);

      if (!userWarns || userWarns.length === 0) {
        // Handle den Fall, wenn es keine Warnungen gibt
        const embedNoWarns = new EmbedBuilder()
          .setColor("Green")
          .setTitle("Auto Mod")
          .setDescription(`Keine Warnungen für <@${targetUserId}>`)
          .setFooter({ text: "© RG System" })
          .setTimestamp();

        return await interaction.reply({
          embeds: [embedNoWarns],
          ephemeral: true,
        });
      }

      const embed = new EmbedBuilder()
        .setColor("Red")
        .setTitle("Auto Mod")
        .setDescription(`Warns von <@${targetUserId}>`);

      const fields = userWarns.map((warn, index) => ({
        name: `Warn ${index + 1}`,
        value: `Grund: ${warn.reason}`,
        inline: false,
      }));

      embed.addFields(fields);

      embed.addFields({
        name: "Gesamtanzahl",
        value: userWarns.length.toString(),
        inline: true,
      });

      embed.setFooter({ text: "© RG System" }).setTimestamp();

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
