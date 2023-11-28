const { ButtonBuilder } = require("@discordjs/builders");
const { PermissionFlagsBits, ActionRowBuilder, EmbedBuilder, ApplicationCommandOptionType, ButtonStyle } = require("discord.js");
const Verify = require("../../models/Verify");

module.exports = {
  name: 'createverify',
  description: 'Verify System',
  options: [
    {
      name: 'channel',
      description: 'Der Kanal, in dem du die Nachricht senden möchtest',
      type: ApplicationCommandOptionType.Channel,
      required: true,
    },
  ],
  permissionsRequired: [PermissionFlagsBits.ModerateMembers],
  botPermissions: [PermissionFlagsBits.ModerateMembers],

  callback: async (client, interaction) => {
    try {
      const { guild } = interaction;
      const channel = interaction.options.getChannel('channel');

      const verifyEmbed = new EmbedBuilder()
        .setTitle('Verifizierung')
        .setDescription('Klicke auf den Button, um dich zu verifizieren!')
        .setColor('Red')
        .setFooter({ text: '© RG System' });

      const savedVerify = await Verify.create({
        GuildID: guild.id,
        ChannelID: channel.id,
      });

      const sendChannel = await channel.send({
        embeds: [verifyEmbed],
        components: [
          new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('verify').setLabel('Verify').setStyle(ButtonStyle.Success)
          ),
        ],
      });

      savedVerify.MessageID = sendChannel.id;
      await savedVerify.save();

      if (!sendChannel) {
        return interaction.reply({ content: 'Es ist ein Fehler passiert!', ephemeral: true });
      } else {
        return interaction.reply({ content: 'Verifizierung Embed erfolgreich!', ephemeral: true });
      }
    } catch (error) {
      console.error(error);
      return interaction.reply({ content: 'Ein Fehler ist aufgetreten!', ephemeral: true });
    }
  },
};
