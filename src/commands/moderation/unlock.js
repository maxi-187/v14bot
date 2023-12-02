const { PermissionFlagsBits, EmbedBuilder, ApplicationCommandOptionType, Role } = require('discord.js');

module.exports = {
  name: 'unlock',
  description: 'Entsperrt ein Channel',
  options: [
    {
      name: 'channel',
      description: 'Wähle ein Channel aus!',
      type: ApplicationCommandOptionType.Channel,
      required: true,
    },
  ],
  permissionsRequired: [PermissionFlagsBits.ManageChannels],
  botPermissions: [PermissionFlagsBits.ManageChannels],
  callback: async (client, interaction) => {
    const channel = interaction.options.getChannel("channel");
    const user = interaction.guild.roles.cache.get('1169715609861365800'); // User

    const succesEmbed = new EmbedBuilder()
      .setColor('Red')
      .setTitle(":lock: Channel Entsperrt!")
      .setDescription(`Der Kanal wurde erfolgreich entgesperrt.`)
      .setFooter({ text: '© RG System' })
      .setTimestamp();


    await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
      SendMessages: true,
    });

    await interaction.reply({
      embeds: [succesEmbed],
    });
  }
};
