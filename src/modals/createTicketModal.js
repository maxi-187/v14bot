const { PermissionFlagsBits, ChannelType, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const TicketSchema = require('../models/Ticket');
const config = require('../../ticket');

module.exports = {
  customId: "ticket",
  permissionsRequired: [],
  botPermissions: [],

  callback: async (client, interaction) => {
    const {guild, member, customId, channel} = interaction;
    let ticket;

    try {
      let problem = interaction.fields.getTextInputValue("text");
      let selectedCategory = interaction.fields.getTextInputValue('category');
      let Handler = '1169715609878138995';

      const alreadyticketEmbed = new EmbedBuilder().setDescription(config.ticketAlreadyExist).setColor('Red')
      const findTicket = await TicketSchema.findOne({GuildID: guild.id, OwnerID: member.id});
      if (findTicket) return interaction.reply({embeds: [alreadyticketEmbed], ephemeral: true}).catch(error => {return});
      const data = await TicketSchema.findOne({GuildID: guild.id}); 
      const ticketId = Math.floor(Math.random() * 9000) + 10000;

      const ticket = await guild.channels.create({
        name: `ticket-` + ticketId,
        type: ChannelType.GuildText,
        parent: '1175162185668902975', // Füge die Kategorie-ID ein
        permissionOverwrites: [
          {
            id: guild.roles.everyone.id,
            deny: [PermissionFlagsBits.ViewChannel],
          },
          {
            id: Handler, // Füge die ID der Mitarbeiterrolle ein
            allow: [PermissionFlagsBits.ViewChannel],
          },
        ],
      }).catch(error => { return; }).then(async (channel) => {
        await TicketSchema.create({
          GuildID: guild.id,
          OwnerID: member.id,
          MemberID: member.id,
          TicketID: ticketId,
          ChannelID: channel.id,
          Locked: false,
          Claimed: false,
        });
        await channel.setTopic(config.ticketDescription + ' <@' + member.id + '>').catch(error => { return; });
        const embed = new EmbedBuilder().setTitle(config.ticketMessageTitle).setDescription(config.ticketMessageDescription);
        const button = new ActionRowBuilder().setComponents(
          new ButtonBuilder().setCustomId('ticket-close').setLabel(config.ticketClose).setStyle(ButtonStyle.Danger).setEmoji(config.ticketCloseEmoji),
          new ButtonBuilder().setCustomId('ticket-lock').setLabel(config.ticketLock).setStyle(ButtonStyle.Secondary).setEmoji(config.ticketLockEmoji),
          new ButtonBuilder().setCustomId('ticket-unlock').setLabel(config.ticketUnlock).setStyle(ButtonStyle.Secondary).setEmoji(config.ticketUnlockEmoji),
          new ButtonBuilder().setCustomId('ticket-manage').setLabel(config.ticketManage).setStyle(ButtonStyle.Secondary).setEmoji(config.ticketManageEmoji),
          new ButtonBuilder().setCustomId('ticket-claim').setLabel(config.ticketClaim).setStyle(ButtonStyle.Primary).setEmoji(config.ticketClaimEmoji),
        );
        channel.send({ embeds: [embed], components: [button] }).catch(error => { return; });
        const handlersmention = await channel.send({ content: '<@&' + Handler + '>' });
        handlersmention.delete().catch(error => { return; });
        const ticketmessage = new EmbedBuilder().setDescription(config.ticketCreate + ' <#' + channel.id + '>').setColor('Green');
        interaction.reply({ embeds: [ticketmessage], ephemeral: true }).catch(error => { return; });
      });
    } catch (err) {
      console.log(err);
    }
  }
};