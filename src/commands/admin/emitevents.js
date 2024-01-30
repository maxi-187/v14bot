const {
  EmbedBuilder,
  ApplicationCommandOptionType,
  PermissionFlagsBits,
} = require("discord.js");

module.exports = {
  name: "emit-event",
  description: "Trigger ein Event.",
  options: [
    {
      name: "event",
      description: "Welches Event möchtest du triggern?",
      type: ApplicationCommandOptionType.String,
      required: true,
      choices: [
        {
          name: "boostSubscriptionAdd",
          value: "boostSubscriptionAdd",
        },
      ],
    },
  ],
  permissionsRequired: [PermissionFlagsBits.Administrator],
  botPermissions: [PermissionFlagsBits.ManageRoles],
  callback: async (client, interaction) => {
    const { member, options } = interaction;

    const event = options.getString("event");

    switch (event) {
      case "boostSubscriptionAdd":
        client.emit("boostSubscriptionAdd", member, member);
        break;
      default:
        interaction.reply({ content: ".", ephemeral: true });
        break;
    }

    interaction.reply({
      content: `Event ausgelöst \`${event}\``,
      ephemeral: true,
    });
  },
};
