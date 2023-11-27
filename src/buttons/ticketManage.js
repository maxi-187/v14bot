const { EmbedBuilder, PermissionFlagsBits, UserSelectMenuBuilder, ActionRowBuilder } = require('discord.js');
const TicketSchema = require('../models/Ticket');
const config = require('../../ticket');

module.exports = {
  customId: "ticket-manage",
  permissionsRequired: [],
  botPermissions: [],

  callback: async (client, interaction) => {
  const { guild, channel, member } = interaction;
  const {ManageChannels, SendMessages} = PermissionFlagsBits;
  const nopermissionsEmbed = new EmbedBuilder()
   .setColor('Red')
   .setDescription(config.ticketNoPermissions);

  let data = await TicketSchema.findOne({ GuildID: guild.id, ChannelID: channel.id })

  await interaction.deferUpdate();
	await interaction.deleteReply();

  const embed = new EmbedBuilder()
  await TicketSchema.findOne({GuildID: guild.id, ChannelID: channel.id}, async (err, data) => {

  if (err) throw err;
  if (!data) return 
    interaction.reply({embeds: [embed.setColor('Red').setDescription(config.ticketError)], ephemeral: true}).catch(error => {return});

  const findMembers = await TicketSchema.findOne({GuildID: guild.id, ChannelID: channel.id, MembersID: interaction.values[0]});
    if(!findMembers) {
    data.MembersID.push(interaction.values[0]);

  channel.permissionOverwrites.edit(interaction.values[0], {
    SendMessages: true,
    ViewChannel: true,
    ReadMessageHistory: true
  }).catch(error => {return});

  interaction.channel.send({embeds: [embed.setColor('Green').setDescription('<@' + interaction.values[0] + '>' + ' ' + config.ticketMemberAdd)]}).catch(error => {return});
    data.save();
  }else {
  data.MembersID.remove(interaction.values[0]);
    channel.permissionOverwrites.delete(interaction.values[0]).catch(error => {return});
    interaction.channel.send({embeds: [embed.setColor('Green').setDescription('<@' + interaction.values[0] + '>' + ' ' + config.ticketMemberRemove)]}).catch(error => {return});
    data.save();
    
  if ((!member.permissions.has(ManageChannels)) & (!member.roles.cache.has(docs.Handlers))) 
  return interaction.reply({embeds: [nopermissionsEmbed], ephemeral: true}).catch(error => {return});

  const menu = new UserSelectMenuBuilder()
    .setCustomId('ticket-manage-menu')
    .setPlaceholder(config.ticketManageMenuEmoji + config.ticketManageMenuTitle)
    .setMinValues(1)
    .setMaxValues(1)
  return interaction.reply({components: [new ActionRowBuilder().addComponents(menu)], ephemeral: true}).catch(error => {return});
      }
    })
  }
};