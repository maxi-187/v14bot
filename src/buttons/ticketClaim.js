const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const TicketSchema = require('../models/Ticket');
const config = require('../../ticket');

module.exports = {
  customId: "ticket-claim", // ticket-close | ticket-lock | ticket-unlock | ticket-manage | ticket-claim
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
 .setDescription(config.ticketAlreadyClaim + ' <@' + data.ClaimedBy + '>.');

 if (data.Claimed == true)
  return interaction.reply({embeds: [alreadyEmbed], ephemeral: true}).catch(error => {return});
  await TicketSchema.updateOne({ChannelID: channel.id}, {Claimed: true, ClaimedBy: member.id});

 let lastinfos = channel;
  await channel
  .edit({name: config.ticketClaimEmoji + '・' + lastinfos.name, topic: lastinfos.topic + config.ticketDescriptionClaim + '<@' + member.id + '>.'})
  .catch(error => {return});

executeEmbed.
setDescription(config.ticketSuccessClaim + ' <@' + member.id + '>.');
interaction
.deferUpdate().catch(error => {return});
interaction.channel.send({embeds: [executeEmbed]}).catch(error => {return});
  }
};