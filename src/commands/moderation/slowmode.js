const { PermissionFlagsBits, EmbedBuilder, ApplicationCommandOptionType, Role } = require('discord.js');
const ms = require("ms");

module.exports = {
  name: 'slowmode',
  description: 'Verringert die Geschwindigkeit, mit der Nachrichten gesendet werden können.',
  options: [
    {
      name: 'rate',
      description: 'Geben Sie die Geschwindigkeit an, z.B. 5s, 1m, 30m, usw.',
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: 'zeit',
      description: 'Geben Sie eine Dauer für den Slowmode an, z.B. 5s, 1m, 30m, usw.',
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  permissionsRequired: [PermissionFlagsBits.ManageChannels],
  botPermissions: [PermissionFlagsBits.ManageChannels],
  callback: async (client, interaction) => {
    let message;
    const { channel, options } = interaction;
    const minRate = ms("5s");
    const maxRate = ms("6h");
    const minDuration = ms("10s");
    const rate =
      options.getString("rate") && ms(options.getString("rate"))
        ? ms(options.getString("rate"))
        : 0;
    const duration =
      options.getString("zeit") && ms(options.getString("zeit"))
        ? ms(options.getString("zeit"))
        : 0;
    const description = duration
      ? `Der Slowmode wurde mit einer Geschwindigkeit von ${ms(rate, {
          long: true,
        })} für ${ms(duration, { long: true })} aktiviert`
      : `Der Slowmode wurde mit einer Geschwindigkeit von ${ms(rate, { long: true })} aktiviert`;
    const response = new EmbedBuilder()
      .setTitle("Slowmode")
      .setColor('Red')
      .setDescription(
        `${description}.\n`
      )
      .setFooter({ text: '© RG System' })
      .setTimestamp();
    if (!rate) {
      channel.rateLimitPerUser
        ? response.setDescription(`Der Slowmode wurde deaktiviert.`)
        : response.setDescription(
            `Der Slowmode wurde mit einer Geschwindigkeit von ${ms(minRate, {
              long: true,
            })} aktiviert.`
          );
      channel.rateLimitPerUser
        ? channel.setRateLimitPerUser(0)
        : channel.setRateLimitPerUser(5);
      message = await interaction.reply({
        embeds: [response],
        fetchReply: true,
        ephemeral: true,
      });
      return setTimeout(() => message.delete().catch(() => {}), 10000);
    }

    if (rate < minRate || rate > maxRate) {
      response.setDescription(
        `Die Geschwindigkeit muss zwischen ${ms(minRate, { long: true })} und ${ms(maxRate, {
          long: true,
        })} liegen. Die Geschwindigkeit kann so angegeben werden: *10s, 1m, 2h*, usw., oder alternativ in Millisekunden.`
      );
      return interaction.reply({
        embeds: [response],
        fetchReply: true,
        ephemeral: true,
      });
    }

    if (duration && duration < minDuration) {
      response.setDescription(
        `Die Dauer muss mindestens ${ms(minDuration, {
          long: true,
        })} betragen. Die Dauer kann so angegeben werden: *10s, 1m, 2h*, usw., oder alternativ in Millisekunden.`
      );
      return interaction.reply({
        embeds: [response],
        fetchReply: true,
        ephemeral: true,
      });
    }

    channel.setRateLimitPerUser(rate / 1000);
    message = await interaction.reply({
      embeds: [response],
      fetchReply: true,
      ephemeral: true,
    });
    setTimeout(() => message.delete().catch(() => {}), 10000);

    if (duration)
      setTimeout(async () => channel.setRateLimitPerUser(0), duration);
  },
};
