const {
  EmbedBuilder,
  ApplicationCommandOptionType,
  PermissionFlagsBits,
} = require("discord.js");

module.exports = {
  name: "invite",
  description: "Lädt ein User ins Team ein.",
  options: [
    {
      name: "benutzer",
      description: "Welchen User möchtest ins Team einladen?",
      type: ApplicationCommandOptionType.Mentionable,
      required: true,
    },
  ],
  permissionsRequired: [PermissionFlagsBits.ManageRoles],
  botPermissions: [PermissionFlagsBits.ManageRoles],
  callback: async (client, interaction) => {
    const role = interaction.guild.roles.cache.get("1169715609878138997"); // Staff
    const role1 = interaction.guild.roles.cache.get("1169715609878138995"); // Serverteam
    let benutzer = interaction.options.get("benutzer").member;

    if (!benutzer) {
      await interaction.reply({
        content: "Bitte ping den User!",
        ephemeral: true,
      });
      return;
    }
    await benutzer.roles.add(role);
    await benutzer.roles.add(role1);
    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setDescription(`Erfolgreich ${benutzer} ins Team eingeladen!`)
          .setColor("Red")
          .setFooter({ text: "© RG System" })
          .setTimestamp(),
      ],
      ephemeral: true,
    });

    client.guilds.cache
      .get("1169715609446141974")
      .channels.cache.get("1179175845487706112")
      .send({
        embeds: [
          new EmbedBuilder()
            .setTitle(`**Team System**`)
            .setDescription(
              `<@${interaction.user.id}> Hat Erfolgreich den User ${benutzer} in das Team eingeladen!`
            )
            .setColor(`#ED4245`)
            .setFooter({ text: "© RG System" })
            .setTimestamp(),
        ],
      });
  },
};
