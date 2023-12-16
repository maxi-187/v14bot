const {
  EmbedBuilder,
  ApplicationCommandOptionType,
  PermissionFlagsBits,
} = require("discord.js");
const Level = require("../../models/Level");

module.exports = {
  name: "leaderboard",
  description: "Zeigt das Leaderboard",
  options: [],
  callback: async (client, interaction) => {
    if (!interaction.inGuild()) {
      interaction.reply("Du kannst den Befehl nur auf dem Server ausführen.");
      return;
    }

    const leaderboardData = await Level.find({}).sort({ level: -1 }).limit(10);

    const botAvatarUrl = client.user.displayAvatarURL({
      dynamic: true,
      size: 64,
    });

    const embed = new EmbedBuilder()
      .setAuthor({ name: "Level Leaderboard", iconURL: botAvatarUrl }) // Hier wird die botAvatarUrl verwendet
      .setColor("Red")
      .setFooter({ text: " © RG System" })
      .setTimestamp();

    const ranksField = {
      name: "Ränge",
      value: "🥇\n🥈\n🥉\n➖\n➖\n➖\n➖\n➖\n➖\n➖",
      inline: true,
    };
    const usersField = { name: "Benutzer", value: "", inline: true };
    const scoresField = { name: "Level", value: "", inline: true };

    for (const userData of leaderboardData) {
      const user = `<@${userData.userId}>`;
      const userObj = await client.users.fetch(userData.userId);
      const avatarUrl = userObj.displayAvatarURL({ dynamic: true, size: 128 });

      usersField.value += `${user}\n`;
      scoresField.value += `**LVL ${userData.level}** \n`;

      if (leaderboardData.indexOf(userData) === 0) {
        embed.setThumbnail(avatarUrl);
      }
    }

    embed.addFields(ranksField, usersField, scoresField);

    interaction.reply({ embeds: [embed.toJSON()] });
  },
};
