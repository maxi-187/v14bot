const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "ip",
  description: "ip zum Connecten",
  callback: async (client, interaction) => {
    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setDescription(
            "**Du kannst dich direkt hier verbinden:** https://cfx.re/join/5kz47z \n**Oder über die Server liste einfach „Reworked Gangwar“**"
          )
          .setColor("Green")
          .setFooter({ text: "© RG System" })
          .setTimestamp(),
      ],
      ephemeral: true,
    });
  },
};
