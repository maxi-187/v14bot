const {
  EmbedBuilder,
  ApplicationCommandOptionType,
  PermissionFlagsBits,
} = require("discord.js");
const AutoMod = require("../../models/AutoMod");
const WarnHistory = require("../../models/WarnHistory");

module.exports = {
  name: "warn",
  description: "Gebe einem Benutzer eine Verwarnung",
  options: [
    {
      name: "benutzer",
      description: "Benutzer",
      type: ApplicationCommandOptionType.Mentionable,
      required: true,
    },
    {
      name: "grund",
      description: "Für was möchtest du den Benutzer verwarnen",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  permissionsRequired: [PermissionFlagsBits.ManageMessages],
  botPermissions: [PermissionFlagsBits.ManageMessages],
  callback: async (client, interaction) => {
    if (!interaction.inGuild()) {
      interaction.reply({
        content: "Du kannst den Befehl nur auf dem Server ausführen.",
        ephemeral: true,
      });
      return;
    }

    const targetUser = interaction.options.getUser("benutzer");
    const reason = interaction.options.getString("grund");
    const moderator = interaction.user;

    if (!targetUser) {
      interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription(`Ungültiger Benutzer.`)
            .setColor("Red")
            .setFooter({ text: "© RG System" })
            .setTimestamp(),
        ],
        ephemeral: true,
      });
      return;
    }

    if (!reason) {
      interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription(`Du musst einen Grund angeben!`)
            .setColor("Red")
            .setFooter({ text: "© RG System" })
            .setTimestamp(),
        ],
        ephemeral: true,
      });
      return;
    }

    try {
      const newWarning = {
        reason: reason,
        moderatorId: moderator.id,
        timestamp: new Date(),
      };

      // Update AutoMod model with the new warning
      await AutoMod.updateOne(
        { guildId: interaction.guild.id, memberId: targetUser.id },
        { $push: { warnings: newWarning } },
        { upsert: true }
      );

      // Update WarnHistory model with the new warning
      const warnHistoryEntry = await WarnHistory.findOneAndUpdate(
        { guildId: interaction.guild.id, memberId: targetUser.id },
        { $push: { warnings: newWarning } },
        { upsert: true, new: true }
      );

      interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription(
              `Erfolgreich <@${targetUser.id}> verwarnt.\nGrund: ${reason}`
            )
            .setColor("#57F287")
            .setFooter({ text: "© RG System" })
            .setTimestamp(),
        ],
        ephemeral: true,
      });
    } catch (error) {
      console.error(error);
      interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription(`Ein Fehler ist aufgetreten.`)
            .setColor("Red")
            .setFooter({ text: "© RG System" })
            .setTimestamp(),
        ],
        ephemeral: true,
      });
    }
  },
};
