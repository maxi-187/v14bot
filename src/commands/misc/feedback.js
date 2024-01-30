const { ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "feedback",
  description: "Schreibt ein Feedback in den Channel",
  options: [
    {
      name: "benutzer",
      description: "Ping das Teammitglied",
      type: ApplicationCommandOptionType.Mentionable,
      required: true,
    },
    {
      name: "feedback",
      description: "Schreib dein Feedback",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],

  callback: async (client, interaction) => {
    const targetUserId = interaction.options.get("benutzer").value;
    const feedbackValue = interaction.options.getString("feedback");
    const targetUser = await interaction.guild.members.fetch(targetUserId);

    if (targetUser.user.id === interaction.user.id) {
      await interaction.reply("Du kannst dich nicht selbst pingen!");
      return;
    }
    if (!targetUser) {
      await interaction.reply("Dieser Benutzer existiert nicht!");
      return;
    }

    if (!targetUserId) {
      await interaction.reply({
        content: "Bitte ping das Teammitglied!",
        ephemeral: true,
      });
      return;
    }

    if (!feedbackValue) {
      await interaction.reply({
        content: "Bitte gebe dein Feedback an!",
        ephemeral: true,
      });
      return;
    }

    const serverRole = interaction.guild.roles.cache.get("1169715609878138995");
    if (!serverRole || !targetUser.roles.cache.has(serverRole.id)) {
      await interaction.reply({
        content: `Du kannst nur Mitglieder mit der ${serverRole} Rolle pingen!`,
        ephemeral: true,
      });
      return;
    }

    const embed = new EmbedBuilder()
      .setTitle(`**Neues Feedback!**`)
      .setDescription(
        `<@${interaction.user.id}> **Schreibt Feedback über ${targetUser}**\n\n__**Feedback**__:\n${feedbackValue}`
      )
      .setColor("#ED4245")
      .setFooter({ text: "© RG System" })
      .setTimestamp(Date.now());

    const guild = client.guilds.cache.get("1169715609446141974");
    const channel = guild.channels.cache.get("1174084330612600832");

    if (channel) {
      await guild.channels.cache.get(channel.id).send({ embeds: [embed] });
    } else {
      console.error("Channel nicht gefunden!");
    }

    return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setDescription("Erfolgreich dein Feedback abgeschickt!")
          .setColor("#57F287")
          .setFooter({ text: "© RG System" })
          .setTimestamp(),
      ],
      ephemeral: true,
    });
  },
};
