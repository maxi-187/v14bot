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
      const imageUrl = 'https://media.discordapp.net/attachments/1036746018601062402/1181709861659099276/Komp_1.gif?ex=65820c12&is=656f9712&hm=0f23be93d0625b297e6be7250b70bf7c226baf84fbffa0552352819ae222baba&=';
      const resizedImageUrl = `${imageUrl}?size=100`;

      const existingVerify = await Verify.findOne({
        GuildID: guild.id,
        ChannelID: channel.id,
      });

      if (existingVerify) {
        return interaction.reply({ content: 'Es existiert bereits ein Verify Embed für diesen Kanal!', ephemeral: true });
      }

      const verifyEmbed = new EmbedBuilder()
        .setTitle('RG - Verifizierung')
        .addFields(
          { name: 'Vor der Freischaltung', value: 'Bevor du alle Channel auf dem Discord sehen kannst, musst du dich freischalten. Bitte lese unsere <#1169715611962707996> und bestätige die folgenden Punkte:' },
          { name: ':scroll: **Regelwerk**', value: 'Du bist mit unseren <#1169715611962707996> einverstanden und hältst dich während deines gesamten Aufenthalts daran. Ebenfalls stimmst du den [Discord ToS](https://discord.com/terms) und den [Community Richtlinien](https://discord.com/guidelines) zu.' },
          { name: ':busts_in_silhouette: **Multiaccount**', value: 'Du bestätigst, dass es sich nicht um einen Multiaccount handelt. Im Falle eines Verstoßes erhalten beide deiner Accounts einen permanenten Ausschluss!' }
        )
        .setColor('Red')
        .setImage(resizedImageUrl)
        .setFooter({ text: '© RG System' });

      const savedVerify = await Verify.create({
        GuildID: guild.id,
        ChannelID: channel.id,
      });

      const sendChannel = await channel.send({
        embeds: [verifyEmbed],
        components: [
          new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('verify').setLabel('✅ Verifizierung').setStyle(ButtonStyle.Success)
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

  async buttonInteractionHandler(interaction) {
    try {
      const { member } = interaction;
      const roleId = '1169715609861365800';

      if (member.roles.cache.has(roleId)) {
        return interaction.reply({ content: 'Du hast bereits die erforderliche Rolle!', ephemeral: true });
      }

      await member.roles.add(roleId);
      return interaction.reply({ content: 'Verifizierung abgeschlossen! Du hast nun die erforderliche Rolle.', ephemeral: true });

    } catch (error) {
      console.error(error);
      return interaction.reply({ content: 'Ein Fehler ist bei der Verifizierung aufgetreten!', ephemeral: true });
    }
  },
};
