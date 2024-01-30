const {
  Client,
  Interaction,
  ApplicationCommandOptionType,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */

  callback: async (client, interaction) => {
    const targetUserId = interaction.options.get("benutzer").value;
    const reason = interaction.options.get("grund")?.value || "Kein Grund!";

    const targetUser = await interaction.guild.members.fetch(targetUserId);

    if (!targetUser) {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription(`Diesen User gibt es Nicht!`)
            .setColor("Red")
            .setFooter({ text: "© RG System" })
            .setTimestamp(),
        ],
        ephemeral: true,
      });
      return;
    }

    if (targetUser.id === interaction.user.id) {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription(`Du kannst dich nicht selber Sperren!`)
            .setColor("Red")
            .setFooter({ text: "© RG System" })
            .setTimestamp(),
        ],
        ephemeral: true,
      });
      return;
    }

    if (targetUser.id === interaction.guild.ownerId) {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription(`Du kannst den Server Besitzer nicht Sperren!`)
            .setColor("Red")
            .setFooter({ text: "© RG System" })
            .setTimestamp(),
        ],
        ephemeral: true,
      });
      return;
    }

    const targetUserRolePosition = targetUser.roles.highest.position;
    const requestUserRolePosition = interaction.member.roles.highest.position;
    const botRolePosition = interaction.guild.members.me.roles.highest.position;

    if (targetUserRolePosition >= requestUserRolePosition) {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription(
              `Du kannst ${targetUser} nicht Sperren! Da er die gleiche Rolle hat oder über dir steh.`
            )
            .setColor("Red")
            .setFooter({ text: "© RG System" })
            .setTimestamp(),
        ],
        ephemeral: true,
      });
      return;
    }

    if (targetUserRolePosition >= botRolePosition) {
      await interaction.editReply;
      return;
    }

    try {
      await targetUser.ban({ reason });
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription(
              `Benutzer ${targetUser} wurde gesperrt!\nGrund: ${reason}`
            )
            .setColor("Red")
            .setFooter({ text: "© RG System" })
            .setTimestamp(),
        ],
        ephemeral: true,
      });
    } catch (error) {
      console.log(`Da ist ein Fehler beim Sperren: ${error}`);
    }
  },

  name: "ban",
  description: "Sperrt einen Benutzer vom Server.",
  options: [
    {
      name: "benutzer",
      description: "Den Benutzer den Du Sperren möchtest!",
      type: ApplicationCommandOptionType.Mentionable,
      required: true,
    },
    {
      name: "grund",
      description: "Wieso möchtest Du den Benutzer sperren?",
      type: ApplicationCommandOptionType.String,
    },
  ],
  permissionsRequired: [PermissionFlagsBits.BanMembers],
  botPermissions: [PermissionFlagsBits.BanMembers],
};

//  .setColor('Red')
//  .setFooter({ text: '© RG System' })
//  .setTimestamp()
//  .setDescription(config.ticketNoPermissions);
