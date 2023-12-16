const {
  EmbedBuilder,
  ApplicationCommandOptionType,
  PermissionFlagsBits,
} = require("discord.js");

module.exports = {
  name: "nuke",
  description: "Löscht einen Channel und erstellt ihn wieder",
  options: [
    {
      name: "channel",
      description: "Welche Channel möchtest du Nuken?",
      type: ApplicationCommandOptionType.Channel,
      required: false,
    },
  ],
  permissionsRequired: [PermissionFlagsBits.ManageChannels],
  botPermissions: [PermissionFlagsBits.ManageChannels],
  callback: async (client, interaction) => {
    try {
      let channel = interaction.options.getChannel("channel");

      if (!channel) {
        channel = interaction.channel;
      }

      await channel.delete();

      const recreatedChannel = await channel.clone();

      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription("Erfolgreich den Channel gelöscht!")
            .setColor("Green")
            .setFooter({ text: "© RG System" })
            .setTimestamp(),
        ],
        ephemeral: true,
      });
    } catch (error) {
      console.log(error);
      await interaction.followUp({
        embeds: [
          new EmbedBuilder()
            .setDescription(`Es ist ein Fehler aufgetreten!`)
            .setColor("Red")
            .setFooter({ text: "© RG System" })
            .setTimestamp(),
        ],
        ephemeral: true,
      });
    }
  },
};
