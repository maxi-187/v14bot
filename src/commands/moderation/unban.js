const { ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');

module.exports = {
  name: 'unban',
  description: 'Unbann an user',
  options: [
    {
      name: 'userid',
      description: 'The user ID who you want unbann',
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  permissionsRequired: [PermissionFlagsBits.BanMembers],
  botPermissions: [PermissionFlagsBits.BanMembers],

  callback: async (client, interaction) => {
    const targetUserId = interaction.options.getString('userid');

    try {
      await interaction.guild.members.unban(targetUserId);
      await interaction.reply(
        ` <@${targetUserId}> entbannt!`
      );
    } catch (error) {
      console.log(`Fehler beim entbannen: ${error}`);
      await interaction.reply(`**Fehler beim entbannen: ${error}**`);
    }
  },
};