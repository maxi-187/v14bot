const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { createTranscript } = require('discord-html-transcripts');
const TicketSchema = require('../models/Ticket');
const config = require('../../ticket');

module.exports = {
  customId: "ticket-close",
  permissionsRequired: [],
  botPermissions: [],

  callback: async (client, interaction) => {
  const { guild, channel } = interaction;

  let data = await TicketSchema.findOne({ GuildID: guild.id, ChannelID: channel.id })
  if (!data) return;

  const transcript = await createTranscript(channel, {
    limit: -1,
    returnType: 'attachment',
    saveImages: true,
    poweredBy: false,
    filename: channel.name + data.TicketID + '.html',
  }).catch();
  let claimed = undefined;
  if (data.Claimed === true) {
    claimed = '\✅'
  }
  if (data.Claimed === false) {
    claimed = '\❌'
  }
  if (data.ClaimedBy === undefined) {
    data.ClaimedBy = '\❌'
  } else {
    data.ClaimedBy = '<@' + data.ClaimedBy + '>'
  }
  const transcriptTimestamp = Math.round(Date.now() / 1000)
  const transcriptEmbed = new EmbedBuilder()
    .setDescription(`${config.ticketTranscriptMember} <@${data.OwnerID}>\n${config.ticketTranscriptTicket} ${data.TicketID}\n${config.ticketTranscriptClaimed} ${claimed}\n${config.ticketTranscriptModerator} ${data.ClaimedBy}\n${config.ticketTranscriptTime} <t:${transcriptTimestamp}:R> (<t:${transcriptTimestamp}:F>)`)
    .setFooter({ text: '© RG System' })
    .setTimestamp()
  const closingTicket = new EmbedBuilder()
    .setTitle(config.ticketCloseTitle)
    .setDescription(config.ticketCloseDescription)
    .setColor('Red')
    .setFooter({ text: '© RG System' })
    .setTimestamp()

  await guild.channels.cache.get("1169715611409076309").send({
    embeds: [transcriptEmbed],
    files: [transcript],
  }).catch(error => console.log(error));

  interaction.reply({ embeds: [closingTicket] }).catch(error => console.log(error));

  await TicketSchema.findOneAndDelete({ GuildID: guild.id, ChannelID: channel.id });
  setTimeout(() => {
    channel.delete().catch(error => console.log(error));
  }, 5000);
    }
};