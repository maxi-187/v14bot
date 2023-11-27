const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const TicketSchema = require('../models/Ticket');
const config = require('../../ticket');

module.exports = {
  customId: "ticket-lock", // ticket-close | ticket-lock | ticket-unlock | ticket-manage | ticket-claim
  permissionsRequired: [],
  botPermissions: [],

  callback: async (client, interaction) => {
   const { guild, channel, member } = interaction;
   const {ManageChannels, SendMessages} = PermissionFlagsBits;
   const alreadyEmbed = new EmbedBuilder()
   .setColor('Orange');   
   const executeEmbed = new EmbedBuilder()
   .setColor('Aqua');
   const nopermissionsEmbed = new EmbedBuilder()
   .setColor('Red')
   .setDescription(config.ticketNoPermissions);

  let data = await TicketSchema.findOne({ GuildID: guild.id, ChannelID: channel.id })
  if (!data) return;

  if ((!member.permissions.has(ManageChannels)) & (!member.roles.cache.has('1169715609878138995'))) 
    return interaction.reply({embeds: [nopermissionsEmbed], ephemeral: true}).catch(error => {return});

  alreadyEmbed
  .setDescription(config.ticketAlreadyLocked);

  if (data.Locked == true) return interaction.reply({embeds: [alreadyEmbed], ephemeral: true}).catch(error => {return});
    await TicketSchema.updateOne({ChannelID: channel.id}, {Locked: true});

    executeEmbed
    .setDescription(config.ticketSuccessLocked);

  data.MembersID.forEach((m) => {channel.permissionOverwrites.edit(m, {SendMessages: false}).catch(error => {return})})
  channel.permissionOverwrites.edit(data.OwnerID, {SendMessages: false}).catch(error => {return});

  interaction.deferUpdate().catch(error => {return});
    return interaction.channel.send({embeds: [executeEmbed]}).catch(error => {return});
  }
};