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
    {
      name: 'grund',
      description: 'The reason why you unbann',
      type: ApplicationCommandOptionType.String,
      require: false,
    },
  ],
  permissionsRequired: [PermissionFlagsBits.BanMembers],
  botPermissions: [PermissionFlagsBits.BanMembers],

  callback: async (client, interaction) => {
    const targetUserId = interaction.options.getString('userid');
    const reason = interaction.options.getString('reason') || 'Kein Grund!';

    try {
      await interaction.guild.members.unban(targetUserId, reason);
      await interaction.reply(
        ` <@${targetUserId}> unbanned!\nreason: ${reason}`
      );
    } catch (error) {
      console.log(`Error when unbann ${error}`);
      await interaction.reply('Error when unbann');
    }
  },
};