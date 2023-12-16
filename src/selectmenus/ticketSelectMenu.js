const { EmbedBuilder } = require("discord.js");
const TicketSchema = require("../models/Ticket");
const config = require("../../ticket");

module.exports = {
  customId: "ticket-manage-menu",
  permissionsRequired: [],
  botPermissions: [],

  callback: async (client, interaction) => {
    const { guild, channel, member } = interaction;
    let data = await TicketSchema.findOne({
      GuildID: guild.id,
      ChannelID: channel.id,
    });

    const embed = new EmbedBuilder();
    const findMembers = await TicketSchema.findOne({
      GuildID: guild.id,
      ChannelID: channel.id,
      MembersID: interaction.values[0],
    });
    if (!findMembers) {
      data.MembersID.push(interaction.values[0]);

      channel.permissionOverwrites
        .edit(interaction.values[0], {
          SendMessages: true,
          ViewChannel: true,
          ReadMessageHistory: true,
        })
        .catch((error) => console.log(error));

      interaction
        .reply({
          embeds: [
            embed
              .setColor("Green")
              .setDescription(
                "<@" +
                  interaction.values[0] +
                  ">" +
                  " " +
                  config.ticketMemberAdd
              )
              .setFooter({ text: "© RG System" })
              .setTimestamp(),
          ],
          ephemeral: true,
        })
        .catch((error) => console.log(error));
      data.save();
    } else {
      data.MembersID.remove(interaction.values[0]);
      channel.permissionOverwrites
        .delete(interaction.values[0])
        .catch((error) => console.log(error));
      interaction
        .reply({
          embeds: [
            embed
              .setColor("Green")
              .setDescription(
                "<@" +
                  interaction.values[0] +
                  ">" +
                  " " +
                  config.ticketMemberRemove
              )
              .setFooter({ text: "© RG System" })
              .setTimestamp(),
          ],
          ephemeral: true,
        })
        .catch((error) => console.log(error));
      data.save();
    }
  },
};
