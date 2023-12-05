const { UserSelectMenuBuilder, ActionRowBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const config = require('../../ticket');

module.exports = {
  customId: "ticket-manage",
  permissionsRequired: [],
  botPermissions: [],

  callback: async (client, interaction) => {
    let Handler = '1169715609878138995';
    const nopermissionsEmbed = new EmbedBuilder()
   .setColor('Red')
   .setDescription(config.ticketNoPermissions)
   .setFooter({ text: '© RG System' })
   .setTimestamp();
    if ((!interaction.member.permissions.has(PermissionFlagsBits.ManageChannels)) & (!interaction.member.roles.cache.has(Handler))) 
    return interaction.reply({embeds: [nopermissionsEmbed], ephemeral: true}).catch(error => console.log(error));

    const menu = new UserSelectMenuBuilder()
    .setCustomId('ticket-manage-menu')
    .setPlaceholder(config.ticketManageMenuEmoji + config.ticketManageMenuTitle)
    .setMinValues(1)
    .setMaxValues(1)

    return interaction.reply({components: [new ActionRowBuilder().addComponents(menu)], ephemeral: true}).catch(error => console.log(error));
  }
};