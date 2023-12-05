const { PermissionFlagsBits, EmbedBuilder, ApplicationCommandOptionType, Role } = require('discord.js');

module.exports = {
  name: 'lock',
  description: 'Sperrt ein Channel',
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
      .setTitle(":lock: Channel Gesperrt!")
      .setDescription(`Der Kanal wurde erfolgreich gesperrt.`)
      .setFooter({ text: '© RG System' })
      .setTimestamp();

    await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
      SendMessages: false,
    });

    await interaction.reply({
      embeds: [succesEmbed],
    });
  }
};
